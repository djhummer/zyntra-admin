import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  window.APP_CONFIG.SUPABASE_URL,
  window.APP_CONFIG.SUPABASE_ANON_KEY
);

// Cliente "de un solo uso": no guarda nada en localStorage ni toca la
// sesión del cliente `supabase` de arriba. Se usa para crear la cuenta
// de un empleado (auth.signUp) desde el panel del admin sin cerrar la
// sesión del propio admin — cada instancia mantiene su propio estado de
// autenticación en memoria, aislado del resto de la app.
export function createTempClient() {
  return createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
