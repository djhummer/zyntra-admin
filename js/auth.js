import { supabase } from "./supabaseClient.js";
import { t, initI18n } from "./i18n.js";

initI18n("lang-switcher-container");

const alertBox = document.getElementById("alert");

function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
}
function clearAlert() {
  alertBox.className = "alert";
  alertBox.textContent = "";
}

// --- Tabs ---
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".form-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`form-${tab.dataset.tab}`).classList.add("active");
    clearAlert();
  });
});

// --- Cargar países disponibles en el selector ---
(async () => {
  const { data: countries, error } = await supabase.from("countries").select("code, name").order("name");
  const select = document.getElementById("signup-country");
  if (error || !countries?.length) {
    select.innerHTML = `<option value="">${t("auth.signupCountryError")}</option>`;
    return;
  }
  select.innerHTML = countries.map((c) => `<option value="${c.code}">${escapeHtml(c.name)}</option>`).join("");
})();

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// --- Si ya hay sesión de admin, ir directo al dashboard ---
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();
    if (profile?.role === "super_admin") window.location.href = "super-admin.html";
    else if (profile?.role === "admin") window.location.href = "dashboard.html";
  }
})();

// --- Login ---
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return showAlert(traducirError(error.message));

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profErr || !profile) return showAlert(t("auth.errorNoProfile"));
  if (profile.role === "super_admin") {
    window.location.href = "super-admin.html";
    return;
  }
  if (profile.role !== "admin") {
    await supabase.auth.signOut();
    return showAlert(t("auth.errorNotAdmin"));
  }
  window.location.href = "dashboard.html";
});

// --- Crear empresa (signup admin) ---
document.getElementById("form-signup").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();
  const companyName = document.getElementById("signup-company").value.trim();
  const countryCode = document.getElementById("signup-country").value;
  const fullName = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  if (!countryCode) {
    showAlert(t("auth.errorChooseCountry"));
    submitBtn.disabled = false;
    return;
  }

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;

    if (!signUpData.session) {
      // El proyecto tiene "Confirm email" activado: no hay sesión todavía.
      showAlert(t("auth.successSignupPendingConfirm"), "success");
      submitBtn.disabled = false;
      return;
    }

    const { data: rpcData, error: rpcError } = await supabase.rpc("create_company_with_admin", {
      p_company_name: companyName,
      p_admin_name: fullName,
      p_country_code: countryCode,
    });
    if (rpcError) throw rpcError;

    const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    document.getElementById("code-value").textContent = row.company_code;
    document.getElementById("code-result").classList.add("show");
    showAlert(t("auth.successCompanyCreated"), "success");
  } catch (err) {
    showAlert(traducirError(err.message));
  } finally {
    submitBtn.disabled = false;
  }
});

function traducirError(msg = "") {
  if (msg.includes("Invalid login credentials")) return t("auth.errorInvalidCredentials");
  if (msg.includes("User already registered")) return t("auth.errorAlreadyRegistered");
  if (msg.includes("Password should be")) return t("auth.errorPasswordShort");
  return msg;
}
