// ============================================================
// Sistema de idiomas de ZyntrAbsen — Español / English / Indonesia / Français
// ============================================================
// Uso en HTML estático:
//   <span data-i18n="dash.emp.title"></span>          -> textContent
//   <span data-i18n-html="auth.codeResultHint"></span> -> innerHTML (para texto con <a>/<strong>)
//   <input data-i18n-placeholder="dash.hol.formNamePlaceholder" />
// Uso en JS:  import { t, currentLocale, initI18n } from "./i18n.js";  t("dash.emp.title")
// ============================================================

const dict = {
  // ---------------- Común ----------------
  "common.loading": { es: "Cargando…", en: "Loading…", id: "Memuat…", fr: "Chargement…" },
  "common.logout": { es: "Cerrar sesión", en: "Log out", id: "Keluar", fr: "Déconnexion" },

  // ---------------- Login / Crear empresa (index.html) ----------------
  "auth.pageTitle": { es: "ZyntrAbsen · Acceso administrador", en: "ZyntrAbsen · Admin access", id: "ZyntrAbsen · Akses admin", fr: "ZyntrAbsen · Accès administrateur" },
  "auth.title": { es: "Panel de administrador", en: "Admin panel", id: "Panel admin", fr: "Panneau administrateur" },
  "auth.subtitle": { es: "Consulta las asistencias de tu equipo e imprime el informe mensual.", en: "Check your team's attendance and print the monthly report.", id: "Lihat kehadiran timmu dan cetak laporan bulanan.", fr: "Consultez les présences de votre équipe et imprimez le rapport mensuel." },
  "auth.tabLogin": { es: "Iniciar sesión", en: "Log in", id: "Masuk", fr: "Se connecter" },
  "auth.tabSignup": { es: "Crear empresa", en: "Create company", id: "Buat perusahaan", fr: "Créer une entreprise" },
  "auth.loginEmail": { es: "Correo", en: "Email", id: "Email", fr: "E-mail" },
  "auth.loginPassword": { es: "Contraseña", en: "Password", id: "Kata sandi", fr: "Mot de passe" },
  "auth.loginButton": { es: "Ingresar", en: "Log in", id: "Masuk", fr: "Se connecter" },
  "auth.signupCompanyName": { es: "Nombre de la empresa", en: "Company name", id: "Nama perusahaan", fr: "Nom de l'entreprise" },
  "auth.signupCountry": { es: "País base", en: "Base country", id: "Negara basis", fr: "Pays de base" },
  "auth.signupCountryLoading": { es: "Cargando países…", en: "Loading countries…", id: "Memuat daftar negara…", fr: "Chargement des pays…" },
  "auth.signupCountryError": { es: "No se pudieron cargar los países", en: "Couldn't load countries", id: "Gagal memuat daftar negara", fr: "Impossible de charger les pays" },
  "auth.signupYourName": { es: "Tu nombre", en: "Your name", id: "Nama kamu", fr: "Votre nom" },
  "auth.signupEmail": { es: "Correo", en: "Email", id: "Email", fr: "E-mail" },
  "auth.signupPassword": { es: "Contraseña", en: "Password", id: "Kata sandi", fr: "Mot de passe" },
  "auth.signupButton": { es: "Crear empresa y cuenta admin", en: "Create company & admin account", id: "Buat perusahaan & akun admin", fr: "Créer l'entreprise et le compte admin" },
  "auth.signupHint": { es: "Se generará un código único que tus empleados usarán para registrarse en la app móvil.", en: "A unique code will be generated for your employees to register in the mobile app.", id: "Kode unik akan dibuat untuk digunakan karyawanmu saat mendaftar di aplikasi seluler.", fr: "Un code unique sera généré pour que vos employés s'inscrivent dans l'application mobile." },
  "auth.codeResultLabel": { es: "Código de invitación de tu empresa:", en: "Your company's invite code:", id: "Kode undangan perusahaanmu:", fr: "Code d'invitation de votre entreprise :" },
  "auth.codeResultHint": {
    es: 'Guárdalo y compártelo con tus empleados. Ya puedes <a href="dashboard.html">ir al panel</a>.',
    en: 'Save it and share it with your employees. You can now <a href="dashboard.html">go to the panel</a>.',
    id: 'Simpan dan bagikan ke karyawanmu. Sekarang kamu bisa <a href="dashboard.html">buka panel</a>.',
    fr: 'Enregistrez-le et partagez-le avec vos employés. Vous pouvez maintenant <a href="dashboard.html">aller au panneau</a>.',
  },
  "auth.errorNoProfile": { es: "No se encontró un perfil para esta cuenta.", en: "No profile found for this account.", id: "Profil untuk akun ini tidak ditemukan.", fr: "Aucun profil trouvé pour ce compte." },
  "auth.errorNotAdmin": { es: "Esta cuenta es de empleado, no de administrador. Usa la app móvil.", en: "This account belongs to an employee, not an admin. Use the mobile app.", id: "Akun ini milik karyawan, bukan admin. Gunakan aplikasi seluler.", fr: "Ce compte est un compte employé, pas administrateur. Utilisez l'application mobile." },
  "auth.errorChooseCountry": { es: "Elige el país de la empresa.", en: "Choose the company's country.", id: "Pilih negara perusahaan.", fr: "Choisissez le pays de l'entreprise." },
  "auth.successSignupPendingConfirm": {
    es: "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión, o desactiva 'Confirm email' en Supabase Auth para pruebas internas.",
    en: "Account created. Check your email to confirm it and then log in, or disable 'Confirm email' in Supabase Auth for internal testing.",
    id: "Akun berhasil dibuat. Cek email untuk konfirmasi lalu masuk, atau nonaktifkan 'Confirm email' di Supabase Auth untuk pengujian internal.",
    fr: "Compte créé. Vérifiez votre e-mail pour le confirmer puis connectez-vous, ou désactivez 'Confirm email' dans Supabase Auth pour les tests internes.",
  },
  "auth.successCompanyCreated": { es: "¡Empresa creada correctamente!", en: "Company created successfully!", id: "Perusahaan berhasil dibuat!", fr: "Entreprise créée avec succès !" },
  "auth.errorInvalidCredentials": { es: "Correo o contraseña incorrectos.", en: "Incorrect email or password.", id: "Email atau kata sandi salah.", fr: "E-mail ou mot de passe incorrect." },
  "auth.errorAlreadyRegistered": { es: "Ya existe una cuenta con ese correo.", en: "An account with that email already exists.", id: "Akun dengan email tersebut sudah ada.", fr: "Un compte avec cet e-mail existe déjà." },
  "auth.errorPasswordShort": { es: "La contraseña debe tener al menos 6 caracteres.", en: "The password must be at least 6 characters.", id: "Kata sandi minimal harus 6 karakter.", fr: "Le mot de passe doit contenir au moins 6 caractères." },

  // ---------------- Dashboard: sidebar / general ----------------
  "dash.pageTitle": { es: "ZyntrAbsen · Panel", en: "ZyntrAbsen · Panel", id: "ZyntrAbsen · Panel", fr: "ZyntrAbsen · Panneau" },
  "dash.navReport": { es: "Informe de asistencia", en: "Attendance report", id: "Laporan kehadiran", fr: "Rapport de présence" },
  "dash.navEmployees": { es: "Empleados", en: "Employees", id: "Karyawan", fr: "Employés" },
  "dash.navVacations": { es: "Vacaciones", en: "Vacation", id: "Cuti", fr: "Congés" },
  "dash.navHolidays": { es: "Festivos", en: "Holidays", id: "Hari Libur", fr: "Jours fériés" },
  "dash.navBackup": { es: "Respaldo", en: "Backup", id: "Cadangan", fr: "Sauvegarde" },
  "dash.navCompany": { es: "Empresa", en: "Company", id: "Perusahaan", fr: "Entreprise" },
  "dash.inviteCode": { es: "Código de invitación", en: "Invite code", id: "Kode undangan", fr: "Code d'invitation" },
  "dash.statusPending": {
    es: "⏳ Tu cuenta está <strong>pendiente de aprobación</strong>. Puedes configurar empleados y festivos, pero nadie podrá marcar entrada/salida hasta que el administrador del servicio active tu cuenta.",
    en: "⏳ Your account is <strong>pending approval</strong>. You can set up employees and holidays, but no one can clock in/out until the service administrator activates your account.",
    id: "⏳ Akun kamu <strong>menunggu persetujuan</strong>. Kamu bisa mengatur karyawan dan hari libur, tapi tidak ada yang bisa absen masuk/keluar sampai admin layanan mengaktifkan akunmu.",
    fr: "⏳ Votre compte est <strong>en attente d'approbation</strong>. Vous pouvez configurer les employés et les jours fériés, mais personne ne pourra pointer jusqu'à ce que l'administrateur du service active votre compte.",
  },
  "dash.statusSuspended": {
    es: "⛔ Tu cuenta está <strong>suspendida</strong>. Los empleados no pueden marcar entrada/salida. Contacta al administrador del servicio.",
    en: "⛔ Your account is <strong>suspended</strong>. Employees cannot clock in/out. Contact the service administrator.",
    id: "⛔ Akun kamu <strong>ditangguhkan</strong>. Karyawan tidak bisa absen masuk/keluar. Hubungi admin layanan.",
    fr: "⛔ Votre compte est <strong>suspendu</strong>. Les employés ne peuvent pas pointer. Contactez l'administrateur du service.",
  },

  // ---------------- Dashboard: Informe ----------------
  "dash.report.title": { es: "Informe de asistencia", en: "Attendance report", id: "Laporan kehadiran", fr: "Rapport de présence" },
  "dash.report.exportCsv": { es: "Exportar CSV", en: "Export CSV", id: "Ekspor CSV", fr: "Exporter CSV" },
  "dash.report.print": { es: "Imprimir informe", en: "Print report", id: "Cetak laporan", fr: "Imprimer le rapport" },
  "dash.report.month": { es: "Mes", en: "Month", id: "Bulan", fr: "Mois" },
  "dash.report.employee": { es: "Empleado", en: "Employee", id: "Karyawan", fr: "Employé" },
  "dash.report.employeeAll": { es: "Todos", en: "All", id: "Semua", fr: "Tous" },
  "dash.report.show": { es: "Mostrar", en: "Show", id: "Tampilkan", fr: "Afficher" },
  "dash.report.showAll": { es: "Todos los registros", en: "All records", id: "Semua catatan", fr: "Tous les enregistrements" },
  "dash.report.showOvertimeOnly": { es: "Solo overtime", en: "Overtime only", id: "Hanya lembur", fr: "Heures supp. seulement" },
  "dash.report.showRegularOnly": { es: "Solo horario regular", en: "Regular hours only", id: "Hanya jam reguler", fr: "Horaire régulier seulement" },
  "dash.report.view": { es: "Vista", en: "View", id: "Tampilan", fr: "Vue" },
  "dash.report.viewList": { es: "Lista", en: "List", id: "Daftar", fr: "Liste" },
  "dash.report.viewCalendar": { es: "Calendario", en: "Calendar", id: "Kalender", fr: "Calendrier" },
  "dash.report.loadingAttendance": { es: "Cargando asistencias…", en: "Loading attendance…", id: "Memuat data kehadiran…", fr: "Chargement des présences…" },
  "dash.report.summaryDaysRegistered": { es: "Días registrados", en: "Days recorded", id: "Hari tercatat", fr: "Jours enregistrés" },
  "dash.report.summaryEmployeesWithRecords": { es: "Empleados con marcas", en: "Employees with records", id: "Karyawan dengan catatan", fr: "Employés avec pointages" },
  "dash.report.summaryOvertimeDays": { es: "Días con overtime", en: "Days with overtime", id: "Hari dengan lembur", fr: "Jours avec heures supp." },
  "dash.report.noRecords": { es: "No hay registros de asistencia para este filtro.", en: "No attendance records for this filter.", id: "Tidak ada data kehadiran untuk filter ini.", fr: "Aucun enregistrement de présence pour ce filtre." },
  "dash.report.errorLoading": { es: "Error cargando datos: {msg}", en: "Error loading data: {msg}", id: "Gagal memuat data: {msg}", fr: "Erreur de chargement des données : {msg}" },
  "dash.report.entrada": { es: "Entrada", en: "Check-in", id: "Masuk", fr: "Entrée" },
  "dash.report.salida": { es: "Salida", en: "Check-out", id: "Keluar", fr: "Sortie" },
  "dash.report.noLocation": { es: "Sin ubicación", en: "No location", id: "Tanpa lokasi", fr: "Sans localisation" },
  "dash.report.overtime": { es: "Overtime", en: "Overtime", id: "Lembur", fr: "Heures supp." },
  "dash.report.regular": { es: "Regular", en: "Regular", id: "Reguler", fr: "Régulier" },
  "dash.report.viewMap": { es: "Ver mapa", en: "View map", id: "Lihat peta", fr: "Voir la carte" },
  "dash.report.csvName": { es: "Nombre", en: "Name", id: "Nama", fr: "Nom" },
  "dash.report.csvEmail": { es: "Correo", en: "Email", id: "Email", fr: "E-mail" },
  "dash.report.csvDate": { es: "Fecha", en: "Date", id: "Tanggal", fr: "Date" },
  "dash.report.csvCheckIn": { es: "Entrada", en: "Check-in", id: "Masuk", fr: "Entrée" },
  "dash.report.csvCheckOut": { es: "Salida", en: "Check-out", id: "Keluar", fr: "Sortie" },
  "dash.report.csvOvertime": { es: "Overtime", en: "Overtime", id: "Lembur", fr: "Heures supp." },
  "dash.report.csvLocIn": { es: "Ubicación entrada", en: "Check-in location", id: "Lokasi masuk", fr: "Lieu d'entrée" },
  "dash.report.csvLocOut": { es: "Ubicación salida", en: "Check-out location", id: "Lokasi keluar", fr: "Lieu de sortie" },
  "dash.report.csvYes": { es: "Sí", en: "Yes", id: "Ya", fr: "Oui" },
  "dash.report.csvNo": { es: "No", en: "No", id: "Tidak", fr: "Non" },
  "dash.report.csvType": { es: "Tipo", en: "Type", id: "Jenis", fr: "Type" },
  "dash.report.csvTime": { es: "Hora", en: "Time", id: "Waktu", fr: "Heure" },
  "dash.report.summaryRecords": { es: "Marcajes registrados", en: "Records logged", id: "Catatan tercatat", fr: "Pointages enregistrés" },
  "dash.report.summaryOvertimeRecords": { es: "Marcajes con overtime", en: "Records with overtime", id: "Catatan dengan lembur", fr: "Pointages avec heures supp." },
  "dash.report.recordsLabel": { es: "marcajes", en: "records", id: "catatan", fr: "pointages" },
  "dash.report.prevMonth": { es: "Mes anterior", en: "Previous month", id: "Bulan sebelumnya", fr: "Mois précédent" },
  "dash.report.nextMonth": { es: "Mes siguiente", en: "Next month", id: "Bulan berikutnya", fr: "Mois suivant" },

  // ---------------- Dashboard: Calendario (impresión) ----------------
  "dash.cal.legendRegular": { es: "Regular", en: "Regular", id: "Reguler", fr: "Régulier" },
  "dash.cal.legendOvertime": { es: "Overtime", en: "Overtime", id: "Lembur", fr: "Heures supp." },
  "dash.cal.legendIncomplete": { es: "Sin salida", en: "No checkout", id: "Belum keluar", fr: "Sans sortie" },
  "dash.cal.legendVacation": { es: "Vacaciones", en: "Vacation", id: "Cuti", fr: "Congés" },
  "dash.cal.legendHoliday": { es: "Festivo", en: "Holiday", id: "Libur", fr: "Jour férié" },
  "dash.cal.totalRegular": { es: "Total regular", en: "Total regular", id: "Total reguler", fr: "Total régulier" },
  "dash.cal.totalOvertime": { es: "Total overtime", en: "Total overtime", id: "Total lembur", fr: "Total heures supp." },
  "dash.cal.totalLate": { es: "Total tardías", en: "Total late", id: "Total terlambat", fr: "Total retards" },
  "dash.cal.generating": { es: "Generando calendario…", en: "Generating calendar…", id: "Membuat kalender…", fr: "Génération du calendrier…" },
  "dash.cal.noSalida": { es: "(sin salida)", en: "(no checkout)", id: "(belum keluar)", fr: "(sans sortie)" },
  "dash.cal.noEntrada": { es: "(sin entrada)", en: "(no check-in)", id: "(belum masuk)", fr: "(sans entrée)" },
  "dash.cal.holidayTag": { es: "Festivo", en: "Holiday", id: "Libur", fr: "Jour férié" },
  "dash.cal.vacationTag": { es: "Vacaciones", en: "Vacation", id: "Cuti", fr: "Congés" },
  "dash.cal.dowMon": { es: "Lun", en: "Mon", id: "Sen", fr: "Lun" },
  "dash.cal.dowTue": { es: "Mar", en: "Tue", id: "Sel", fr: "Mar" },
  "dash.cal.dowWed": { es: "Mié", en: "Wed", id: "Rab", fr: "Mer" },
  "dash.cal.dowThu": { es: "Jue", en: "Thu", id: "Kam", fr: "Jeu" },
  "dash.cal.dowFri": { es: "Vie", en: "Fri", id: "Jum", fr: "Ven" },
  "dash.cal.dowSat": { es: "Sáb", en: "Sat", id: "Sab", fr: "Sam" },
  "dash.cal.dowSun": { es: "Dom", en: "Sun", id: "Min", fr: "Dim" },

  // ---------------- Dashboard: Empleados ----------------
  "dash.emp.title": { es: "Empleados", en: "Employees", id: "Karyawan", fr: "Employés" },
  "dash.emp.hintHtml": {
    es: "Dos formas de dar de alta a un empleado: <strong>crea su cuenta aquí</strong> (le compartes el correo y la contraseña provisional que elijas) o comparte el código <strong>{code}</strong> para que se registre solo desde la app móvil.",
    en: "Two ways to add an employee: <strong>create their account here</strong> (share the email and provisional password you choose) or share the code <strong>{code}</strong> so they can register themselves from the mobile app.",
    id: "Ada dua cara menambahkan karyawan: <strong>buat akunnya di sini</strong> (bagikan email dan kata sandi sementara pilihanmu) atau bagikan kode <strong>{code}</strong> agar mereka mendaftar sendiri lewat aplikasi seluler.",
    fr: "Deux façons d'ajouter un employé : <strong>créez son compte ici</strong> (partagez l'e-mail et le mot de passe provisoire que vous choisissez) ou partagez le code <strong>{code}</strong> pour qu'il s'inscrive lui-même depuis l'application mobile.",
  },
  "dash.emp.formName": { es: "Nombre completo", en: "Full name", id: "Nama lengkap", fr: "Nom complet" },
  "dash.emp.formEmail": { es: "Correo", en: "Email", id: "Email", fr: "E-mail" },
  "dash.emp.formPassword": { es: "Contraseña provisional", en: "Provisional password", id: "Kata sandi sementara", fr: "Mot de passe provisoire" },
  "dash.emp.formPasswordPlaceholder": { es: "Mínimo 6 caracteres", en: "Minimum 6 characters", id: "Minimal 6 karakter", fr: "Minimum 6 caractères" },
  "dash.emp.formHireDate": { es: "Fecha de ingreso", en: "Hire date", id: "Tanggal masuk kerja", fr: "Date d'embauche" },
  "dash.emp.formSubmit": { es: "Crear cuenta", en: "Create account", id: "Buat akun", fr: "Créer un compte" },
  "dash.emp.thName": { es: "Nombre", en: "Name", id: "Nama", fr: "Nom" },
  "dash.emp.thEmail": { es: "Correo", en: "Email", id: "Email", fr: "E-mail" },
  "dash.emp.thStatus": { es: "Estado", en: "Status", id: "Status", fr: "Statut" },
  "dash.emp.thHire": { es: "Ingreso", en: "Hired", id: "Masuk", fr: "Embauche" },
  "dash.emp.thTermination": { es: "Salida", en: "Left", id: "Keluar", fr: "Départ" },
  "dash.emp.noneYet": { es: "Aún no hay empleados registrados.", en: "No employees registered yet.", id: "Belum ada karyawan yang terdaftar.", fr: "Aucun employé enregistré pour l'instant." },
  "dash.emp.statusActive": { es: "Activo", en: "Active", id: "Aktif", fr: "Actif" },
  "dash.emp.statusSuspended": { es: "Suspendido", en: "Suspended", id: "Ditangguhkan", fr: "Suspendu" },
  "dash.emp.statusTerminated": { es: "Retirado", en: "Terminated", id: "Berhenti", fr: "Désactivé" },
  "dash.emp.btnSuspend": { es: "Suspender", en: "Suspend", id: "Tangguhkan", fr: "Suspendre" },
  "dash.emp.btnTerminate": { es: "Retirar", en: "Terminate", id: "Berhentikan", fr: "Désactiver" },
  "dash.emp.btnReactivate": { es: "Reactivar", en: "Reactivate", id: "Aktifkan lagi", fr: "Réactiver" },
  "dash.emp.btnRename":    { es: "Cambiar nombre", en: "Rename", id: "Ubah nama", fr: "Renommer" },
  "dash.emp.promptRename": { es: "Nuevo nombre completo:", en: "New full name:", id: "Nama lengkap baru:", fr: "Nouveau nom complet :" },
  "dash.emp.errRename":    { es: "No se pudo cambiar el nombre: {msg}", en: "Couldn't rename: {msg}", id: "Gagal mengubah nama: {msg}", fr: "Impossible de renommer : {msg}" },
  "dash.emp.btnDelete": { es: "Eliminar", en: "Delete", id: "Hapus", fr: "Supprimer" },
  "dash.emp.confirmSuspend": { es: "¿Suspender a este empleado? No podrá marcar entrada/salida hasta que lo reactives.", en: "Suspend this employee? They won't be able to clock in/out until you reactivate them.", id: "Tangguhkan karyawan ini? Mereka tidak bisa absen masuk/keluar sampai kamu aktifkan lagi.", fr: "Suspendre cet employé ? Il ne pourra pas pointer jusqu'à votre réactivation." },
  "dash.emp.errSuspend": { es: "No se pudo suspender: {msg}", en: "Couldn't suspend: {msg}", id: "Gagal menangguhkan: {msg}", fr: "Impossible de suspendre : {msg}" },
  "dash.emp.errReactivate": { es: "No se pudo reactivar: {msg}", en: "Couldn't reactivate: {msg}", id: "Gagal mengaktifkan kembali: {msg}", fr: "Impossible de réactiver : {msg}" },
  "dash.emp.promptTerminationDate": { es: "Fecha de salida (AAAA-MM-DD):", en: "Termination date (YYYY-MM-DD):", id: "Tanggal berhenti (YYYY-MM-DD):", fr: "Date de départ (AAAA-MM-JJ) :" },
  "dash.emp.confirmTerminate": { es: "¿Confirmas retirar a este empleado? Se conserva todo su historial de asistencia.", en: "Confirm terminating this employee? Their full attendance history will be kept.", id: "Konfirmasi berhentikan karyawan ini? Seluruh riwayat kehadirannya akan tetap disimpan.", fr: "Confirmez la désactivation de cet employé ? Tout son historique de présence sera conservé." },
  "dash.emp.errTerminate": { es: "No se pudo retirar: {msg}", en: "Couldn't terminate: {msg}", id: "Gagal memberhentikan: {msg}", fr: "Impossible de désactiver : {msg}" },
  "dash.emp.confirmDelete1": {
    es: "¿ELIMINAR DEFINITIVAMENTE a este empleado? Esto borra también todo su historial de asistencia y vacaciones. No se puede deshacer. Si solo quieres que deje de trabajar conservando sus registros, usa 'Retirar' en vez de esto.",
    en: "PERMANENTLY DELETE this employee? This also erases all their attendance and vacation history. This cannot be undone. If you just want them to stop working while keeping their records, use 'Terminate' instead.",
    id: "HAPUS PERMANEN karyawan ini? Ini juga akan menghapus seluruh riwayat kehadiran dan cutinya. Tidak bisa dibatalkan. Jika kamu hanya ingin menghentikannya bekerja tapi tetap menyimpan datanya, gunakan 'Berhentikan' saja.",
    fr: "SUPPRIMER DÉFINITIVEMENT cet employé ? Cela efface également tout son historique de présence et de congés. Cette action est irréversible. Si vous voulez simplement qu'il arrête de travailler en conservant ses données, utilisez 'Désactiver' à la place.",
  },
  "dash.emp.confirmDelete2": { es: "Última confirmación: esta acción es permanente. ¿Continuar?", en: "Final confirmation: this action is permanent. Continue?", id: "Konfirmasi terakhir: tindakan ini permanen. Lanjutkan?", fr: "Dernière confirmation : cette action est permanente. Continuer ?" },
  "dash.emp.errDelete": { es: "No se pudo eliminar: {msg}", en: "Couldn't delete: {msg}", id: "Gagal menghapus: {msg}", fr: "Impossible de supprimer : {msg}" },
  "dash.emp.alertIncomplete": { es: "Completa nombre, correo y una contraseña de al menos 6 caracteres.", en: "Fill in name, email, and a password of at least 6 characters.", id: "Isi nama, email, dan kata sandi minimal 6 karakter.", fr: "Remplissez le nom, l'e-mail et un mot de passe d'au moins 6 caractères." },
  "dash.emp.errConfirmEmail": {
    es: "Supabase pidió confirmar el correo antes de continuar. Desactiva 'Confirm email' en Authentication → Sign In / Providers → Email (ver README).",
    en: "Supabase asked to confirm the email before continuing. Disable 'Confirm email' in Authentication → Sign In / Providers → Email (see README).",
    id: "Supabase meminta konfirmasi email sebelum melanjutkan. Nonaktifkan 'Confirm email' di Authentication → Sign In / Providers → Email (lihat README).",
    fr: "Supabase a demandé de confirmer l'e-mail avant de continuer. Désactivez 'Confirm email' dans Authentication → Sign In / Providers → Email (voir README).",
  },
  "dash.emp.successCreated": { es: "Cuenta creada. Comparte con {name}: correo {email}, contraseña {password}", en: "Account created. Share with {name}: email {email}, password {password}", id: "Akun berhasil dibuat. Bagikan ke {name}: email {email}, kata sandi {password}", fr: "Compte créé. Partagez avec {name} : e-mail {email}, mot de passe {password}" },
  "dash.emp.errAlreadyRegistered": { es: "Ya existe una cuenta con ese correo (puede ser de otra empresa en este mismo sistema).", en: "An account with that email already exists (it may belong to another company in this same system).", id: "Akun dengan email tersebut sudah ada (mungkin milik perusahaan lain di sistem yang sama).", fr: "Un compte avec cet e-mail existe déjà (il peut appartenir à une autre entreprise dans ce même système)." },
  "dash.emp.errPasswordShort": { es: "La contraseña debe tener al menos 6 caracteres.", en: "The password must be at least 6 characters.", id: "Kata sandi minimal harus 6 karakter.", fr: "Le mot de passe doit contenir au moins 6 caractères." },

  // ---------------- Dashboard: Vacaciones ----------------
  "dash.vac.title": { es: "Vacaciones", en: "Vacation", id: "Cuti", fr: "Congés" },
  "dash.vac.year": { es: "Año", en: "Year", id: "Tahun", fr: "Année" },
  "dash.vac.hint": {
    es: "El saldo se calcula como los días asignados al año menos los días ya registrados como tomados en ese año. Los días asignados son editables por empleado.",
    en: "The balance is calculated as the days assigned per year minus the days already recorded as taken that year. Assigned days are editable per employee.",
    id: "Sisa cuti dihitung dari hari yang dialokasikan per tahun dikurangi hari yang sudah tercatat diambil pada tahun itu. Hari yang dialokasikan bisa diedit per karyawan.",
    fr: "Le solde est calculé comme les jours attribués par an moins les jours déjà enregistrés comme pris cette année. Les jours attribués sont modifiables par employé.",
  },
  "dash.vac.thEmployee": { es: "Empleado", en: "Employee", id: "Karyawan", fr: "Employé" },
  "dash.vac.thAllowance": { es: "Asignados/año", en: "Assigned/year", id: "Dialokasikan/tahun", fr: "Attribués/an" },
  "dash.vac.thTaken": { es: "Tomados este año", en: "Taken this year", id: "Diambil tahun ini", fr: "Pris cette année" },
  "dash.vac.thRemaining": { es: "Restantes", en: "Remaining", id: "Sisa", fr: "Restants" },
  "dash.vac.registerTitle": { es: "Registrar un período tomado", en: "Register a period taken", id: "Catat periode cuti", fr: "Enregistrer une période prise" },
  "dash.vac.formEmployee": { es: "Empleado", en: "Employee", id: "Karyawan", fr: "Employé" },
  "dash.vac.formStart": { es: "Inicio", en: "Start", id: "Mulai", fr: "Début" },
  "dash.vac.formEnd": { es: "Fin", en: "End", id: "Selesai", fr: "Fin" },
  "dash.vac.formDays": { es: "Días", en: "Days", id: "Hari", fr: "Jours" },
  "dash.vac.formNote": { es: "Nota (opcional)", en: "Note (optional)", id: "Catatan (opsional)", fr: "Note (facultatif)" },
  "dash.vac.formNotePlaceholder": { es: "Ej. Vacaciones de fin de año", en: "E.g. Year-end vacation", id: "Cth. Cuti akhir tahun", fr: "Ex. Congés de fin d'année" },
  "dash.vac.formSubmit": { es: "Registrar", en: "Register", id: "Catat", fr: "Enregistrer" },
  "dash.vac.thPeriod": { es: "Período", en: "Period", id: "Periode", fr: "Période" },
  "dash.vac.thDays": { es: "Días", en: "Days", id: "Hari", fr: "Jours" },
  "dash.vac.thNote": { es: "Nota", en: "Note", id: "Catatan", fr: "Note" },
  "dash.vac.noEmployees": { es: "Aún no hay empleados.", en: "No employees yet.", id: "Belum ada karyawan.", fr: "Aucun employé pour l'instant." },
  "dash.vac.errSave": { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}", fr: "Impossible d'enregistrer : {msg}" },
  "dash.vac.noneInYear": { es: "Sin períodos registrados en {year}.", en: "No periods recorded in {year}.", id: "Belum ada periode tercatat di tahun {year}.", fr: "Aucune période enregistrée en {year}." },
  "dash.vac.btnDelete": { es: "Eliminar", en: "Delete", id: "Hapus", fr: "Supprimer" },
  "dash.vac.confirmDelete": { es: "¿Eliminar este período de vacaciones?", en: "Delete this vacation period?", id: "Hapus periode cuti ini?", fr: "Supprimer cette période de congés ?" },
  "dash.vac.errDelete": { es: "No se pudo eliminar: {msg}", en: "Couldn't delete: {msg}", id: "Gagal menghapus: {msg}", fr: "Impossible de supprimer : {msg}" },
  "dash.vac.errRegister": { es: "No se pudo registrar: {msg}", en: "Couldn't register: {msg}", id: "Gagal mencatat: {msg}", fr: "Impossible d'enregistrer : {msg}" },

  // ---------------- Dashboard: Festivos ----------------
  "dash.hol.title": { es: "Festivos", en: "Holidays", id: "Hari Libur", fr: "Jours fériés" },
  "dash.hol.hint": {
    es: "Los festivos nacionales del país de tu empresa ya están precargados. Agrega aquí fechas especiales propias de tu empresa (cierres, puentes internos, etc). Cualquier día listado aquí cuenta como overtime a cualquier hora.",
    en: "Your company's national holidays are already preloaded. Add your own company-specific dates here (closures, internal long weekends, etc). Any day listed here counts as overtime at any time.",
    id: "Hari libur nasional negara perusahaanmu sudah dimuat otomatis. Tambahkan di sini tanggal khusus milik perusahaanmu sendiri (tutup kantor, cuti bersama internal, dll). Setiap hari yang terdaftar di sini dihitung lembur kapan pun.",
    fr: "Les jours fériés nationaux du pays de votre entreprise sont déjà préchargés. Ajoutez ici vos dates spéciales propres à votre entreprise (fermetures, ponts internes, etc). Tout jour listé ici compte comme heures supplémentaires à toute heure.",
  },
  "dash.hol.countriesLabel": { es: "Países cuyos festivos nacionales aplican", en: "Countries whose national holidays apply", id: "Negara yang hari liburnya berlaku", fr: "Pays dont les jours fériés nationaux s'appliquent" },
  "dash.hol.addCountryLabel": { es: "Agregar otro país (ej. embajadas)", en: "Add another country (e.g. embassies)", id: "Tambah negara lain (mis. kedutaan)", fr: "Ajouter un autre pays (ex. ambassades)" },
  "dash.hol.chooseCountry": { es: "Elegir país…", en: "Choose a country…", id: "Pilih negara…", fr: "Choisir un pays…" },
  "dash.hol.allCountriesAdded": { es: "Ya están todos los países disponibles", en: "All available countries have been added", id: "Semua negara yang tersedia sudah ditambahkan", fr: "Tous les pays disponibles ont été ajoutés" },
  "dash.hol.addCountryBtn": { es: "Agregar país", en: "Add country", id: "Tambah negara", fr: "Ajouter un pays" },
  "dash.hol.formDate": { es: "Fecha", en: "Date", id: "Tanggal", fr: "Date" },
  "dash.hol.formName": { es: "Nombre", en: "Name", id: "Nama", fr: "Nom" },
  "dash.hol.formNamePlaceholder": { es: "Ej. Aniversario de la empresa", en: "E.g. Company anniversary", id: "Cth. Hari jadi perusahaan", fr: "Ex. Anniversaire de l'entreprise" },
  "dash.hol.formSubmit": { es: "Agregar festivo", en: "Add holiday", id: "Tambah hari libur", fr: "Ajouter un jour férié" },
  "dash.hol.thDate": { es: "Fecha", en: "Date", id: "Tanggal", fr: "Date" },
  "dash.hol.thName": { es: "Nombre", en: "Name", id: "Nama", fr: "Nom" },
  "dash.hol.thOrigin": { es: "Origen", en: "Source", id: "Sumber", fr: "Source" },
  "dash.hol.yourCompany": { es: "Tu empresa", en: "Your company", id: "Perusahaanmu", fr: "Votre entreprise" },
  "dash.hol.national": { es: "(nacional)", en: "(national)", id: "(nasional)", fr: "(national)" },
  "dash.hol.base": { es: " (sede)", en: " (base)", id: " (basis)", fr: " (siège)" },
  "dash.hol.removeTitle": { es: "Quitar", en: "Remove", id: "Hapus", fr: "Supprimer" },
  "dash.hol.confirmRemoveCountry": { es: "¿Dejar de tomar los festivos de {country}?", en: "Stop observing {country}'s holidays?", id: "Berhenti mengikuti hari libur {country}?", fr: "Cesser d'observer les jours fériés de {country} ?" },
  "dash.hol.errRemoveCountry": { es: "No se pudo quitar: {msg}", en: "Couldn't remove: {msg}", id: "Gagal menghapus: {msg}", fr: "Impossible de supprimer : {msg}" },
  "dash.hol.errAddCountry": { es: "No se pudo agregar: {msg}", en: "Couldn't add: {msg}", id: "Gagal menambahkan: {msg}", fr: "Impossible d'ajouter : {msg}" },
  "dash.hol.confirmDeleteHoliday": { es: "¿Eliminar este festivo?", en: "Delete this holiday?", id: "Hapus hari libur ini?", fr: "Supprimer ce jour férié ?" },
  "dash.hol.errDeleteHoliday": { es: "No se pudo eliminar: {msg}", en: "Couldn't delete: {msg}", id: "Gagal menghapus: {msg}", fr: "Impossible de supprimer : {msg}" },
  "dash.hol.btnDelete": { es: "Eliminar", en: "Delete", id: "Hapus", fr: "Supprimer" },

  // ---------------- Dashboard: Respaldo ----------------
  "dash.backup.title": { es: "Respaldo de datos", en: "Data backup", id: "Cadangan data", fr: "Sauvegarde des données" },
  "dash.backup.hint": {
    es: "Descarga una copia completa de los datos de tu empresa (empleados, asistencias, horarios laborales, festivos propios, suscripciones de países y vacaciones) en un archivo JSON. Guárdalo en un lugar seguro (Google Drive, disco externo) por cualquier eventualidad. Puedes hacerlo tan seguido como quieras — no afecta los datos en ZyntrAbsen.",
    en: "Download a complete copy of your company's data (employees, attendance, work schedules, custom holidays, holiday country subscriptions and vacations) as a JSON file. Keep it somewhere safe (Google Drive, external drive) just in case. You can do this as often as you like — it doesn't affect the data in ZyntrAbsen.",
    id: "Unduh salinan lengkap data perusahaanmu (karyawan, kehadiran, jadwal kerja, hari libur khusus, langganan hari libur negara, dan cuti) dalam file JSON. Simpan di tempat aman (Google Drive, hard disk eksternal) untuk berjaga-jaga. Kamu bisa melakukannya sesering mungkin — tidak memengaruhi data di ZyntrAbsen.",
    fr: "Téléchargez une copie complète des données de votre entreprise (employés, présences, horaires de travail, jours fériés personnalisés, abonnements aux jours fériés nationaux et congés) sous forme de fichier JSON. Conservez-le en lieu sûr (Google Drive, disque externe) pour toute éventualité. Vous pouvez le faire aussi souvent que vous le souhaitez — cela n'affecte pas les données dans ZyntrAbsen.",
  },
  "dash.backup.button": { es: "Descargar respaldo completo", en: "Download full backup", id: "Unduh cadangan lengkap", fr: "Télécharger la sauvegarde complète" },
  "dash.backup.generating": { es: "Generando respaldo…", en: "Generating backup…", id: "Membuat cadangan…", fr: "Génération de la sauvegarde…" },
  "dash.backup.errGenerating": { es: "Error generando el respaldo: {msg}", en: "Error generating the backup: {msg}", id: "Gagal membuat cadangan: {msg}", fr: "Erreur lors de la génération de la sauvegarde : {msg}" },
  "dash.backup.done": { es: "Listo — respaldo descargado con {emp} empleados, {att} marcas de asistencia y {sch} horarios.", en: "Done — backup downloaded with {emp} employees, {att} attendance records and {sch} schedules.", id: "Selesai — cadangan berhasil diunduh dengan {emp} karyawan, {att} catatan kehadiran dan {sch} jadwal.", fr: "Terminé — sauvegarde téléchargée avec {emp} employés, {att} pointages et {sch} horaires." },
  "dash.backup.restoreTitle": { es: "Restaurar desde respaldo", en: "Restore from backup", id: "Pulihkan dari cadangan", fr: "Restaurer depuis une sauvegarde" },
  "dash.backup.restoreHint": {
    es: "Sube un archivo JSON generado con 'Descargar respaldo completo' para recuperar empleados, asistencias, vacaciones y festivos propios. ⚠️ Si las cuentas de Auth (usuarios de Supabase) fueron eliminadas, los perfiles de empleados no pueden restaurarse automáticamente — solo los demás datos.",
    en: "Upload a JSON file generated with 'Download full backup' to recover employees, attendance records, vacations and custom holidays. ⚠️ If Auth accounts (Supabase users) were deleted, employee profiles cannot be restored automatically — only the other data.",
    id: "Unggah file JSON dari 'Unduh cadangan lengkap' untuk memulihkan karyawan, catatan kehadiran, cuti, dan hari libur khusus. ⚠️ Jika akun Auth (pengguna Supabase) dihapus, profil karyawan tidak dapat dipulihkan otomatis — hanya data lainnya.",
    fr: "Importez un fichier JSON généré avec 'Télécharger la sauvegarde complète' pour récupérer les employés, les présences, les congés et les jours fériés personnalisés. ⚠️ Si les comptes Auth (utilisateurs Supabase) ont été supprimés, les profils employés ne peuvent pas être restaurés automatiquement — seulement les autres données.",
  },
  "dash.backup.restoreChoose":     { es: "Elegir archivo de respaldo", en: "Choose backup file", id: "Pilih file cadangan", fr: "Choisir un fichier de sauvegarde" },
  "dash.backup.restoreConfirmBtn": { es: "Restaurar datos", en: "Restore data", id: "Pulihkan data", fr: "Restaurer les données" },
  "dash.backup.restoreConfirm":    { es: "¿Restaurar datos del respaldo del {date}? Los registros existentes se mantendrán; solo se añadirán o actualizarán los del archivo.", en: "Restore data from the {date} backup? Existing records will be kept; only records from the file will be added or updated.", id: "Pulihkan data dari cadangan tanggal {date}? Data yang ada akan tetap; hanya data dari file yang akan ditambah atau diperbarui.", fr: "Restaurer les données de la sauvegarde du {date} ? Les enregistrements existants seront conservés ; seuls les enregistrements du fichier seront ajoutés ou mis à jour." },
  "dash.backup.restoreLoading":    { es: "Restaurando…", en: "Restoring…", id: "Memulihkan…", fr: "Restauration…" },
  "dash.backup.restoreErrInvalid": { es: "Archivo inválido — no parece un respaldo de ZyntrAbsen.", en: "Invalid file — doesn't look like a ZyntrAbsen backup.", id: "File tidak valid — bukan cadangan ZyntrAbsen.", fr: "Fichier invalide — ne ressemble pas à une sauvegarde ZyntrAbsen." },
  "dash.backup.restoreErrWrongCompany": { es: "Este respaldo pertenece a otra empresa y no se puede restaurar aquí.", en: "This backup belongs to a different company and cannot be restored here.", id: "Cadangan ini milik perusahaan lain dan tidak dapat dipulihkan di sini.", fr: "Cette sauvegarde appartient à une autre entreprise et ne peut pas être restaurée ici." },
  "dash.backup.restoreErrParse":   { es: "Error al leer el archivo: {msg}", en: "Error reading the file: {msg}", id: "Gagal membaca file: {msg}", fr: "Erreur de lecture du fichier : {msg}" },
  "dash.backup.restoreDone":       { es: "✓ Restauración completa — {emp} empleados, {att} registros de asistencia y {sch} horarios procesados.", en: "✓ Restore complete — {emp} employees, {att} attendance records and {sch} schedules processed.", id: "✓ Pemulihan selesai — {emp} karyawan, {att} catatan kehadiran dan {sch} jadwal diproses.", fr: "✓ Restauration complète — {emp} employés, {att} enregistrements de présence et {sch} horaires traités." },
  "dash.backup.restorePartial":    { es: "Restauración parcial — {failed} tabla(s) con errores. Revisa la consola del navegador para más detalles.", en: "Partial restore — {failed} table(s) had errors. Check the browser console for details.", id: "Pemulihan sebagian — {failed} tabel mengalami kesalahan. Periksa konsol browser untuk detailnya.", fr: "Restauration partielle — {failed} table(s) avec erreurs. Vérifiez la console du navigateur pour plus de détails." },

  // ---------------- Dashboard: Empresa (logo) ----------------
  "dash.company.title": { es: "Configuración de la empresa", en: "Company settings", id: "Pengaturan perusahaan", fr: "Paramètres de l'entreprise" },
  "dash.company.logoLabel": { es: "Logo de la empresa", en: "Company logo", id: "Logo perusahaan", fr: "Logo de l'entreprise" },
  "dash.company.logoHint": {
    es: "Se muestra en la app móvil de tus empleados. Recomendado: imagen cuadrada, fondo blanco o transparente, menos de 2 MB.",
    en: "Shown in your employees' mobile app. Recommended: square image, white or transparent background, under 2 MB.",
    id: "Ditampilkan di aplikasi seluler karyawanmu. Disarankan: gambar persegi, latar putih atau transparan, kurang dari 2 MB.",
    fr: "Affiché dans l'application mobile de vos employés. Recommandé : image carrée, fond blanc ou transparent, moins de 2 Mo.",
  },
  "dash.company.noLogo": { es: "Todavía no has subido un logo.", en: "You haven't uploaded a logo yet.", id: "Kamu belum mengunggah logo.", fr: "Vous n'avez pas encore téléchargé de logo." },
  "dash.company.uploadButton": { es: "Subir logo", en: "Upload logo", id: "Unggah logo", fr: "Télécharger un logo" },
  "dash.company.uploading": { es: "Subiendo…", en: "Uploading…", id: "Mengunggah…", fr: "Téléchargement…" },
  "dash.company.uploadSuccess": { es: "Logo actualizado.", en: "Logo updated.", id: "Logo diperbarui.", fr: "Logo mis à jour." },
  "dash.company.errUpload": { es: "No se pudo subir: {msg}", en: "Couldn't upload: {msg}", id: "Gagal mengunggah: {msg}", fr: "Impossible de télécharger : {msg}" },
  "dash.company.errTooLarge": { es: "La imagen debe pesar menos de 2 MB.", en: "The image must be under 2 MB.", id: "Ukuran gambar harus di bawah 2 MB.", fr: "L'image doit peser moins de 2 Mo." },
  "dash.company.errType": { es: "Solo se permiten imágenes (PNG, JPG, WEBP).", en: "Only images are allowed (PNG, JPG, WEBP).", id: "Hanya gambar yang diizinkan (PNG, JPG, WEBP).", fr: "Seules les images sont autorisées (PNG, JPG, WEBP)." },
  "dash.company.hoursTitle": { es: "Horario laboral", en: "Work hours", id: "Jam kerja", fr: "Horaires de travail" },
  "dash.company.hoursHint": {
    es: "Cualquier marcaje fuera de este horario (o cualquier hora, en un día festivo) cuenta automáticamente como overtime.",
    en: "Any record outside these hours (or any time on a holiday) automatically counts as overtime.",
    id: "Catatan di luar jam ini (atau kapan saja di hari libur) otomatis dihitung sebagai lembur.",
    fr: "Tout pointage en dehors de ces horaires (ou à toute heure un jour férié) compte automatiquement comme heures supplémentaires.",
  },
  "dash.company.workStart": { es: "Entrada", en: "Start", id: "Masuk", fr: "Entrée" },
  "dash.company.workEnd": { es: "Salida", en: "End", id: "Keluar", fr: "Sortie" },
  "dash.company.hoursSave": { es: "Guardar horario", en: "Save hours", id: "Simpan jam kerja", fr: "Enregistrer les horaires" },
  "dash.company.hoursSaved": { es: "Horario actualizado.", en: "Hours updated.", id: "Jam kerja diperbarui.", fr: "Horaires mis à jour." },
  "dash.company.hoursErrMissing": { es: "Completa la hora de entrada y salida.", en: "Fill in both start and end times.", id: "Isi jam masuk dan keluar.", fr: "Remplissez l'heure d'entrée et de sortie." },
  "dash.company.hoursErrSave": { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}", fr: "Impossible d'enregistrer : {msg}" },

  // ---------------- Dashboard: Recordatorios de marcaje ----------------
  "dash.company.scheduleTitle": { es: "Recordatorios de marcaje (app móvil)", en: "Attendance reminders (mobile app)", id: "Pengingat absen (aplikasi seluler)", fr: "Rappels de pointage (application mobile)" },
  "dash.company.scheduleHint": {
    es: "Define a qué hora enviar notificaciones de entrada y salida a los empleados en la app. Solo aplica a los días marcados como laborales.",
    en: "Set when to send check-in and check-out notifications to employees in the app. Only applies to days marked as working days.",
    id: "Tentukan kapan mengirim notifikasi absen masuk dan keluar ke karyawan di aplikasi. Hanya berlaku untuk hari yang ditandai sebagai hari kerja.",
    fr: "Définissez à quelle heure envoyer des notifications d'entrée et de sortie aux employés dans l'application. S'applique uniquement aux jours marqués comme jours ouvrables.",
  },
  "dash.company.schDay":    { es: "Día",          en: "Day",          id: "Hari",  fr: "Jour" },
  "dash.company.schActive": { es: "Día laboral",  en: "Working day",  id: "Hari kerja", fr: "Jour ouvrable" },
  "dash.company.schIn":     { es: "Entrada",      en: "Check-in",     id: "Masuk", fr: "Entrée" },
  "dash.company.schOut":    { es: "Salida",       en: "Check-out",    id: "Keluar", fr: "Sortie" },
  "dash.company.schSave":   { es: "Guardar recordatorios", en: "Save reminders", id: "Simpan pengingat", fr: "Enregistrer les rappels" },
  "dash.company.schSaved":  { es: "Recordatorios guardados.", en: "Reminders saved.", id: "Pengingat disimpan.", fr: "Rappels enregistrés." },
  "dash.company.schErrTime": { es: "Completa la hora de entrada y salida para {day}.", en: "Fill in check-in and check-out time for {day}.", id: "Isi jam masuk dan keluar untuk {day}.", fr: "Remplissez l'heure d'entrée et de sortie pour {day}." },
  "dash.company.schMon": { es: "Lunes",     en: "Monday",    id: "Senin",  fr: "Lundi" },
  "dash.company.schTue": { es: "Martes",    en: "Tuesday",   id: "Selasa", fr: "Mardi" },
  "dash.company.schWed": { es: "Miércoles", en: "Wednesday", id: "Rabu",   fr: "Mercredi" },
  "dash.company.schThu": { es: "Jueves",    en: "Thursday",  id: "Kamis",  fr: "Jeudi" },
  "dash.company.schFri": { es: "Viernes",   en: "Friday",    id: "Jumat",  fr: "Vendredi" },
  "dash.company.schSat": { es: "Sábado",    en: "Saturday",  id: "Sabtu",  fr: "Samedi" },
  "dash.company.schSun": { es: "Domingo",   en: "Sunday",    id: "Minggu", fr: "Dimanche" },

  // ---------------- Dashboard: Reglas de asistencia ----------------
  "dash.company.rulesTitle": { es: "Reglas de asistencia", en: "Attendance rules", id: "Aturan kehadiran", fr: "Règles de présence" },
  "dash.company.rulesHint": {
    es: "Configura la tolerancia de llegada tardía y el tiempo mínimo para que las horas extras se contabilicen.",
    en: "Set the late arrival grace period and the minimum time for overtime to be counted.",
    id: "Atur toleransi keterlambatan dan waktu minimum agar lembur dihitung.",
    fr: "Configurez la tolérance d'arrivée tardive et le temps minimum pour que les heures supplémentaires soient comptabilisées.",
  },
  "dash.company.graceLabel":      { es: "Tolerancia de llegada tardía (minutos)", en: "Late arrival grace period (minutes)", id: "Toleransi keterlambatan (menit)", fr: "Tolérance d'arrivée tardive (minutes)" },
  "dash.company.graceHint":       { es: "Si el empleado llega dentro de este margen, sus horas cuentan desde la hora programada.", en: "If the employee arrives within this margin, hours count from the scheduled time.", id: "Jika karyawan datang dalam margin ini, jam dihitung dari waktu terjadwal.", fr: "Si l'employé arrive dans ce délai, les heures sont comptées depuis l'heure prévue." },
  "dash.company.overtimeMinLabel": { es: "Mínimo de horas extras por sesión (minutos)", en: "Minimum overtime per session (minutes)", id: "Minimum lembur per sesi (menit)", fr: "Minimum d'heures supplémentaires par session (minutes)" },
  "dash.company.overtimeMinHint":  { es: "Las horas extras menores a este valor en una sola sesión no se contabilizan.", en: "Overtime shorter than this value in a single session is not counted.", id: "Lembur yang kurang dari nilai ini dalam satu sesi tidak dihitung.", fr: "Les heures supplémentaires inférieures à cette valeur en une seule session ne sont pas comptabilisées." },
  "dash.company.rulesSave":   { es: "Guardar reglas", en: "Save rules", id: "Simpan aturan", fr: "Enregistrer les règles" },
  "dash.company.rulesSaved":  { es: "Reglas guardadas.", en: "Rules saved.", id: "Aturan disimpan.", fr: "Règles enregistrées." },
  "dash.company.rulesErrSave": { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}", fr: "Impossible d'enregistrer : {msg}" },

  // ---------------- Dashboard: Tarifas horas extras ----------------
  "dash.company.otRatesTitle":    { es: "Tarifas de horas extras", en: "Overtime rates", id: "Tarif lembur", fr: "Taux d'heures supplémentaires" },
  "dash.company.otRatesHint":     { es: "Porcentaje del sueldo básico que se paga por hora extra. El máximo define el tope mensual permitido.", en: "Percentage of the base salary paid per overtime hour. The maximum defines the monthly cap allowed.", id: "Persentase gaji pokok yang dibayarkan per jam lembur. Maksimum menentukan batas bulanan yang diizinkan.", fr: "Pourcentage du salaire de base payé par heure supplémentaire. Le maximum définit le plafond mensuel autorisé." },
  "dash.company.otRateWeekday":   { es: "Tarifa día hábil (% del sueldo/hora)", en: "Weekday rate (% of salary/hour)", id: "Tarif hari kerja (% gaji/jam)", fr: "Taux jour ouvrable (% du salaire/heure)" },
  "dash.company.otRateHoliday":   { es: "Tarifa día libre / festivo (% del sueldo/hora)", en: "Holiday / day-off rate (% of salary/hour)", id: "Tarif hari libur / festif (% gaji/jam)", fr: "Taux jour férié / repos (% du salaire/heure)" },
  "dash.company.otMaxPct":        { es: "Máximo mensual permitido (% del sueldo básico)", en: "Monthly maximum allowed (% of base salary)", id: "Maksimum bulanan (% gaji pokok)", fr: "Maximum mensuel autorisé (% du salaire de base)" },
  "dash.company.otRatesSave":     { es: "Guardar tarifas", en: "Save rates", id: "Simpan tarif", fr: "Enregistrer les taux" },
  "dash.company.otRatesSaved":    { es: "Tarifas guardadas.", en: "Rates saved.", id: "Tarif disimpan.", fr: "Taux enregistrés." },
  "dash.company.otRatesErrSave":  { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}", fr: "Impossible d'enregistrer : {msg}" },

  // ---------------- Dashboard: Encabezado formulario OT ----------------
  "dash.company.reportHeaderTitle":       { es: "Encabezado del formulario de horas extras", en: "Overtime form header", id: "Header formulir lembur", fr: "En-tête du formulaire d'heures supplémentaires" },
  "dash.company.reportHeaderHint":        { es: "Este texto aparecerá en la esquina superior derecha del formulario impreso de horas extras.", en: "This text will appear in the top-right corner of the printed overtime form.", id: "Teks ini akan muncul di pojok kanan atas formulir lembur yang dicetak.", fr: "Ce texte apparaîtra dans le coin supérieur droit du formulaire d'heures supplémentaires imprimé." },
  "dash.company.reportHeaderLabel":       { es: "Texto de referencia", en: "Reference text", id: "Teks referensi", fr: "Texte de référence" },
  "dash.company.reportHeaderPlaceholder": { es: "Ej. Lampiran B dari SE Sekjen\nSE 100/KU/II/2000/02", en: "e.g. Lampiran B dari SE Sekjen\nSE 100/KU/II/2000/02", id: "Mis. Lampiran B dari SE Sekjen\nSE 100/KU/II/2000/02", fr: "Ex. Lampiran B dari SE Sekjen\nSE 100/KU/II/2000/02" },
  "dash.company.reportHeaderSave":        { es: "Guardar encabezado", en: "Save header", id: "Simpan header", fr: "Enregistrer l'en-tête" },
  "dash.company.reportHeaderSaved":       { es: "Encabezado guardado.", en: "Header saved.", id: "Header disimpan.", fr: "En-tête enregistré." },
  "dash.company.reportHeaderErrSave":     { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}", fr: "Impossible d'enregistrer : {msg}" },

  // ---------------- Dashboard: Sueldo y departamento ----------------
  "dash.emp.salaryTitle":          { es: "Sueldo y departamento", en: "Salary & department", id: "Gaji & departemen", fr: "Salaire et département" },
  "dash.emp.salaryHint":           { es: "El sueldo básico se usa para calcular la remuneración de horas extras en el portal del empleado.", en: "The base salary is used to calculate overtime pay in the employee portal.", id: "Gaji pokok digunakan untuk menghitung upah lembur di portal karyawan.", fr: "Le salaire de base est utilisé pour calculer la rémunération des heures supplémentaires dans le portail employé." },
  "dash.emp.salaryThDept":         { es: "Departamento", en: "Department", id: "Departemen", fr: "Département" },
  "dash.emp.salaryThSalary":       { es: "Sueldo básico", en: "Base salary", id: "Gaji pokok", fr: "Salaire de base" },
  "dash.emp.salaryDeptPlaceholder":{ es: "Ej. Operaciones", en: "e.g. Operations", id: "Mis. Operasional", fr: "Ex. Opérations" },
  "dash.emp.portalLink":           { es: "Portal de horas extras ↗", en: "Overtime portal ↗", id: "Portal lembur ↗", fr: "Portail heures supplémentaires ↗" },

  // ---------------- Dashboard: Horas extras admin ----------------
  "dash.navOvertime":             { es: "Horas extras",          en: "Overtime",            id: "Lembur",              fr: "Heures supplémentaires" },
  "dash.ot.title":                { es: "Horas extras",          en: "Overtime",            id: "Lembur",              fr: "Heures supplémentaires" },
  "dash.ot.hint":                 { es: "Formularios de horas extras enviados por los empleados. Añade los nombres de quien autoriza y aprueba antes de imprimir.", en: "Overtime forms submitted by employees. Add the names of the authorizer and approver before printing.", id: "Formulir lembur yang dikirimkan karyawan. Tambahkan nama pemberi izin dan penyetuju sebelum mencetak.", fr: "Formulaires d'heures supplémentaires soumis par les employés. Ajoutez les noms de l'autorisateur et de l'approbateur avant d'imprimer." },
  "dash.ot.filterAll":            { es: "Todos",                 en: "All",                 id: "Semua",               fr: "Tous" },
  "dash.ot.filterSubmitted":      { es: "Enviados",              en: "Submitted",           id: "Terkirim",            fr: "Soumis" },
  "dash.ot.filterApproved":       { es: "Aprobados",             en: "Approved",            id: "Disetujui",           fr: "Approuvés" },
  "dash.ot.filterRejected":       { es: "Rechazados",            en: "Rejected",            id: "Ditolak",             fr: "Rejetés" },
  "dash.ot.filterDraft":          { es: "Borradores",            en: "Drafts",              id: "Draf",                fr: "Brouillons" },
  "dash.ot.filterAllMonths":      { es: "Todos los meses",       en: "All months",          id: "Semua bulan",         fr: "Tous les mois" },
  "dash.ot.none":                 { es: "No hay formularios con estos filtros.",  en: "No forms match these filters.", id: "Tidak ada formulir yang cocok.", fr: "Aucun formulaire ne correspond à ces filtres." },
  "dash.ot.statusSubmitted":      { es: "Enviado",               en: "Submitted",           id: "Terkirim",            fr: "Soumis" },
  "dash.ot.statusApproved":       { es: "Aprobado",              en: "Approved",            id: "Disetujui",           fr: "Approuvé" },
  "dash.ot.statusRejected":       { es: "Rechazado",             en: "Rejected",            id: "Ditolak",             fr: "Rejeté" },
  "dash.ot.statusDraft":          { es: "Borrador",              en: "Draft",               id: "Draf",                fr: "Brouillon" },
  "dash.ot.authorizerName":             { es: "Quien Autoriza",         en: "Authorizer",              id: "Yang Memberi Perintah",  fr: "Qui autorise" },
  "dash.ot.authorizerPlaceholder":      { es: "Nombre completo",        en: "Full name",               id: "Nama lengkap",           fr: "Nom complet" },
  "dash.ot.position":                   { es: "Cargo / Posición",       en: "Position / Title",        id: "Jabatan",                fr: "Poste / Titre" },
  "dash.ot.positionPlaceholder":        { es: "Ej: Jefe de Área",       en: "e.g. Department Head",    id: "cth: Kepala Bagian",     fr: "Ex : Chef de service" },
  "dash.ot.reviewerName":               { es: "Visto Bueno / Aprobado", en: "Reviewer / Approved",     id: "Mengetahui/Menyetujui",  fr: "Visa / Approuvé par" },
  "dash.ot.reviewerPlaceholder":        { es: "Nombre completo",        en: "Full name",               id: "Nama lengkap",           fr: "Nom complet" },
  "dash.ot.reviewerSubtitle":           { es: "Subtítulo",              en: "Subtitle",                id: "Keterangan Jabatan",     fr: "Sous-titre" },
  "dash.ot.reviewerSubtitlePlaceholder":{ es: "Ej: Kepala Cabang",      en: "e.g. Branch Manager",     id: "cth: Kepala Cabang",     fr: "Ex : Directeur de succursale" },
  "dash.ot.employee":                   { es: "Empleado",               en: "Employee",                id: "Yang Melaksanakan",      fr: "Employé" },
  "dash.ot.btnApprove":                 { es: "Aprobar",                en: "Approve",                 id: "Setujui",                fr: "Approuver" },
  "dash.ot.btnReject":                  { es: "Rechazar",               en: "Reject",                  id: "Tolak",                  fr: "Rejeter" },
  "dash.ot.rejectPrompt":               { es: "Motivo del rechazo (opcional):", en: "Reason for rejection (optional):", id: "Alasan penolakan (opsional):", fr: "Motif du rejet (facultatif) :" },

  // ---------------- Dashboard: Cambiar contraseña ----------------
  "dash.company.pwTitle":   { es: "Cambiar contraseña", en: "Change password", id: "Ganti kata sandi", fr: "Changer le mot de passe" },
  "dash.company.pwHint":    { es: "Tu contraseña se almacena de forma segura en Supabase, nunca en este sitio.", en: "Your password is stored securely in Supabase, never on this site.", id: "Kata sandimu disimpan dengan aman di Supabase, tidak pernah di situs ini.", fr: "Votre mot de passe est stocké de manière sécurisée dans Supabase, jamais sur ce site." },
  "dash.company.pwCurrent": { es: "Contraseña actual", en: "Current password", id: "Kata sandi saat ini", fr: "Mot de passe actuel" },
  "dash.company.pwNew":     { es: "Nueva contraseña",  en: "New password",     id: "Kata sandi baru",    fr: "Nouveau mot de passe" },
  "dash.company.pwConfirm": { es: "Confirmar nueva contraseña", en: "Confirm new password", id: "Konfirmasi kata sandi baru", fr: "Confirmer le nouveau mot de passe" },
  "dash.company.pwSave":    { es: "Cambiar contraseña", en: "Change password",  id: "Ganti kata sandi",  fr: "Changer le mot de passe" },
  "dash.company.pwErrEmpty":   { es: "Completa todos los campos.", en: "Fill in all fields.", id: "Isi semua kolom.", fr: "Remplissez tous les champs." },
  "dash.company.pwErrShort":   { es: "La nueva contraseña debe tener al menos 6 caracteres.", en: "New password must be at least 6 characters.", id: "Kata sandi baru minimal 6 karakter.", fr: "Le nouveau mot de passe doit contenir au moins 6 caractères." },
  "dash.company.pwErrMatch":   { es: "Las contraseñas nuevas no coinciden.", en: "New passwords don't match.", id: "Kata sandi baru tidak cocok.", fr: "Les nouveaux mots de passe ne correspondent pas." },
  "dash.company.pwErrWrong":   { es: "La contraseña actual es incorrecta.", en: "Current password is incorrect.", id: "Kata sandi saat ini salah.", fr: "Le mot de passe actuel est incorrect." },
  "dash.company.pwErrSave":    { es: "No se pudo cambiar: {msg}", en: "Couldn't change: {msg}", id: "Gagal mengubah: {msg}", fr: "Impossible de modifier : {msg}" },
  "dash.company.pwSuccess":    { es: "Contraseña actualizada correctamente.", en: "Password updated successfully.", id: "Kata sandi berhasil diperbarui.", fr: "Mot de passe mis à jour avec succès." },

  // ---------------- Dashboard: Cambiar correo ----------------
  "dash.company.emailTitle":   { es: "Cambiar correo de acceso", en: "Change login email", id: "Ganti email login", fr: "Changer l'e-mail de connexion" },
  "dash.company.emailHint":    { es: "Supabase enviará un enlace de confirmación al nuevo correo. El cambio solo aplica al hacer clic en ese enlace.", en: "Supabase will send a confirmation link to the new email. The change only applies after clicking that link.", id: "Supabase akan mengirim tautan konfirmasi ke email baru. Perubahan berlaku setelah kamu mengklik tautan tersebut.", fr: "Supabase enverra un lien de confirmation au nouvel e-mail. La modification ne s'applique qu'après avoir cliqué sur ce lien." },
  "dash.company.emailCurrent": { es: "Correo actual", en: "Current email", id: "Email saat ini", fr: "E-mail actuel" },
  "dash.company.emailNew":     { es: "Nuevo correo",  en: "New email",     id: "Email baru",     fr: "Nouvel e-mail" },
  "dash.company.emailPw":      { es: "Contraseña actual (para verificar)", en: "Current password (to verify)", id: "Kata sandi saat ini (untuk verifikasi)", fr: "Mot de passe actuel (pour vérification)" },
  "dash.company.emailSave":    { es: "Cambiar correo", en: "Change email",  id: "Ganti email",   fr: "Changer l'e-mail" },
  "dash.company.emailErrEmpty":  { es: "Completa el nuevo correo y tu contraseña.", en: "Fill in the new email and your password.", id: "Isi email baru dan kata sandimu.", fr: "Remplissez le nouvel e-mail et votre mot de passe." },
  "dash.company.emailErrSame":   { es: "El nuevo correo es igual al actual.", en: "The new email is the same as the current one.", id: "Email baru sama dengan yang sekarang.", fr: "Le nouvel e-mail est identique à l'actuel." },
  "dash.company.emailErrPw":     { es: "Contraseña incorrecta.", en: "Incorrect password.", id: "Kata sandi salah.", fr: "Mot de passe incorrect." },
  "dash.company.emailErrSave":   { es: "No se pudo cambiar: {msg}", en: "Couldn't change: {msg}", id: "Gagal mengubah: {msg}", fr: "Impossible de modifier : {msg}" },
  "dash.company.emailSuccess":   { es: "Revisa tu nuevo correo y haz clic en el enlace de confirmación para completar el cambio.", en: "Check your new email and click the confirmation link to complete the change.", id: "Cek email barumu dan klik tautan konfirmasi untuk menyelesaikan perubahan.", fr: "Vérifiez votre nouvel e-mail et cliquez sur le lien de confirmation pour finaliser la modification." },

  // ---------------- Zona de peligro ----------------
  "dash.danger.title":       { es: "Zona de peligro", en: "Danger zone", id: "Zona berbahaya", fr: "Zone dangereuse" },
  "dash.danger.hint":        { es: "Esta acción eliminará permanentemente la empresa y todos sus datos (empleados, asistencias, vacaciones, festivos). No se puede deshacer. Descarga un respaldo antes si lo necesitas.", en: "This action will permanently delete the company and all its data (employees, attendance, vacations, holidays). It cannot be undone. Download a backup first if needed.", id: "Tindakan ini akan menghapus permanen perusahaan dan semua datanya (karyawan, absensi, cuti, hari libur). Tidak dapat dibatalkan. Unduh cadangan terlebih dahulu jika diperlukan.", fr: "Cette action supprimera définitivement l'entreprise et toutes ses données (employés, présences, congés, jours fériés). Cette action est irréversible. Téléchargez une sauvegarde avant si nécessaire." },
  "dash.danger.pwLabel":     { es: "Contraseña actual (para verificar)", en: "Current password (to verify)", id: "Kata sandi saat ini (untuk verifikasi)", fr: "Mot de passe actuel (pour vérification)" },
  "dash.danger.codeLabel":   { es: "Escribe el código de tu empresa para confirmar", en: "Type your company code to confirm", id: "Ketik kode perusahaanmu untuk konfirmasi", fr: "Tapez le code de votre entreprise pour confirmer" },
  "dash.danger.deleteBtn":   { es: "Eliminar empresa y todos sus datos", en: "Delete company and all its data", id: "Hapus perusahaan dan semua datanya", fr: "Supprimer l'entreprise et toutes ses données" },
  "dash.danger.errEmpty":    { es: "Completa la contraseña y el código de empresa.", en: "Fill in the password and company code.", id: "Isi kata sandi dan kode perusahaan.", fr: "Remplissez le mot de passe et le code d'entreprise." },
  "dash.danger.errWrongCode":{ es: "El código no coincide. Debes escribir exactamente: {code}", en: "The code doesn't match. You must type exactly: {code}", id: "Kode tidak cocok. Kamu harus mengetikkan persis: {code}", fr: "Le code ne correspond pas. Vous devez taper exactement : {code}" },
  "dash.danger.errWrongPw":  { es: "Contraseña incorrecta.", en: "Incorrect password.", id: "Kata sandi salah.", fr: "Mot de passe incorrect." },
  "dash.danger.finalConfirm":{ es: "¿Estás absolutamente seguro? Esta acción es IRREVERSIBLE y borrará todos los datos de la empresa.", en: "Are you absolutely sure? This action is IRREVERSIBLE and will delete all company data.", id: "Apakah kamu benar-benar yakin? Tindakan ini TIDAK DAPAT DIBATALKAN dan akan menghapus semua data perusahaan.", fr: "Êtes-vous absolument certain ? Cette action est IRRÉVERSIBLE et supprimera toutes les données de l'entreprise." },
  "dash.danger.deleting":    { es: "Eliminando datos… no cierres esta ventana.", en: "Deleting data… do not close this window.", id: "Menghapus data… jangan tutup jendela ini.", fr: "Suppression des données… ne fermez pas cette fenêtre." },
  "dash.danger.errDelete":   { es: "Error al eliminar: {msg}", en: "Error deleting: {msg}", id: "Kesalahan saat menghapus: {msg}", fr: "Erreur lors de la suppression : {msg}" },

  // ---------------- Super-admin ----------------
  "sa.pageTitle": { es: "ZyntrAbsen · Super Admin", en: "ZyntrAbsen · Super Admin", id: "ZyntrAbsen · Super Admin", fr: "ZyntrAbsen · Super Admin" },
  "sa.subtitle": { es: "Panel del dueño del servicio", en: "Service owner panel", id: "Panel pemilik layanan", fr: "Panneau du propriétaire du service" },
  "sa.title": { es: "Empresas registradas", en: "Registered companies", id: "Perusahaan terdaftar", fr: "Entreprises enregistrées" },
  "sa.hint": {
    es: "Aquí apruebas o suspendes el acceso de cada empresa que contrata ZyntrAbsen. Mientras una empresa está pendiente, su administrador puede entrar a configurar todo, pero los empleados no pueden marcar entrada/salida hasta que la apruebes. No tienes acceso a las asistencias, ubicaciones ni festivos de ninguna empresa — solo a este panel de cuentas.",
    en: "Here you approve or suspend access for each company that hires ZyntrAbsen. While a company is pending, its admin can log in to set everything up, but employees can't clock in/out until you approve it. You don't have access to any company's attendance, locations, or holidays — only to this account panel.",
    id: "Di sini kamu menyetujui atau menangguhkan akses tiap perusahaan yang menggunakan ZyntrAbsen. Selama perusahaan berstatus menunggu, adminnya bisa masuk untuk mengatur semuanya, tapi karyawan tidak bisa absen masuk/keluar sampai kamu menyetujuinya. Kamu tidak punya akses ke data kehadiran, lokasi, atau hari libur perusahaan mana pun — hanya ke panel akun ini.",
    fr: "Ici vous approuvez ou suspendez l'accès de chaque entreprise qui utilise ZyntrAbsen. Pendant qu'une entreprise est en attente, son administrateur peut se connecter pour tout configurer, mais les employés ne peuvent pas pointer jusqu'à votre approbation. Vous n'avez pas accès aux présences, emplacements ou jours fériés d'une entreprise — seulement à ce panneau de comptes.",
  },
  "sa.summaryTotal": { es: "Empresas totales", en: "Total companies", id: "Total perusahaan", fr: "Total d'entreprises" },
  "sa.summaryPending": { es: "Pendientes de aprobar", en: "Pending approval", id: "Menunggu persetujuan", fr: "En attente d'approbation" },
  "sa.summaryActive": { es: "Activas", en: "Active", id: "Aktif", fr: "Actives" },
  "sa.summarySuspended": { es: "Suspendidas", en: "Suspended", id: "Ditangguhkan", fr: "Suspendues" },
  "sa.noneYet": { es: "Todavía no hay empresas registradas.", en: "No companies registered yet.", id: "Belum ada perusahaan yang terdaftar.", fr: "Aucune entreprise enregistrée pour l'instant." },
  "sa.errLoading": { es: "Error cargando empresas: {msg}", en: "Error loading companies: {msg}", id: "Gagal memuat data perusahaan: {msg}", fr: "Erreur de chargement des entreprises : {msg}" },
  "sa.thCompany": { es: "Empresa", en: "Company", id: "Perusahaan", fr: "Entreprise" },
  "sa.thCountry": { es: "País base", en: "Base country", id: "Negara basis", fr: "Pays de base" },
  "sa.thCode": { es: "Código", en: "Code", id: "Kode", fr: "Code" },
  "sa.thStatus": { es: "Estado", en: "Status", id: "Status", fr: "Statut" },
  "sa.thCreated": { es: "Creada", en: "Created", id: "Dibuat", fr: "Créée" },
  "sa.statusPending": { es: "Pendiente", en: "Pending", id: "Menunggu", fr: "En attente" },
  "sa.statusActive": { es: "Activa", en: "Active", id: "Aktif", fr: "Active" },
  "sa.statusSuspended": { es: "Suspendida", en: "Suspended", id: "Ditangguhkan", fr: "Suspendue" },
  "sa.btnApprove": { es: "Aprobar", en: "Approve", id: "Setujui", fr: "Approuver" },
  "sa.btnSuspend": { es: "Suspender", en: "Suspend", id: "Tangguhkan", fr: "Suspendre" },
  "sa.btnReactivate": { es: "Reactivar", en: "Reactivate", id: "Aktifkan lagi", fr: "Réactiver" },
  "sa.confirmAction": { es: "¿Confirmas {action} esta empresa?", en: "Confirm {action} this company?", id: "Konfirmasi {action} perusahaan ini?", fr: "Confirmez {action} cette entreprise ?" },
  "sa.actionApprove": { es: "aprobar", en: "approving", id: "menyetujui", fr: "l'approbation de" },
  "sa.actionSuspend": { es: "suspender", en: "suspending", id: "menangguhkan", fr: "la suspension de" },
  "sa.actionUpdate": { es: "actualizar", en: "updating", id: "memperbarui", fr: "la mise à jour de" },
  "sa.errUpdate": { es: "No se pudo actualizar: {msg}", en: "Couldn't update: {msg}", id: "Gagal memperbarui: {msg}", fr: "Impossible de mettre à jour : {msg}" },
  "sa.btnDelete":          { es: "Eliminar", en: "Delete", id: "Hapus", fr: "Supprimer" },
  "sa.deletePrompt":       { es: "Vas a eliminar permanentemente la empresa «{name}» y todos sus datos. Escribe el código de la empresa ({code}) para confirmar:", en: "You are about to permanently delete company «{name}» and all its data. Type the company code ({code}) to confirm:", id: "Kamu akan menghapus permanen perusahaan «{name}» dan semua datanya. Ketik kode perusahaan ({code}) untuk konfirmasi:", fr: "Vous allez supprimer définitivement l'entreprise «{name}» et toutes ses données. Tapez le code de l'entreprise ({code}) pour confirmer :" },
  "sa.deleteWrongCode":    { es: "El código no coincide. Operación cancelada.", en: "Code doesn't match. Operation cancelled.", id: "Kode tidak cocok. Operasi dibatalkan.", fr: "Le code ne correspond pas. Opération annulée." },
  "sa.deleteFinalConfirm": { es: "¿Estás absolutamente seguro? Esta es IRREVERSIBLE y eliminará todos los datos de «{name}».", en: "Are you absolutely sure? This is IRREVERSIBLE and will delete all data for «{name}».", id: "Apakah kamu benar-benar yakin? Ini TIDAK DAPAT DIBATALKAN dan akan menghapus semua data «{name}».", fr: "Êtes-vous absolument certain ? C'est IRRÉVERSIBLE et supprimera toutes les données de «{name}»." },
  "sa.deleteErr":          { es: "Error al eliminar: {msg}", en: "Error deleting: {msg}", id: "Kesalahan saat menghapus: {msg}", fr: "Erreur lors de la suppression : {msg}" },

  // ---------------- Portal de horas extras (empleado) ----------------
  "portal.title":              { es: "Portal de Horas Extras",    en: "Overtime Portal",          id: "Portal Lembur",                fr: "Portail Heures Supplémentaires" },
  "portal.subtitle":           { es: "Ingresa con tu correo y contraseña para ver y reportar tus horas extras del mes.", en: "Log in with your email and password to view and report your overtime for the month.", id: "Masuk dengan email dan kata sandi untuk melihat dan melaporkan lembur bulan ini.", fr: "Connectez-vous avec votre e-mail et mot de passe pour voir et déclarer vos heures supplémentaires du mois." },
  "portal.email":              { es: "Correo",                    en: "Email",                    id: "Email",                        fr: "E-mail" },
  "portal.password":           { es: "Contraseña",                en: "Password",                 id: "Kata sandi",                   fr: "Mot de passe" },
  "portal.loginBtn":           { es: "Ingresar",                  en: "Log in",                   id: "Masuk",                        fr: "Se connecter" },
  "portal.logout":             { es: "Salir",                     en: "Log out",                  id: "Keluar",                       fr: "Déconnexion" },
  "portal.infoName":           { es: "Nombre",                    en: "Name",                     id: "Nama",                         fr: "Nom" },
  "portal.infoDept":           { es: "Departamento",              en: "Department",               id: "Departemen",                   fr: "Département" },
  "portal.infoSalary":         { es: "Sueldo Básico",             en: "Base Salary",              id: "Gaji Pokok",                   fr: "Salaire de base" },
  "portal.infoMaxOT":          { es: "Máximo Permitido",          en: "Maximum Allowed",          id: "Maksimum Diizinkan",           fr: "Maximum autorisé" },
  "portal.sessionsTitle":      { es: "Sesiones de Horas Extras",  en: "Overtime Sessions",        id: "Sesi Lembur",                  fr: "Sessions d'heures supplémentaires" },
  "portal.addRow":             { es: "+ Agregar fila",            en: "+ Add row",                id: "+ Tambah baris",               fr: "+ Ajouter une ligne" },
  "portal.thDate":             { es: "Fecha",                     en: "Date",                     id: "Tanggal",                      fr: "Date" },
  "portal.thSchedule":         { es: "Horario",                   en: "Schedule",                 id: "Jadwal",                       fr: "Horaire" },
  "portal.thHours":            { es: "Horas",                     en: "Hours",                    id: "Jam",                          fr: "Heures" },
  "portal.thType":             { es: "Tipo",                      en: "Type",                     id: "Tipe",                         fr: "Type" },
  "portal.thDesc":             { es: "Descripción / Keterangan",  en: "Description / Keterangan", id: "Keterangan / Descripción",     fr: "Description / Keterangan" },
  "portal.typeWeekday":        { es: "Día hábil",                 en: "Weekday",                  id: "Hari kerja",                   fr: "Jour ouvrable" },
  "portal.typeHoliday":        { es: "Día libre",                 en: "Day off / Holiday",        id: "Hari libur",                   fr: "Jour de repos / Férié" },
  "portal.descPlaceholder":    { es: "Descripción del trabajo realizado…", en: "Description of work done…", id: "Keterangan pekerjaan yang dilakukan…", fr: "Description du travail effectué…" },
  "portal.noSessions":         { es: "No se encontraron sesiones de horas extras en este mes desde la app.", en: "No overtime sessions found for this month from the app.", id: "Tidak ada sesi lembur ditemukan bulan ini dari aplikasi.", fr: "Aucune session d'heures supplémentaires trouvée pour ce mois dans l'application." },
  "portal.noSessionsHint":     { es: "Verifica que el mes seleccionado sea correcto, o añade filas manualmente.", en: "Check that the selected month is correct, or add rows manually.", id: "Periksa bulan yang dipilih sudah benar, atau tambahkan baris secara manual.", fr: "Vérifiez que le mois sélectionné est correct, ou ajoutez des lignes manuellement." },
  "portal.calcTitle":          { es: "Cálculo de Remuneración",   en: "Pay Calculation",          id: "Perhitungan Upah",             fr: "Calcul de la rémunération" },
  "portal.calcWeekday":        { es: "Días hábiles:",             en: "Weekdays:",                id: "Hari kerja:",                  fr: "Jours ouvrables :" },
  "portal.calcHoliday":        { es: "Días libres / festivos:",   en: "Days off / holidays:",     id: "Hari libur / festif:",         fr: "Jours de repos / fériés :" },
  "portal.calcTotal":          { es: "Horas extras solicitadas",  en: "Overtime requested",       id: "Lembur yang diminta",          fr: "Heures supplémentaires demandées" },
  "portal.overMax":            { es: "⚠ El total ({total}) supera el máximo permitido ({max}, {pct}% del sueldo).", en: "⚠ Total ({total}) exceeds the maximum allowed ({max}, {pct}% of salary).", id: "⚠ Total ({total}) melebihi maksimum ({max}, {pct}% dari gaji).", fr: "⚠ Le total ({total}) dépasse le maximum autorisé ({max}, {pct}% du salaire)." },
  "portal.btnSave":            { es: "Guardar borrador",          en: "Save draft",               id: "Simpan draf",                  fr: "Enregistrer le brouillon" },
  "portal.btnSubmit":          { es: "Enviar formulario",         en: "Submit form",              id: "Kirim formulir",               fr: "Soumettre le formulaire" },
  "portal.btnSubmitted":       { es: "✓ Enviado",                 en: "✓ Submitted",              id: "✓ Terkirim",                   fr: "✓ Soumis" },
  "portal.btnPrint":           { es: "🖨 Imprimir",               en: "🖨 Print",                  id: "🖨 Cetak",                      fr: "🖨 Imprimer" },
  "portal.confirmSubmit":      { es: "¿Confirmas el envío? El administrador podrá revisar el formulario.", en: "Confirm submission? The administrator will review the form.", id: "Konfirmasi pengiriman? Administrator akan meninjau formulir.", fr: "Confirmer la soumission ? L'administrateur examinera le formulaire." },
  "portal.saving":             { es: "Guardando…",                en: "Saving…",                  id: "Menyimpan…",                   fr: "Enregistrement…" },
  "portal.savedDraft":         { es: "✓ Borrador guardado",       en: "✓ Draft saved",            id: "✓ Draf disimpan",              fr: "✓ Brouillon enregistré" },
  "portal.savedSubmitted":     { es: "✓ Formulario enviado",      en: "✓ Form submitted",         id: "✓ Formulir terkirim",          fr: "✓ Formulaire soumis" },
  "portal.errProfile":         { es: "No se pudo cargar tu perfil. Contacta al administrador.", en: "Couldn't load your profile. Contact the administrator.", id: "Gagal memuat profil. Hubungi administrator.", fr: "Impossible de charger votre profil. Contactez l'administrateur." },
  "portal.errEmpOnly":         { es: "Este portal es exclusivo para empleados. Inicia sesión con tu cuenta de empleado.", en: "This portal is for employees only. Log in with your employee account.", id: "Portal ini hanya untuk karyawan. Masuk dengan akun karyawanmu.", fr: "Ce portail est réservé aux employés. Connectez-vous avec votre compte employé." },
  "portal.printTitle":         { es: "FORMULARIO DE CÁLCULO DE HORAS EXTRAS", en: "OVERTIME CALCULATION FORM", id: "FORMULIR PERHITUNGAN KERJA LEMBUR", fr: "FORMULAIRE DE CALCUL DES HEURES SUPPLÉMENTAIRES" },
  "portal.printFormHeader":    { es: "Formulario de Cálculo de Horas Extras", en: "Overtime Calculation Form", id: "Formulir Perhitungan Lembur", fr: "Formulaire de calcul des heures supplémentaires" },
  "portal.printName":          { es: "Nombre:",                   en: "Name:",                    id: "Nama:",                        fr: "Nom :" },
  "portal.printDept":          { es: "Departamento:",             en: "Department:",              id: "Departemen:",                  fr: "Département :" },
  "portal.printSalary":        { es: "Sueldo Básico:",            en: "Base Salary:",             id: "Gaji Pokok:",                  fr: "Salaire de base :" },
  "portal.printMaxOT":         { es: "Máximo horas extras permitido ({pct}%) = {cur} {max}", en: "Maximum overtime allowed ({pct}%) = {cur} {max}", id: "Maksimum lembur diizinkan ({pct}%) = {cur} {max}", fr: "Maximum d'heures supplémentaires autorisé ({pct}%) = {cur} {max}" },
  "portal.printThDate":        { es: "Fecha",                     en: "Date",                     id: "Tanggal",                      fr: "Date" },
  "portal.printThSchedule":    { es: "Horario",                   en: "Schedule",                 id: "Jadwal",                       fr: "Horaire" },
  "portal.printThHours":       { es: "Horas",                     en: "Hours",                    id: "Jam",                          fr: "Heures" },
  "portal.printThWeekday":     { es: "Día Hábil",                 en: "Weekday",                  id: "Hari Kerja",                   fr: "Jour ouvrable" },
  "portal.printThHoliday":     { es: "Día Libre",                 en: "Day Off",                  id: "Hari Libur",                   fr: "Jour de repos" },
  "portal.printThDesc":        { es: "Descripción",               en: "Description",              id: "Keterangan",                   fr: "Description" },
  "portal.printTotalHours":    { es: "Total Horas",               en: "Total Hours",              id: "Total Jam",                    fr: "Total heures" },
  "portal.printCalcTitle":     { es: "Cálculo de Remuneración",   en: "Pay Calculation",          id: "Perhitungan Upah",             fr: "Calcul de la rémunération" },
  "portal.printCalcWeekday":   { es: "Días hábiles:",             en: "Weekdays:",                id: "Hari kerja:",                  fr: "Jours ouvrables :" },
  "portal.printCalcHoliday":   { es: "Días libres:",              en: "Days off:",                id: "Hari libur:",                  fr: "Jours de repos :" },
  "portal.printOTRequested":   { es: "Horas Extras Solicitadas",  en: "Overtime Requested",       id: "Lembur yang Diminta",          fr: "Heures supplémentaires demandées" },
  "portal.printOTPay":         { es: "Horas Extras a Pagar",      en: "Overtime to Pay",          id: "Lembur yang Dibayar",          fr: "Heures supplémentaires à payer" },
  "portal.sigSectionTitle":    { es: "Firmas del formulario",      en: "Form Signatures",          id: "Tanda Tangan Formulir",        fr: "Signatures du formulaire" },
  "portal.sigAuthTitle":       { es: "Yang Memberi Perintah",     en: "Authorizer",               id: "Yang Memberi Perintah",        fr: "Yang Memberi Perintah" },
  "portal.sigRevTitle":        { es: "Mengetahui/Menyetujui",     en: "Approved By",              id: "Mengetahui/Menyetujui",        fr: "Mengetahui/Menyetujui" },
  "portal.sigName":            { es: "Nombre",                    en: "Name",                     id: "Nama",                         fr: "Nom" },
  "portal.sigPosition":        { es: "Cargo / Posición",          en: "Position / Title",         id: "Jabatan",                      fr: "Poste / Titre" },
  "portal.sigSubtitle":        { es: "Subtítulo",                 en: "Subtitle",                 id: "Keterangan Jabatan",           fr: "Sous-titre" },
  "portal.sigNamePh":          { es: "Nombre completo",           en: "Full name",                id: "Nama lengkap",                 fr: "Nom complet" },
  "portal.sigPositionPh":      { es: "Ej: Jefe de Área",          en: "e.g. Department Head",     id: "cth: Kepala Bagian",           fr: "Ex : Chef de service" },
  "portal.sigSubtitlePh":      { es: "Ej: Kepala Cabang",         en: "e.g. Branch Manager",      id: "cth: Kepala Cabang",           fr: "Ex : Directeur de succursale" },
  "portal.printSigAuthTitle":  { es: "Yang Memberi Perintah",     en: "Authorizer",               id: "Yang Memberi Perintah",        fr: "Yang Memberi Perintah" },
  "portal.printSigEmpTitle":   { es: "Yang Melaksanakan lembur",  en: "Employee (Overtime)",      id: "Yang Melaksanakan lembur",     fr: "Employé (Heures supp.)" },
  "portal.printSigRevTitle":   { es: "Mengetahui/Menyetujui",     en: "Approved By",              id: "Mengetahui/Menyetujui",        fr: "Mengetahui/Menyetujui" },
  "portal.printSigAuthorizer": { es: "Quien Autoriza",            en: "Authorizer",               id: "Yang Mengizinkan",             fr: "Qui autorise" },
  "portal.printSigReviewer":   { es: "Visto Bueno / Aprobado",    en: "Reviewer / Approved",      id: "Pemeriksa / Disetujui",        fr: "Visa / Approuvé par" },
  "portal.printSigEmployee":   { es: "Quien Realizó las Horas Extras", en: "Employee who worked overtime", id: "Karyawan yang melakukan lembur", fr: "Employé ayant effectué les heures supplémentaires" },
  "portal.rejectedTitle":      { es: "Formulario rechazado",      en: "Form rejected",            id: "Formulir ditolak",             fr: "Formulaire rejeté" },
  "portal.rejectedNoteLabel":  { es: "Motivo:",                   en: "Reason:",                  id: "Alasan:",                      fr: "Motif :" },
  "portal.rejectedHint":       { es: "Puedes modificar el formulario y volver a enviarlo para su revisión.", en: "You can edit the form and resubmit it for review.", id: "Kamu bisa mengubah formulir dan mengirimnya kembali untuk ditinjau.", fr: "Vous pouvez modifier le formulaire et le soumettre à nouveau pour examen." },
  "portal.printDisabledHint":  { es: "Solo disponible cuando el formulario está aprobado", en: "Only available when the form is approved", id: "Hanya tersedia saat formulir disetujui", fr: "Disponible uniquement lorsque le formulaire est approuvé" },

  // ---------------- Super-admin-setup ----------------
  "sas.pageTitle": { es: "ZyntrAbsen · Configuración inicial", en: "ZyntrAbsen · Initial setup", id: "ZyntrAbsen · Pengaturan awal", fr: "ZyntrAbsen · Configuration initiale" },
  "sas.title": { es: "Configuración inicial", en: "Initial setup", id: "Pengaturan awal", fr: "Configuration initiale" },
  "sas.subtitleHtml": {
    es: "Crea la cuenta del <strong>dueño del servicio</strong> (super-admin). Esta página solo funciona una vez — úsala tú, no la compartas con las empresas que contraten ZyntrAbsen. Ellas se registran desde <a href=\"index.html\">la página normal</a>.",
    en: "Create the <strong>service owner</strong> account (super-admin). This page only works once — use it yourself, don't share it with companies that hire ZyntrAbsen. They register from <a href=\"index.html\">the regular page</a>.",
    id: "Buat akun <strong>pemilik layanan</strong> (super-admin). Halaman ini hanya berfungsi sekali — gunakan sendiri, jangan bagikan ke perusahaan yang memakai ZyntrAbsen. Mereka mendaftar lewat <a href=\"index.html\">halaman biasa</a>.",
    fr: "Créez le compte du <strong>propriétaire du service</strong> (super-admin). Cette page ne fonctionne qu'une seule fois — utilisez-la vous-même, ne la partagez pas avec les entreprises qui utilisent ZyntrAbsen. Elles s'inscrivent depuis <a href=\"index.html\">la page normale</a>.",
  },
  "sas.formName": { es: "Tu nombre", en: "Your name", id: "Nama kamu", fr: "Votre nom" },
  "sas.formEmail": { es: "Correo", en: "Email", id: "Email", fr: "E-mail" },
  "sas.formPassword": { es: "Contraseña", en: "Password", id: "Kata sandi", fr: "Mot de passe" },
  "sas.formSubmit": { es: "Crear cuenta de super-admin", en: "Create super-admin account", id: "Buat akun super-admin", fr: "Créer un compte super-admin" },
  "sas.successPendingConfirm": {
    es: "Cuenta creada. Revisa tu correo para confirmarla, o desactiva 'Confirm email' en Supabase y vuelve a intentar.",
    en: "Account created. Check your email to confirm it, or disable 'Confirm email' in Supabase and try again.",
    id: "Akun berhasil dibuat. Cek email untuk konfirmasi, atau nonaktifkan 'Confirm email' di Supabase lalu coba lagi.",
    fr: "Compte créé. Vérifiez votre e-mail pour le confirmer, ou désactivez 'Confirm email' dans Supabase et réessayez.",
  },
  "sas.errAlreadyExists": { es: "Ya existe un super-admin en este sistema. Si eres tú, inicia sesión desde la página principal.", en: "A super-admin already exists in this system. If that's you, log in from the main page.", id: "Super-admin untuk sistem ini sudah ada. Jika itu kamu, masuk lewat halaman utama.", fr: "Un super-admin existe déjà dans ce système. Si c'est vous, connectez-vous depuis la page principale." },
  "sas.errAlreadyRegistered": { es: "Ya existe una cuenta con ese correo. Inicia sesión desde la página principal.", en: "An account with that email already exists. Log in from the main page.", id: "Akun dengan email tersebut sudah ada. Masuk lewat halaman utama.", fr: "Un compte avec cet e-mail existe déjà. Connectez-vous depuis la page principale." },
};

const LANG_KEY = "zyntra_lang";
const SUPPORTED = ["es", "en", "id", "fr"];
const LOCALE_MAP = { es: "es-CO", en: "en-US", id: "id-ID", fr: "fr-FR" };
const LANG_NAMES = { es: "🇪🇸 Español", en: "🇬🇧 English", id: "🇮🇩 Indonesia", fr: "🇫🇷 Français" };

export function getLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser = (navigator.language || "es").slice(0, 2);
  return SUPPORTED.includes(browser) ? browser : "es";
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  localStorage.setItem(LANG_KEY, lang);
  window.location.reload();
}

export function currentLocale() {
  return LOCALE_MAP[getLang()] || "es-CO";
}

export function t(key, vars = {}) {
  const lang = getLang();
  const entry = dict[key];
  let str = entry ? (entry[lang] ?? entry.es ?? key) : key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replaceAll(`{${k}}`, v);
  });
  return str;
}

export function applyStaticTranslations() {
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

export function renderLangSwitcher(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const current = getLang();
  el.innerHTML = `<select class="lang-switcher" aria-label="Idioma / Language / Bahasa / Langue">
    ${SUPPORTED.map((l) => `<option value="${l}" ${l === current ? "selected" : ""}>${LANG_NAMES[l]}</option>`).join("")}
  </select>`;
  el.querySelector(".lang-switcher").addEventListener("change", (e) => setLang(e.target.value));
}

export function initI18n(switcherContainerId) {
  applyStaticTranslations();
  if (switcherContainerId) renderLangSwitcher(switcherContainerId);
}
