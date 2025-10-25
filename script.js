// script.js - enhanced interactions

// ====== INIT ======
// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ====== MOBILE MENU ======
function toggleMenu() {
  document.getElementById('navMenu').classList.toggle('show');
}

// ====== FILTERING & SEARCH ======
function applyCategory(e) {
  const cat = e.currentTarget.dataset.cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  e.currentTarget.classList.add('active');
  filterGrid(cat, document.getElementById('searchInput').value.trim().toLowerCase());
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const active = document.querySelector('.chip.active')?.dataset.cat || 'all';
  filterGrid(active, q);
}

function filterGrid(category, query) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const cats = (card.dataset.categories || '').toLowerCase();
    const desc = (card.querySelector('.prod-desc')?.textContent || '').toLowerCase();

    const matchesCat = category === 'all' || cats.split(',').includes(category);
    const matchesQuery = query === '' || name.includes(query) || desc.includes(query);

    // Smooth animation using flex + transition
    if (matchesCat && matchesQuery) {
      card.style.display = 'flex';
      setTimeout(() => card.style.opacity = '1', 50);
    } else {
      card.style.opacity = '0';
      setTimeout(() => card.style.display = 'none', 200);
    }
  });
}

// ====== PRODUCT MODAL ======
function openProductModal(btn) {
  const card = btn.closest('.product-card');
  if (!card) return;

  const images = JSON.parse(card.dataset.images || '[]');
  const title = card.dataset.name || '';
  const price = card.dataset.price || '';
  const stock = card.dataset.stock || '';
  const dims = card.dataset.dimensions || '';
  const specs = card.dataset.specs || '';
  const shortDesc = card.querySelector('.prod-desc')?.textContent || '';

  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalStock').textContent = stock;
  document.getElementById('modalDimensions').textContent = dims;
  document.getElementById('modalSpecs').textContent = specs;
  document.getElementById('modalShortDesc').textContent = shortDesc;

  const mainImg = document.getElementById('modalMainImg');
  const thumbs = document.getElementById('modalThumbs');
  thumbs.innerHTML = '';

  if (images.length) {
    mainImg.src = images[0];
    images.forEach((src, idx) => {
      const t = document.createElement('img');
      t.src = src;
      t.alt = title + ' ' + (idx + 1);
      t.className = idx === 0 ? 'active' : '';
      t.onclick = () => {
        document.querySelectorAll('#modalThumbs img').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        mainImg.src = src;
      };
      thumbs.appendChild(t);
    });
  } else {
    mainImg.src = card.querySelector('img')?.src || '';
  }

  // Update modal WhatsApp button dynamically
  const waBtn = document.getElementById('modalWhatsappBtn');
  waBtn.onclick = () => {
    openWhatsAppForProduct(title, price);
  };

  // Show modal
  const modal = document.getElementById('productModal');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

// Close modal
function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

// Close modal on outside click
window.onclick = function (evt) {
  const modal = document.getElementById('productModal');
  if (modal && evt.target === modal) closeProductModal();
};

// ====== QUICK ENQUIRE & WHATSAPP ======
function openQuickEnquire(e, el) {
  let card = el.closest ? el.closest('.product-card') : null;
  if (!card) {
    // called from modal
    const title = document.getElementById('modalTitle')?.textContent || '';
    const price = document.getElementById('modalPrice')?.textContent || '';
    openWhatsAppForProduct(title, price);
    return;
  }
  const title = card.dataset.name || '';
  const price = card.dataset.price || '';
  openWhatsAppForProduct(title, price);
}

function openWhatsAppForProduct(productName, price) {
  const phone = '919876543210';
  const msg = `Hello Konark Furniture, I’m interested in the product: "${productName}". Price: ${price}. Please share more details and availability.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ====== SOCIAL SHARING PLACEHOLDERS ======
function shareFB() { alert('Share to Facebook — implement later'); }
function shareInsta() { alert('Share to Instagram — implement later'); }
function shareLink() { navigator.clipboard?.writeText(location.href).then(() => alert('Link copied')); }

// ====== CONTACT FORM ======
function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  if (!name || !phone) { alert('Please add name and phone'); return; }
  alert('Thanks! We received your message. We will contact you soon.');
  form.reset();
}

// ====== FLOATING WHATSAPP BUTTON ======
// Updates dynamically based on filtered product or latest viewed
const whatsappFloat = document.getElementById('whatsappFloat');
function updateFloatingWhatsapp(productName, price) {
  const phone = '919876543210';
  const msg = productName ? `Hello Konark Furniture, I’m interested in the product: "${productName}". Price: ${price}.` : 'Hello Konark Furniture, I need assistance.';
  whatsappFloat.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
