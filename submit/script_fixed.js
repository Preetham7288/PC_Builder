// Fixed and cleaned script for PC Builder Pro (dark neon)
// Note: initializeTooltips moved to top-level to avoid scope issues.

const components = {
  processor: [
    { id: 'i9-13900k', name: 'Intel Core i9-13900K', price: 58990, image: 'https://source.unsplash.com/500x300/?cpu,processor', specs: '24 Cores / 32 Threads', socket: 'LGA1700' },
    { id: 'ryzen-9-7950x', name: 'AMD Ryzen 9 7950X', price: 65990, image: 'https://source.unsplash.com/500x300/?ryzen,processor', specs: '16 Cores / 32 Threads', socket: 'AM5' },
    { id: 'i7-13700k', name: 'Intel Core i7-13700K', price: 42990, image: 'https://source.unsplash.com/500x300/?intel,processor', specs: '16 Cores / 24 Threads', socket: 'LGA1700' }
  ],
  motherboard: [
    { id: 'z790-apex', name: 'ASUS ROG Maximus Z790 Apex', price: 65990, image: 'https://source.unsplash.com/500x300/?motherboard', specs: 'LGA1700 / DDR5', socket: 'LGA1700' },
    { id: 'x670e-hero', name: 'ASUS ROG Crosshair X670E Hero', price: 58990, image: 'https://source.unsplash.com/500x300/?motherboard,amd', specs: 'AM5 / DDR5', socket: 'AM5' },
    { id: 'b660-aorus', name: 'Gigabyte B660 AORUS Master', price: 24990, image: 'https://source.unsplash.com/500x300/?motherboard,intel', specs: 'LGA1700 / DDR4', socket: 'LGA1700' }
  ],
  gpu: [
    { id: 'rtx-4090', name: 'NVIDIA RTX 4090', price: 164990, image: 'https://source.unsplash.com/500x300/?gpu,graphics', specs: '24GB GDDR6X', power: 450 },
    { id: 'rx-7900xtx', name: 'AMD Radeon RX 7900 XTX', price: 109990, image: 'https://source.unsplash.com/500x300/?amd,gpu', specs: '24GB GDDR6', power: 355 }
  ],
  ram: [
    { id: 'trident-z5', name: 'G.Skill Trident Z5', price: 24990, image: 'https://source.unsplash.com/500x300/?ram,memory', specs: '32GB DDR5', type: 'DDR5', modules: 2 },
    { id: 'vengeance-ddr4', name: 'Corsair Vengeance DDR4', price: 12990, image: 'https://source.unsplash.com/500x300/?ram', specs: '32GB DDR4', type: 'DDR4', modules: 2 }
  ],
  storage: [
    { id: '980-pro', name: 'Samsung 980 Pro 1TB', price: 12990, image: 'https://source.unsplash.com/500x300/?ssd,storage', specs: '1TB NVMe', type: 'NVMe', capacity: 1000 }
  ],
  psu: [
    { id: 'rm1000x', name: 'Corsair RM1000x', price: 17990, image: 'https://source.unsplash.com/500x300/?psu,power', specs: '1000W 80+ Gold', wattage: 1000 }
  ],
  case: [
    { id: 'o11d-evo', name: 'Lian Li PC-O11 Dynamic EVO', price: 19990, image: 'https://source.unsplash.com/500x300/?pc-case,case', specs: 'Mid Tower' }
  ],
  cooling: [
    { id: 'kraken-z73', name: 'NZXT Kraken Z73', price: 27990, image: 'https://source.unsplash.com/500x300/?cooler,cooling', specs: '360mm AIO', type: 'Liquid' }
  ],
  peripherals: [
    { id: 'g-pro-x', name: 'Logitech G Pro X Superlight', price: 12990, image: 'https://source.unsplash.com/500x300/?mouse,peripheral', specs: 'Wireless Mouse', type: 'Mouse' }
  ]
};

let currentBuild = {
  processor: null, motherboard: null, gpu: null, ram: null,
  storage: [], psu: null, case: null, cooling: null, peripherals: []
};

// DOM refs
const componentContainers = document.querySelectorAll('.component-options');
const selectedComponentsEl = document.querySelector('.selected-components');
const totalAmountEl = document.querySelector('.total-amount');
const cartCountEl = document.querySelector('.cart-count');
const cartTotalEl = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const compatibilityMessagesEl = document.getElementById('compatibilityMessages');

// Utility
function formatPrice(price){ return '₹' + Number(price).toLocaleString('en-IN'); }

// Tooltip initializer (moved to top-level)
function initializeTooltips(){
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      // simple native tooltip fallback using title if present
      const tip = el.getAttribute('data-tooltip');
      if (tip) el.setAttribute('title', tip);
    });
  });
}

// Calculate totals
function calculateTotal(){
  let total = 0;
  ['processor','motherboard','gpu','ram','psu','case','cooling'].forEach(k=>{
    if (currentBuild[k]) total += (currentBuild[k].price || 0);
  });
  currentBuild.storage.forEach(s => total += s.price || 0);
  currentBuild.peripherals.forEach(p => total += p.price || 0);
  totalAmountEl.textContent = formatPrice(total);
  cartTotalEl.textContent = formatPrice(total);
  return total;
}

function updateCartCount(){
  let count = 0;
  ['processor','motherboard','gpu','ram','psu','case','cooling'].forEach(k=>{ if (currentBuild[k]) count++; });
  count += currentBuild.storage.length + currentBuild.peripherals.length;
  cartCountEl.textContent = count;
}

// Render component options
function renderComponentOptions(){
  componentContainers.forEach(container=>{
    const category = container.parentElement.getAttribute('data-category');
    const list = components[category] || [];
    container.innerHTML = '';
    list.forEach(comp=>{
      const isSelected = (currentBuild[category]?.id === comp.id) || (Array.isArray(currentBuild[category]) && currentBuild[category].some(i=>i.id===comp.id));
      const card = document.createElement('div');
      card.className = 'component-option' + (isSelected ? ' selected' : '');
      card.dataset.id = comp.id;
      card.dataset.category = category;
      card.innerHTML = `
        <img src="${comp.image}" alt="${comp.name}" loading="lazy">
        <h4>${comp.name}</h4>
        <div class="price">${formatPrice(comp.price)}</div>
        <div class="specs">${comp.specs || ''}</div>
        <button class="select-btn">${isSelected ? 'Selected' : 'Select'}</button>
      `;
      // attach handler to button only (prevents accidental clicks)
      const btn = card.querySelector('.select-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSelect(category, comp, card, btn);
      });
      container.appendChild(card);
    });
  });
}

// selection logic extracted
function handleSelect(category, component, cardEl, btn){
  if (category === 'storage' || category === 'peripherals'){
    const idx = currentBuild[category].findIndex(i=>i.id===component.id);
    if (idx >= 0){
      currentBuild[category].splice(idx,1);
      cardEl.classList.remove('selected'); btn.textContent = 'Select';
    } else {
      currentBuild[category].push(component);
      cardEl.classList.add('selected'); btn.textContent = 'Selected';
    }
  } else {
    if (currentBuild[category]?.id === component.id){
      currentBuild[category] = null;
      cardEl.classList.remove('selected'); btn.textContent = 'Select';
    } else {
      // clear previous selection in this container
      const parent = cardEl.parentElement;
      const prev = parent.querySelector('.component-option.selected');
      if (prev){
        prev.classList.remove('selected');
        const prevBtn = prev.querySelector('.select-btn'); if (prevBtn) prevBtn.textContent = 'Select';
      }
      currentBuild[category] = component;
      cardEl.classList.add('selected'); btn.textContent = 'Selected';
    }
  }
  updateSelectedComponents();
  calculateTotal();
  updateCartCount();
}

// Update the list of selected components
function updateSelectedComponents(){
  // preserve scroll
  const scroll = selectedComponentsEl.scrollTop;
  selectedComponentsEl.innerHTML = '';
  for (const [category, comp] of Object.entries(currentBuild)){
    if (Array.isArray(comp)){
      comp.forEach(item => addSelectedComponent(item, category));
    } else if (comp){
      addSelectedComponent(comp, category);
    }
  }
  calculateTotal();
  updateCartCount();
  const issues = checkCompatibility();
  displayCompatibilityIssues(issues);
  selectedComponentsEl.scrollTop = scroll;
}

function addSelectedComponent(component, category){
  const el = document.createElement('div');
  el.className = 'selected-component';
  el.dataset.id = component.id;
  el.innerHTML = `
    <div class="info">
      <h4>${component.name}</h4>
      <div class="price">${formatPrice(component.price)}</div>
    </div>
    <button class="remove-btn" title="Remove">&times;</button>
  `;
  const btn = el.querySelector('.remove-btn');
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    if (Array.isArray(currentBuild[category])){
      const idx = currentBuild[category].findIndex(i=>i.id===component.id);
      if (idx>=0) currentBuild[category].splice(idx,1);
    } else {
      currentBuild[category] = null;
    }
    renderComponentOptions();
    updateSelectedComponents();
  });
  selectedComponentsEl.appendChild(el);
}

// Compatibility checks (kept simple & safe)
function checkCompatibility(){
  const issues = [];
  if (!currentBuild.processor) issues.push({ type:'warning', message:'No processor selected.' });
  if (!currentBuild.motherboard) issues.push({ type:'warning', message:'No motherboard selected.' });
  if (!currentBuild.ram) issues.push({ type:'warning', message:'No RAM selected.' });
  if (!currentBuild.psu) issues.push({ type:'warning', message:'No PSU selected.' });
  if (!currentBuild.storage || currentBuild.storage.length===0) issues.push({ type:'warning', message:'No storage selected.' });

  if (currentBuild.processor && currentBuild.motherboard && currentBuild.processor.socket !== currentBuild.motherboard.socket){
    issues.push({ type:'error', message:`CPU (${currentBuild.processor.socket}) incompatible with motherboard (${currentBuild.motherboard.socket}).` });
  }

  if (issues.length===0) issues.push({ type:'success', message:'All selected components look compatible.' });
  return issues;
}

// Display compatibility messages
function displayCompatibilityIssues(issues){
  compatibilityMessagesEl.innerHTML = '';
  if (!issues || issues.length===0) return;
  issues.forEach(issue=>{
    const div = document.createElement('div');
    div.className = 'compatibility-' + (issue.type === 'error' ? 'error' : issue.type === 'warning' ? 'warning' : 'success');
    div.innerHTML = `<i class="fas fa-${issue.type === 'error' ? 'exclamation-triangle' : issue.type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> <span>${issue.message}</span>`;
    compatibilityMessagesEl.appendChild(div);
  });
}

// Notifications (simple)
function showNotification(msg, type='info', duration=3000){
  const n = document.createElement('div');
  n.className = 'notification ' + type; n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(()=> n.classList.add('show'), 20);
  setTimeout(()=> n.classList.remove('show'), duration);
  setTimeout(()=> n.remove(), duration + 350);
}

// Init app
function init(){
  renderComponentOptions();
  initializeTooltips();
  checkoutBtn.addEventListener('click', ()=>{
    const issues = checkCompatibility();
    displayCompatibilityIssues(issues);
    const hasError = issues.some(i=>i.type==='error');
    if (hasError){ showNotification('Fix compatibility errors before checkout','error',3500); return; }
    const total = calculateTotal();
    if (total<=0){ showNotification('Add components to checkout','warning',2500); return; }
    showNotification('Build compatible — demo checkout only','success',3000);
    setTimeout(()=> alert('Demo: total is ' + formatPrice(total)), 800);
  });

  // mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  mobileBtn.addEventListener('click', ()=> {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

// DOM ready
document.addEventListener('DOMContentLoaded', init);
