// ============================================================
// Sistema de idiomas de ZyntrAbsen — Español / English / Indonesia
// ============================================================
// Uso en HTML estático:
//   <span data-i18n="dash.emp.title"></span>          -> textContent
//   <span data-i18n-html="auth.codeResultHint"></span> -> innerHTML (para texto con <a>/<strong>)
//   <input data-i18n-placeholder="dash.hol.formNamePlaceholder" />
// Uso en JS:  import { t, currentLocale, initI18n } from "./i18n.js";  t("dash.emp.title")
// ============================================================

const dict = {
  // ---------------- Común ----------------
  "common.loading": { es: "Cargando…", en: "Loading…", id: "Memuat…" },
  "common.logout": { es: "Cerrar sesión", en: "Log out", id: "Keluar" },

  // ---------------- Login / Crear empresa (index.html) ----------------
  "auth.pageTitle": { es: "ZyntrAbsen · Acceso administrador", en: "ZyntrAbsen · Admin access", id: "ZyntrAbsen · Akses admin" },
  "auth.title": { es: "Panel de administrador", en: "Admin panel", id: "Panel admin" },
  "auth.subtitle": { es: "Consulta las asistencias de tu equipo e imprime el informe mensual.", en: "Check your team's attendance and print the monthly report.", id: "Lihat kehadiran timmu dan cetak laporan bulanan." },
  "auth.tabLogin": { es: "Iniciar sesión", en: "Log in", id: "Masuk" },
  "auth.tabSignup": { es: "Crear empresa", en: "Create company", id: "Buat perusahaan" },
  "auth.loginEmail": { es: "Correo", en: "Email", id: "Email" },
  "auth.loginPassword": { es: "Contraseña", en: "Password", id: "Kata sandi" },
  "auth.loginButton": { es: "Ingresar", en: "Log in", id: "Masuk" },
  "auth.signupCompanyName": { es: "Nombre de la empresa", en: "Company name", id: "Nama perusahaan" },
  "auth.signupCountry": { es: "País base", en: "Base country", id: "Negara basis" },
  "auth.signupCountryLoading": { es: "Cargando países…", en: "Loading countries…", id: "Memuat daftar negara…" },
  "auth.signupCountryError": { es: "No se pudieron cargar los países", en: "Couldn't load countries", id: "Gagal memuat daftar negara" },
  "auth.signupYourName": { es: "Tu nombre", en: "Your name", id: "Nama kamu" },
  "auth.signupEmail": { es: "Correo", en: "Email", id: "Email" },
  "auth.signupPassword": { es: "Contraseña", en: "Password", id: "Kata sandi" },
  "auth.signupButton": { es: "Crear empresa y cuenta admin", en: "Create company & admin account", id: "Buat perusahaan & akun admin" },
  "auth.signupHint": { es: "Se generará un código único que tus empleados usarán para registrarse en la app móvil.", en: "A unique code will be generated for your employees to register in the mobile app.", id: "Kode unik akan dibuat untuk digunakan karyawanmu saat mendaftar di aplikasi seluler." },
  "auth.codeResultLabel": { es: "Código de invitación de tu empresa:", en: "Your company's invite code:", id: "Kode undangan perusahaanmu:" },
  "auth.codeResultHint": {
    es: 'Guárdalo y compártelo con tus empleados. Ya puedes <a href="dashboard.html">ir al panel</a>.',
    en: 'Save it and share it with your employees. You can now <a href="dashboard.html">go to the panel</a>.',
    id: 'Simpan dan bagikan ke karyawanmu. Sekarang kamu bisa <a href="dashboard.html">buka panel</a>.',
  },
  "auth.errorNoProfile": { es: "No se encontró un perfil para esta cuenta.", en: "No profile found for this account.", id: "Profil untuk akun ini tidak ditemukan." },
  "auth.errorNotAdmin": { es: "Esta cuenta es de empleado, no de administrador. Usa la app móvil.", en: "This account belongs to an employee, not an admin. Use the mobile app.", id: "Akun ini milik karyawan, bukan admin. Gunakan aplikasi seluler." },
  "auth.errorChooseCountry": { es: "Elige el país de la empresa.", en: "Choose the company's country.", id: "Pilih negara perusahaan." },
  "auth.successSignupPendingConfirm": {
    es: "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión, o desactiva 'Confirm email' en Supabase Auth para pruebas internas.",
    en: "Account created. Check your email to confirm it and then log in, or disable 'Confirm email' in Supabase Auth for internal testing.",
    id: "Akun berhasil dibuat. Cek email untuk konfirmasi lalu masuk, atau nonaktifkan 'Confirm email' di Supabase Auth untuk pengujian internal.",
  },
  "auth.successCompanyCreated": { es: "¡Empresa creada correctamente!", en: "Company created successfully!", id: "Perusahaan berhasil dibuat!" },
  "auth.errorInvalidCredentials": { es: "Correo o contraseña incorrectos.", en: "Incorrect email or password.", id: "Email atau kata sandi salah." },
  "auth.errorAlreadyRegistered": { es: "Ya existe una cuenta con ese correo.", en: "An account with that email already exists.", id: "Akun dengan email tersebut sudah ada." },
  "auth.errorPasswordShort": { es: "La contraseña debe tener al menos 6 caracteres.", en: "The password must be at least 6 characters.", id: "Kata sandi minimal harus 6 karakter." },

  // ---------------- Dashboard: sidebar / general ----------------
  "dash.pageTitle": { es: "ZyntrAbsen · Panel", en: "ZyntrAbsen · Panel", id: "ZyntrAbsen · Panel" },
  "dash.navReport": { es: "Informe de asistencia", en: "Attendance report", id: "Laporan kehadiran" },
  "dash.navEmployees": { es: "Empleados", en: "Employees", id: "Karyawan" },
  "dash.navVacations": { es: "Vacaciones", en: "Vacation", id: "Cuti" },
  "dash.navHolidays": { es: "Festivos", en: "Holidays", id: "Hari Libur" },
  "dash.navBackup": { es: "Respaldo", en: "Backup", id: "Cadangan" },
  "dash.navCompany": { es: "Empresa", en: "Company", id: "Perusahaan" },
  "dash.inviteCode": { es: "Código de invitación", en: "Invite code", id: "Kode undangan" },
  "dash.statusPending": {
    es: "⏳ Tu cuenta está <strong>pendiente de aprobación</strong>. Puedes configurar empleados y festivos, pero nadie podrá marcar entrada/salida hasta que el administrador del servicio active tu cuenta.",
    en: "⏳ Your account is <strong>pending approval</strong>. You can set up employees and holidays, but no one can clock in/out until the service administrator activates your account.",
    id: "⏳ Akun kamu <strong>menunggu persetujuan</strong>. Kamu bisa mengatur karyawan dan hari libur, tapi tidak ada yang bisa absen masuk/keluar sampai admin layanan mengaktifkan akunmu.",
  },
  "dash.statusSuspended": {
    es: "⛔ Tu cuenta está <strong>suspendida</strong>. Los empleados no pueden marcar entrada/salida. Contacta al administrador del servicio.",
    en: "⛔ Your account is <strong>suspended</strong>. Employees cannot clock in/out. Contact the service administrator.",
    id: "⛔ Akun kamu <strong>ditangguhkan</strong>. Karyawan tidak bisa absen masuk/keluar. Hubungi admin layanan.",
  },

  // ---------------- Dashboard: Informe ----------------
  "dash.report.title": { es: "Informe de asistencia", en: "Attendance report", id: "Laporan kehadiran" },
  "dash.report.exportCsv": { es: "Exportar CSV", en: "Export CSV", id: "Ekspor CSV" },
  "dash.report.print": { es: "Imprimir informe", en: "Print report", id: "Cetak laporan" },
  "dash.report.month": { es: "Mes", en: "Month", id: "Bulan" },
  "dash.report.employee": { es: "Empleado", en: "Employee", id: "Karyawan" },
  "dash.report.employeeAll": { es: "Todos", en: "All", id: "Semua" },
  "dash.report.show": { es: "Mostrar", en: "Show", id: "Tampilkan" },
  "dash.report.showAll": { es: "Todos los registros", en: "All records", id: "Semua catatan" },
  "dash.report.showOvertimeOnly": { es: "Solo overtime", en: "Overtime only", id: "Hanya lembur" },
  "dash.report.showRegularOnly": { es: "Solo horario regular", en: "Regular hours only", id: "Hanya jam reguler" },
  "dash.report.view": { es: "Vista", en: "View", id: "Tampilan" },
  "dash.report.viewList": { es: "Lista", en: "List", id: "Daftar" },
  "dash.report.viewCalendar": { es: "Calendario", en: "Calendar", id: "Kalender" },
  "dash.report.loadingAttendance": { es: "Cargando asistencias…", en: "Loading attendance…", id: "Memuat data kehadiran…" },
  "dash.report.summaryDaysRegistered": { es: "Días registrados", en: "Days recorded", id: "Hari tercatat" },
  "dash.report.summaryEmployeesWithRecords": { es: "Empleados con marcas", en: "Employees with records", id: "Karyawan dengan catatan" },
  "dash.report.summaryOvertimeDays": { es: "Días con overtime", en: "Days with overtime", id: "Hari dengan lembur" },
  "dash.report.noRecords": { es: "No hay registros de asistencia para este filtro.", en: "No attendance records for this filter.", id: "Tidak ada data kehadiran untuk filter ini." },
  "dash.report.errorLoading": { es: "Error cargando datos: {msg}", en: "Error loading data: {msg}", id: "Gagal memuat data: {msg}" },
  "dash.report.entrada": { es: "Entrada", en: "Check-in", id: "Masuk" },
  "dash.report.salida": { es: "Salida", en: "Check-out", id: "Keluar" },
  "dash.report.noLocation": { es: "Sin ubicación", en: "No location", id: "Tanpa lokasi" },
  "dash.report.overtime": { es: "Overtime", en: "Overtime", id: "Lembur" },
  "dash.report.regular": { es: "Regular", en: "Regular", id: "Reguler" },
  "dash.report.viewMap": { es: "Ver mapa", en: "View map", id: "Lihat peta" },
  "dash.report.csvName": { es: "Nombre", en: "Name", id: "Nama" },
  "dash.report.csvEmail": { es: "Correo", en: "Email", id: "Email" },
  "dash.report.csvDate": { es: "Fecha", en: "Date", id: "Tanggal" },
  "dash.report.csvCheckIn": { es: "Entrada", en: "Check-in", id: "Masuk" },
  "dash.report.csvCheckOut": { es: "Salida", en: "Check-out", id: "Keluar" },
  "dash.report.csvOvertime": { es: "Overtime", en: "Overtime", id: "Lembur" },
  "dash.report.csvLocIn": { es: "Ubicación entrada", en: "Check-in location", id: "Lokasi masuk" },
  "dash.report.csvLocOut": { es: "Ubicación salida", en: "Check-out location", id: "Lokasi keluar" },
  "dash.report.csvYes": { es: "Sí", en: "Yes", id: "Ya" },
  "dash.report.csvNo": { es: "No", en: "No", id: "Tidak" },
  "dash.report.csvType": { es: "Tipo", en: "Type", id: "Jenis" },
  "dash.report.csvTime": { es: "Hora", en: "Time", id: "Waktu" },
  "dash.report.summaryRecords": { es: "Marcajes registrados", en: "Records logged", id: "Catatan tercatat" },
  "dash.report.summaryOvertimeRecords": { es: "Marcajes con overtime", en: "Records with overtime", id: "Catatan dengan lembur" },
  "dash.report.recordsLabel": { es: "marcajes", en: "records", id: "catatan" },
  "dash.report.prevMonth": { es: "Mes anterior", en: "Previous month", id: "Bulan sebelumnya" },
  "dash.report.nextMonth": { es: "Mes siguiente", en: "Next month", id: "Bulan berikutnya" },

  // ---------------- Dashboard: Calendario (impresión) ----------------
  "dash.cal.legendRegular": { es: "Regular", en: "Regular", id: "Reguler" },
  "dash.cal.legendOvertime": { es: "Overtime", en: "Overtime", id: "Lembur" },
  "dash.cal.legendIncomplete": { es: "Sin salida", en: "No checkout", id: "Belum keluar" },
  "dash.cal.legendVacation": { es: "Vacaciones", en: "Vacation", id: "Cuti" },
  "dash.cal.legendHoliday": { es: "Festivo", en: "Holiday", id: "Libur" },
  "dash.cal.totalRegular": { es: "Total regular", en: "Total regular", id: "Total reguler" },
  "dash.cal.totalOvertime": { es: "Total overtime", en: "Total overtime", id: "Total lembur" },
  "dash.cal.generating": { es: "Generando calendario…", en: "Generating calendar…", id: "Membuat kalender…" },
  "dash.cal.noSalida": { es: "(sin salida)", en: "(no checkout)", id: "(belum keluar)" },
  "dash.cal.noEntrada": { es: "(sin entrada)", en: "(no check-in)", id: "(belum masuk)" },
  "dash.cal.holidayTag": { es: "Festivo", en: "Holiday", id: "Libur" },
  "dash.cal.vacationTag": { es: "Vacaciones", en: "Vacation", id: "Cuti" },
  "dash.cal.dowMon": { es: "Lun", en: "Mon", id: "Sen" },
  "dash.cal.dowTue": { es: "Mar", en: "Tue", id: "Sel" },
  "dash.cal.dowWed": { es: "Mié", en: "Wed", id: "Rab" },
  "dash.cal.dowThu": { es: "Jue", en: "Thu", id: "Kam" },
  "dash.cal.dowFri": { es: "Vie", en: "Fri", id: "Jum" },
  "dash.cal.dowSat": { es: "Sáb", en: "Sat", id: "Sab" },
  "dash.cal.dowSun": { es: "Dom", en: "Sun", id: "Min" },

  // ---------------- Dashboard: Empleados ----------------
  "dash.emp.title": { es: "Empleados", en: "Employees", id: "Karyawan" },
  "dash.emp.hintHtml": {
    es: "Dos formas de dar de alta a un empleado: <strong>crea su cuenta aquí</strong> (le compartes el correo y la contraseña provisional que elijas) o comparte el código <strong>{code}</strong> para que se registre solo desde la app móvil.",
    en: "Two ways to add an employee: <strong>create their account here</strong> (share the email and provisional password you choose) or share the code <strong>{code}</strong> so they can register themselves from the mobile app.",
    id: "Ada dua cara menambahkan karyawan: <strong>buat akunnya di sini</strong> (bagikan email dan kata sandi sementara pilihanmu) atau bagikan kode <strong>{code}</strong> agar mereka mendaftar sendiri lewat aplikasi seluler.",
  },
  "dash.emp.formName": { es: "Nombre completo", en: "Full name", id: "Nama lengkap" },
  "dash.emp.formEmail": { es: "Correo", en: "Email", id: "Email" },
  "dash.emp.formPassword": { es: "Contraseña provisional", en: "Provisional password", id: "Kata sandi sementara" },
  "dash.emp.formPasswordPlaceholder": { es: "Mínimo 6 caracteres", en: "Minimum 6 characters", id: "Minimal 6 karakter" },
  "dash.emp.formHireDate": { es: "Fecha de ingreso", en: "Hire date", id: "Tanggal masuk kerja" },
  "dash.emp.formSubmit": { es: "Crear cuenta", en: "Create account", id: "Buat akun" },
  "dash.emp.thName": { es: "Nombre", en: "Name", id: "Nama" },
  "dash.emp.thEmail": { es: "Correo", en: "Email", id: "Email" },
  "dash.emp.thStatus": { es: "Estado", en: "Status", id: "Status" },
  "dash.emp.thHire": { es: "Ingreso", en: "Hired", id: "Masuk" },
  "dash.emp.thTermination": { es: "Salida", en: "Left", id: "Keluar" },
  "dash.emp.noneYet": { es: "Aún no hay empleados registrados.", en: "No employees registered yet.", id: "Belum ada karyawan yang terdaftar." },
  "dash.emp.statusActive": { es: "Activo", en: "Active", id: "Aktif" },
  "dash.emp.statusSuspended": { es: "Suspendido", en: "Suspended", id: "Ditangguhkan" },
  "dash.emp.statusTerminated": { es: "Retirado", en: "Terminated", id: "Berhenti" },
  "dash.emp.btnSuspend": { es: "Suspender", en: "Suspend", id: "Tangguhkan" },
  "dash.emp.btnTerminate": { es: "Retirar", en: "Terminate", id: "Berhentikan" },
  "dash.emp.btnReactivate": { es: "Reactivar", en: "Reactivate", id: "Aktifkan lagi" },
  "dash.emp.btnDelete": { es: "Eliminar", en: "Delete", id: "Hapus" },
  "dash.emp.confirmSuspend": { es: "¿Suspender a este empleado? No podrá marcar entrada/salida hasta que lo reactives.", en: "Suspend this employee? They won't be able to clock in/out until you reactivate them.", id: "Tangguhkan karyawan ini? Mereka tidak bisa absen masuk/keluar sampai kamu aktifkan lagi." },
  "dash.emp.errSuspend": { es: "No se pudo suspender: {msg}", en: "Couldn't suspend: {msg}", id: "Gagal menangguhkan: {msg}" },
  "dash.emp.errReactivate": { es: "No se pudo reactivar: {msg}", en: "Couldn't reactivate: {msg}", id: "Gagal mengaktifkan kembali: {msg}" },
  "dash.emp.promptTerminationDate": { es: "Fecha de salida (AAAA-MM-DD):", en: "Termination date (YYYY-MM-DD):", id: "Tanggal berhenti (YYYY-MM-DD):" },
  "dash.emp.confirmTerminate": { es: "¿Confirmas retirar a este empleado? Se conserva todo su historial de asistencia.", en: "Confirm terminating this employee? Their full attendance history will be kept.", id: "Konfirmasi berhentikan karyawan ini? Seluruh riwayat kehadirannya akan tetap disimpan." },
  "dash.emp.errTerminate": { es: "No se pudo retirar: {msg}", en: "Couldn't terminate: {msg}", id: "Gagal memberhentikan: {msg}" },
  "dash.emp.confirmDelete1": {
    es: "¿ELIMINAR DEFINITIVAMENTE a este empleado? Esto borra también todo su historial de asistencia y vacaciones. No se puede deshacer. Si solo quieres que deje de trabajar conservando sus registros, usa 'Retirar' en vez de esto.",
    en: "PERMANENTLY DELETE this employee? This also erases all their attendance and vacation history. This cannot be undone. If you just want them to stop working while keeping their records, use 'Terminate' instead.",
    id: "HAPUS PERMANEN karyawan ini? Ini juga akan menghapus seluruh riwayat kehadiran dan cutinya. Tidak bisa dibatalkan. Jika kamu hanya ingin menghentikannya bekerja tapi tetap menyimpan datanya, gunakan 'Berhentikan' saja.",
  },
  "dash.emp.confirmDelete2": { es: "Última confirmación: esta acción es permanente. ¿Continuar?", en: "Final confirmation: this action is permanent. Continue?", id: "Konfirmasi terakhir: tindakan ini permanen. Lanjutkan?" },
  "dash.emp.errDelete": { es: "No se pudo eliminar: {msg}", en: "Couldn't delete: {msg}", id: "Gagal menghapus: {msg}" },
  "dash.emp.alertIncomplete": { es: "Completa nombre, correo y una contraseña de al menos 6 caracteres.", en: "Fill in name, email, and a password of at least 6 characters.", id: "Isi nama, email, dan kata sandi minimal 6 karakter." },
  "dash.emp.errConfirmEmail": {
    es: "Supabase pidió confirmar el correo antes de continuar. Desactiva 'Confirm email' en Authentication → Sign In / Providers → Email (ver README).",
    en: "Supabase asked to confirm the email before continuing. Disable 'Confirm email' in Authentication → Sign In / Providers → Email (see README).",
    id: "Supabase meminta konfirmasi email sebelum melanjutkan. Nonaktifkan 'Confirm email' di Authentication → Sign In / Providers → Email (lihat README).",
  },
  "dash.emp.successCreated": { es: "Cuenta creada. Comparte con {name}: correo {email}, contraseña {password}", en: "Account created. Share with {name}: email {email}, password {password}", id: "Akun berhasil dibuat. Bagikan ke {name}: email {email}, kata sandi {password}" },
  "dash.emp.errAlreadyRegistered": { es: "Ya existe una cuenta con ese correo (puede ser de otra empresa en este mismo sistema).", en: "An account with that email already exists (it may belong to another company in this same system).", id: "Akun dengan email tersebut sudah ada (mungkin milik perusahaan lain di sistem yang sama)." },
  "dash.emp.errPasswordShort": { es: "La contraseña debe tener al menos 6 caracteres.", en: "The password must be at least 6 characters.", id: "Kata sandi minimal harus 6 karakter." },

  // ---------------- Dashboard: Vacaciones ----------------
  "dash.vac.title": { es: "Vacaciones", en: "Vacation", id: "Cuti" },
  "dash.vac.year": { es: "Año", en: "Year", id: "Tahun" },
  "dash.vac.hint": {
    es: "El saldo se calcula como los días asignados al año menos los días ya registrados como tomados en ese año. Los días asignados son editables por empleado.",
    en: "The balance is calculated as the days assigned per year minus the days already recorded as taken that year. Assigned days are editable per employee.",
    id: "Sisa cuti dihitung dari hari yang dialokasikan per tahun dikurangi hari yang sudah tercatat diambil pada tahun itu. Hari yang dialokasikan bisa diedit per karyawan.",
  },
  "dash.vac.thEmployee": { es: "Empleado", en: "Employee", id: "Karyawan" },
  "dash.vac.thAllowance": { es: "Asignados/año", en: "Assigned/year", id: "Dialokasikan/tahun" },
  "dash.vac.thTaken": { es: "Tomados este año", en: "Taken this year", id: "Diambil tahun ini" },
  "dash.vac.thRemaining": { es: "Restantes", en: "Remaining", id: "Sisa" },
  "dash.vac.registerTitle": { es: "Registrar un período tomado", en: "Register a period taken", id: "Catat periode cuti" },
  "dash.vac.formEmployee": { es: "Empleado", en: "Employee", id: "Karyawan" },
  "dash.vac.formStart": { es: "Inicio", en: "Start", id: "Mulai" },
  "dash.vac.formEnd": { es: "Fin", en: "End", id: "Selesai" },
  "dash.vac.formDays": { es: "Días", en: "Days", id: "Hari" },
  "dash.vac.formNote": { es: "Nota (opcional)", en: "Note (optional)", id: "Catatan (opsional)" },
  "dash.vac.formNotePlaceholder": { es: "Ej. Vacaciones de fin de año", en: "E.g. Year-end vacation", id: "Cth. Cuti akhir tahun" },
  "dash.vac.formSubmit": { es: "Registrar", en: "Register", id: "Catat" },
  "dash.vac.thPeriod": { es: "Período", en: "Period", id: "Periode" },
  "dash.vac.thDays": { es: "Días", en: "Days", id: "Hari" },
  "dash.vac.thNote": { es: "Nota", en: "Note", id: "Catatan" },
  "dash.vac.noEmployees": { es: "Aún no hay empleados.", en: "No employees yet.", id: "Belum ada karyawan." },
  "dash.vac.errSave": { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}" },
  "dash.vac.noneInYear": { es: "Sin períodos registrados en {year}.", en: "No periods recorded in {year}.", id: "Belum ada periode tercatat di tahun {year}." },
  "dash.vac.btnDelete": { es: "Eliminar", en: "Delete", id: "Hapus" },
  "dash.vac.confirmDelete": { es: "¿Eliminar este período de vacaciones?", en: "Delete this vacation period?", id: "Hapus periode cuti ini?" },
  "dash.vac.errDelete": { es: "No se pudo eliminar: {msg}", en: "Couldn't delete: {msg}", id: "Gagal menghapus: {msg}" },
  "dash.vac.errRegister": { es: "No se pudo registrar: {msg}", en: "Couldn't register: {msg}", id: "Gagal mencatat: {msg}" },

  // ---------------- Dashboard: Festivos ----------------
  "dash.hol.title": { es: "Festivos", en: "Holidays", id: "Hari Libur" },
  "dash.hol.hint": {
    es: "Los festivos nacionales del país de tu empresa ya están precargados. Agrega aquí fechas especiales propias de tu empresa (cierres, puentes internos, etc). Cualquier día listado aquí cuenta como overtime a cualquier hora.",
    en: "Your company's national holidays are already preloaded. Add your own company-specific dates here (closures, internal long weekends, etc). Any day listed here counts as overtime at any time.",
    id: "Hari libur nasional negara perusahaanmu sudah dimuat otomatis. Tambahkan di sini tanggal khusus milik perusahaanmu sendiri (tutup kantor, cuti bersama internal, dll). Setiap hari yang terdaftar di sini dihitung lembur kapan pun.",
  },
  "dash.hol.countriesLabel": { es: "Países cuyos festivos nacionales aplican", en: "Countries whose national holidays apply", id: "Negara yang hari liburnya berlaku" },
  "dash.hol.addCountryLabel": { es: "Agregar otro país (ej. embajadas)", en: "Add another country (e.g. embassies)", id: "Tambah negara lain (mis. kedutaan)" },
  "dash.hol.chooseCountry": { es: "Elegir país…", en: "Choose a country…", id: "Pilih negara…" },
  "dash.hol.allCountriesAdded": { es: "Ya están todos los países disponibles", en: "All available countries have been added", id: "Semua negara yang tersedia sudah ditambahkan" },
  "dash.hol.addCountryBtn": { es: "Agregar país", en: "Add country", id: "Tambah negara" },
  "dash.hol.formDate": { es: "Fecha", en: "Date", id: "Tanggal" },
  "dash.hol.formName": { es: "Nombre", en: "Name", id: "Nama" },
  "dash.hol.formNamePlaceholder": { es: "Ej. Aniversario de la empresa", en: "E.g. Company anniversary", id: "Cth. Hari jadi perusahaan" },
  "dash.hol.formSubmit": { es: "Agregar festivo", en: "Add holiday", id: "Tambah hari libur" },
  "dash.hol.thDate": { es: "Fecha", en: "Date", id: "Tanggal" },
  "dash.hol.thName": { es: "Nombre", en: "Name", id: "Nama" },
  "dash.hol.thOrigin": { es: "Origen", en: "Source", id: "Sumber" },
  "dash.hol.yourCompany": { es: "Tu empresa", en: "Your company", id: "Perusahaanmu" },
  "dash.hol.national": { es: "(nacional)", en: "(national)", id: "(nasional)" },
  "dash.hol.base": { es: " (sede)", en: " (base)", id: " (basis)" },
  "dash.hol.removeTitle": { es: "Quitar", en: "Remove", id: "Hapus" },
  "dash.hol.confirmRemoveCountry": { es: "¿Dejar de tomar los festivos de {country}?", en: "Stop observing {country}'s holidays?", id: "Berhenti mengikuti hari libur {country}?" },
  "dash.hol.errRemoveCountry": { es: "No se pudo quitar: {msg}", en: "Couldn't remove: {msg}", id: "Gagal menghapus: {msg}" },
  "dash.hol.errAddCountry": { es: "No se pudo agregar: {msg}", en: "Couldn't add: {msg}", id: "Gagal menambahkan: {msg}" },
  "dash.hol.confirmDeleteHoliday": { es: "¿Eliminar este festivo?", en: "Delete this holiday?", id: "Hapus hari libur ini?" },
  "dash.hol.errDeleteHoliday": { es: "No se pudo eliminar: {msg}", en: "Couldn't delete: {msg}", id: "Gagal menghapus: {msg}" },
  "dash.hol.btnDelete": { es: "Eliminar", en: "Delete", id: "Hapus" },

  // ---------------- Dashboard: Respaldo ----------------
  "dash.backup.title": { es: "Respaldo de datos", en: "Data backup", id: "Cadangan data" },
  "dash.backup.hint": {
    es: "Descarga una copia completa de los datos de tu empresa (empleados, asistencias, festivos propios y vacaciones) en un archivo JSON. Guárdalo en un lugar seguro (Google Drive, disco externo) por cualquier eventualidad. Puedes hacerlo tan seguido como quieras — no afecta los datos en ZyntrAbsen.",
    en: "Download a complete copy of your company's data (employees, attendance, custom holidays, and vacations) as a JSON file. Keep it somewhere safe (Google Drive, external drive) just in case. You can do this as often as you like — it doesn't affect the data in ZyntrAbsen.",
    id: "Unduh salinan lengkap data perusahaanmu (karyawan, kehadiran, hari libur khusus, dan cuti) dalam file JSON. Simpan di tempat aman (Google Drive, hard disk eksternal) untuk berjaga-jaga. Kamu bisa melakukannya sesering mungkin — tidak memengaruhi data di ZyntrAbsen.",
  },
  "dash.backup.button": { es: "Descargar respaldo completo", en: "Download full backup", id: "Unduh cadangan lengkap" },
  "dash.backup.generating": { es: "Generando respaldo…", en: "Generating backup…", id: "Membuat cadangan…" },
  "dash.backup.errGenerating": { es: "Error generando el respaldo: {msg}", en: "Error generating the backup: {msg}", id: "Gagal membuat cadangan: {msg}" },
  "dash.backup.done": { es: "Listo — respaldo descargado con {emp} empleados y {att} marcas de asistencia.", en: "Done — backup downloaded with {emp} employees and {att} attendance records.", id: "Selesai — cadangan berhasil diunduh dengan {emp} karyawan dan {att} catatan kehadiran." },

  // ---------------- Dashboard: Empresa (logo) ----------------
  "dash.company.title": { es: "Configuración de la empresa", en: "Company settings", id: "Pengaturan perusahaan" },
  "dash.company.logoLabel": { es: "Logo de la empresa", en: "Company logo", id: "Logo perusahaan" },
  "dash.company.logoHint": {
    es: "Se muestra en la app móvil de tus empleados. Recomendado: imagen cuadrada, fondo blanco o transparente, menos de 2 MB.",
    en: "Shown in your employees' mobile app. Recommended: square image, white or transparent background, under 2 MB.",
    id: "Ditampilkan di aplikasi seluler karyawanmu. Disarankan: gambar persegi, latar putih atau transparan, kurang dari 2 MB.",
  },
  "dash.company.noLogo": { es: "Todavía no has subido un logo.", en: "You haven't uploaded a logo yet.", id: "Kamu belum mengunggah logo." },
  "dash.company.uploadButton": { es: "Subir logo", en: "Upload logo", id: "Unggah logo" },
  "dash.company.uploading": { es: "Subiendo…", en: "Uploading…", id: "Mengunggah…" },
  "dash.company.uploadSuccess": { es: "Logo actualizado.", en: "Logo updated.", id: "Logo diperbarui." },
  "dash.company.errUpload": { es: "No se pudo subir: {msg}", en: "Couldn't upload: {msg}", id: "Gagal mengunggah: {msg}" },
  "dash.company.errTooLarge": { es: "La imagen debe pesar menos de 2 MB.", en: "The image must be under 2 MB.", id: "Ukuran gambar harus di bawah 2 MB." },
  "dash.company.errType": { es: "Solo se permiten imágenes (PNG, JPG, WEBP).", en: "Only images are allowed (PNG, JPG, WEBP).", id: "Hanya gambar yang diizinkan (PNG, JPG, WEBP)." },
  "dash.company.hoursTitle": { es: "Horario laboral", en: "Work hours", id: "Jam kerja" },
  "dash.company.hoursHint": {
    es: "Cualquier marcaje fuera de este horario (o cualquier hora, en un día festivo) cuenta automáticamente como overtime.",
    en: "Any record outside these hours (or any time on a holiday) automatically counts as overtime.",
    id: "Catatan di luar jam ini (atau kapan saja di hari libur) otomatis dihitung sebagai lembur.",
  },
  "dash.company.workStart": { es: "Entrada", en: "Start", id: "Masuk" },
  "dash.company.workEnd": { es: "Salida", en: "End", id: "Keluar" },
  "dash.company.hoursSave": { es: "Guardar horario", en: "Save hours", id: "Simpan jam kerja" },
  "dash.company.hoursSaved": { es: "Horario actualizado.", en: "Hours updated.", id: "Jam kerja diperbarui." },
  "dash.company.hoursErrMissing": { es: "Completa la hora de entrada y salida.", en: "Fill in both start and end times.", id: "Isi jam masuk dan keluar." },
  "dash.company.hoursErrSave": { es: "No se pudo guardar: {msg}", en: "Couldn't save: {msg}", id: "Gagal menyimpan: {msg}" },

  // ---------------- Super-admin ----------------
  "sa.pageTitle": { es: "ZyntrAbsen · Super Admin", en: "ZyntrAbsen · Super Admin", id: "ZyntrAbsen · Super Admin" },
  "sa.subtitle": { es: "Panel del dueño del servicio", en: "Service owner panel", id: "Panel pemilik layanan" },
  "sa.title": { es: "Empresas registradas", en: "Registered companies", id: "Perusahaan terdaftar" },
  "sa.hint": {
    es: "Aquí apruebas o suspendes el acceso de cada empresa que contrata ZyntrAbsen. Mientras una empresa está pendiente, su administrador puede entrar a configurar todo, pero los empleados no pueden marcar entrada/salida hasta que la apruebes. No tienes acceso a las asistencias, ubicaciones ni festivos de ninguna empresa — solo a este panel de cuentas.",
    en: "Here you approve or suspend access for each company that hires ZyntrAbsen. While a company is pending, its admin can log in to set everything up, but employees can't clock in/out until you approve it. You don't have access to any company's attendance, locations, or holidays — only to this account panel.",
    id: "Di sini kamu menyetujui atau menangguhkan akses tiap perusahaan yang menggunakan ZyntrAbsen. Selama perusahaan berstatus menunggu, adminnya bisa masuk untuk mengatur semuanya, tapi karyawan tidak bisa absen masuk/keluar sampai kamu menyetujuinya. Kamu tidak punya akses ke data kehadiran, lokasi, atau hari libur perusahaan mana pun — hanya ke panel akun ini.",
  },
  "sa.summaryTotal": { es: "Empresas totales", en: "Total companies", id: "Total perusahaan" },
  "sa.summaryPending": { es: "Pendientes de aprobar", en: "Pending approval", id: "Menunggu persetujuan" },
  "sa.summaryActive": { es: "Activas", en: "Active", id: "Aktif" },
  "sa.summarySuspended": { es: "Suspendidas", en: "Suspended", id: "Ditangguhkan" },
  "sa.noneYet": { es: "Todavía no hay empresas registradas.", en: "No companies registered yet.", id: "Belum ada perusahaan yang terdaftar." },
  "sa.errLoading": { es: "Error cargando empresas: {msg}", en: "Error loading companies: {msg}", id: "Gagal memuat data perusahaan: {msg}" },
  "sa.thCompany": { es: "Empresa", en: "Company", id: "Perusahaan" },
  "sa.thCountry": { es: "País base", en: "Base country", id: "Negara basis" },
  "sa.thCode": { es: "Código", en: "Code", id: "Kode" },
  "sa.thStatus": { es: "Estado", en: "Status", id: "Status" },
  "sa.thCreated": { es: "Creada", en: "Created", id: "Dibuat" },
  "sa.statusPending": { es: "Pendiente", en: "Pending", id: "Menunggu" },
  "sa.statusActive": { es: "Activa", en: "Active", id: "Aktif" },
  "sa.statusSuspended": { es: "Suspendida", en: "Suspended", id: "Ditangguhkan" },
  "sa.btnApprove": { es: "Aprobar", en: "Approve", id: "Setujui" },
  "sa.btnSuspend": { es: "Suspender", en: "Suspend", id: "Tangguhkan" },
  "sa.btnReactivate": { es: "Reactivar", en: "Reactivate", id: "Aktifkan lagi" },
  "sa.confirmAction": { es: "¿Confirmas {action} esta empresa?", en: "Confirm {action} this company?", id: "Konfirmasi {action} perusahaan ini?" },
  "sa.actionApprove": { es: "aprobar", en: "approving", id: "menyetujui" },
  "sa.actionSuspend": { es: "suspender", en: "suspending", id: "menangguhkan" },
  "sa.actionUpdate": { es: "actualizar", en: "updating", id: "memperbarui" },
  "sa.errUpdate": { es: "No se pudo actualizar: {msg}", en: "Couldn't update: {msg}", id: "Gagal memperbarui: {msg}" },

  // ---------------- Super-admin-setup ----------------
  "sas.pageTitle": { es: "ZyntrAbsen · Configuración inicial", en: "ZyntrAbsen · Initial setup", id: "ZyntrAbsen · Pengaturan awal" },
  "sas.title": { es: "Configuración inicial", en: "Initial setup", id: "Pengaturan awal" },
  "sas.subtitleHtml": {
    es: "Crea la cuenta del <strong>dueño del servicio</strong> (super-admin). Esta página solo funciona una vez — úsala tú, no la compartas con las empresas que contraten ZyntrAbsen. Ellas se registran desde <a href=\"index.html\">la página normal</a>.",
    en: "Create the <strong>service owner</strong> account (super-admin). This page only works once — use it yourself, don't share it with companies that hire ZyntrAbsen. They register from <a href=\"index.html\">the regular page</a>.",
    id: "Buat akun <strong>pemilik layanan</strong> (super-admin). Halaman ini hanya berfungsi sekali — gunakan sendiri, jangan bagikan ke perusahaan yang memakai ZyntrAbsen. Mereka mendaftar lewat <a href=\"index.html\">halaman biasa</a>.",
  },
  "sas.formName": { es: "Tu nombre", en: "Your name", id: "Nama kamu" },
  "sas.formEmail": { es: "Correo", en: "Email", id: "Email" },
  "sas.formPassword": { es: "Contraseña", en: "Password", id: "Kata sandi" },
  "sas.formSubmit": { es: "Crear cuenta de super-admin", en: "Create super-admin account", id: "Buat akun super-admin" },
  "sas.successPendingConfirm": {
    es: "Cuenta creada. Revisa tu correo para confirmarla, o desactiva 'Confirm email' en Supabase y vuelve a intentar.",
    en: "Account created. Check your email to confirm it, or disable 'Confirm email' in Supabase and try again.",
    id: "Akun berhasil dibuat. Cek email untuk konfirmasi, atau nonaktifkan 'Confirm email' di Supabase lalu coba lagi.",
  },
  "sas.errAlreadyExists": { es: "Ya existe un super-admin en este sistema. Si eres tú, inicia sesión desde la página principal.", en: "A super-admin already exists in this system. If that's you, log in from the main page.", id: "Super-admin untuk sistem ini sudah ada. Jika itu kamu, masuk lewat halaman utama." },
  "sas.errAlreadyRegistered": { es: "Ya existe una cuenta con ese correo. Inicia sesión desde la página principal.", en: "An account with that email already exists. Log in from the main page.", id: "Akun dengan email tersebut sudah ada. Masuk lewat halaman utama." },
};

const LANG_KEY = "zyntra_lang";
const SUPPORTED = ["es", "en", "id"];
const LOCALE_MAP = { es: "es-CO", en: "en-US", id: "id-ID" };
const LANG_NAMES = { es: "🇪🇸 Español", en: "🇬🇧 English", id: "🇮🇩 Indonesia" };

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
  el.innerHTML = `<select id="lang-switcher" class="lang-switcher" aria-label="Idioma / Language / Bahasa">
    ${SUPPORTED.map((l) => `<option value="${l}" ${l === current ? "selected" : ""}>${LANG_NAMES[l]}</option>`).join("")}
  </select>`;
  document.getElementById("lang-switcher").addEventListener("change", (e) => setLang(e.target.value));
}

export function initI18n(switcherContainerId) {
  applyStaticTranslations();
  if (switcherContainerId) renderLangSwitcher(switcherContainerId);
}
