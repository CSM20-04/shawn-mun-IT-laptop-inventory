const laptops = [
  { brand: 'Lenovo', model: 'ThinkPad E14 Gen 6', config: 'Core Ultra 5 · 16 GB · 512 GB', price: 1499, availability: 'Available', stock: 6 },
  { brand: 'Dell', model: 'Dell Pro 14', config: 'Core Ultra 5 · 16 GB · 512 GB', price: 1569, availability: 'Available', stock: 4 },
  { brand: 'HP', model: 'EliteBook 840 G11', config: 'Core Ultra 5 · 16 GB · 512 GB', price: 1619, availability: 'Limited', stock: 2 },
  { brand: 'Lenovo', model: 'ThinkPad T14 Gen 5', config: 'Ryzen 7 Pro · 32 GB · 1 TB', price: 1820, availability: 'Available', stock: 3 },
  { brand: 'Dell', model: 'Latitude 5450', config: 'Core Ultra 7 · 16 GB · 512 GB', price: 1749, availability: 'Available', stock: 2 },
  { brand: 'HP', model: 'ProBook 440 G11', config: 'Core Ultra 5 · 16 GB · 512 GB', price: 1399, availability: 'Available', stock: 1 },
  { brand: 'Lenovo', model: 'ThinkBook 14 Gen 7', config: 'Core Ultra 5 · 16 GB · 1 TB', price: 1459, availability: 'Limited', stock: 0 },
  { brand: 'Dell', model: 'Precision 3591', config: 'Core Ultra 7 · 32 GB · 1 TB', price: 2299, availability: 'Out of stock', stock: 0 }
];

const logs = [
  { time: '10:24', type: 'Security', severity: 'Critical', source: 'Microsoft Entra ID', event: 'Repeated sign-in failure detected', detail: 'Account: olivia.tan@orbit.local · Location: Singapore' },
  { time: '10:12', type: 'Application', severity: 'Warning', source: 'Orbit Inventory', event: 'Supplier catalogue refresh delayed', detail: 'Dell connector · Retry scheduled in 15 minutes' },
  { time: '09:58', type: 'System', severity: 'Information', source: 'LAP-SG-042', event: 'Windows update installed successfully', detail: 'KB5039212 · Restart completed' },
  { time: '09:46', type: 'Security', severity: 'Warning', source: 'Endpoint protection', event: 'Unusual PowerShell command blocked', detail: 'Device: LAP-SG-017 · User: haris.lee@orbit.local' },
  { time: '09:31', type: 'Application', severity: 'Information', source: 'Asset service', event: 'Device assignment updated', detail: 'ORB-0241 assigned to Mei Lin' },
  { time: '09:14', type: 'System', severity: 'Warning', source: 'LAP-SG-021', event: 'Disk capacity below 15%', detail: 'Free space: 42 GB of 512 GB' },
  { time: '08:52', type: 'Security', severity: 'Information', source: 'Microsoft Entra ID', event: 'Multi-factor sign-in approved', detail: 'Account: daniel.ng@orbit.local' }
];

const firstNames = ['Aisha','Ben','Cheryl','Daniel','Elena','Farid','Grace','Hannah','Isaac','Jasmine','Kai','Lina','Marcus','Nadia','Owen','Priya','Qian','Ravi','Sarah','Tom','Uma','Victor','Wei','Xavier','Yasmin','Zack','Amir','Bella','Clara','Darren'];
const lastNames = ['Tan','Lim','Lee','Ng','Koh','Goh','Wong','Chua','Ong','Yap','Low','Chan'];
const departments = ['Finance','Operations','Sales','Engineering','Human resources','Customer success'];
const staff = Array.from({ length: 120 }, (_, index) => ({
  id: `ORB-${String(index + 1).padStart(3, '0')}`,
  name: `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`,
  department: departments[index % departments.length],
  email: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[Math.floor(index / firstNames.length) % lastNames.length].toLowerCase()}@orbit.local`
}));

const state = { checklist: JSON.parse(localStorage.getItem('orbitChecklist') || '{}') };
const $ = (selector) => document.querySelector(selector);
const vendorClass = (brand) => brand.toLowerCase();

function renderLaptops() {
  const term = $('#laptopSearch').value.trim().toLowerCase();
  const brand = $('#brandFilter').value;
  const availability = $('#availabilityFilter').value;
  const budget = $('#budgetFilter').value;
  const matches = laptops.filter((laptop) => {
    const searchable = `${laptop.brand} ${laptop.model} ${laptop.config}`.toLowerCase();
    return (!term || searchable.includes(term)) && (brand === 'all' || laptop.brand === brand) && (availability === 'all' || laptop.availability === availability) && (budget === 'all' || laptop.price <= Number(budget));
  });
  $('#resultCount').textContent = `${matches.length} laptop${matches.length === 1 ? '' : 's'} found`;
  $('#laptopRows').innerHTML = matches.length ? matches.map((laptop, index) => `<tr><td><div class="model"><span class="vendor ${vendorClass(laptop.brand)}">${laptop.brand === 'HP' ? 'HP' : laptop.brand[0]}</span><span><strong>${laptop.model}</strong><small>${laptop.brand} · Supplier catalogue</small></span></div></td><td>${laptop.config}</td><td><strong>S$${laptop.price.toLocaleString('en-SG')}</strong><small>Verified today</small></td><td><span class="status ${laptop.availability.toLowerCase().replaceAll(' ', '-')}">${laptop.availability}</span></td><td>${laptop.stock} available</td><td><button class="assign-button" data-laptop="${index}" ${laptop.availability === 'Out of stock' ? 'disabled' : ''}>Assign</button></td></tr>`).join('') : '<tr><td class="empty-state" colspan="6">No laptops match these search filters.</td></tr>';
}

function renderLogs() {
  const term = $('#logSearch').value.trim().toLowerCase(); const type = $('#logTypeFilter').value; const severity = $('#logSeverityFilter').value;
  const matches = logs.filter((log) => (`${log.source} ${log.event} ${log.detail}`.toLowerCase().includes(term)) && (type === 'all' || log.type === type) && (severity === 'all' || log.severity === severity));
  $('#logResultCount').textContent = `${matches.length} event${matches.length === 1 ? '' : 's'} found`; $('#criticalCount').textContent = logs.filter((log) => log.severity === 'Critical').length; $('#securityCount').textContent = logs.filter((log) => log.type === 'Security').length;
  $('#logRows').innerHTML = matches.length ? matches.map((log, index) => `<tr><td>${log.time}<small>Today</small></td><td><span class="log-type ${log.type.toLowerCase()}">${log.type}</span></td><td><span class="severity ${log.severity.toLowerCase()}">${log.severity}</span></td><td>${log.source}</td><td><strong>${log.event}</strong><small>${log.detail}</small></td><td><button class="assign-button" data-log="${index}">Review</button></td></tr>`).join('') : '<tr><td class="empty-state" colspan="6">No log events match these filters.</td></tr>';
}

function staffProgress(id) { return state.checklist[id] || [false, false, false, false]; }
function isComplete(id) { return staffProgress(id).every(Boolean); }
function renderStaff() {
  const term = $('#staffSearch').value.trim().toLowerCase();
  const department = $('#departmentFilter').value;
  const onlyIncomplete = $('#incompleteFilter').checked;
  const matches = staff.filter((person) => (`${person.name} ${person.department} ${person.id}`.toLowerCase().includes(term)) && (department === 'all' || person.department === department) && (!onlyIncomplete || !isComplete(person.id)));
  $('#staffList').innerHTML = matches.length ? matches.map((person) => {
    const progress = staffProgress(person.id); const completed = progress.filter(Boolean).length;
    return `<div class="staff-row"><input class="staff-check" type="checkbox" data-staff="${person.id}" ${isComplete(person.id) ? 'checked' : ''} aria-label="Mark ${person.name} complete" /><div><span class="staff-name">${person.name}</span><span class="staff-detail">${person.id} · ${person.email}</span></div><div class="staff-department">${person.department}</div><div class="staff-status ${isComplete(person.id) ? 'complete' : ''}">${isComplete(person.id) ? 'Ready to assign' : `${completed}/4 checks complete`}</div><div class="checklist-mini" aria-label="${completed} of 4 checks complete"><i class="${progress[0] ? 'done' : ''}"></i><i class="${progress[1] ? 'done' : ''}"></i><i class="${progress[2] ? 'done' : ''}"></i><i class="${progress[3] ? 'done' : ''}"></i></div></div>`;
  }).join('') : '<div class="empty-state">No staff members match these filters.</div>';
  updateProgress();
}

function updateProgress() {
  const total = staff.filter((person) => isComplete(person.id)).length;
  $('#checkedCount').textContent = total;
  $('#staffCount').textContent = staff.length;
  $('#summaryComplete').textContent = `${Math.round(total / staff.length * 100)}%`;
}

function saveChecklist() { localStorage.setItem('orbitChecklist', JSON.stringify(state.checklist)); }
function populateDepartments() { departments.forEach((department) => { const option = document.createElement('option'); option.value = department; option.textContent = department; $('#departmentFilter').append(option); }); }
let initialized = false;
function initApp() {
  if (initialized) { renderLaptops(); renderStaff(); renderLogs(); return; }
  initialized = true;
  populateDepartments(); renderLaptops(); renderStaff(); renderLogs();
  ['input', 'change'].forEach((event) => { $('#laptopSearch').addEventListener(event, renderLaptops); $('#brandFilter').addEventListener(event, renderLaptops); $('#availabilityFilter').addEventListener(event, renderLaptops); $('#budgetFilter').addEventListener(event, renderLaptops); $('#staffSearch').addEventListener(event, renderStaff); $('#departmentFilter').addEventListener(event, renderStaff); $('#incompleteFilter').addEventListener(event, renderStaff); });
  $('#clearFilters').addEventListener('click', () => { $('#laptopSearch').value = ''; $('#brandFilter').value = 'all'; $('#availabilityFilter').value = 'all'; $('#budgetFilter').value = 'all'; renderLaptops(); });
  ['input', 'change'].forEach((event) => { $('#logSearch').addEventListener(event, renderLogs); $('#logTypeFilter').addEventListener(event, renderLogs); $('#logSeverityFilter').addEventListener(event, renderLogs); });
  $('#staffList').addEventListener('change', (event) => { if (!event.target.matches('.staff-check')) return; state.checklist[event.target.dataset.staff] = event.target.checked ? [true, true, true, true] : [false, false, false, false]; saveChecklist(); renderStaff(); });
  $('#laptopRows').addEventListener('click', (event) => { const button = event.target.closest('[data-laptop]'); if (!button) return; const laptop = laptops[Number(button.dataset.laptop)]; alert(`${laptop.model} selected. Choose a ready staff member from the checklist to complete the assignment.`); });
  $('#logRows').addEventListener('click', (event) => { const button = event.target.closest('[data-log]'); if (!button) return; const log = logs[Number(button.dataset.log)]; alert(`Reviewing: ${log.event}\n\n${log.detail}`); });
}

function enterApp() { $('#loginScreen').hidden = true; $('#app').hidden = false; initApp(); }
$('#loginForm').addEventListener('submit', (event) => { event.preventDefault(); const valid = $('#email').value.trim().toLowerCase() === 'it@orbit.local' && $('#password').value === 'password'; $('#loginError').hidden = valid; if (valid) { sessionStorage.setItem('orbitAuthenticated', 'true'); enterApp(); } });
$('#signOut').addEventListener('click', () => { sessionStorage.removeItem('orbitAuthenticated'); $('#app').hidden = true; $('#loginScreen').hidden = false; $('#password').focus(); });
if (sessionStorage.getItem('orbitAuthenticated') === 'true') enterApp();
