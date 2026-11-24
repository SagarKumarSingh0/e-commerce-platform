let cartData = null;

const loadCart = async () => {
  if (!getUser()) {
    window.location.href = '/pages/login.html';
    return;
  }
  try {
    cartData = await apiFetch('/cart');
    renderCart();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

const renderCart = () => {
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('summary');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartData.items.length) {
    container.innerHTML = '<p style="text-align:center;padding:3rem 0;color:#6b7280">Your cart is empty. <a href="/pages/products.html" style="color:#6366f1">Start shopping</a></p>';
    summary.innerHTML = '';
    checkoutBtn.disabled = true;
    return;
  }

  container.innerHTML = cartData.items.map(item => `
    <div class="cart-item">
      <img src="${item.product.image}" onerror="this.src='https://via.placeholder.com/100'">
      <div class="cart-item-info">
        <h4>${item.product.name}</h4>
        <div class="cart-item-price">₹${item.product.price.toFixed(2)}</div>
        <div class="quantity-control">
          <button onclick="updateQty('${item.product._id}', ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQty('${item.product._id}', ${item.quantity + 1})">+</button>
          <button class="remove-btn" onclick="removeItem('${item.product._id}')">Remove</button>
        </div>
      </div>
      <div style="font-weight:700;font-size:1.1rem">₹${(item.product.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');

  const subtotal = cartData.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  summary.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}</span></div>
    <div class="summary-row"><span>Tax (8%)</span><span>₹${tax.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
  `;
  checkoutBtn.disabled = false;
};

const updateQty = async (productId, qty) => {
  if (qty < 1) return;
  try {
    cartData = await apiFetch(`/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: qty })
    });
    renderCart();
    updateNavbar();
  } catch (err) { showToast(err.message, 'error'); }
};

const removeItem = async (productId) => {
  try {
    cartData = await apiFetch(`/cart/remove/${productId}`, { method: 'DELETE' });
    renderCart();
    updateNavbar();
    showToast('Item removed', 'success');
  } catch (err) { showToast(err.message, 'error'); }
};

document.getElementById('checkoutBtn').addEventListener('click', () => {
  window.location.href = '/pages/checkout.html';
});

document.addEventListener('DOMContentLoaded', loadCart);