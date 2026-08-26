import { supabase, createTempClient } from "./supabaseClient.js";

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

  $("#company-name").textContent = company.name;
  $("#company-code").textContent = company.code;
  $("#employees-code").textContent = company.code;
  renderStatusBanner();

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
    banner.innerHTML = `<div class="status-banner pending">⏳ Tu cuenta está <strong>pendiente de aprobación</strong>. Puedes configurar empleados y festivos, pero nadie podrá marcar entrada/salida hasta que el administrador del servicio active tu cuenta.</div>`;
  } else if (company.status === "suspended") {
    banner.innerHTML = `<div class="status-banner suspended">⛔ Tu cuenta está <strong>suspendida</strong>. Los empleados no pueden marcar entrada/salida. Contacta al administrador del servicio.</div>`;
  } else {
    banner.innerHTML = "";
  }
}

function setupNav() {
  document.querySelectorAll(".sidebar-nav button[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav button[data-view]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      ["report", "employees", "vacations", "holidays", "backup"].forEach((v) => {
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
  sel.innerHTML = `<option value="">Todos</option>` +
    employees.map((e) => `<option value="${e.id}">${escapeHtml(e.full_name)}</option>`).join("");

  const vacSel = $("#vac-employee");
  if (vacSel) {
    vacSel.innerHTML = employees.map((e) => `<option value="${e.id}">${escapeHtml(e.full_name)}</option>`).join("");
  }
}

function statusLabel(status) {
  return { active: "Activo", suspended: "Suspendido", terminated: "Retirado" }[status] || status;
}

function renderEmployeesTable() {
  const tbody = $("#employees-tbody");
  if (!employees.length) {
    tbody.innerHTML = `<tr><td colspan="6">Aún no hay empleados registrados.</td></tr>`;
    return;
  }
  tbody.innerHTML = employees.map((e) => `
    <tr>
      <td>${escapeHtml(e.full_name)}</td>
      <td>${escapeHtml(e.email)}</td>
      <td><span class="t-badge ${e.status === "active" ? "ok" : "overtime"}" style="display:inline-block">${statusLabel(e.status)}</span></td>
      <td>${e.hire_date ? new Date(`${e.hire_date}T12:00:00`).toLocaleDateString("es-CO") : "—"}</td>
      <td>${e.termination_date ? new Date(`${e.termination_date}T12:00:00`).toLocaleDateString("es-CO") : "—"}</td>
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
    btns.push(`<button class="btn btn-ghost" data-suspend="${e.id}">Suspender</button>`);
    btns.push(`<button class="btn btn-ghost" data-terminate="${e.id}">Retirar</button>`);
  } else if (e.status === "suspended") {
    btns.push(`<button class="btn btn-primary" data-reactivate="${e.id}">Reactivar</button>`);
    btns.push(`<button class="btn btn-ghost" data-terminate="${e.id}">Retirar</button>`);
  } else {
    btns.push(`<button class="btn btn-primary" data-reactivate="${e.id}">Reactivar</button>`);
  }
  btns.push(`<button class="btn btn-ghost" data-delete="${e.id}" style="color:var(--stamp)">Eliminar</button>`);
  return btns.join("");
}

function wireEmployeeActions() {
  $("#employees-tbody").querySelectorAll("[data-suspend]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("¿Suspender a este empleado? No podrá marcar entrada/salida hasta que lo reactives.")) return;
      const { error } = await supabase.from("profiles").update({ status: "suspended" }).eq("id", btn.dataset.suspend);
      if (error) return alert("No se pudo suspender: " + error.message);
      await loadEmployees(); renderEmployeesTable();
    });
  });

  $("#employees-tbody").querySelectorAll("[data-reactivate]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const { error } = await supabase.from("profiles")
        .update({ status: "active", termination_date: null })
        .eq("id", btn.dataset.reactivate);
      if (error) return alert("No se pudo reactivar: " + error.message);
      await loadEmployees(); renderEmployeesTable();
    });
  });

  $("#employees-tbody").querySelectorAll("[data-terminate]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const dateStr = prompt("Fecha de salida (AAAA-MM-DD):", new Date().toISOString().slice(0, 10));
      if (!dateStr) return;
      if (!confirm("¿Confirmas retirar a este empleado? Se conserva todo su historial de asistencia.")) return;
      const { error } = await supabase.from("profiles")
        .update({ status: "terminated", termination_date: dateStr })
        .eq("id", btn.dataset.terminate);
      if (error) return alert("No se pudo retirar: " + error.message);
      await loadEmployees(); renderEmployeesTable();
    });
  });

  $("#employees-tbody").querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("¿ELIMINAR DEFINITIVAMENTE a este empleado? Esto borra también todo su historial de asistencia y vacaciones. No se puede deshacer. Si solo quieres que deje de trabajar conservando sus registros, usa 'Retirar' en vez de esto.")) return;
      if (!confirm("Última confirmación: esta acción es permanente. ¿Continuar?")) return;
      const { error } = await supabase.from("profiles").delete().eq("id", btn.dataset.delete);
      if (error) return alert("No se pudo eliminar: " + error.message);
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

async function loadReport() {
  const list = $("#report-list");
  list.innerHTML = `<p class="loading">Cargando asistencias…</p>`;

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
    list.innerHTML = `<div class="empty-state">Error cargando datos: ${escapeHtml(error.message)}</div>`;
    return;
  }
  currentRecords = data || [];
  renderReport();
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
        checkIn: null,
        checkOut: null,
        overtime: false,
      };
    }
    const g = groups[key];
    g.overtime = g.overtime || r.is_overtime;
    if (r.type === "check_in" && (!g.checkIn || new Date(r.recorded_at) < new Date(g.checkIn.recorded_at))) g.checkIn = r;
    if (r.type === "check_out" && (!g.checkOut || new Date(r.recorded_at) > new Date(g.checkOut.recorded_at))) g.checkOut = r;
  }
  return Object.values(groups).sort((a, b) => (a.date < b.date ? 1 : -1) || a.name.localeCompare(b.name));
}

function applyOvertimeFilter(groups) {
  const mode = $("#filter-overtime").value;
  if (mode === "overtime") return groups.filter((g) => g.overtime);
  if (mode === "regular") return groups.filter((g) => !g.overtime);
  return groups;
}

function fmtTime(recordedAt) {
  if (!recordedAt) return "—";
  return new Date(recordedAt).toLocaleTimeString("es-CO", { timeZone: company.timezone, hour: "2-digit", minute: "2-digit" });
}
function fmtDate(dateKey) {
  const d = new Date(`${dateKey}T12:00:00-05:00`);
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "2-digit", month: "short" });
}
function mapLink(rec) {
  if (!rec || rec.latitude == null || rec.longitude == null) return "";
  const label = rec.address ? escapeHtml(rec.address) : "Ver mapa";
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
  container.innerHTML = `<p class="loading">Generando calendario…</p>`;

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
    container.innerHTML = `<div class="empty-state">No hay registros de asistencia para este filtro.</div>`;
    return;
  }

  const monthTitle = new Date(`${monthValue}-01T12:00:00`).toLocaleDateString("es-CO", { month: "long", year: "numeric" });
  const dows = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const legend = `
    <div class="cal-legend">
      <span><span class="swatch" style="background:var(--ok)"></span>Regular</span>
      <span><span class="swatch" style="background:var(--stamp)"></span>Overtime</span>
      <span><span class="swatch" style="background:#B23A3A"></span>Sin salida</span>
      <span><span class="swatch" style="background:var(--ok-soft)"></span>Vacaciones</span>
      <span><span class="swatch" style="background:var(--stamp-soft)"></span>Festivo</span>
    </div>`;

  const blocks = targetEmployees.map((emp) => {
    const empData = byEmployee[emp.id] || {};
    const empVacations = vacationsByEmployee[emp.id] || [];

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
        if (isHoliday) inner += `<div class="cal-holiday-tag">Festivo</div>`;
        if (g && g.checkIn && g.checkOut) {
          inner += `<div class="cal-bar ${g.overtime ? "overtime" : "regular"}">${fmtTime(g.checkIn.recorded_at)}–${fmtTime(g.checkOut.recorded_at)}</div>`;
        } else if (g && g.checkIn) {
          inner += `<div class="cal-bar incomplete">${fmtTime(g.checkIn.recorded_at)} (sin salida)</div>`;
        } else if (g && g.checkOut) {
          inner += `<div class="cal-bar incomplete">(sin entrada) ${fmtTime(g.checkOut.recorded_at)}</div>`;
        } else if (onVacation) {
          inner += `<div class="cal-vacation-tag">Vacaciones</div>`;
        }
      }
      return `<div class="${cls}">${inner}</div>`;
    }).join("")).join("");

    return `
      <div class="cal-employee-block">
        <div class="cal-employee-name">${escapeHtml(emp.full_name)}</div>
        <div class="cal-employee-email">${escapeHtml(emp.email)}</div>
        <div class="cal-month-title">${monthTitle}</div>
        <div class="cal-grid">
          ${dows.map((d) => `<div class="cal-dow">${d}</div>`).join("")}
          ${weeksHtml}
        </div>
      </div>`;
  }).join("");

  container.innerHTML = legend + blocks;
}

function renderReport() {
  const grouped = applyOvertimeFilter(groupByEmployeeDay(currentRecords));
  const list = $("#report-list");
  const calendar = $("#report-calendar");
  const viewMode = $("#filter-view").value;

  // Resumen
  const overtimeCount = grouped.filter((g) => g.overtime).length;
  const employeesWithRecords = new Set(grouped.map((g) => g.employeeId)).size;
  $("#summary-row").innerHTML = `
    <div class="summary-card"><div class="label">Días registrados</div><div class="value">${fmtMoney(grouped.length)}</div></div>
    <div class="summary-card"><div class="label">Empleados con marcas</div><div class="value">${fmtMoney(employeesWithRecords)}</div></div>
    <div class="summary-card stamp"><div class="label">Días con overtime</div><div class="value">${fmtMoney(overtimeCount)}</div></div>
  `;

  if (viewMode === "calendar") {
    list.style.display = "none";
    calendar.style.display = "block";
    renderCalendarView(grouped);
    return;
  }
  list.style.display = "block";
  calendar.style.display = "none";

  if (!grouped.length) {
    list.innerHTML = `<div class="empty-state">No hay registros de asistencia para este filtro.</div>`;
    return;
  }

  list.innerHTML = grouped.map((g) => `
    <div class="ticket">
      <div class="t-date">${fmtDate(g.date)}</div>
      <div class="t-name">${escapeHtml(g.name)}<small>${escapeHtml(g.email)}</small></div>
      <div class="t-time"><span class="lbl">Entrada</span>${fmtTime(g.checkIn?.recorded_at)}</div>
      <div class="t-time"><span class="lbl">Salida</span>${fmtTime(g.checkOut?.recorded_at)}</div>
      <div class="t-loc">${mapLink(g.checkIn) || mapLink(g.checkOut) || "<span style=\"color:var(--text-muted)\">Sin ubicación</span>"}</div>
      <div class="t-badge ${g.overtime ? "overtime" : "ok"}">${g.overtime ? "Overtime" : "Regular"}</div>
    </div>
  `).join("");
}

function exportCsv() {
  const grouped = applyOvertimeFilter(groupByEmployeeDay(currentRecords));
  const rows = [["Nombre", "Correo", "Fecha", "Entrada", "Salida", "Overtime", "Ubicación entrada", "Ubicación salida"]];
  for (const g of grouped) {
    rows.push([
      g.name, g.email, g.date,
      g.checkIn ? fmtTime(g.checkIn.recorded_at) : "",
      g.checkOut ? fmtTime(g.checkOut.recorded_at) : "",
      g.overtime ? "Sí" : "No",
      g.checkIn && g.checkIn.latitude != null ? `${g.checkIn.latitude},${g.checkIn.longitude}` : "",
      g.checkOut && g.checkOut.latitude != null ? `${g.checkOut.latitude},${g.checkOut.longitude}` : "",
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
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

async function loadVacationsSummary() {
  const tbody = $("#vacations-summary-tbody");
  tbody.innerHTML = `<tr><td colspan="4" class="loading">Cargando…</td></tr>`;
  const year = Number($("#vac-year").value) || new Date().getFullYear();

  const { data, error } = await supabase.from("vacations").select("employee_id, start_date, days_count");
  if (error) { tbody.innerHTML = `<tr><td colspan="4">Error: ${escapeHtml(error.message)}</td></tr>`; return; }

  const takenByEmployee = {};
  (data || []).forEach((v) => {
    const y = new Date(`${v.start_date}T12:00:00`).getFullYear();
    if (y === year) takenByEmployee[v.employee_id] = (takenByEmployee[v.employee_id] || 0) + v.days_count;
  });

  if (!employees.length) {
    tbody.innerHTML = `<tr><td colspan="4">Aún no hay empleados.</td></tr>`;
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
      if (updError) { alert("No se pudo guardar: " + updError.message); return; }
      const emp = employees.find((e) => e.id === input.dataset.vacAllowance);
      if (emp) emp.vacation_days_per_year = val;
      loadVacationsSummary();
    });
  });
}

async function loadVacationsLog() {
  const tbody = $("#vacations-log-tbody");
  tbody.innerHTML = `<tr><td colspan="5" class="loading">Cargando…</td></tr>`;
  const year = Number($("#vac-year").value) || new Date().getFullYear();

  const { data, error } = await supabase
    .from("vacations")
    .select("id, employee_id, start_date, end_date, days_count, note, profiles(full_name)")
    .gte("start_date", `${year}-01-01`)
    .lte("start_date", `${year}-12-31`)
    .order("start_date", { ascending: false });

  if (error) { tbody.innerHTML = `<tr><td colspan="5">Error: ${escapeHtml(error.message)}</td></tr>`; return; }

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="5">Sin períodos registrados en ${year}.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map((v) => `
    <tr>
      <td>${escapeHtml(v.profiles?.full_name || "—")}</td>
      <td>${fmtDateSimple(v.start_date)} – ${fmtDateSimple(v.end_date)}</td>
      <td>${v.days_count}</td>
      <td>${escapeHtml(v.note || "—")}</td>
      <td><button class="btn btn-ghost" data-del-vacation="${v.id}">Eliminar</button></td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-del-vacation]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("¿Eliminar este período de vacaciones?")) return;
      const { error: delError } = await supabase.from("vacations").delete().eq("id", btn.dataset.delVacation);
      if (delError) return alert("No se pudo eliminar: " + delError.message);
      loadVacationsSummary(); loadVacationsLog();
    });
  });
}

// ---------------------------------------------------------------------
// 4. Festivos
// ---------------------------------------------------------------------
async function loadHolidayCountries() {
  const list = $("#holiday-countries-list");
  list.innerHTML = `<span class="loading">Cargando…</span>`;

  const { data, error } = await supabase
    .from("company_holiday_countries")
    .select("country_code, is_base")
    .order("is_base", { ascending: false });

  if (error) { list.innerHTML = `Error: ${escapeHtml(error.message)}`; return; }

  const activeCodes = new Set((data || []).map((r) => r.country_code));

  list.innerHTML = (data || []).map((r) => `
    <span class="chip ${r.is_base ? "base" : ""}">
      ${escapeHtml(countriesMap[r.country_code] || r.country_code)}${r.is_base ? " (sede)" : ""}
      ${r.is_base ? "" : `<button type="button" class="chip-remove" data-remove-country="${r.country_code}" title="Quitar">×</button>`}
    </span>
  `).join("");

  list.querySelectorAll("[data-remove-country]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm(`¿Dejar de tomar los festivos de ${countriesMap[btn.dataset.removeCountry] || btn.dataset.removeCountry}?`)) return;
      const { error: delError } = await supabase
        .from("company_holiday_countries")
        .delete()
        .eq("company_id", company.id)
        .eq("country_code", btn.dataset.removeCountry);
      if (delError) { alert("No se pudo quitar: " + delError.message); return; }
      loadHolidayCountries();
      loadHolidays();
    });
  });

  // Selector para agregar países que todavía no están activos
  const select = $("#add-country-select");
  const options = Object.entries(countriesMap).filter(([code]) => !activeCodes.has(code));
  select.innerHTML = options.length
    ? `<option value="">Elegir país…</option>` + options.map(([code, name]) => `<option value="${code}">${escapeHtml(name)}</option>`).join("")
    : `<option value="">Ya están todos los países disponibles</option>`;
}

async function loadHolidays() {
  const tbody = $("#holidays-tbody");
  tbody.innerHTML = `<tr><td colspan="4" class="loading">Cargando…</td></tr>`;
  const { data, error } = await supabase.from("holidays").select("*").order("date");
  if (error) { tbody.innerHTML = `<tr><td colspan="4">Error: ${escapeHtml(error.message)}</td></tr>`; return; }

  tbody.innerHTML = (data || []).map((h) => `
    <tr>
      <td>${new Date(`${h.date}T12:00:00-05:00`).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</td>
      <td>${escapeHtml(h.name)}</td>
      <td>${h.company_id ? "Tu empresa" : `<span class="tag-default">${escapeHtml(countriesMap[h.country_code] || h.country_code)} (nacional)</span>`}</td>
      <td>${h.company_id ? `<button class="btn btn-ghost" data-del-holiday="${h.id}">Eliminar</button>` : ""}</td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-del-holiday]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("¿Eliminar este festivo?")) return;
      const { error } = await supabase.from("holidays").delete().eq("id", btn.dataset.delHoliday);
      if (error) alert("No se pudo eliminar: " + error.message);
      else loadHolidays();
    });
  });
}

// ---------------------------------------------------------------------
// 5. Respaldo
// ---------------------------------------------------------------------
async function downloadBackup() {
  const status = $("#backup-status");
  status.textContent = "Generando respaldo…";

  const [empRes, attRes, holRes, vacRes] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("attendance_records").select("*"),
    supabase.from("holidays").select("*"),
    supabase.from("vacations").select("*"),
  ]);

  const firstError = [empRes, attRes, holRes, vacRes].find((r) => r.error);
  if (firstError) { status.textContent = "Error generando el respaldo: " + firstError.error.message; return; }

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

  status.textContent = `Listo — respaldo descargado con ${empRes.data.length} empleados y ${attRes.data.length} marcas de asistencia.`;
}

// ---------------------------------------------------------------------
// 6. Handlers de formularios / botones
// ---------------------------------------------------------------------
function setupFormHandlers() {
  $("#filter-month").addEventListener("change", loadReport);
  $("#filter-employee").addEventListener("change", loadReport);
  $("#filter-overtime").addEventListener("change", renderReport);
  $("#filter-view").addEventListener("change", renderReport);
  $("#btn-print").addEventListener("click", () => window.print());
  $("#btn-export-csv").addEventListener("click", exportCsv);

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
    if (error) { alert("No se pudo registrar: " + error.message); return; }
    $("#form-vacation").reset();
    loadVacationsSummary();
    loadVacationsLog();
  });

  // Autocalcular días al elegir fechas (el admin puede ajustarlo después)
  const recalcVacDays = () => {
    const start = $("#vac-start").value;
    const end = $("#vac-end").value;
    if (!start || !end) return;
    const days = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
    if (days > 0) $("#vac-days").value = days;
  };
  $("#vac-start").addEventListener("change", recalcVacDays);
  $("#vac-end").addEventListener("change", recalcVacDays);

  $("#btn-download-backup").addEventListener("click", downloadBackup);

  $("#btn-add-country").addEventListener("click", async () => {
    const code = $("#add-country-select").value;
    if (!code) return;
    const { error } = await supabase.from("company_holiday_countries").insert({ company_id: company.id, country_code: code });
    if (error) { alert("No se pudo agregar: " + error.message); return; }
    loadHolidayCountries();
    loadHolidays();
  });

  $("#form-holiday").addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = $("#holiday-date").value;
    const name = $("#holiday-name").value.trim();
    const { error } = await supabase.from("holidays").insert({ company_id: company.id, date, name });
    if (error) { alert("No se pudo agregar: " + error.message); return; }
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
    alertBox.textContent = "Completa nombre, correo y una contraseña de al menos 6 caracteres.";
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
      throw new Error("Supabase pidió confirmar el correo antes de continuar. Desactiva 'Confirm email' en Authentication → Sign In / Providers → Email (ver README).");
    }

    const { error: joinError } = await temp.rpc("join_company_as_employee", {
      p_code: company.code,
      p_full_name: full_name,
      p_hire_date: hire_date,
    });
    if (joinError) throw joinError;

    alertBox.textContent = `Cuenta creada. Comparte con ${full_name}: correo ${email}, contraseña ${password}`;
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
    return "Ya existe una cuenta con ese correo (puede ser de otra empresa en este mismo sistema).";
  }
  if (msg.includes("Password should be")) return "La contraseña debe tener al menos 6 caracteres.";
  return msg;
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

init();
