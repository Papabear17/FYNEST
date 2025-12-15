// FYNEST CORE LOGIC

// State
let products = [];
let categories = [];
let activeCategory = 'all';
let wishlist = JSON.parse(localStorage.getItem('fynest_wishlist')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const filterContainer = document.getElementById('categoryFilters');
const searchInput = document.getElementById('searchInput');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await Promise.all([fetchProducts(), fetchCategories()]);

    renderFilters();
    renderProducts(products);
    setupSearch();
    initThreeJS(); // Keep the 3D logic
  } catch (error) {
    console.error("Initialization failed:", error);
    productGrid.innerHTML = '<p style="text-align:center;">Failed to load data. Please try again.</p>';
  }
});

// --- DATA FETCHING ---
async function fetchProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Network response was not ok');
    products = await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback or empty
  }
}

async function fetchCategories() {
  try {
    const response = await fetch('data/categories.json');
    categories = await response.json();
    // Ensure 'all' is there if not in JSON
    if (!categories.find(c => c.id === 'all')) {
      categories.unshift({ id: 'all', name: 'All Collection' });
    }
  } catch (error) {
    // Fallback default
    categories = [
      { id: 'all', name: 'All Collection' },
      { id: 't-shirts', name: 'T-Shirts' },
      { id: 'outerwear', name: 'Outerwear' }
    ];
  }
}

// --- RENDERING ---
function renderProducts(data) {
  productGrid.innerHTML = '';

  if (data.length === 0) {
    productGrid.innerHTML = '<p class="loading-spinner">No products found matching your criteria.</p>';
    return;
  }

  data.forEach(product => {
    const isWishlisted = wishlist.includes(product.id);
    const isLowStock = product.stock < 5;

    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
            <div class="card-badge-container">
                ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
                ${isLowStock ? '<span class="badge badge-low-stock">Low Stock</span>' : ''}
            </div>
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id}, this)">
                <svg viewBox="0 0 24 24">
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
            <div class="product-image">
                <img src="${product.image}" loading="lazy" alt="${product.name}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <span class="product-price">IDR ${product.price.toLocaleString('id-ID')}</span>
            </div>
        `;
    productGrid.appendChild(card);
  });
}

function renderFilters() {
  filterContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat.id === activeCategory ? 'filter-active' : ''}`;
    btn.textContent = cat.name;
    btn.onclick = () => filterByCategory(cat.id);
    filterContainer.appendChild(btn);
  });
}

// --- LOGIC ---
function filterByCategory(categoryId) {
  activeCategory = categoryId;

  // Update visual buttons
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(b => {
    b.classList.toggle('filter-active', b.textContent === categories.find(c => c.id === categoryId).name);
  });

  // Filter logic
  let filtered = products;
  if (categoryId !== 'all') {
    filtered = products.filter(p => p.category.toLowerCase() === categoryId.toLowerCase());
  }

  // Also respect search if any
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  renderProducts(filtered);
}

function setupSearch() {
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const term = e.target.value.toLowerCase();
      const filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      });
      renderProducts(filtered);
    }, 300); // 300ms debounce
  });
}

window.toggleWishlist = function (id, btnElement) {
  const index = wishlist.indexOf(id);
  if (index === -1) {
    wishlist.push(id);
    btnElement.classList.add('active');
  } else {
    wishlist.splice(index, 1);
    btnElement.classList.remove('active');
  }
  localStorage.setItem('fynest_wishlist', JSON.stringify(wishlist));
};


// --- THREE.JS MANNEQUIN ANIMATION (Retained) ---
function initThreeJS() {
  const container = document.getElementById('logo3DContainer');
  if (!container) return;

  // Basic Three.js boilerplate to keep the section functional visually
  // In a real app, this would load a 3D model. We'll make a rotating cube for now as placeholder or 
  // try to render a simple "F" text if possible, or just a geometric shape.

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mannequinCanvas'), alpha: true, antialias: true });

  renderer.setSize(container.clientWidth, container.clientHeight);

  // Create a metallic aesthetic shape
  const geometry = new THREE.IcosahedronGeometry(1.5, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xe4b98f,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: true
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(2, 2, 5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  camera.position.z = 4;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
