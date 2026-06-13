import {
  getAllEvents, upsertEvent, deleteEvent,
  getPhotos, uploadPhoto, deletePhoto,
  getAllBookings, updateBookingStatus,
  getAllAvailableDates, setDateAvailability, removeDateEntry,
  sb
} from '../db.js';

// ── Auth ──────────────────────────────────────────────────────────────────────
const loginScreen = document.getElementById('loginScreen');
const dashboard   = document.getElementById('dashboard');

sb.auth.getSession().then(({ data: { session } }) => {
  session ? showDashboard() : showLogin();
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginError');
  btn.textContent = 'Signing in…'; btn.disabled = true; err.textContent = '';
  const { error } = await sb.auth.signInWithPassword({
    email:    document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value,
  });
  btn.textContent = 'Sign In'; btn.disabled = false;
  if (error) { err.textContent = error.message; return; }
  showDashboard();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await sb.auth.signOut();
  showLogin();
});

function showLogin()     { loginScreen.classList.remove('hidden'); dashboard.classList.add('hidden'); }
function showDashboard() { loginScreen.classList.add('hidden'); dashboard.classList.remove('hidden'); loadTab('events'); }

// ── Tabs ──────────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTab(btn.dataset.tab);
  });
});

function loadTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  const panel = document.getElementById(`tab-${name}`);
  panel.classList.remove('hidden');
  panel.classList.add('active');
  ({ events: loadEvents, gallery: loadGallery, bookings: loadBookings, dates: loadDates })[name]?.();
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
const eventForm   = document.getElementById('eventForm');
const eventsBody  = document.getElementById('eventsBody');
const eventStatus = document.getElementById('eventStatus');

document.getElementById('addEventBtn').addEventListener('click', () => openEventForm());
document.getElementById('cancelEventBtn').addEventListener('click', () => eventForm.classList.add('hidden'));
document.getElementById('saveEventBtn').addEventListener('click', saveEvent);

function openEventForm(event = null) {
  document.getElementById('eventFormTitle').textContent = event ? 'Edit Event' : 'New Event';
  document.getElementById('eventId').value        = event?.id ?? '';
  document.getElementById('evTitle').value        = event?.title ?? '';
  document.getElementById('evDate').value         = event?.date ?? '';
  document.getElementById('evStart').value        = event?.time_start ?? '';
  document.getElementById('evEnd').value          = event?.time_end ?? '';
  document.getElementById('evVenue').value        = event?.venue ?? '';
  document.getElementById('evDesc').value         = event?.description ?? '';
  document.getElementById('evPublished').checked  = event?.is_published ?? true;
  eventStatus.textContent = '';
  eventForm.classList.remove('hidden');
  eventForm.scrollIntoView({ behavior: 'smooth' });
}

async function saveEvent() {
  const id = document.getElementById('eventId').value;
  const payload = {
    ...(id ? { id } : {}),
    title:        document.getElementById('evTitle').value.trim(),
    date:         document.getElementById('evDate').value,
    time_start:   document.getElementById('evStart').value || null,
    time_end:     document.getElementById('evEnd').value || null,
    venue:        document.getElementById('evVenue').value.trim() || null,
    description:  document.getElementById('evDesc').value.trim() || null,
    is_published: document.getElementById('evPublished').checked,
  };
  if (!payload.title || !payload.date) {
    showStatus(eventStatus, 'Title and date are required.', 'error'); return;
  }
  try {
    showStatus(eventStatus, 'Saving…', '');
    await upsertEvent(payload);
    showStatus(eventStatus, 'Saved.', 'success');
    eventForm.classList.add('hidden');
    loadEvents();
  } catch (e) { showStatus(eventStatus, e.message, 'error'); }
}

async function loadEvents() {
  eventsBody.innerHTML = '<tr><td colspan="5" class="loading">Loading…</td></tr>';
  try {
    const events = await getAllEvents();
    if (!events.length) { eventsBody.innerHTML = '<tr><td colspan="5" class="loading">No events yet.</td></tr>'; return; }
    eventsBody.innerHTML = events.map(ev => `
      <tr>
        <td>${formatDate(ev.date)}</td>
        <td><strong>${ev.title}</strong>${ev.time_start ? `<br><small>${ev.time_start}${ev.time_end ? ' – ' + ev.time_end : ''}</small>` : ''}</td>
        <td>${ev.venue ?? '—'}</td>
        <td><span class="badge ${ev.is_published ? 'badge-published' : 'badge-draft'}">${ev.is_published ? 'Published' : 'Draft'}</span></td>
        <td class="actions-cell">
          <button class="btn-sm btn-edit" data-id="${ev.id}" data-action="edit-event">Edit</button>
          <button class="btn-sm btn-delete" data-id="${ev.id}" data-action="delete-event">Delete</button>
        </td>
      </tr>`).join('');
  } catch (e) { eventsBody.innerHTML = `<tr><td colspan="5" class="loading">${e.message}</td></tr>`; }
}

eventsBody.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'edit-event') {
    const events = await getAllEvents();
    openEventForm(events.find(ev => ev.id === id));
  } else if (action === 'delete-event') {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(id);
    loadEvents();
  }
});

// ── GALLERY ───────────────────────────────────────────────────────────────────
const galleryGrid  = document.getElementById('galleryAdminGrid');
const uploadStatus = document.getElementById('uploadStatus');
let galleryPhotos  = [];

document.getElementById('photoUpload').addEventListener('change', async e => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  showUploadStatus(`Uploading ${files.length} photo(s)…`, 'progress');
  for (const file of files) {
    const caption = prompt(`Caption for "${file.name}" (optional):`) ?? '';
    try { await uploadPhoto(file, caption); }
    catch (err) { showUploadStatus(`Error: ${err.message}`, 'error'); return; }
  }
  showUploadStatus(`Uploaded ${files.length} photo(s).`, 'success');
  e.target.value = '';
  loadGallery();
});

async function loadGallery() {
  galleryGrid.innerHTML = '<div class="loading">Loading…</div>';
  try {
    galleryPhotos = await getPhotos();
    if (!galleryPhotos.length) { galleryGrid.innerHTML = '<div class="loading">No photos yet. Upload some above.</div>'; return; }
    renderGallery();
  } catch (e) { galleryGrid.innerHTML = `<div class="loading">${e.message}</div>`; }
}

function renderGallery() {
  galleryGrid.innerHTML = galleryPhotos.map((p, i) => `
    <div class="gallery-admin-item" draggable="true" data-id="${p.id}" data-index="${i}">
      <img src="${p.url}" alt="${p.caption ?? ''}" loading="lazy" />
      <div class="gallery-item-footer">
        <span class="gallery-item-caption">${p.caption ?? 'No caption'}</span>
        <div style="display:flex;gap:0.3rem">
          <button class="btn-sm btn-edit" data-action="edit-caption" data-id="${p.id}" data-path="${p.storage_path}" title="Edit caption">✏️</button>
          <button class="btn-sm btn-delete" data-action="delete-photo" data-id="${p.id}" data-path="${p.storage_path}" title="Delete">✕</button>
        </div>
      </div>
    </div>`).join('');

  setupDragReorder();
}

galleryGrid.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id, path } = btn.dataset;

  if (action === 'delete-photo') {
    if (!confirm('Delete this photo?')) return;
    await deletePhoto({ id, storage_path: path });
    galleryPhotos = galleryPhotos.filter(p => p.id !== id);
    renderGallery();
  } else if (action === 'edit-caption') {
    const photo = galleryPhotos.find(p => p.id === id);
    const newCaption = prompt('Edit caption:', photo?.caption ?? '');
    if (newCaption === null) return;
    try {
      await sb.from('photos').update({ caption: newCaption }).eq('id', id);
      galleryPhotos = galleryPhotos.map(p => p.id === id ? { ...p, caption: newCaption } : p);
      renderGallery();
    } catch (err) { alert('Failed to update caption: ' + err.message); }
  }
});

// ── Drag-to-reorder ───────────────────────────────────────────────────────────
function setupDragReorder() {
  const items = galleryGrid.querySelectorAll('.gallery-admin-item');
  let dragSrc = null;

  items.forEach(item => {
    item.addEventListener('dragstart', e => {
      dragSrc = item;
      e.dataTransfer.effectAllowed = 'move';
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      galleryGrid.querySelectorAll('.gallery-admin-item').forEach(i => i.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (item !== dragSrc) {
        galleryGrid.querySelectorAll('.gallery-admin-item').forEach(i => i.classList.remove('drag-over'));
        item.classList.add('drag-over');
      }
    });
    item.addEventListener('drop', async e => {
      e.preventDefault();
      if (!dragSrc || dragSrc === item) return;
      const srcId  = dragSrc.dataset.id;
      const destId = item.dataset.id;
      const srcIdx  = galleryPhotos.findIndex(p => p.id === srcId);
      const destIdx = galleryPhotos.findIndex(p => p.id === destId);
      const reordered = [...galleryPhotos];
      const [moved] = reordered.splice(srcIdx, 1);
      reordered.splice(destIdx, 0, moved);
      galleryPhotos = reordered;
      renderGallery();
      // Persist new order
      await Promise.all(reordered.map((p, i) =>
        sb.from('photos').update({ display_order: i }).eq('id', p.id)
      ));
    });
  });
}

function showUploadStatus(msg, type) {
  uploadStatus.textContent = msg;
  uploadStatus.className = `upload-status upload-${type}`;
}

// ── BOOKINGS ──────────────────────────────────────────────────────────────────
const bookingsBody  = document.getElementById('bookingsBody');
const bookingFilter = document.getElementById('bookingFilter');
let allBookings = [];

bookingFilter.addEventListener('change', renderBookings);

async function loadBookings() {
  bookingsBody.innerHTML = '<tr><td colspan="6" class="loading">Loading…</td></tr>';
  try {
    allBookings = await getAllBookings();
    renderBookings();
  } catch (e) { bookingsBody.innerHTML = `<tr><td colspan="6" class="loading">${e.message}</td></tr>`; }
}

function renderBookings() {
  const filter = bookingFilter.value;
  const list = filter === 'all' ? allBookings : allBookings.filter(b => b.status === filter);
  if (!list.length) { bookingsBody.innerHTML = '<tr><td colspan="6" class="loading">No bookings found.</td></tr>'; return; }
  bookingsBody.innerHTML = list.map(b => `
    <tr>
      <td>${formatDate(b.event_date)}<br><small style="color:var(--text-sub)">${formatDateShort(b.created_at)}</small></td>
      <td><strong>${b.name}</strong></td>
      <td>${b.email}<br>${b.phone ?? ''}</td>
      <td>${b.event_type ?? '—'}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td class="actions-cell">
        ${b.status !== 'confirmed' ? `<button class="btn-sm btn-confirm" data-action="booking-status" data-id="${b.id}" data-status="confirmed">Confirm</button>` : ''}
        ${b.status !== 'declined'  ? `<button class="btn-sm btn-decline" data-action="booking-status" data-id="${b.id}" data-status="declined">Decline</button>`   : ''}
        ${b.status !== 'pending'   ? `<button class="btn-sm btn-pending" data-action="booking-status" data-id="${b.id}" data-status="pending">Pending</button>`     : ''}
        ${b.message ? `<button class="btn-sm btn-edit" data-action="view-note" data-id="${b.id}">Note</button>` : ''}
      </td>
    </tr>`).join('');
}

bookingsBody.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id, status } = btn.dataset;

  if (action === 'booking-status') {
    await updateBookingStatus(id, status);
    allBookings = allBookings.map(b => b.id === id ? { ...b, status } : b);
    renderBookings();
  } else if (action === 'view-note') {
    const booking = allBookings.find(b => b.id === id);
    if (!booking) return;
    showBookingModal(booking);
  }
});

// ── Booking detail modal ──────────────────────────────────────────────────────
function showBookingModal(b) {
  let modal = document.getElementById('bookingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bookingModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h3 id="modalTitle">Booking Details</h3>
          <button class="modal-close" id="modalClose">✕</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('modalClose').addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  }

  document.getElementById('modalBody').innerHTML = `
    <dl class="booking-detail">
      <dt>Name</dt><dd>${b.name}</dd>
      <dt>Email</dt><dd>${b.email}</dd>
      <dt>Phone</dt><dd>${b.phone ?? '—'}</dd>
      <dt>Date Requested</dt><dd>${formatDate(b.event_date)}</dd>
      <dt>Event Type</dt><dd>${b.event_type ?? '—'}</dd>
      <dt>Status</dt><dd><span class="badge badge-${b.status}">${b.status}</span></dd>
      <dt>Submitted</dt><dd>${formatDateShort(b.created_at)}</dd>
      <dt>Message</dt><dd style="white-space:pre-wrap">${b.message ?? '—'}</dd>
    </dl>`;
  modal.classList.remove('hidden');
}

// ── AVAILABLE DATES ───────────────────────────────────────────────────────────
const datesBody  = document.getElementById('datesBody');
const dateStatus = document.getElementById('dateStatus');

document.getElementById('saveDateBtn').addEventListener('click', async () => {
  const date  = document.getElementById('newDate').value;
  const avail = document.getElementById('dateAvail').value === 'true';
  const notes = document.getElementById('dateNotes').value.trim();
  if (!date) { showStatus(dateStatus, 'Please select a date.', 'error'); return; }
  try {
    showStatus(dateStatus, 'Saving…', '');
    await setDateAvailability(date, avail, notes);
    showStatus(dateStatus, 'Date saved.', 'success');
    document.getElementById('newDate').value   = '';
    document.getElementById('dateNotes').value = '';
    loadDates();
  } catch (e) { showStatus(dateStatus, e.message, 'error'); }
});

async function loadDates() {
  datesBody.innerHTML = '<tr><td colspan="4" class="loading">Loading…</td></tr>';
  try {
    const dates = await getAllAvailableDates();
    if (!dates.length) { datesBody.innerHTML = '<tr><td colspan="4" class="loading">No dates set yet.</td></tr>'; return; }
    datesBody.innerHTML = dates.map(d => `
      <tr>
        <td>${formatDate(d.date)}</td>
        <td><span class="badge ${d.is_available ? 'badge-available' : 'badge-blocked'}">${d.is_available ? 'Available' : 'Blocked'}</span></td>
        <td>${d.notes ?? '—'}</td>
        <td><button class="btn-sm btn-delete" data-action="remove-date" data-id="${d.id}">Remove</button></td>
      </tr>`).join('');
  } catch (e) { datesBody.innerHTML = `<tr><td colspan="4" class="loading">${e.message}</td></tr>`; }
}

datesBody.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action="remove-date"]');
  if (!btn) return;
  if (!confirm('Remove this date entry?')) return;
  await removeDateEntry(btn.dataset.id);
  loadDates();
});

// ── Mobile sidebar toggle ─────────────────────────────────────────────────────
const sidebarToggle = document.createElement('button');
sidebarToggle.className = 'sidebar-toggle';
sidebarToggle.innerHTML = '☰';
sidebarToggle.setAttribute('aria-label', 'Toggle sidebar');
dashboard.querySelector('.main-content').prepend(sidebarToggle);

sidebarToggle.addEventListener('click', () => {
  dashboard.querySelector('.sidebar').classList.toggle('sidebar-open');
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function showStatus(el, msg, type) {
  el.textContent = msg;
  el.className = `form-status${type ? ' ' + type : ''}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(isoStr) {
  return new Date(isoStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}
