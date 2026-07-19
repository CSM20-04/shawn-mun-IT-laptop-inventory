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
  if (initialized) { renderLaptops(); renderStaff(); return; }
  initialized = true;
  populateDepartments(); renderLaptops(); renderStaff();
  ['input', 'change'].forEach((event) => { $('#laptopSearch').addEventListener(event, renderLaptops); $('#brandFilter').addEventListener(event, renderLaptops); $('#availabilityFilter').addEventListener(event, renderLaptops); $('#budgetFilter').addEventListener(event, renderLaptops); $('#staffSearch').addEventListener(event, renderStaff); $('#departmentFilter').addEventListener(event, renderStaff); $('#incompleteFilter').addEventListener(event, renderStaff); });
  $('#clearFilters').addEventListener('click', () => { $('#laptopSearch').value = ''; $('#brandFilter').value = 'all'; $('#availabilityFilter').value = 'all'; $('#budgetFilter').value = 'all'; renderLaptops(); });
  $('#staffList').addEventListener('change', (event) => { if (!event.target.matches('.staff-check')) return; state.checklist[event.target.dataset.staff] = event.target.checked ? [true, true, true, true] : [false, false, false, false]; saveChecklist(); renderStaff(); });
  $('#laptopRows').addEventListener('click', (event) => { const button = event.target.closest('[data-laptop]'); if (!button) return; const laptop = laptops[Number(button.dataset.laptop)]; alert(`${laptop.model} selected. Choose a ready staff member from the checklist to complete the assignment.`); });
}

function enterApp() { $('#loginScreen').hidden = true; $('#app').hidden = false; initApp(); }
$('#loginForm').addEventListener('submit', (event) => { event.preventDefault(); const valid = $('#email').value.trim().toLowerCase() === 'it@orbit.local' && $('#password').value === 'password'; $('#loginError').hidden = valid; if (valid) { sessionStorage.setItem('orbitAuthenticated', 'true'); enterApp(); } });
$('#signOut').addEventListener('click', () => { sessionStorage.removeItem('orbitAuthenticated'); $('#app').hidden = true; $('#loginScreen').hidden = false; $('#password').focus(); });
if (sessionStorage.getItem('orbitAuthenticated') === 'true') enterApp();
