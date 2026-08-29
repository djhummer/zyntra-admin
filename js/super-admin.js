import { supabase } from "./supabaseClient.js";
import { t, currentLocale, initI18n } from "./i18n.js";

let countriesMap = {};

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return (window.location.href = "index.html");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
  if (!profile || profile.role !== "super_admin") {
    return (window.location.href = "index.html");
  }

  initI18n("lang-switcher-container");

  const { data: countryRows } = await supabase.from("countries").select("code, name");
  (countryRows || []).forEach((c) => { countriesMap[c.code] = c.name; });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });

  await loadCompanies();
}

async function loadCompanies() {
  const list = document.getElementById("companies-list");
  list.innerHTML = `<p class="loading">${t("common.loading")}</p>`;

  const { data, error } = await supabase
    .from("companies")
    .select("id, name, code, country_code, status, created_at, plan_start, plan_end")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="empty-state">${t("sa.errLoading", { msg: escapeHtml(error.message) })}</div>`;
    return;
  }

  // Auto-suspend companies whose plan_end has passed
  const today = new Date().toISOString().split("T")[0];
  const toSuspend = data.filter((c) => c.status === "active" && c.plan_end && c.plan_end < today);
  if (toSuspend.length) {
    await Promise.all(toSuspend.map((c) =>
      supabase.from("companies").update({ status: "suspended" }).eq("id", c.id)
    ));
    toSuspend.forEach((c) => { c.status = "suspended"; });
  }

  const pending   = data.filter((c) => c.status === "pending").length;
  const active    = data.filter((c) => c.status === "active").length;
  const suspended = data.filter((c) => c.status === "suspended").length;

  document.getElementById("summary-row").innerHTML = `
    <div class="summary-card"><div class="label">${t("sa.summaryTotal")}</div><div class="value">${data.length}</div></div>
    <div class="summary-card stamp"><div class="label">${t("sa.summaryPending")}</div><div class="value">${pending}</div></div>
    <div class="summary-card"><div class="label">${t("sa.summaryActive")}</div><div class="value">${active}</div></div>
    <div class="summary-card"><div class="label">${t("sa.summarySuspended")}</div><div class="value">${suspended}</div></div>
  `;

  if (!data.length) {
    list.innerHTML = `<div class="empty-state">${t("sa.noneYet")}</div>`;
    return;
  }

  list.innerHTML = `
    <table class="simple-table">
      <thead><tr>
        <th>${t("sa.thCompany")}</th>
        <th>${t("sa.thCountry")}</th>
        <th>${t("sa.thCode")}</th>
        <th>${t("sa.thStatus")}</th>
        <th>${t("sa.thPlan")}</th>
        <th>${t("sa.thCreated")}</th>
        <th></th>
      </tr></thead>
      <tbody>
        ${data.map((c) => companyRow(c)).join("")}
      </tbody>
    </table>
  `;

  // Status change buttons
  list.querySelectorAll("[data-set-status]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const newStatus = btn.dataset.setStatus;
      const actionKey = { active: "sa.actionApprove", suspended: "sa.actionSuspend" }[newStatus] || "sa.actionUpdate";
      if (!confirm(t("sa.confirmAction", { action: t(actionKey) }))) return;
      const { error: updError } = await supabase
        .from("companies")
        .update({ status: newStatus })
        .eq("id", btn.dataset.companyId);
      if (updError) { alert(t("sa.errUpdate", { msg: updError.message })); return; }
      loadCompanies();
    });
  });

  // Delete buttons
  list.querySelectorAll("[data-delete-company]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = { id: btn.dataset.deleteCompany, code: btn.dataset.code, name: btn.dataset.name };
      deleteCompany(c);
    });
  });

  // Edit buttons
  list.querySelectorAll("[data-edit-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = JSON.parse(btn.dataset.editCompany);
      toggleEditRow(btn, c);
    });
  });
}

// ── Row renderer ──────────────────────────────────────────────────────────────

function companyRow(c) {
  return `
    <tr data-company-id="${c.id}">
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(countriesMap[c.country_code] || c.country_code)}</td>
      <td>${escapeHtml(c.code)}</td>
      <td>${statusBadge(c.status)}</td>
      <td style="font-size:12px;white-space:nowrap">${planLabel(c)}${planExpiresWarning(c)}</td>
      <td>${new Date(c.created_at).toLocaleDateString(currentLocale())}</td>
      <td style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-ghost" style="font-size:12px"
          data-edit-id="${c.id}"
          data-edit-company='${escapeAttr(JSON.stringify(c))}'>${t("sa.btnEdit")}</button>
        ${actionButtons(c)}
      </td>
    </tr>`;
}

function planLabel(c) {
  if (!c.plan_start && !c.plan_end) return `<span class="hint">${t("sa.planNone")}</span>`;
  const fmt = (d) => d
    ? new Date(d + "T00:00:00").toLocaleDateString(currentLocale(), { day: "2-digit", month: "2-digit", year: "2-digit" })
    : "—";
  return `${fmt(c.plan_start)} → ${fmt(c.plan_end)}`;
}

function planExpiresWarning(c) {
  if (!c.plan_end || c.status !== "active") return "";
  const today = new Date().toISOString().split("T")[0];
  const daysLeft = Math.ceil((new Date(c.plan_end + "T00:00:00") - new Date(today + "T00:00:00")) / 86400000);
  if (daysLeft > 0 && daysLeft <= 14) {
    return ` <span style="color:var(--stamp);font-size:11px;font-weight:700">${t("sa.planExpiresIn", { d: daysLeft })}</span>`;
  }
  return "";
}

// ── Inline edit row ───────────────────────────────────────────────────────────

function toggleEditRow(btn, c) {
  const tbody = btn.closest("tbody");
  const companyTr = btn.closest("tr");
  const existingEdit = tbody.querySelector(`tr.edit-row[data-for="${c.id}"]`);

  if (existingEdit) {
    existingEdit.remove();
    return;
  }

  const editTr = document.createElement("tr");
  editTr.className = "edit-row";
  editTr.dataset.for = c.id;
  editTr.innerHTML = `
    <td colspan="7" style="padding:16px 20px;background:var(--paper-card);border-top:2px solid var(--stamp)">
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end">
        <div style="display:flex;flex-direction:column;gap:4px;min-width:220px;flex:1">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${t("sa.editName")}</label>
          <input id="edit-name-${c.id}" type="text" value="${escapeHtml(c.name)}"
            style="padding:7px 10px;border:1px solid var(--line);border-radius:4px;font-size:14px;background:var(--paper);font-family:inherit;width:100%" />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${t("sa.editPlanStart")}</label>
          <input id="edit-plan-start-${c.id}" type="date" value="${c.plan_start || ''}"
            style="padding:7px 10px;border:1px solid var(--line);border-radius:4px;font-size:13px;background:var(--paper);font-family:inherit" />
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted)">${t("sa.editPlanEnd")}</label>
          <input id="edit-plan-end-${c.id}" type="date" value="${c.plan_end || ''}"
            style="padding:7px 10px;border:1px solid var(--line);border-radius:4px;font-size:13px;background:var(--paper);font-family:inherit" />
        </div>
        <div style="display:flex;gap:8px;align-items:center;padding-bottom:2px">
          <button class="btn btn-primary" id="edit-save-${c.id}">${t("sa.editSave")}</button>
          <button class="btn btn-ghost" id="edit-cancel-${c.id}">${t("sa.editCancel")}</button>
          <span id="edit-status-${c.id}" class="hint" style="font-size:12px"></span>
        </div>
      </div>
    </td>`;

  companyTr.after(editTr);

  document.getElementById(`edit-cancel-${c.id}`).addEventListener("click", () => editTr.remove());
  document.getElementById(`edit-save-${c.id}`).addEventListener("click", () => saveCompanyEdit(c.id, editTr));
}

async function saveCompanyEdit(id, editTr) {
  const nameVal   = (document.getElementById(`edit-name-${id}`)?.value || "").trim();
  const planStart = document.getElementById(`edit-plan-start-${id}`)?.value || null;
  const planEnd   = document.getElementById(`edit-plan-end-${id}`)?.value || null;
  const statusSpan = document.getElementById(`edit-status-${id}`);

  if (!nameVal) {
    statusSpan.textContent = t("sa.editErrName");
    statusSpan.style.color = "var(--stamp)";
    return;
  }

  const saveBtn = document.getElementById(`edit-save-${id}`);
  saveBtn.disabled = true;

  const { error } = await supabase
    .from("companies")
    .update({ name: nameVal, plan_start: planStart, plan_end: planEnd })
    .eq("id", id);

  if (error) {
    statusSpan.textContent = t("sa.errUpdate", { msg: error.message });
    statusSpan.style.color = "var(--stamp)";
    saveBtn.disabled = false;
    return;
  }

  editTr.remove();
  loadCompanies();
}

// ── Status / action helpers ───────────────────────────────────────────────────

function statusBadge(status) {
  const map = {
    pending:   [t("sa.statusPending"),   "overtime"],
    active:    [t("sa.statusActive"),    "ok"],
    suspended: [t("sa.statusSuspended"), "overtime"],
  };
  const [label, cls] = map[status] || [status, "ok"];
  return `<span class="t-badge ${cls}" style="display:inline-block">${label}</span>`;
}

function actionButtons(c) {
  const deleteBtn = `<button class="btn btn-ghost" data-delete-company="${c.id}" data-code="${escapeHtml(c.code)}" data-name="${escapeHtml(c.name)}" style="color:#c0392b;font-size:12px">${t("sa.btnDelete")}</button>`;
  if (c.status === "pending") {
    return `<button class="btn btn-stamp" style="font-size:12px" data-set-status="active" data-company-id="${c.id}">${t("sa.btnApprove")}</button> ${deleteBtn}`;
  }
  if (c.status === "active") {
    return `<button class="btn btn-ghost" style="font-size:12px" data-set-status="suspended" data-company-id="${c.id}">${t("sa.btnSuspend")}</button> ${deleteBtn}`;
  }
  return `<button class="btn btn-primary" style="font-size:12px" data-set-status="active" data-company-id="${c.id}">${t("sa.btnReactivate")}</button> ${deleteBtn}`;
}

// ── Delete ────────────────────────────────────────────────────────────────────

async function deleteCompany(c) {
  const typed = prompt(t("sa.deletePrompt", { name: c.name, code: c.code }));
  if (!typed || typed.trim().toUpperCase() !== c.code.toUpperCase()) {
    if (typed !== null) alert(t("sa.deleteWrongCode"));
    return;
  }
  if (!confirm(t("sa.deleteFinalConfirm", { name: c.name }))) return;

  try {
    await supabase.from("attendance_records").delete().eq("company_id", c.id);
    await supabase.from("vacations").delete().eq("company_id", c.id);
    await supabase.from("work_schedules").delete().eq("company_id", c.id);
    await supabase.from("holidays").delete().eq("company_id", c.id);
    await supabase.from("company_holiday_countries").delete().eq("company_id", c.id);
    await supabase.from("profiles").delete().eq("company_id", c.id);
    const { error } = await supabase.from("companies").delete().eq("id", c.id);
    if (error) throw error;
    loadCompanies();
  } catch (err) {
    alert(t("sa.deleteErr", { msg: err.message }));
  }
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function escapeAttr(str = "") {
  return String(str).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

init();
