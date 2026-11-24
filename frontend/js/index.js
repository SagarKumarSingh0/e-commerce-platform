const loadFeatured = async () => {
  const container = document.getElementById('featuredProducts');
  if (!container) return;
  try {
    const data = await apiFetch('/products?limit=8&sort=rating');
    if (!data.products.length) {
      container.innerHTML = '<p class="loading">No products available</p>';
      return;
    }
    container.innerHTML = data.products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300?text=${encodeURIComponent(p.name)}'">
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))} (${p.numReviews || 0})</div>
          <div class="product-price">₹${p.price.toFixed(2)}</div>
          <button class="btn btn-primary add-to-cart-btn" data-id="${p._id}">Add to Cart</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
  } catch (err) {
    container.innerHTML = `<p class="loading">Error: ${err.message}</p>`;
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

document.addEventListener('DOMContentLoaded', loadFeatured);