import { supabase } from "./supabaseClient.js";
import { t, initI18n } from "./i18n.js";

initI18n("lang-switcher-container");

const alertBox = document.getElementById("alert");
function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
}

document.getElementById("form-bootstrap").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("su-name").value.trim();
  const email = document.getElementById("su-email").value.trim();
  const password = document.getElementById("su-password").value;
  const btn = e.target.querySelector("button[type=submit]");
  btn.disabled = true;

  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;

    if (!signUpData.session) {
      showAlert(t("sas.successPendingConfirm"), "success");
      return;
    }

    const { error: rpcError } = await supabase.rpc("bootstrap_super_admin", { p_full_name: fullName });
    if (rpcError) throw rpcError;

    window.location.href = "super-admin.html";
  } catch (err) {
    if (err.message.includes("Ya existe un super-admin")) {
      showAlert(t("sas.errAlreadyExists"));
    } else if (err.message.includes("User already registered")) {
      showAlert(t("sas.errAlreadyRegistered"));
    } else {
      showAlert(err.message);
    }
  } finally {
    btn.disabled = false;
  }
});
