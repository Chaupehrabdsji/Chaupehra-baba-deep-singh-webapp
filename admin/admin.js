/* ============================================================
   CHAUPEHRA ADMIN — Full Dashboard Logic
   ============================================================ */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON } from '../supabase-config.js';

const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ── Helpers ── */
const $    = id => document.getElementById(id);
const fmtD = d  => new Date(d + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const fmtT = t  => { if (!t) return ''; const [h, m] = t.split(':'); const d = new Date(); d.setHours(+h, +m); return d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true }); };
const fmtTs= ts => new Date(ts).toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
const setStatus = (id, msg, type) => { const el = $(id); el.textContent = msg; el.className = 'form-status ' + (type || ''); };

const REASON_LABELS = { volunteer: 'Volunteer', book_event: 'Book Event', donate: 'Donate', general: 'General Enquiry', other: 'Other' };

/* ══════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════ */
async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) showDashboard();

  sb.auth.onAuthStateChange((_, session) => {
    if (session) showDashboard(); else showLogin();
  });

  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('loginBtn');
    btn.textContent = 'Signing in…'; btn.disabled = true;
    const { error } = await sb.auth.signInWithPassword({
      email:    $('loginEmail').value.trim(),
      password: $('loginPassword').value,
    });
    if (error) {
      $('loginError').textContent = error.message;
      $('loginError').classList.remove('hidden');
      btn.textContent = 'Sign In'; btn.disabled = false;
    }
  });

  $('logoutBtn').addEventListener('click', () => sb.auth.signOut());
}

function showLogin() {
  $('loginScreen').classList.remove('hidden');
  $('dashboard').classList.add('hidden');
}

function showDashboard() {
  $('loginScreen').classList.add('hidden');
  $('dashboard').classList.remove('hidden');
  loadTab('events');
  loadInquiryBadge();
  loadSignupsBadge();
  loadErrorLogsBadge();
}

/* ══════════════════════════════════════════════════
   TAB NAVIGATION
══════════════════════════════════════════════════ */
function loadTab(tab) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => {
    const isActive = p.id === 'tab-' + tab;
    p.classList.toggle('active', isActive);
    p.classList.remove('hidden');
  });
  $('sidebar').classList.remove('open');
  if (tab === 'events')    loadEvents();
  if (tab === 'inquiries') loadInquiries();
  if (tab === 'signups')   loadSignups();
  if (tab === 'gallery')   loadGallery();
  if (tab === 'errorlogs') loadErrorLogs();
}

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => loadTab(btn.dataset.tab)));
$('sidebarToggle').addEventListener('click', () => $('sidebar').classList.toggle('open'));

/* ══════════════════════════════════════════════════
   EVENTS
══════════════════════════════════════════════════ */
let editingEventId = null;

function showEventForm(ev = null) {
  editingEventId = ev?.id || null;
  $('eventFormTitle').textContent = ev ? 'Edit Event' : 'New Event';
  $('evName').value         = ev?.name || '';
  $('evDate').value         = ev?.date || '';
  $('evEndDate').value      = ev?.end_date || '';
  $('evStart').value        = ev?.start_time?.slice(0, 5) || '';
  $('evEnd').value          = ev?.end_time?.slice(0, 5) || '';
  $('evPath').value         = ev?.path_type || '';
  $('evKirtani').value      = ev?.kirtani || '';
  $('evNotes').value        = ev?.notes || '';
  $('evGurpurab').checked   = ev?.is_gurpurab  || false;
  $('evRecurring').checked  = ev?.is_recurring || false;
  setStatus('eventStatus', '', '');
  $('eventForm').classList.remove('hidden');
  $('evName').focus();
  $('eventForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideEventForm() {
  $('eventForm').classList.add('hidden');
  editingEventId = null;
}

$('addEventBtn').addEventListener('click', () => showEventForm());
$('cancelEventBtn').addEventListener('click', hideEventForm);

$('saveEventBtn').addEventListener('click', async () => {
  const name = $('evName').value.trim();
  const date = $('evDate').value;
  if (!name) { setStatus('eventStatus', 'Event name is required.', 'error'); return; }
  if (!date) { setStatus('eventStatus', 'Date is required.', 'error'); return; }

  $('saveEventBtn').disabled = true;
  setStatus('eventStatus', 'Saving…', '');

  const payload = {
    name,
    date,
    end_date:     $('evEndDate').value  || null,
    start_time:   $('evStart').value    || null,
    end_time:     $('evEnd').value      || null,
    path_type:    $('evPath').value     || null,
    kirtani:      $('evKirtani').value.trim()  || null,
    notes:        $('evNotes').value.trim()    || null,
    is_gurpurab:  $('evGurpurab').checked,
    is_recurring: $('evRecurring').checked,
  };
  if (editingEventId) payload.id = editingEventId;

  const { error } = await sb.from('events').upsert(payload);
  $('saveEventBtn').disabled = false;

  if (error) { setStatus('eventStatus', 'Error: ' + error.message, 'error'); return; }
  setStatus('eventStatus', 'Saved ✓', 'success');
  setTimeout(hideEventForm, 900);
  loadEvents();
});

async function loadEvents() {
  $('eventsBody').innerHTML = `<tr><td colspan="6" class="loading-cell">Loading…</td></tr>`;
  const { data, error } = await sb.from('events').select('*').order('date', { ascending: false });
  if (error || !data) {
    $('eventsBody').innerHTML = `<tr><td colspan="6" class="loading-cell text-muted">Failed to load events.</td></tr>`;
    return;
  }
  if (!data.length) {
    $('eventsBody').innerHTML = `<tr><td colspan="6" class="loading-cell text-muted">No events yet. Add one above.</td></tr>`;
    return;
  }
  $('eventsBody').innerHTML = data.map(ev => `
    <tr>
      <td>
        ${fmtD(ev.date)}
        ${ev.end_date && ev.end_date !== ev.date
          ? `<br><span class="text-muted" style="font-size:0.75rem;">→ ${fmtD(ev.end_date)}</span>`
          : ''}
      </td>
      <td>
        <strong>${ev.name}</strong>
        ${ev.is_gurpurab  ? ' <span class="pill pill-gurpurab">Gurpurab</span>' : ''}
        ${ev.is_recurring ? ' <span class="pill pill-event">Recurring</span>' : ''}
      </td>
      <td>
        ${ev.start_time ? fmtT(ev.start_time) : '<span class="text-muted">—</span>'}
        ${ev.end_time   ? ' – ' + fmtT(ev.end_time) : ''}
      </td>
      <td>${[ev.path_type, ev.kirtani].filter(Boolean).join('<br>') || '<span class="text-muted">—</span>'}</td>
      <td>${ev.is_gurpurab
        ? '<span class="pill pill-gurpurab">Gurpurab</span>'
        : '<span class="pill pill-event">Event</span>'}</td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn-outline btn-sm" onclick="window._editEvent('${ev.id}')">Edit</button>
          <button class="btn-danger btn-sm" onclick="window._deleteEvent('${ev.id}','${ev.name.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>`).join('');
}

window._editEvent = async id => {
  const { data } = await sb.from('events').select('*').eq('id', id).single();
  if (data) showEventForm(data);
};

window._deleteEvent = async (id, name) => {
  if (!confirm(`Delete "${name}"?\n\nThis cannot be undone.`)) return;
  const { error } = await sb.from('events').delete().eq('id', id);
  if (error) alert('Error: ' + error.message);
  else loadEvents();
};

/* ══════════════════════════════════════════════════
   INQUIRIES
══════════════════════════════════════════════════ */
async function loadSignupsBadge() {
  const { count } = await sb.from('likhanbhagti_signups').select('*', { count: 'exact', head: true });
  const badge = $('signups-badge');
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}

async function loadInquiryBadge() {
  const { count } = await sb.from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');
  const badge = $('inquiries-badge');
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}

async function loadInquiries() {
  $('inquiriesList').innerHTML = `<div class="loading-cell">Loading…</div>`;

  const statusFilter = $('inquiryFilter').value;
  const reasonFilter = $('inquiryReason').value;

  let q = sb.from('inquiries').select('*').order('created_at', { ascending: false });
  if (statusFilter !== 'all') q = q.eq('status', statusFilter);
  if (reasonFilter !== 'all') q = q.eq('reason', reasonFilter);

  const { data, error } = await q;
  if (error) { $('inquiriesList').innerHTML = `<div class="loading-cell text-muted">Failed to load.</div>`; return; }
  if (!data.length) { $('inquiriesList').innerHTML = `<div class="loading-cell text-muted">No inquiries found.</div>`; return; }

  $('inquiriesList').innerHTML = data.map(inq => `
    <div class="inquiry-card status-${inq.status}" id="inq-${inq.id}">
      <div class="inquiry-header">
        <div>
          <div class="inquiry-name">${inq.name}</div>
          <div class="inquiry-reason">${REASON_LABELS[inq.reason] || inq.reason}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="pill pill-${inq.status}">${inq.status}</span>
          <span class="inquiry-date">${fmtTs(inq.created_at)}</span>
        </div>
      </div>
      <div class="inquiry-meta">
        <span>📞 <a href="tel:${inq.phone}">${inq.phone}</a></span>
        <span>✉️ <a href="mailto:${inq.email}">${inq.email}</a></span>
      </div>
      ${inq.preferred_date ? `<span class="inquiry-date-pref">📅 Preferred date: ${fmtD(inq.preferred_date)}</span>` : ''}
      ${inq.comments ? `<div class="inquiry-comments">"${inq.comments}"</div>` : ''}
      <div class="inquiry-actions">
        <button class="btn-outline btn-sm" onclick="window._setInqStatus('${inq.id}','read')"
          ${inq.status === 'read' ? 'disabled style="opacity:0.4"' : ''}>Mark Read</button>
        <button class="btn-outline btn-sm" onclick="window._setInqStatus('${inq.id}','responded')"
          ${inq.status === 'responded' ? 'disabled style="opacity:0.4"' : ''}>Mark Responded</button>
        <button class="btn-danger btn-sm" onclick="window._deleteInq('${inq.id}')">Delete</button>
        <a href="mailto:${inq.email}?subject=Re: Your Inquiry — Chaupehra Baba Deep Singh Ji&body=Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh %0A%0ADear ${inq.name},"
           class="btn-primary btn-sm" style="margin-left:auto;">Reply by Email</a>
      </div>
    </div>`).join('');
}

window._setInqStatus = async (id, status) => {
  const { error } = await sb.from('inquiries').update({ status }).eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  loadInquiries();
  loadInquiryBadge();
};

window._deleteInq = async id => {
  if (!confirm('Delete this inquiry? This cannot be undone.')) return;
  const { error } = await sb.from('inquiries').delete().eq('id', id);
  if (error) alert('Error: ' + error.message);
  else { loadInquiries(); loadInquiryBadge(); }
};

$('inquiryFilter').addEventListener('change', loadInquiries);
$('inquiryReason').addEventListener('change', loadInquiries);

/* ══════════════════════════════════════════════════
   SIGNUPS
══════════════════════════════════════════════════ */
const AGE_GROUP_LABELS = {
  '6_under': '6 & under', '7_9': '7–9 yrs', '9_12': '9–12 yrs',
  '13_15': '13–15 yrs', '16_20': '16–20 yrs', '21_above': '21+',
};

let allSignups = [];

async function loadSignups() {
  $('signupsBody').innerHTML = `<tr><td colspan="9" class="loading-cell">Loading…</td></tr>`;
  const { data, error } = await sb
    .from('likhanbhagti_signups')
    .select('*, likhanbhagti_members(*)')
    .order('created_at', { ascending: false });

  if (error) {
    $('signupsBody').innerHTML = `<tr><td colspan="9" class="loading-cell text-muted">Failed to load: ${error.message}</td></tr>`;
    return;
  }

  allSignups = data || [];
  const badge = $('signups-badge');
  if (allSignups.length) { badge.textContent = allSignups.length; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');

  renderSignups();
}

function renderSignups() {
  const search    = $('signupSearch').value.toLowerCase();
  const ageFilter = $('signupAgeFilter').value;

  const filtered = allSignups.filter(s => {
    const matchAge  = ageFilter === 'all' || s.age_group === ageFilter;
    const matchText = !search || [s.full_name, s.phone, s.email, s.city, s.province, s.country]
      .filter(Boolean).some(v => v.toLowerCase().includes(search));
    return matchAge && matchText;
  });

  $('signupsCount').textContent = `Showing ${filtered.length} of ${allSignups.length} registrations`;

  if (!filtered.length) {
    $('signupsBody').innerHTML = `<tr><td colspan="9" class="loading-cell text-muted">No signups found.</td></tr>`;
    return;
  }

  $('signupsBody').innerHTML = filtered.map((s, i) => {
    const members = s.likhanbhagti_members || [];
    const memberRows = members.map(m => `
      <tr style="background:rgba(255,153,51,0.04);font-size:0.82rem;">
        <td></td>
        <td style="padding-left:2rem;color:var(--saffron);">↳ ${m.full_name}</td>
        <td>${m.age ?? '—'} / ${AGE_GROUP_LABELS[m.age_group] || m.age_group || '—'}</td>
        <td>${m.simran_times?.toLocaleString() ?? '—'}</td>
        <td colspan="5" class="text-muted">family member</td>
      </tr>`).join('');

    return `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td>
          <strong>${s.full_name}</strong>
          ${s.parent_name ? `<br><span class="text-muted" style="font-size:0.75rem;">Guardian: ${s.parent_name}</span>` : ''}
        </td>
        <td>${s.age ?? '—'} / ${AGE_GROUP_LABELS[s.age_group] || s.age_group || '—'}</td>
        <td>${s.simran_times?.toLocaleString() ?? '—'}</td>
        <td><a href="tel:${s.phone}">${s.phone}</a></td>
        <td><a href="mailto:${s.email}">${s.email || '—'}</a></td>
        <td>${[s.city, s.province, s.country].filter(Boolean).join(', ') || '—'}</td>
        <td style="white-space:nowrap;">${fmtTs(s.created_at)}</td>
        <td>${members.length ? `<span class="pill pill-event">+${members.length}</span>` : '<span class="text-muted">—</span>'}</td>
      </tr>
      ${memberRows}`;
  }).join('');
}

function exportSignupsCSV() {
  const headers = ['#','Full Name','Age','Age Group','Simran Target','Parent/Guardian','Phone','Email','City','Province','Country','Consent','Registered','Family Members'];
  const rows = allSignups.map((s, i) => [
    i + 1, s.full_name, s.age ?? '', AGE_GROUP_LABELS[s.age_group] || s.age_group || '',
    s.simran_times ?? '', s.parent_name ?? '', s.phone, s.email ?? '',
    s.city ?? '', s.province ?? '', s.country ?? '',
    s.contact_consent ? 'Yes' : 'No',
    new Date(s.created_at).toLocaleDateString('en-CA'),
    (s.likhanbhagti_members || []).map(m => `${m.full_name} (${m.age})`).join('; '),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`));

  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `lb-signups-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

$('signupSearch').addEventListener('input', renderSignups);
$('signupAgeFilter').addEventListener('change', renderSignups);
$('signupExportBtn').addEventListener('click', exportSignupsCSV);

/* ── Duplicate detection ── */
const normPhone = p => (p || '').replace(/[^\d]/g, '').replace(/^1(?=\d{10}$)/, '');
const normName  = n => (n || '').trim().toLowerCase().replace(/\s+/g, ' ');

function findDuplicateGroups() {
  const byPhone = new Map();
  const byName  = new Map();
  allSignups.forEach(s => {
    const p = normPhone(s.phone);
    const n = normName(s.full_name);
    if (p) { if (!byPhone.has(p)) byPhone.set(p, []); byPhone.get(p).push(s); }
    if (n) { if (!byName.has(n))  byName.set(n, []);  byName.get(n).push(s); }
  });

  const groups = [];
  const seen = new Set();
  byPhone.forEach((rows) => {
    if (rows.length > 1) { groups.push({ reason: 'Same phone number', rows }); rows.forEach(r => seen.add(r.id)); }
  });
  byName.forEach((rows) => {
    if (rows.length > 1 && !rows.every(r => seen.has(r.id))) {
      groups.push({ reason: 'Same name', rows });
    }
  });
  return groups;
}

function renderDuplicates() {
  const groups = findDuplicateGroups();
  const listEl = $('duplicatesList');
  $('duplicatesPanelTitle').textContent = groups.length
    ? `Possible Duplicates (${groups.length} group${groups.length > 1 ? 's' : ''})`
    : 'Possible Duplicates';

  if (!groups.length) {
    listEl.innerHTML = `<p class="text-muted">No duplicate phone numbers or names found.</p>`;
    return;
  }

  listEl.innerHTML = groups.map((g, gi) => `
    <div class="dup-group" style="border:1px solid var(--navy-light,#333);border-radius:var(--radius);padding:var(--space-4);margin-bottom:var(--space-3);">
      <div style="font-size:0.8rem;font-weight:700;color:var(--saffron);margin-bottom:var(--space-2);">${g.reason} — ${g.rows.length} entries</div>
      ${g.rows.map(r => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);padding:var(--space-2) 0;border-top:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:0.85rem;">
            <strong>${r.full_name}</strong>
            <span class="text-muted"> · ${r.phone} · ${r.email || 'no email'} · registered ${fmtTs(r.created_at)}</span>
          </div>
          <button class="btn-danger btn-sm" onclick="window._deleteDupSignup('${r.id}', ${gi})">Delete this one</button>
        </div>`).join('')}
    </div>`).join('');
}

window._deleteDupSignup = async (id) => {
  if (!confirm('Delete this signup entry? This cannot be undone.')) return;
  const { error } = await sb.from('likhanbhagti_signups').delete().eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  await loadSignups();
  renderDuplicates();
};

$('signupDuplicatesBtn').addEventListener('click', () => {
  const panel = $('duplicatesPanel');
  const hidden = panel.classList.toggle('hidden');
  if (!hidden) renderDuplicates();
});

/* ══════════════════════════════════════════════════
   GALLERY
══════════════════════════════════════════════════ */
async function loadGallery() {
  $('galleryAdminGrid').innerHTML = `<div class="loading-cell">Loading…</div>`;
  const { data, error } = await sb.from('photos').select('*').order('sort_order').order('created_at');
  if (error) { $('galleryAdminGrid').innerHTML = `<div class="loading-cell text-muted">Failed to load.</div>`; return; }
  if (!data.length) { $('galleryAdminGrid').innerHTML = `<div class="loading-cell text-muted">No photos yet. Upload some above.</div>`; return; }

  $('galleryAdminGrid').innerHTML = data.map(p => {
    const url = p.url || sb.storage.from('gallery').getPublicUrl(p.storage_path).data.publicUrl;
    return `
      <div class="gallery-photo-item" id="photo-${p.id}">
        <img src="${url}" alt="" loading="lazy" />
        <button class="gallery-photo-delete"
          onclick="window._deletePhoto('${p.id}','${(p.storage_path||'').replace(/'/g,"\\'")}')"
          aria-label="Delete photo" title="Delete">✕</button>
      </div>`;
  }).join('');
}

$('photoUpload').addEventListener('change', async e => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const progress = $('uploadProgress');
  const fill     = $('progressFill');
  const status   = $('uploadStatus');
  progress.classList.remove('hidden');

  let done = 0;
  for (const file of files) {
    status.textContent = `Uploading ${file.name}… (${done + 1} of ${files.length})`;
    fill.style.width   = (done / files.length * 100) + '%';

    const ext  = file.name.split('.').pop().toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await sb.storage.from('gallery').upload(path, file);
    if (upErr) { status.textContent = `Error: ${upErr.message}`; continue; }

    const { data: { publicUrl } } = sb.storage.from('gallery').getPublicUrl(path);
    await sb.from('photos').insert({ url: publicUrl, storage_path: path, sort_order: 0 });
    done++;
  }

  fill.style.width    = '100%';
  status.textContent  = `✓ ${done} of ${files.length} photo${files.length > 1 ? 's' : ''} uploaded.`;
  setTimeout(() => { progress.classList.add('hidden'); fill.style.width = '0%'; }, 3500);
  e.target.value = '';
  loadGallery();
});

window._deletePhoto = async (id, storagePath) => {
  if (!confirm('Delete this photo? This cannot be undone.')) return;
  if (storagePath) await sb.storage.from('gallery').remove([storagePath]);
  const { error } = await sb.from('photos').delete().eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  const el = $('photo-' + id);
  if (el) el.remove();
};

/* ══════════════════════════════════════════════════
   ERROR LOGS
══════════════════════════════════════════════════ */
let allErrorLogs = [];

async function loadErrorLogsBadge() {
  const { count } = await sb.from('error_logs').select('*', { count: 'exact', head: true });
  const badge = $('errorlogs-badge');
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}

async function loadErrorLogs() {
  $('errorLogsBody').innerHTML = `<tr><td colspan="6" class="loading-cell">Loading error logs…</td></tr>`;
  const { data, error } = await sb.from('error_logs').select('*').order('created_at', { ascending: false }).limit(500);

  if (error) {
    $('errorLogsBody').innerHTML = `<tr><td colspan="6" class="loading-cell text-muted">Failed to load: ${error.message}</td></tr>`;
    return;
  }

  allErrorLogs = data;

  const sources = [...new Set(data.map(l => l.source))].sort();
  const filterEl = $('errorSourceFilter');
  const prevValue = filterEl.value;
  filterEl.innerHTML = `<option value="all">All Sources</option>` +
    sources.map(s => `<option value="${s}">${s}</option>`).join('');
  filterEl.value = sources.includes(prevValue) ? prevValue : 'all';

  renderErrorLogs();
}

function renderErrorLogs() {
  const filter = $('errorSourceFilter').value;
  const rows = filter === 'all' ? allErrorLogs : allErrorLogs.filter(l => l.source === filter);

  if (!rows.length) {
    $('errorLogsBody').innerHTML = `<tr><td colspan="6" class="loading-cell text-muted">No error logs found.</td></tr>`;
    return;
  }

  $('errorLogsBody').innerHTML = rows.map(log => `
    <tr>
      <td>${fmtTs(log.created_at)}</td>
      <td><span class="pill">${log.source}</span></td>
      <td>${log.message}</td>
      <td>${log.details ? `<code style="font-size:0.75rem;">${JSON.stringify(log.details).slice(0, 200)}</code>` : ''}</td>
      <td class="text-muted" style="font-size:0.8rem;">${log.page_url || ''}</td>
      <td><button class="btn-danger btn-sm" onclick="window._deleteErrorLog('${log.id}')">Delete</button></td>
    </tr>`).join('');
}

window._deleteErrorLog = async id => {
  const { error } = await sb.from('error_logs').delete().eq('id', id);
  if (error) { alert('Error: ' + error.message); return; }
  loadErrorLogs();
  loadErrorLogsBadge();
};

$('errorSourceFilter').addEventListener('change', renderErrorLogs);

$('errorClearBtn').addEventListener('click', async () => {
  if (!confirm('Delete ALL error logs? This cannot be undone.')) return;
  const { error } = await sb.from('error_logs').delete().not('id', 'is', null);
  if (error) { alert('Error: ' + error.message); return; }
  loadErrorLogs();
  loadErrorLogsBadge();
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
initAuth();
