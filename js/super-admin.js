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
    .select("id, name, code, country_code, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="empty-state">${t("sa.errLoading", { msg: escapeHtml(error.message) })}</div>`;
    return;
  }

  const pending = data.filter((c) => c.status === "pending").length;
  const active = data.filter((c) => c.status === "active").length;
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
      <thead><tr><th>${t("sa.thCompany")}</th><th>${t("sa.thCountry")}</th><th>${t("sa.thCode")}</th><th>${t("sa.thStatus")}</th><th>${t("sa.thCreated")}</th><th></th></tr></thead>
      <tbody>
        ${data.map((c) => `
          <tr>
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(countriesMap[c.country_code] || c.country_code)}</td>
            <td>${escapeHtml(c.code)}</td>
            <td>${statusBadge(c.status)}</td>
            <td>${new Date(c.created_at).toLocaleDateString(currentLocale())}</td>
            <td>${actionButtons(c)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

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

  list.querySelectorAll("[data-delete-company]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = { id: btn.dataset.deleteCompany, code: btn.dataset.code, name: btn.dataset.name };
      deleteCompany(c);
    });
  });
}

function statusBadge(status) {
  const map = {
    pending: [t("sa.statusPending"), "overtime"],
    active: [t("sa.statusActive"), "ok"],
    suspended: [t("sa.statusSuspended"), "overtime"],
  };
  const [label, cls] = map[status] || [status, "ok"];
  return `<span class="t-badge ${cls}" style="justify-self:start; display:inline-block">${label}</span>`;
}

function actionButtons(c) {
  const deleteBtn = `<button class="btn btn-ghost" data-delete-company="${c.id}" data-code="${escapeHtml(c.code)}" data-name="${escapeHtml(c.name)}" style="color:#c0392b">${t("sa.btnDelete")}</button>`;
  if (c.status === "pending") {
    return `<button class="btn btn-stamp" data-set-status="active" data-company-id="${c.id}">${t("sa.btnApprove")}</button> ${deleteBtn}`;
  }
  if (c.status === "active") {
    return `<button class="btn btn-ghost" data-set-status="suspended" data-company-id="${c.id}">${t("sa.btnSuspend")}</button> ${deleteBtn}`;
  }
  return `<button class="btn btn-primary" data-set-status="active" data-company-id="${c.id}">${t("sa.btnReactivate")}</button> ${deleteBtn}`;
}

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

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

init();
