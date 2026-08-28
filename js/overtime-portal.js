import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { t, initI18n, renderLangSwitcher, applyStaticTranslations } from "./i18n.js";

const supabase = createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY);
const $ = (sel, root = document) => root.querySelector(sel);

// ─── State ────────────────────────────────────────────
let profile = null;   // { id, full_name, department, base_salary, company_id }
let company = null;   // { id, name, timezone, ot_rate_weekday_pct, ot_rate_holiday_pct, ot_max_pct }
let sessions = [];    // [{ rowId, date, timeStart, timeEnd, hours, type, description }]
let holidaySet = new Set();
let currentYear = 0;
let currentMonth = 0;
let submissionId = null;
let submissionStatus = 'draft';
let authorizerName     = '';
let authorizerPosition = '';
let reviewerName       = '';
let reviewerSubtitle   = '';
let reviewerPosition   = '';

const pad = (n) => String(n).padStart(2, '0');
const esc = (s = '') => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const escAttr = (s = '') => String(s).replace(/"/g, '&quot;');
const fmt2 = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
const pctStr = (r) => (Number(r) * 100).toFixed(2) + '%';

// ─── Auth ─────────────────────────────────────────────
async function init() {
  applyStaticTranslations();
  renderLangSwitcher('login-lang-container');

  const { data: { session } } = await supabase.auth.getSession();
  if (session) { await boot(); } else { show('login'); }
  supabase.auth.onAuthStateChange(async (ev) => {
    if (ev === 'SIGNED_IN')  await boot();
    if (ev === 'SIGNED_OUT') { showLoginAlert(''); show('login'); }
  });
}

async function boot() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { show('login'); return; }

  const { data: prof, error } = await supabase
    .from('profiles')
    .select(`id, role, full_name, department, base_salary, company_id,
             companies(id, name, timezone, ot_rate_weekday_pct, ot_rate_holiday_pct, ot_max_pct)`)
    .eq('id', user.id)
    .single();

  if (error || !prof?.companies) {
    await supabase.auth.signOut();
    showLoginAlert(t('portal.errProfile'));
    return;
  }

  // Only employees can use this portal
  if (prof.role !== 'employee') {
    await supabase.auth.signOut();
    showLoginAlert(t('portal.errEmpOnly'));
    return;
  }

  profile = prof;
  company = prof.companies;

  setupMonthSelect();
  renderEmpInfo();
  renderLangSwitcher('portal-lang-container');

  const tz = company.timezone;
  const now = new Date();
  currentYear  = parseInt(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric'  }).format(now));
  currentMonth = parseInt(new Intl.DateTimeFormat('en-CA', { timeZone: tz, month: 'numeric' }).format(now));

  $('#month-select').value = `${currentYear}-${pad(currentMonth)}`;
  await loadMonth(currentYear, currentMonth);
  show('portal');
}

// ─── Month selector ───────────────────────────────────
function setupMonthSelect() {
  const sel = $('#month-select');
  const tz  = company.timezone;
  const now = new Date();
  sel.innerHTML = '';
  for (let i = 0; i < 13; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = parseInt(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:  'numeric' }).format(d));
    const m = parseInt(new Intl.DateTimeFormat('en-CA', { timeZone: tz, month: 'numeric' }).format(d));
    const label = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'long' }).format(d);
    const opt = document.createElement('option');
    opt.value = `${y}-${pad(m)}`;
    opt.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => {
    const [y, m] = sel.value.split('-').map(Number);
    loadMonth(y, m);
  });
}

// ─── Load month ───────────────────────────────────────
async function loadMonth(year, month) {
  currentYear = year; currentMonth = month;
  submissionId = null; submissionStatus = 'draft';
  authorizerName = ''; authorizerPosition = '';
  reviewerName   = ''; reviewerSubtitle   = ''; reviewerPosition = '';
  sessions = [];

  const tz = company.timezone;
  const { startISO, endISO } = monthBoundsUTC(year, month, tz);
  const nextM = month === 12 ? 1 : month + 1;
  const nextY = month === 12 ? year + 1 : year;

  const [recRes, holRes, subRes] = await Promise.all([
    supabase
      .from('attendance_records')
      .select('id, type, recorded_at, is_overtime, overtime_note')
      .eq('employee_id', profile.id)
      .gte('recorded_at', startISO)
      .lt('recorded_at', endISO)
      .order('recorded_at', { ascending: true }),
    supabase
      .from('holidays')
      .select('date')
      .or(`company_id.eq.${company.id},company_id.is.null`)
      .gte('date', `${year}-${pad(month)}-01`)
      .lt('date', `${nextY}-${pad(nextM)}-01`),
    supabase
      .from('overtime_submissions')
      .select('*')
      .eq('employee_id', profile.id)
      .eq('year', year)
      .eq('month', month)
      .maybeSingle()
  ]);

  holidaySet = new Set((holRes.data || []).map(h => h.date));

  if (subRes.data?.sessions?.length) {
    submissionId       = subRes.data.id;
    submissionStatus   = subRes.data.status;
    authorizerName     = subRes.data.authorizer_name     || '';
    authorizerPosition = subRes.data.authorizer_position || '';
    reviewerName       = subRes.data.reviewer_name       || '';
    reviewerSubtitle   = subRes.data.reviewer_subtitle   || '';
    reviewerPosition   = subRes.data.reviewer_position   || '';
    sessions = subRes.data.sessions;
  } else {
    sessions = buildFromRecords(recRes.data || [], tz);
  }

  renderTable();
  renderCalc();
  renderSubmitBtn();
}

// ─── Build sessions from attendance records ────────────
function buildFromRecords(records, tz) {
  // Pair all records; then keep only overtime check-ins
  const pairs = [];
  let pendingIn = null;
  for (const r of records) {
    if (r.type === 'check_in') {
      if (pendingIn) pairs.push({ checkIn: pendingIn, checkOut: null });
      pendingIn = r;
    } else if (r.type === 'check_out' && pendingIn) {
      pairs.push({ checkIn: pendingIn, checkOut: r });
      pendingIn = null;
    }
  }
  if (pendingIn) pairs.push({ checkIn: pendingIn, checkOut: null });

  return pairs
    .filter(p => p.checkIn.is_overtime)
    .map(({ checkIn, checkOut }) => {
      const d1 = new Date(checkIn.recorded_at);
      const d2 = checkOut ? new Date(checkOut.recorded_at) : null;
      const date      = dateTZ(d1, tz);
      const timeStart = timeTZ(d1, tz);
      const timeEnd   = d2 ? timeTZ(d2, tz) : '';
      const hours     = d2 ? Math.round((d2 - d1) / (1000 * 60 * 60) * 2) / 2 : 0;
      return {
        rowId: crypto.randomUUID(),
        date,
        timeStart,
        timeEnd,
        hours,
        type: classify(date),
        description: checkIn.overtime_note || ''
      };
    });
}

// ─── Classify weekday / holiday ────────────────────────
function classify(dateStr) {
  if (holidaySet.has(dateStr)) return 'holiday';
  // Use UTC day-of-week since the date string is already in company timezone
  const d = new Date(dateStr + 'T12:00:00Z');
  const dow = d.getUTCDay(); // 0=Sun, 6=Sat
  return (dow === 0 || dow === 6) ? 'holiday' : 'weekday';
}

// ─── Render table ─────────────────────────────────────
function renderTable() {
  const tbody = $('#sessions-tbody');
  if (!sessions.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px">
      ${t('portal.noSessions')}<br>
      <span style="font-size:12px">${t('portal.noSessionsHint')}</span>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = sessions.map((s, i) => `
    <tr data-row="${s.rowId}">
      <td class="num-col" style="color:var(--text-muted);font-size:12px;text-align:center">${i + 1}</td>
      <td>
        <input class="ot-input" type="date" value="${s.date}" data-f="date" />
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:4px">
          <input class="ot-input time" type="time" value="${s.timeStart}" data-f="timeStart" />
          <span style="color:var(--text-muted)">–</span>
          <input class="ot-input time" type="time" value="${s.timeEnd}" data-f="timeEnd" />
        </div>
      </td>
      <td>
        <input class="ot-input num" type="number" value="${s.hours}" min="0" max="24" step="0.5" data-f="hours" />
      </td>
      <td>
        <select class="type-sel ${s.type}" data-f="type">
          <option value="weekday" ${s.type==='weekday'?'selected':''}>${t('portal.typeWeekday')}</option>
          <option value="holiday" ${s.type==='holiday'?'selected':''}>${t('portal.typeHoliday')}</option>
        </select>
      </td>
      <td>
        <input class="ot-input" type="text" value="${escAttr(s.description)}"
          placeholder="${t('portal.descPlaceholder')}" data-f="description" />
      </td>
      <td class="no-print">
        <button class="del-btn" data-del="${s.rowId}" title="Eliminar fila">×</button>
      </td>
    </tr>
  `).join('');

  // Wire row events
  tbody.querySelectorAll('[data-f]').forEach(el => {
    el.addEventListener('change', onFieldChange);
    el.addEventListener('input',  onFieldChange);
  });
  tbody.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      sessions = sessions.filter(s => s.rowId !== btn.dataset.del);
      renderTable(); renderCalc();
    });
  });
}

function onFieldChange(e) {
  const row = e.target.closest('[data-row]');
  if (!row) return;
  const rowId = row.dataset.row;
  const field = e.target.dataset.f;
  const s = sessions.find(x => x.rowId === rowId);
  if (!s) return;

  if (field === 'hours') {
    s.hours = parseFloat(e.target.value) || 0;
  } else {
    s[field] = e.target.value;
  }

  // Auto-compute hours from time range when either time changes
  if (field === 'timeStart' || field === 'timeEnd') {
    const startEl = row.querySelector('[data-f="timeStart"]');
    const endEl   = row.querySelector('[data-f="timeEnd"]');
    if (startEl.value && endEl.value) {
      const [sh, sm] = startEl.value.split(':').map(Number);
      const [eh, em] = endEl.value.split(':').map(Number);
      const mins = (eh * 60 + em) - (sh * 60 + sm);
      if (mins > 0) {
        s.hours = Math.round(mins / 60 * 2) / 2;
        row.querySelector('[data-f="hours"]').value = s.hours;
      }
    }
  }

  // Update type-sel color class
  if (field === 'type') {
    e.target.className = `type-sel ${s.type}`;
  }

  renderCalc();
}

// ─── Calculation ──────────────────────────────────────
function getTotals() {
  const salary   = parseFloat(profile.base_salary) || 0;
  const wRate    = parseFloat(company.ot_rate_weekday_pct) || 0;
  const hRate    = parseFloat(company.ot_rate_holiday_pct) || 0;
  const maxPct   = parseFloat(company.ot_max_pct) || 0;
  const wHours   = sessions.filter(s => s.type === 'weekday').reduce((a, s) => a + (s.hours || 0), 0);
  const hHours   = sessions.filter(s => s.type === 'holiday').reduce((a, s) => a + (s.hours || 0), 0);
  const wAmount  = Math.round(wHours * wRate * salary * 100) / 100;
  const hAmount  = Math.round(hHours * hRate * salary * 100) / 100;
  const total    = Math.round((wAmount + hAmount) * 100) / 100;
  const maxAllow = Math.round((maxPct / 100) * salary * 100) / 100;
  return { salary, wRate, hRate, maxPct, wHours, hHours, wAmount, hAmount, total, maxAllow };
}

function renderCalc() {
  const { salary, wRate, hRate, maxPct, wHours, hHours, wAmount, hAmount, total, maxAllow } = getTotals();
  const cur = company.currency || 'USD';
  const over = total > maxAllow && maxAllow > 0;

  $('#calc-box').innerHTML = `
    <h3 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin:0 0 14px">
      ${t('portal.calcTitle')}
    </h3>
    <div class="calc-row">
      <span class="cl">${t('portal.calcWeekday')}</span>
      <span class="ch">${wHours.toFixed(1)}h</span>
      <span class="cf">× ${pctStr(wRate)} × ${cur} ${fmt2(salary)}</span>
      <span class="ca">${cur} ${fmt2(wAmount)}</span>
    </div>
    <div class="calc-row">
      <span class="cl">${t('portal.calcHoliday')}</span>
      <span class="ch">${hHours.toFixed(1)}h</span>
      <span class="cf">× ${pctStr(hRate)} × ${cur} ${fmt2(salary)}</span>
      <span class="ca">${cur} ${fmt2(hAmount)}</span>
    </div>
    <div class="calc-total">
      <span class="lbl">${t('portal.calcTotal')}</span>
      <span class="val" style="color:${over?'var(--stamp)':'var(--ink)'}">${cur} ${fmt2(total)}</span>
    </div>
    ${over ? `<div class="over-max-banner">${t('portal.overMax', { total: cur+' '+fmt2(total), max: cur+' '+fmt2(maxAllow), pct: maxPct })}</div>` : ''}
  `;
}

// ─── Employee info ────────────────────────────────────
function renderEmpInfo() {
  const salary   = parseFloat(profile.base_salary) || 0;
  const maxPct   = parseFloat(company.ot_max_pct) || 0;
  const maxAllow = Math.round((maxPct / 100) * salary * 100) / 100;
  const cur = company.currency || 'USD';
  $('#portal-company').textContent = company.name || '';
  $('#info-name').textContent   = profile.full_name  || '';
  $('#info-dept').textContent   = profile.department || '—';
  $('#info-salary').textContent = `${cur} ${fmt2(salary)}`;
  $('#info-max').textContent    = `${cur} ${fmt2(maxAllow)} (${maxPct}%)`;
}

// ─── Save / Submit ────────────────────────────────────
async function save(status) {
  const { salary, wRate, hRate, wHours, hHours, wAmount, hAmount, total } = getTotals();
  const statusEl = $('#portal-status');
  statusEl.textContent = t('portal.saving');
  statusEl.style.color = '';

  const payload = {
    employee_id: profile.id,
    company_id:  company.id,
    year: currentYear, month: currentMonth,
    sessions,
    weekday_hours: wHours, holiday_hours: hHours,
    base_salary: salary,
    ot_rate_weekday_pct: wRate, ot_rate_holiday_pct: hRate,
    weekday_amount: wAmount, holiday_amount: hAmount,
    total_amount: total,
    status,
    updated_at: new Date().toISOString(),
    ...(status === 'submitted' ? { submitted_at: new Date().toISOString() } : {})
  };

  const { data, error } = submissionId
    ? await supabase.from('overtime_submissions').update(payload).eq('id', submissionId).select('id').single()
    : await supabase.from('overtime_submissions').insert(payload).select('id').single();

  if (error) {
    statusEl.textContent = '✗ ' + error.message;
    statusEl.style.color = 'var(--stamp)';
    return;
  }
  submissionId = data.id;
  submissionStatus = status;
  statusEl.textContent = status === 'submitted' ? t('portal.savedSubmitted') : t('portal.savedDraft');
  statusEl.style.color = 'var(--ok)';
  renderSubmitBtn();
}

function renderSubmitBtn() {
  const btn = $('#btn-submit');
  if (submissionStatus === 'submitted') {
    btn.textContent = t('portal.btnSubmitted');
    btn.disabled = true;
  } else {
    btn.textContent = t('portal.btnSubmit');
    btn.disabled = false;
  }
}

// ─── Print ────────────────────────────────────────────
function doPrint() {
  const { salary, wRate, hRate, maxPct, wHours, hHours, wAmount, hAmount, total, maxAllow } = getTotals();
  const cur = company.currency || 'USD';
  const monthLabel = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'long' })
    .format(new Date(currentYear, currentMonth - 1, 1)).toUpperCase();

  const rows = sessions.map((s, i) => `
    <tr>
      <td style="text-align:center">${i + 1}</td>
      <td>${printDate(s.date)}</td>
      <td style="text-align:center">${s.timeStart || ''}${s.timeEnd ? ' – ' + s.timeEnd : ''}</td>
      <td style="text-align:center">${s.type === 'weekday' ? s.hours.toFixed(1) : ''}</td>
      <td style="text-align:center">${s.type === 'holiday' ? s.hours.toFixed(1) : ''}</td>
      <td>${esc(s.description)}</td>
    </tr>`).join('');

  $('#print-view').innerHTML = `
    <div class="print-page" style="padding:20pt 24pt">
      <div class="print-hdr">
        <strong>${esc(company.name || '')}</strong>
        <span>${t('portal.printFormHeader')}</span>
      </div>
      <h1>${t('portal.printTitle')}</h1>
      <h2>${monthLabel}</h2>
      <table class="print-info" style="margin-bottom:6pt">
        <tr><td>${t('portal.printName')}</td><td><strong>${esc(profile.full_name)}</strong></td></tr>
        <tr><td>${t('portal.printDept')}</td><td>${esc(profile.department || '—')}</td></tr>
        <tr><td>${t('portal.printSalary')}</td><td>${cur} ${fmt2(salary)}</td></tr>
        <tr><td colspan="2"><strong>${t('portal.printMaxOT', { pct: maxPct, cur, max: fmt2(maxAllow) })}</strong></td></tr>
      </table>

      <table class="print-table">
        <thead>
          <tr>
            <th rowspan="2" style="width:24pt">No</th>
            <th rowspan="2" style="width:70pt">${t('portal.printThDate')}</th>
            <th rowspan="2" style="width:80pt">${t('portal.printThSchedule')}</th>
            <th colspan="2">${t('portal.printThHours')}</th>
            <th rowspan="2">${t('portal.printThDesc')}</th>
          </tr>
          <tr>
            <th style="width:46pt;text-align:center">${t('portal.printThWeekday')}</th>
            <th style="width:46pt;text-align:center">${t('portal.printThHoliday')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align:center">${t('portal.printTotalHours')}</td>
            <td style="text-align:center">${wHours.toFixed(1)}</td>
            <td style="text-align:center">${hHours.toFixed(1)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div class="print-calc">
        <div style="font-weight:bold;margin-bottom:6pt">${t('portal.printCalcTitle')}</div>
        <table>
          <tr>
            <td style="color:#555">${t('portal.printCalcWeekday')}</td>
            <td style="font-family:monospace;padding:0 8pt">${wHours.toFixed(1)}</td>
            <td style="color:#555">× ${pctStr(wRate)} × ${cur} ${fmt2(salary)}</td>
            <td style="font-family:monospace;font-weight:bold;padding-left:10pt">${cur} ${fmt2(wAmount)}</td>
          </tr>
          <tr>
            <td style="color:#555">${t('portal.printCalcHoliday')}</td>
            <td style="font-family:monospace;padding:0 8pt">${hHours.toFixed(1)}</td>
            <td style="color:#555">× ${pctStr(hRate)} × ${cur} ${fmt2(salary)}</td>
            <td style="font-family:monospace;font-weight:bold;padding-left:10pt">${cur} ${fmt2(hAmount)}</td>
          </tr>
        </table>
        <div style="margin-top:8pt"><strong>${t('portal.printOTRequested')} = ${cur} ${fmt2(total)}</strong></div>
        <div style="margin-top:2pt"><strong>${t('portal.printOTPay')} = ${cur} ${fmt2(total)}</strong></div>
      </div>

      <!-- Top row: Authorizer (left) + Employee (right) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20pt;margin-top:40pt;font-size:10pt;font-family:'Times New Roman',serif">
        <div style="text-align:center">
          <div style="font-weight:bold">${t('portal.printSigAuthTitle')}</div>
          <div style="margin-top:48pt;border-top:1pt solid #333;padding-top:4pt">
            <div><strong>${esc(authorizerName)}</strong></div>
            ${authorizerPosition ? `<div style="font-size:9pt">${esc(authorizerPosition)}</div>` : ''}
          </div>
        </div>
        <div style="text-align:center">
          <div style="font-weight:bold">${t('portal.printSigEmpTitle')}</div>
          <div style="margin-top:48pt;border-top:1pt solid #333;padding-top:4pt">
            <div><strong>${esc(profile.full_name)}</strong></div>
          </div>
        </div>
      </div>
      <!-- Bottom center: Reviewer/Approver -->
      <div style="text-align:center;margin-top:30pt;font-size:10pt;font-family:'Times New Roman',serif;max-width:200pt;margin-left:auto;margin-right:auto">
        <div style="font-weight:bold">${t('portal.printSigRevTitle')}</div>
        ${reviewerSubtitle ? `<div style="font-size:9pt;color:#555">${esc(reviewerSubtitle)}</div>` : ''}
        <div style="margin-top:48pt;border-top:1pt solid #333;padding-top:4pt">
          <div><strong>${esc(reviewerName)}</strong></div>
          ${reviewerPosition ? `<div style="font-size:9pt">${esc(reviewerPosition)}</div>` : ''}
        </div>
      </div>
    </div>`;

  window.print();
}

// ─── Helpers ──────────────────────────────────────────
function show(screen) {
  $('#screen-login').style.display  = screen === 'login'  ? '' : 'none';
  $('#screen-portal').style.display = screen === 'portal' ? '' : 'none';
}

function showLoginAlert(msg) {
  const el = $('#login-alert');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.className = 'alert error';
  } else {
    el.textContent = '';
    el.className = 'alert';
  }
  // Re-enable login button if it was disabled
  const btn = $('#login-btn');
  if (btn) btn.disabled = false;
}

function monthBoundsUTC(year, month, timezone) {
  // Sample mid-month noon UTC to determine timezone offset
  const sample = new Date(Date.UTC(year, month - 1, 15, 12, 0, 0));
  const parts  = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone, year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', hour12: false
  }).formatToParts(sample);
  const get = (type) => parseInt(parts.find(p => p.type === type)?.value || '0');
  const offsetMin = (12 * 60) - (get('hour') * 60 + get('minute'));

  const nextM = month === 12 ? 1  : month + 1;
  const nextY = month === 12 ? year + 1 : year;
  const startUTC = new Date(Date.UTC(year,  month - 1, 1) + offsetMin * 60000);
  const endUTC   = new Date(Date.UTC(nextY, nextM  - 1, 1) + offsetMin * 60000);
  return { startISO: startUTC.toISOString(), endISO: endUTC.toISOString() };
}

function dateTZ(date, tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit' }).format(date);
}
function timeTZ(date, tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, hour:'2-digit', minute:'2-digit', hour12: false }).format(date);
}
function printDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z');
  return new Intl.DateTimeFormat('es', { day:'numeric', month:'short', year:'2-digit' }).format(d);
}

// ─── Event wiring ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  $('#form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoginAlert('');
    const btn = $('#login-btn');
    btn.disabled = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: $('#login-email').value.trim(),
      password: $('#login-password').value
    });
    if (error) {
      showLoginAlert(error.message);
    }
    // If success, onAuthStateChange fires SIGNED_IN → boot() runs
  });

  document.addEventListener('click', async (e) => {
    const id = e.target.id;
    if (id === 'btn-logout')  { await supabase.auth.signOut(); }
    if (id === 'btn-add-row') {
      const tz = company?.timezone || 'UTC';
      sessions.push({
        rowId: crypto.randomUUID(),
        date: dateTZ(new Date(), tz),
        timeStart: '', timeEnd: '',
        hours: 0,
        type: 'weekday',
        description: ''
      });
      renderTable(); renderCalc();
    }
    if (id === 'btn-save')   { await save('draft'); }
    if (id === 'btn-submit') {
      if (!confirm(t('portal.confirmSubmit'))) return;
      await save('submitted');
    }
    if (id === 'btn-print') { doPrint(); }
  });

  init();
});
