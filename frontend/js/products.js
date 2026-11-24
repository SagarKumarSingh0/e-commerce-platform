let currentPage = 1;

const getParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    category: document.getElementById('categoryFilter').value,
    sort: document.getElementById('sortFilter').value,
    minPrice: document.getElementById('minPrice').value,
    maxPrice: document.getElementById('maxPrice').value,
    page: currentPage,
    limit: 12
  };
};

const loadProducts = async () => {
  const grid = document.getElementById('productsGrid');
  const pagination = document.getElementById('pagination');
  grid.innerHTML = '<div class="loading">Loading...</div>';
  pagination.innerHTML = '';

  const p = getParams();
  const query = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => { if (v) query.append(k, v); });

  try {
    const data = await apiFetch('/products?' + query.toString());
    if (!data.products.length) {
      grid.innerHTML = '<div class="loading">No products found</div>';
      return;
    }
    grid.innerHTML = data.products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300?text=Product'">
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))}</div>
          <div class="product-price">₹${p.price.toFixed(2)}</div>
          <button class="btn btn-primary add-to-cart-btn" data-id="${p._id}">Add to Cart</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });

    // Pagination
    if (data.pages > 1) {
      let html = '';
      for (let i = 1; i <= data.pages; i++) {
        html += `<button class="btn ${i === data.page ? 'btn-primary' : 'btn-outline'}" data-page="${i}" style="margin:0 0.25rem">${i}</button>`;
      }
      pagination.innerHTML = html;
      pagination.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => {
          currentPage = Number(b.dataset.page);
          loadProducts();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
  } catch (err) {
    grid.innerHTML = `<div class="loading">Error: ${err.message}</div>`;
  }
};

const addToCart = async (productId) => {
  if (!getUser()) {
    window.location.href = '/pages/login.html';
    return;
  }
  try {
    await apiFetch('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    showToast('Added to cart!', 'success');
    updateNavbar();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('search')) document.getElementById('searchInput').value = params.get('search');
  
  ['categoryFilter', 'sortFilter', 'minPrice', 'maxPrice'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => { currentPage = 1; loadProducts(); });
  });
  loadProducts();
});