import { supabase, createTempClient } from "./supabaseClient.js";
import { t, currentLocale, initI18n } from "./i18n.js";

let company = null;      // { id, name, code, timezone, country_code }
let employees = [];      // lista de perfiles role=employee
let currentRecords = [];
let countriesMap = {};   // { CO: 'Colombia', ID: 'Indonesia', ... }

const $ = (sel) => document.querySelector(sel);
const fmtMoney = (n) => n.toString();

// ---------------------------------------------------------------------
// 0. Autenticación / carga inicial
// ---------------------------------------------------------------------
async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return (window.location.href = "index.html");

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role, company_id, full_name")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profErr || !profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return (window.location.href = "index.html");
  }

  const { data: companyRow } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile.company_id)
    .single();
  company = companyRow;

  initI18n("lang-switcher-container");

  $("#company-name").textContent = company.name;
  $("#company-code").textContent = company.code;
  $("#employees-hint").innerHTML = t("dash.emp.hintHtml", { code: company.code });
  renderStatusBanner();
  renderLogo();
  renderWorkHours();

  const { data: countryRows } = await supabase.from("countries").select("code, name");
  (countryRows || []).forEach((c) => { countriesMap[c.code] = c.name; });

  setupNav();
  setupMonthDefault();
  await loadEmployees();
  await loadReport();
  setupFormHandlers();
}

function renderStatusBanner() {
  const banner = $("#status-banner");
  if (company.status === "pending") {
    banner.innerHTML = `<div class="status-banner pending">${t("dash.statusPending")}</div>`;
  } else if (company.status === "suspended") {
    banner.innerHTML = `<div class="status-banner suspended">${t("dash.statusSuspended")}</div>`;
  } else {
    banner.innerHTML = "";
  }
}

function setupNav() {
  document.querySelectorAll(".sidebar-nav button[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav button[data-view]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      ["report", "employees", "vacations", "holidays", "company", "backup"].forEach((v) => {
        document.getElementById(`view-${v}`).style.display = v === btn.dataset.view ? "block" : "none";
      });
      if (btn.dataset.view === "employees") renderEmployeesTable();
      if (btn.dataset.view === "vacations") { loadVacationsSummary(); loadVacationsLog(); }
      if (btn.dataset.view === "holidays") { loadHolidayCountries(); loadHolidays(); }
    });
  });
  $("#logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });
}

function setupMonthDefault() {
  const now = new Date();
  const bogotaMonth = new Intl.DateTimeFormat("en-CA", { timeZone: company.timezone, year: "numeric", month: "2-digit" }).format(now);
  $("#filter-month").value = bogotaMonth; // "YYYY-MM"

  const bogotaDate = new Intl.DateTimeFormat("en-CA", { timeZone: company.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  $("#new-emp-hire-date").value = bogotaDate;
  $("#vac-year").value = bogotaDate.slice(0, 4);
}

// ---------------------------------------------------------------------
// 1. Empleados
// ---------------------------------------------------------------------
async function loadEmployees() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, status, hire_date, termination_date, vacation_days_per_year, created_at")
    .eq("role", "employee")
    .order("full_name");
  if (error) { console.error(error); return; }
  employees = data || [];

  const sel = $("#filter-employee");
  sel.innerHTML = `<option value="">${t("dash.report.employeeAll")}</option>` +
    employees.map((e) => `<option value="${e.id}">${escapeHtml(e.full_name)}</option>`).join("");

  const vacSel = $("#vac-employee");
  if (vacSel) {
    vacSel.innerHTML = employees.map((e) => `<option value="${e.id}">${escapeHtml(e.full_name)}</option>`).join("");
  }
}

function statusLabel(status) {
  return { active: t("dash.emp.statusActive"), suspended: t("dash.emp.statusSuspended"), terminated: t("dash.emp.statusTerminated") }[status] || status;
}

function renderEmployeesTable() {
  const tbody = $("#employees-tbody");
  if (!employees.length) {
    tbody.innerHTML = `<tr><td colspan="6">${t("dash.emp.noneYet")}</td></tr>`;
    return;
  }
  tbody.innerHTML = employees.map((e) => `
    <tr>
      <td>${escapeHtml(e.full_name)}</td>
      <td>${escapeHtml(e.email)}</td>
      <td><span class="t-badge ${e.status === "active" ? "ok" : "overtime"}" style="display:inline-block">${statusLabel(e.status)}</span></td>
      <td>${e.hire_date ? new Date(`${e.hire_date}T12:00:00`).toLocaleDateString(currentLocale()) : "—"}</td>
      <td>${e.termination_date ? new Date(`${e.termination_date}T12:00:00`).toLocaleDateString(currentLocale()) : "—"}</td>
      <td style="white-space:nowrap; display:flex; gap:6px">
        ${employeeActionButtons(e)}
      </td>
    </tr>
  `).join("");

  wireEmployeeActions();
}

function employeeActionButtons(e) {
  const btns = [];
  if (e.status === "active") {
    btns.push(`<button class="btn btn-ghost" data-suspend="${e.id}">${t("dash.emp.btnSuspend")}</button>`);
    btns.push(`<button class="btn btn-ghost" data-terminate="${e.id}">${t("dash.emp.btnTerminate")}</button>`);
  } else if (e.status === "suspended") {
    btns.push(`<button class="btn btn-primary" data-reactivate="${e.id}">${t("dash.emp.btnReactivate")}</button>`);
    btns.push(`<button class="btn btn-ghost" data-terminate="${e.id}">${t("dash.emp.btnTerminate")}</button>`);
  } else {
    btns.push(`<button class="btn btn-primary" data-reactivate="${e.id}">${t("dash.emp.btnReactivate")}</button>`);
  }
  btns.push(`<button class="btn btn-ghost" data-delete="${e.id}" style="color:var(--stamp)">${t("dash.emp.btnDelete")}</button>`);
  return btns.join("");
}

function wireEmployeeActions() {
  $("#employees-tbody").querySelectorAll("[data-suspend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm(t("dash.emp.confirmSuspend"))) return;
      const { error } = await supabase.from("profiles").update({ status: "suspended" }).eq("id", btn.dataset.suspend);
      if (error) return alert(t("dash.emp.errSuspend", { msg: error.message }));
      await loadEmployees(); renderEmployeesTable();
    });
  });

  $("#employees-tbody").querySelectorAll("[data-reactivate]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const { error } = await supabase.from("profiles")
        .update({ status: "active", termination_date: null })
        .eq("id", btn.dataset.reactivate);
      if (error) return alert(t("dash.emp.errReactivate", { msg: error.message }));
      await loadEmployees(); renderEmployeesTable();
    });
  });

  $("#employees-tbody").querySelectorAll("[data-terminate]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const dateStr = prompt(t("dash.emp.promptTerminationDate"), new Date().toISOString().slice(0, 10));
      if (!dateStr) return;
      if (!confirm(t("dash.emp.confirmTerminate"))) return;
      const { error } = await supabase.from("profiles")
        .update({ status: "terminated", termination_date: dateStr })
        .eq("id", btn.dataset.terminate);
      if (error) return alert(t("dash.emp.errTerminate", { msg: error.message }));
      await loadEmployees(); renderEmployeesTable();
    });
  });

  $("#employees-tbody").querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm(t("dash.emp.confirmDelete1"))) return;
      if (!confirm(t("dash.emp.confirmDelete2"))) return;
      const { error } = await supabase.from("profiles").delete().eq("id", btn.dataset.delete);
      if (error) return alert(t("dash.emp.errDelete", { msg: error.message }));
      await loadEmployees(); renderEmployeesTable();
    });
  });
}

// ---------------------------------------------------------------------
// 2. Informe de asistencia
// ---------------------------------------------------------------------
function monthRangeISO(monthValue) {
  // Colombia no tiene horario de verano: UTC-5 fijo todo el año.
  const [y, m] = monthValue.split("-").map(Number);
  const start = new Date(`${monthValue}-01T00:00:00-05:00`);
  const nextY = m === 12 ? y + 1 : y;
  const nextM = m === 12 ? 1 : m + 1;
  const end = new Date(`${nextY}-${String(nextM).padStart(2, "0")}-01T00:00:00-05:00`);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

function shiftMonth(delta) {
  const [y, m] = $("#filter-month").value.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  $("#filter-month").value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  loadReport();
}

async function loadReport() {
  const list = $("#report-list");
  list.innerHTML = `<p class="loading">${t("dash.report.loadingAttendance")}</p>`;

  const monthValue = $("#filter-month").value;
  const employeeId = $("#filter-employee").value;
  const { startISO, endISO } = monthRangeISO(monthValue);

  let query = supabase
    .from("attendance_records")
    .select("id, type, recorded_at, latitude, longitude, address, is_overtime, employee_id, profiles(full_name, email)")
    .gte("recorded_at", startISO)
    .lt("recorded_at", endISO)
    .order("recorded_at", { ascending: true });

  if (employeeId) query = query.eq("employee_id", employeeId);

  const { data, error } = await query;
  if (error) {
    list.innerHTML = `<div class="empty-state">${t("dash.report.errorLoading", { msg: escapeHtml(error.message) })}</div>`;
    return;
  }
  currentRecords = data || [];
  renderReport();
}

// Empareja los marcajes de un día en sesiones (entrada+salida). Si alguien
// marca dos veces en el mismo día (ej. jornada normal, y luego otra entrada/
// salida en la noche por overtime desde casa), cada par queda como su
// propia sesión en vez de perderse dentro de un solo "primera entrada -
// última salida".
function pairSessionsForDay(records) {
  const sessions = [];
  let pendingCheckIn = null;
  for (const r of records) {
    if (r.type === "check_in") {
      if (pendingCheckIn) sessions.push({ checkIn: pendingCheckIn, checkOut: null });
      pendingCheckIn = r;
    } else if (r.type === "check_out") {
      if (pendingCheckIn) {
        sessions.push({ checkIn: pendingCheckIn, checkOut: r });
        pendingCheckIn = null;
      } else {
        sessions.push({ checkIn: null, checkOut: r });
      }
    }
  }
  if (pendingCheckIn) sessions.push({ checkIn: pendingCheckIn, checkOut: null });
  return sessions;
}

function groupByEmployeeDay(records) {
  const groups = {};
  for (const r of records) {
    const dateKey = new Intl.DateTimeFormat("en-CA", { timeZone: company.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(r.recorded_at));
    const key = `${r.employee_id}__${dateKey}`;
    if (!groups[key]) {
      groups[key] = {
        employeeId: r.employee_id,
        name: r.profiles?.full_name || "—",
        email: r.profiles?.email || "",
        date: dateKey,
        records: [],
        overtime: false,
      };
    }
    const g = groups[key];
    g.overtime = g.overtime || r.is_overtime;
    g.records.push(r);
  }
  const list = Object.values(groups);
  for (const g of list) {
    g.records.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
    g.sessions = pairSessionsForDay(g.records);
  }
  return list.sort((a, b) => (a.date < b.date ? 1 : -1) || a.name.localeCompare(b.name));
}

function applyOvertimeFilter(groups) {
  const mode = $("#filter-overtime").value;
  if (mode === "overtime") return groups.filter((g) => g.overtime);
  if (mode === "regular") return groups.filter((g) => !g.overtime);
  return groups;
}

// Igual que applyOvertimeFilter, pero sobre registros individuales sin
// unificar por día — la vista de Lista ya no combina entrada+salida.
function filterRecordsByOvertime(records) {
  const mode = $("#filter-overtime").value;
  if (mode === "overtime") return records.filter((r) => r.is_overtime);
  if (mode === "regular") return records.filter((r) => !r.is_overtime);
  return records;
}

function fmtTime(recordedAt) {
  if (!recordedAt) return "—";
  return new Date(recordedAt).toLocaleTimeString(currentLocale(), { timeZone: company.timezone, hour: "2-digit", minute: "2-digit" });
}
function fmtDate(dateKey) {
  const d = new Date(`${dateKey}T12:00:00-05:00`);
  return d.toLocaleDateString(currentLocale(), { weekday: "short", day: "2-digit", month: "short" });
}
function mapLink(rec) {
  if (!rec || rec.latitude == null || rec.longitude == null) return "";
  const label = rec.address ? escapeHtml(rec.address) : t("dash.report.viewMap");
  return `<a href="https://www.google.com/maps?q=${rec.latitude},${rec.longitude}" target="_blank" rel="noopener">${label}</a>`;
}

// ---- Vista de calendario (para impresión) ----

async function getHolidayDateSet() {
  const { data, error } = await supabase.from("holidays").select("date");
  if (error) { console.error(error); return new Set(); }
  return new Set((data || []).map((h) => h.date));
}

async function getVacationRangesByEmployee() {
  const { data, error } = await supabase.from("vacations").select("employee_id, start_date, end_date");
  if (error) { console.error(error); return {}; }
  const byEmployee = {};
  (data || []).forEach((v) => {
    if (!byEmployee[v.employee_id]) byEmployee[v.employee_id] = [];
    byEmployee[v.employee_id].push({ start: v.start_date, end: v.end_date });
  });
  return byEmployee;
}

function isDateInRanges(dateKey, ranges) {
  return (ranges || []).some((r) => dateKey >= r.start && dateKey <= r.end);
}

function countBusinessDays(startStr, endStr, holidaySet) {
  let count = 0;
  let d = new Date(`${startStr}T12:00:00`);
  const end = new Date(`${endStr}T12:00:00`);
  while (d <= end) {
    const dow = d.getDay(); // 0=domingo ... 6=sábado
    if (dow !== 0 && dow !== 6 && !holidaySet.has(dateKeyLocal(d))) count++;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }
  return count;
}

function dateKeyLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildMonthMatrix(year, monthIndex) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startDow = (firstOfMonth.getDay() + 6) % 7; // 0=lunes ... 6=domingo
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ date: new Date(year, monthIndex, 1 - (startDow - i)), inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, monthIndex, d), inMonth: true });
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

async function renderCalendarView(groupedForFilter) {
  const container = $("#report-calendar");
  container.innerHTML = `<p class="loading">${t("dash.cal.generating")}</p>`;

  const monthValue = $("#filter-month").value;
  const [y, m] = monthValue.split("-").map(Number);
  const weeks = buildMonthMatrix(y, m - 1);

  const [holidaySet, vacationsByEmployee] = await Promise.all([
    getHolidayDateSet(),
    getVacationRangesByEmployee(),
  ]);

  const byEmployee = {};
  groupedForFilter.forEach((g) => {
    if (!byEmployee[g.employeeId]) byEmployee[g.employeeId] = {};
    byEmployee[g.employeeId][g.date] = g;
  });

  const employeeIdFilter = $("#filter-employee").value;
  const targetEmployees = employeeIdFilter
    ? employees.filter((e) => e.id === employeeIdFilter)
    : employees.filter((e) => byEmployee[e.id]);

  if (!targetEmployees.length) {
    container.innerHTML = `<div class="empty-state">${t("dash.report.noRecords")}</div>`;
    return;
  }

  const monthTitle = new Date(`${monthValue}-01T12:00:00`).toLocaleDateString(currentLocale(), { month: "long", year: "numeric" });
  const dows = [t("dash.cal.dowMon"), t("dash.cal.dowTue"), t("dash.cal.dowWed"), t("dash.cal.dowThu"), t("dash.cal.dowFri"), t("dash.cal.dowSat"), t("dash.cal.dowSun")];

  const legend = `
    <div class="cal-legend">
      <span><span class="swatch" style="background:var(--ok)"></span>${t("dash.cal.legendRegular")}</span>
      <span><span class="swatch" style="background:var(--stamp)"></span>${t("dash.cal.legendOvertime")}</span>
      <span><span class="swatch" style="background:#B23A3A"></span>${t("dash.cal.legendIncomplete")}</span>
      <span><span class="swatch" style="background:var(--ok-soft)"></span>${t("dash.cal.legendVacation")}</span>
      <span><span class="swatch" style="background:var(--stamp-soft)"></span>${t("dash.cal.legendHoliday")}</span>
    </div>`;

  const blocks = targetEmployees.map((emp) => {
    const empData = byEmployee[emp.id] || {};
    const empVacations = vacationsByEmployee[emp.id] || [];

    let overtimeMinutes = 0;
    let regularMinutes = 0;
    Object.values(empData).forEach((dayGroup) => {
      dayGroup.sessions.forEach((s) => {
        if (!s.checkIn || !s.checkOut) return; // sesión incompleta: no se puede medir duración
        const mins = (new Date(s.checkOut.recorded_at) - new Date(s.checkIn.recorded_at)) / 60000;
        const sessionOvertime = s.checkIn.is_overtime || s.checkOut.is_overtime;
        if (sessionOvertime) overtimeMinutes += mins;
        else regularMinutes += mins;
      });
    });
    const overtimeHoursLabel = (overtimeMinutes / 60).toLocaleString(currentLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const regularHoursLabel = (regularMinutes / 60).toLocaleString(currentLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    const weeksHtml = weeks.map((week) => week.map((cell) => {
      const dateKey = dateKeyLocal(cell.date);
      const dow = (cell.date.getDay() + 6) % 7;
      const isWeekend = dow === 5 || dow === 6;
      const isHoliday = holidaySet.has(dateKey);
      const g = empData[dateKey];
      const onVacation = isDateInRanges(dateKey, empVacations);

      let cls = "cal-cell";
      if (!cell.inMonth) cls += " other-month";
      else if (isHoliday) cls += " holiday";
      else if (isWeekend) cls += " weekend";

      let inner = `<div class="cal-day-num">${cell.date.getDate()}</div>`;
      if (cell.inMonth) {
        if (isHoliday) inner += `<div class="cal-holiday-tag">${t("dash.cal.holidayTag")}</div>`;
        if (g && g.sessions.length) {
          let dayOvertimeMinutes = 0;
          g.sessions.forEach((s) => {
            const sessionOvertime = (s.checkIn && s.checkIn.is_overtime) || (s.checkOut && s.checkOut.is_overtime);
            if (s.checkIn && s.checkOut) {
              inner += `<div class="cal-bar ${sessionOvertime ? "overtime" : "regular"}">${fmtTime(s.checkIn.recorded_at)}–${fmtTime(s.checkOut.recorded_at)}</div>`;
              if (sessionOvertime) dayOvertimeMinutes += (new Date(s.checkOut.recorded_at) - new Date(s.checkIn.recorded_at)) / 60000;
            } else if (s.checkIn) {
              inner += `<div class="cal-bar incomplete">${fmtTime(s.checkIn.recorded_at)} ${t("dash.cal.noSalida")}</div>`;
            } else if (s.checkOut) {
              inner += `<div class="cal-bar incomplete">${t("dash.cal.noEntrada")} ${fmtTime(s.checkOut.recorded_at)}</div>`;
            }
          });
          if (dayOvertimeMinutes > 0) {
            const dayOtLabel = (dayOvertimeMinutes / 60).toLocaleString(currentLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
            inner += `<div class="cal-day-ot-total">${t("dash.cal.totalOvertime")}: ${dayOtLabel} h</div>`;
          }
        } else if (onVacation && !isWeekend && !isHoliday) {
          inner += `<div class="cal-vacation-tag">${t("dash.cal.vacationTag")}</div>`;
        }
      }
      return `<div class="${cls}">${inner}</div>`;
    }).join("")).join("");

    return `
      <div class="emp-group cal-emp-group${targetEmployees.length === 1 ? "" : " collapsed"}">
        <button type="button" class="emp-group-summary" data-emp-toggle>
          <span>${escapeHtml(emp.full_name)} <span class="emp-group-meta">${escapeHtml(emp.email)}</span></span>
          <span class="emp-group-meta">${t("dash.cal.totalRegular")}: ${regularHoursLabel} h · <strong style="color:var(--stamp)">${t("dash.cal.totalOvertime")}: ${overtimeHoursLabel} h</strong></span>
        </button>
        <div class="emp-group-body">
          <div class="cal-month-title">${monthTitle}</div>
          <div class="cal-grid">
            ${dows.map((d) => `<div class="cal-dow">${d}</div>`).join("")}
            ${weeksHtml}
          </div>
        </div>
      </div>`;
  }).join("");

  container.innerHTML = legend + blocks;
  wireEmpGroupToggles();
}

function recordDateKey(recordedAt) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: company.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(recordedAt));
}

function groupRecordsByEmployee(records) {
  const groups = {};
  for (const r of records) {
    const key = r.employee_id;
    if (!groups[key]) {
      groups[key] = {
        employeeId: key,
        name: r.profiles?.full_name || "—",
        email: r.profiles?.email || "",
        records: [],
      };
    }
    groups[key].records.push(r);
  }
  return Object.values(groups)
    .map((g) => ({ ...g, records: g.records.slice().sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function wireEmpGroupToggles() {
  document.querySelectorAll("[data-emp-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".emp-group").classList.toggle("collapsed");
    });
  });
}

function renderRecordTicket(r) {
  const typeLabel = r.type === "check_in" ? t("dash.report.entrada") : t("dash.report.salida");
  const typeCls = r.type === "check_in" ? "checkin" : "checkout";
  return `
    <div class="ticket ticket-single">
      <div class="t-date">${fmtDate(recordDateKey(r.recorded_at))}</div>
      <div class="t-name">${escapeHtml(r.profiles?.full_name || "—")}<small>${escapeHtml(r.profiles?.email || "")}</small></div>
      <div class="t-time"><span class="t-type-pill ${typeCls}">${typeLabel}</span>${fmtTime(r.recorded_at)}</div>
      <div class="t-loc">${mapLink(r) || `<span style="color:var(--text-muted)">${t("dash.report.noLocation")}</span>`}</div>
      <div class="t-badge ${r.is_overtime ? "overtime" : "ok"}">${r.is_overtime ? t("dash.report.overtime") : t("dash.report.regular")}</div>
    </div>
  `;
}

function renderReport() {
  const viewMode = $("#filter-view").value;
  const list = $("#report-list");
  const calendar = $("#report-calendar");

  if (viewMode === "calendar") {
    const grouped = applyOvertimeFilter(groupByEmployeeDay(currentRecords));
    const overtimeCount = grouped.filter((g) => g.overtime).length;
    const employeesWithRecords = new Set(grouped.map((g) => g.employeeId)).size;
    $("#summary-row").innerHTML = `
      <div class="summary-card"><div class="label">${t("dash.report.summaryDaysRegistered")}</div><div class="value">${fmtMoney(grouped.length)}</div></div>
      <div class="summary-card"><div class="label">${t("dash.report.summaryEmployeesWithRecords")}</div><div class="value">${fmtMoney(employeesWithRecords)}</div></div>
      <div class="summary-card stamp"><div class="label">${t("dash.report.summaryOvertimeDays")}</div><div class="value">${fmtMoney(overtimeCount)}</div></div>
    `;
    list.style.display = "none";
    calendar.style.display = "block";
    renderCalendarView(grouped);
    return;
  }

  // Vista de Lista: cada marcaje (entrada o salida) como su propia fila,
  // agrupados por empleado en secciones plegables (para que no se vuelva
  // una lista eterna con muchos empleados) — más reciente primero dentro
  // de cada uno.
  list.style.display = "block";
  calendar.style.display = "none";

  const records = filterRecordsByOvertime(currentRecords);
  const employeeGroups = groupRecordsByEmployee(records);

  const overtimeCount = records.filter((r) => r.is_overtime).length;
  $("#summary-row").innerHTML = `
    <div class="summary-card"><div class="label">${t("dash.report.summaryRecords")}</div><div class="value">${fmtMoney(records.length)}</div></div>
    <div class="summary-card"><div class="label">${t("dash.report.summaryEmployeesWithRecords")}</div><div class="value">${fmtMoney(employeeGroups.length)}</div></div>
    <div class="summary-card stamp"><div class="label">${t("dash.report.summaryOvertimeRecords")}</div><div class="value">${fmtMoney(overtimeCount)}</div></div>
  `;

  if (!employeeGroups.length) {
    list.innerHTML = `<div class="empty-state">${t("dash.report.noRecords")}</div>`;
    return;
  }

  list.innerHTML = employeeGroups.map((g) => {
    const empOvertimeCount = g.records.filter((r) => r.is_overtime).length;
    const collapsedCls = employeeGroups.length === 1 ? "" : " collapsed";
    return `
      <div class="emp-group${collapsedCls}">
        <button type="button" class="emp-group-summary" data-emp-toggle>
          <span>${escapeHtml(g.name)} <span class="emp-group-meta">${escapeHtml(g.email)}</span></span>
          <span class="emp-group-meta">${g.records.length} ${t("dash.report.recordsLabel")}${empOvertimeCount ? " · " + empOvertimeCount + " " + t("dash.report.overtime") : ""}</span>
        </button>
        <div class="emp-group-body">
          ${g.records.map(renderRecordTicket).join("")}
        </div>
      </div>
    `;
  }).join("");
  wireEmpGroupToggles();
}

function exportCsv() {
  const records = filterRecordsByOvertime(currentRecords)
    .slice()
    .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));

  const rows = [[
    t("dash.report.csvName"), t("dash.report.csvEmail"), t("dash.report.csvDate"),
    t("dash.report.csvType"), t("dash.report.csvTime"), t("dash.report.csvOvertime"),
    t("dash.report.csvLocIn"),
  ]];
  for (const r of records) {
    rows.push([
      r.profiles?.full_name || "", r.profiles?.email || "", recordDateKey(r.recorded_at),
      r.type === "check_in" ? t("dash.report.entrada") : t("dash.report.salida"),
      fmtTime(r.recorded_at),
      r.is_overtime ? t("dash.report.csvYes") : t("dash.report.csvNo"),
      r.latitude != null ? `${r.latitude},${r.longitude}` : "",
    ]);
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `asistencia_${$("#filter-month").value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------
// 3. Vacaciones
// ---------------------------------------------------------------------
function fmtDateSimple(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString(currentLocale(), { day: "2-digit", month: "short", year: "numeric" });
}

async function loadVacationsSummary() {
  const tbody = $("#vacations-summary-tbody");
  tbody.innerHTML = `<tr><td colspan="4" class="loading">${t("common.loading")}</td></tr>`;
  const year = Number($("#vac-year").value) || new Date().getFullYear();

  const { data, error } = await supabase.from("vacations").select("employee_id, start_date, days_count");
  if (error) { tbody.innerHTML = `<tr><td colspan="4">Error: ${escapeHtml(error.message)}</td></tr>`; return; }

  const takenByEmployee = {};
  (data || []).forEach((v) => {
    const y = new Date(`${v.start_date}T12:00:00`).getFullYear();
    if (y === year) takenByEmployee[v.employee_id] = (takenByEmployee[v.employee_id] || 0) + v.days_count;
  });

  if (!employees.length) {
    tbody.innerHTML = `<tr><td colspan="4">${t("dash.vac.noEmployees")}</td></tr>`;
    return;
  }

  tbody.innerHTML = employees.map((e) => {
    const taken = takenByEmployee[e.id] || 0;
    const remaining = e.vacation_days_per_year - taken;
    return `
      <tr>
        <td>${escapeHtml(e.full_name)}</td>
        <td><input type="number" min="0" value="${e.vacation_days_per_year}" data-vac-allowance="${e.id}" style="width:70px; padding:6px 8px; border:1px solid var(--line); border-radius:4px" /></td>
        <td>${taken}</td>
        <td style="font-weight:700; color:${remaining < 0 ? "var(--stamp)" : "var(--ok)"}">${remaining}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("[data-vac-allowance]").forEach((input) => {
    input.addEventListener("change", async () => {
      const val = Number(input.value);
      if (!Number.isFinite(val) || val < 0) return;
      const { error: updError } = await supabase.from("profiles").update({ vacation_days_per_year: val }).eq("id", input.dataset.vacAllowance);
      if (updError) { alert(t("dash.vac.errSave", { msg: updError.message })); return; }
      const emp = employees.find((e) => e.id === input.dataset.vacAllowance);
      if (emp) emp.vacation_days_per_year = val;
      loadVacationsSummary();
    });
  });
}

async function loadVacationsLog() {
  const tbody = $("#vacations-log-tbody");
  tbody.innerHTML = `<tr><td colspan="5" class="loading">${t("common.loading")}</td></tr>`;
  const year = Number($("#vac-year").value) || new Date().getFullYear();

  const { data, error } = await supabase
    .from("vacations")
    .select("id, employee_id, start_date, end_date, days_count, note, profiles(full_name)")
    .gte("start_date", `${year}-01-01`)
    .lte("start_date", `${year}-12-31`)
    .order("start_date", { ascending: false });

  if (error) { tbody.innerHTML = `<tr><td colspan="5">Error: ${escapeHtml(error.message)}</td></tr>`; return; }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5">${t("dash.vac.noneInYear", { year })}</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((v) => `
    <tr>
      <td>${escapeHtml(v.profiles?.full_name || "—")}</td>
      <td>${fmtDateSimple(v.start_date)} – ${fmtDateSimple(v.end_date)}</td>
      <td>${v.days_count}</td>
      <td>${escapeHtml(v.note || "—")}</td>
      <td><button class="btn btn-ghost" data-del-vacation="${v.id}">${t("dash.vac.btnDelete")}</button></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-del-vacation]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm(t("dash.vac.confirmDelete"))) return;
      const { error: delError } = await supabase.from("vacations").delete().eq("id", btn.dataset.delVacation);
      if (delError) return alert(t("dash.vac.errDelete", { msg: delError.message }));
      loadVacationsSummary(); loadVacationsLog();
    });
  });
}

// ---------------------------------------------------------------------
// 4. Festivos
// ---------------------------------------------------------------------
async function loadHolidayCountries() {
  const list = $("#holiday-countries-list");
  list.innerHTML = `<span class="loading">${t("common.loading")}</span>`;

  const { data, error } = await supabase
    .from("company_holiday_countries")
    .select("country_code, is_base")
    .order("is_base", { ascending: false });

  if (error) { list.innerHTML = `Error: ${escapeHtml(error.message)}`; return; }

  const activeCodes = new Set((data || []).map((r) => r.country_code));

  list.innerHTML = (data || []).map((r) => `
    <span class="chip ${r.is_base ? "base" : ""}">
      ${escapeHtml(countriesMap[r.country_code] || r.country_code)}${r.is_base ? t("dash.hol.base") : ""}
      ${r.is_base ? "" : `<button type="button" class="chip-remove" data-remove-country="${r.country_code}" title="${t("dash.hol.removeTitle")}">×</button>`}
    </span>
  `).join("");

  list.querySelectorAll("[data-remove-country]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const countryName = countriesMap[btn.dataset.removeCountry] || btn.dataset.removeCountry;
      if (!confirm(t("dash.hol.confirmRemoveCountry", { country: countryName }))) return;
      const { error: delError } = await supabase
        .from("company_holiday_countries")
        .delete()
        .eq("company_id", company.id)
        .eq("country_code", btn.dataset.removeCountry);
      if (delError) { alert(t("dash.hol.errRemoveCountry", { msg: delError.message })); return; }
      loadHolidayCountries();
      loadHolidays();
    });
  });

  // Selector para agregar países que todavía no están activos
  const select = $("#add-country-select");
  const options = Object.entries(countriesMap).filter(([code]) => !activeCodes.has(code));
  select.innerHTML = options.length
    ? `<option value="">${t("dash.hol.chooseCountry")}</option>` + options.map(([code, name]) => `<option value="${code}">${escapeHtml(name)}</option>`).join("")
    : `<option value="">${t("dash.hol.allCountriesAdded")}</option>`;
}

async function loadHolidays() {
  const tbody = $("#holidays-tbody");
  tbody.innerHTML = `<tr><td colspan="4" class="loading">${t("common.loading")}</td></tr>`;
  const { data, error } = await supabase.from("holidays").select("*").order("date");
  if (error) { tbody.innerHTML = `<tr><td colspan="4">Error: ${escapeHtml(error.message)}</td></tr>`; return; }

  tbody.innerHTML = (data || []).map((h) => `
    <tr>
      <td>${new Date(`${h.date}T12:00:00-05:00`).toLocaleDateString(currentLocale(), { day: "2-digit", month: "long", year: "numeric" })}</td>
      <td>${escapeHtml(h.name)}</td>
      <td>${h.company_id ? t("dash.hol.yourCompany") : `<span class="tag-default">${escapeHtml(countriesMap[h.country_code] || h.country_code)} ${t("dash.hol.national")}</span>`}</td>
      <td>${h.company_id ? `<button class="btn btn-ghost" data-del-holiday="${h.id}">${t("dash.hol.btnDelete")}</button>` : ""}</td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-del-holiday]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm(t("dash.hol.confirmDeleteHoliday"))) return;
      const { error } = await supabase.from("holidays").delete().eq("id", btn.dataset.delHoliday);
      if (error) alert(t("dash.hol.errDeleteHoliday", { msg: error.message }));
      else loadHolidays();
    });
  });
}

// ---------------------------------------------------------------------
// 5. Respaldo
// ---------------------------------------------------------------------
async function downloadBackup() {
  const status = $("#backup-status");
  status.textContent = t("dash.backup.generating");

  const [empRes, attRes, holRes, vacRes] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("attendance_records").select("*"),
    supabase.from("holidays").select("*"),
    supabase.from("vacations").select("*"),
  ]);

  const firstError = [empRes, attRes, holRes, vacRes].find((r) => r.error);
  if (firstError) { status.textContent = t("dash.backup.errGenerating", { msg: firstError.error.message }); return; }

  const backup = {
    generated_at: new Date().toISOString(),
    company: { id: company.id, name: company.name, code: company.code, country_code: company.country_code, timezone: company.timezone },
    employees: empRes.data,
    attendance_records: attRes.data,
    holidays: holRes.data,
    vacations: vacRes.data,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zyntra-respaldo-${company.code}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  status.textContent = t("dash.backup.done", { emp: empRes.data.length, att: attRes.data.length });
}

// ---------------------------------------------------------------------
// 6. Handlers de formularios / botones
// ---------------------------------------------------------------------
function setupFormHandlers() {
  $("#filter-month").addEventListener("change", loadReport);
  $("#filter-employee").addEventListener("change", loadReport);
  $("#filter-overtime").addEventListener("change", renderReport);
  $("#filter-view").addEventListener("change", renderReport);
  $("#btn-print").addEventListener("click", () => {
    document.querySelectorAll("#report-list .emp-group, #report-calendar .emp-group").forEach((el) => { el.classList.remove("collapsed"); });
    window.print();
  });
  $("#btn-export-csv").addEventListener("click", exportCsv);

  $("#btn-prev-month").title = t("dash.report.prevMonth");
  $("#btn-next-month").title = t("dash.report.nextMonth");
  $("#btn-prev-month").addEventListener("click", () => shiftMonth(-1));
  $("#btn-next-month").addEventListener("click", () => shiftMonth(1));

  $("#form-add-employee").addEventListener("submit", handleAddEmployee);

  $("#vac-year").addEventListener("change", () => { loadVacationsSummary(); loadVacationsLog(); });

  $("#form-vacation").addEventListener("submit", async (e) => {
    e.preventDefault();
    const employee_id = $("#vac-employee").value;
    const start_date = $("#vac-start").value;
    const end_date = $("#vac-end").value;
    const days_count = Number($("#vac-days").value);
    const note = $("#vac-note").value.trim() || null;

    const { error } = await supabase.from("vacations").insert({ employee_id, company_id: company.id, start_date, end_date, days_count, note });
    if (error) { alert(t("dash.vac.errRegister", { msg: error.message })); return; }
    $("#form-vacation").reset();
    loadVacationsSummary();
    loadVacationsLog();
  });

  // Autocalcular días LABORABLES (sin fines de semana ni festivos) al
  // elegir fechas — el admin puede ajustar el número después si hace falta.
  const recalcVacDays = async () => {
    const start = $("#vac-start").value;
    const end = $("#vac-end").value;
    if (!start || !end) return;
    const holidaySet = await getHolidayDateSet();
    const days = countBusinessDays(start, end, holidaySet);
    if (days > 0) $("#vac-days").value = days;
  };
  $("#vac-start").addEventListener("change", recalcVacDays);
  $("#vac-end").addEventListener("change", recalcVacDays);

  $("#btn-download-backup").addEventListener("click", downloadBackup);

  $("#btn-upload-logo").addEventListener("click", () => $("#logo-file-input").click());
  $("#logo-file-input").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleLogoUpload(file);
    e.target.value = "";
  });

  $("#btn-save-hours").addEventListener("click", handleSaveWorkHours);

  $("#btn-add-country").addEventListener("click", async () => {
    const code = $("#add-country-select").value;
    if (!code) return;
    const { error } = await supabase.from("company_holiday_countries").insert({ company_id: company.id, country_code: code });
    if (error) { alert(t("dash.hol.errAddCountry", { msg: error.message })); return; }
    loadHolidayCountries();
    loadHolidays();
  });

  $("#form-holiday").addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = $("#holiday-date").value;
    const name = $("#holiday-name").value.trim();
    const { error } = await supabase.from("holidays").insert({ company_id: company.id, date, name });
    if (error) { alert(t("dash.hol.errAddCountry", { msg: error.message })); return; }
    $("#holiday-date").value = "";
    $("#holiday-name").value = "";
    loadHolidays();
  });
}

async function handleAddEmployee(e) {
  e.preventDefault();
  const alertBox = $("#employee-alert");
  alertBox.className = "alert";
  const full_name = $("#new-emp-name").value.trim();
  const email = $("#new-emp-email").value.trim().toLowerCase();
  const password = $("#new-emp-password").value;
  const hire_date = $("#new-emp-hire-date").value;
  const btn = e.target.querySelector("button[type=submit]");

  if (!full_name || !email || password.length < 6) {
    alertBox.textContent = t("dash.emp.alertIncomplete");
    alertBox.className = "alert error";
    return;
  }

  btn.disabled = true;
  // Cliente de un solo uso: crea la cuenta del empleado sin afectar tu
  // propia sesión de admin (ver supabaseClient.js).
  const temp = createTempClient();

  try {
    const { data: signUpData, error: signUpError } = await temp.auth.signUp({ email, password });
    if (signUpError) throw signUpError;
    if (!signUpData.session) {
      throw new Error(t("dash.emp.errConfirmEmail"));
    }

    const { error: joinError } = await temp.rpc("join_company_as_employee", {
      p_code: company.code,
      p_full_name: full_name,
      p_hire_date: hire_date,
    });
    if (joinError) throw joinError;

    alertBox.textContent = t("dash.emp.successCreated", { name: full_name, email, password });
    alertBox.className = "alert success";
    $("#form-add-employee").reset();
    $("#new-emp-hire-date").value = hire_date;
    await loadEmployees();
    renderEmployeesTable();
  } catch (err) {
    alertBox.textContent = traducirErrorAlta(err.message);
    alertBox.className = "alert error";
  } finally {
    await temp.auth.signOut().catch(() => {});
    btn.disabled = false;
  }
}

function traducirErrorAlta(msg = "") {
  if (msg.includes("already registered") || msg.includes("already been registered")) {
    return t("dash.emp.errAlreadyRegistered");
  }
  if (msg.includes("Password should be")) return t("dash.emp.errPasswordShort");
  return msg;
}

function renderLogo() {
  const sidebarLogo = $("#sidebar-logo");
  const preview = $("#logo-preview");
  if (company.logo_url) {
    sidebarLogo.innerHTML = `<img src="${company.logo_url}" class="sidebar-logo-img" alt="Logo" />`;
    if (preview) preview.innerHTML = `<img src="${company.logo_url}" style="width:100%; height:100%; object-fit:cover" alt="Logo" />`;
  } else {
    sidebarLogo.innerHTML = "";
    if (preview) preview.innerHTML = `<span class="hint" style="text-align:center; padding:8px; font-size:12px">${t("dash.company.noLogo")}</span>`;
  }
}

function renderWorkHours() {
  $("#work-start").value = (company.work_start || "09:00:00").slice(0, 5);
  $("#work-end").value = (company.work_end || "17:00:00").slice(0, 5);
}

async function handleSaveWorkHours() {
  const alertBox = $("#company-alert");
  const workStart = $("#work-start").value;
  const workEnd = $("#work-end").value;

  if (!workStart || !workEnd) {
    alertBox.textContent = t("dash.company.hoursErrMissing");
    alertBox.className = "alert error";
    return;
  }

  const { data, error } = await supabase
    .from("companies")
    .update({ work_start: workStart, work_end: workEnd })
    .eq("id", company.id)
    .select("id");

  if (error) {
    alertBox.textContent = t("dash.company.hoursErrSave", { msg: error.message });
    alertBox.className = "alert error";
    return;
  }
  if (!data || data.length === 0) {
    // Supabase no dio error, pero tampoco modificó ninguna fila — casi
    // siempre significa que la política de RLS está bloqueando el update.
    alertBox.textContent = t("dash.company.hoursErrSave", { msg: "0 filas afectadas (revisa la política RLS de UPDATE en companies)" });
    alertBox.className = "alert error";
    return;
  }

  company.work_start = workStart;
  company.work_end = workEnd;
  alertBox.textContent = t("dash.company.hoursSaved");
  alertBox.className = "alert success";
}

async function handleLogoUpload(file) {
  const alertBox = $("#company-alert");
  alertBox.className = "alert";

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    alertBox.textContent = t("dash.company.errType");
    alertBox.className = "alert error";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alertBox.textContent = t("dash.company.errTooLarge");
    alertBox.className = "alert error";
    return;
  }

  alertBox.textContent = t("dash.company.uploading");
  alertBox.className = "alert success";

  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${company.id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("company-assets")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    alertBox.textContent = t("dash.company.errUpload", { msg: uploadError.message });
    alertBox.className = "alert error";
    return;
  }

  const { data: publicUrlData } = supabase.storage.from("company-assets").getPublicUrl(path);
  // Le agregamos un parámetro con la hora para evitar que el navegador muestre el logo viejo desde caché.
  const freshUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

  const { data: updateData, error: updateError } = await supabase
    .from("companies")
    .update({ logo_url: freshUrl })
    .eq("id", company.id)
    .select("id");

  if (updateError) {
    alertBox.textContent = t("dash.company.errUpload", { msg: updateError.message });
    alertBox.className = "alert error";
    return;
  }
  if (!updateData || updateData.length === 0) {
    alertBox.textContent = t("dash.company.errUpload", { msg: "0 filas afectadas (revisa la política RLS de UPDATE en companies)" });
    alertBox.className = "alert error";
    return;
  }

  company.logo_url = freshUrl;
  renderLogo();
  alertBox.textContent = t("dash.company.uploadSuccess");
  alertBox.className = "alert success";
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

init();
