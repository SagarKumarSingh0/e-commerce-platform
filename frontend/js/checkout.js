let cart = null;

const loadSummary = async () => {
  if (!getUser()) { window.location.href = '/pages/login.html'; return; }
  try {
    cart = await apiFetch('/cart');
    if (!cart.items.length) {
      window.location.href = '/pages/cart.html';
      return;
    }
    
    // Calculate totals
    const subtotal = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 50; // Adjusted for Rupees (Free over ₹1000)
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + shipping + tax).toFixed(2);

    document.getElementById('checkoutSummary').innerHTML = `
      <h3>Order Summary</h3>
      <div style="margin:1rem 0;max-height:300px;overflow:auto">
        ${cart.items.map(i => `<div class="summary-row"><span>${i.product.name} × ${i.quantity}</span><span>₹${(i.product.price*i.quantity).toFixed(2)}</span></div>`).join('')}
      </div>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}</span></div>
      <div class="summary-row"><span>Tax</span><span>₹${tax.toFixed(2)}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
    `;
  } catch (err) {
    showToast(err.message, 'error');
  }
};

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  try {
    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Validation for UPI
    if (paymentMethod === 'upi') {
      const upiId = document.getElementById('upiId').value;
      if (!upiId || !upiId.includes('@')) {
        throw new Error('Please enter a valid UPI ID (e.g., name@upi)');
      }
    }

    // Create shipping address
    const shippingAddress = {
      fullName: document.getElementById('fullName').value,
      street: document.getElementById('street').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      country: 'India',
      phone: document.getElementById('phone').value
    };

    // 1. Create order in database
    const order = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ 
        shippingAddress, 
        paymentMethod: paymentMethod // sends 'card', 'upi', or 'cod'
      })
    });

    // 2. Process payment
    if (paymentMethod === 'cod') {
      // For COD, we just show success without hitting the payment gateway
      showToast('Order placed! Pay ₹' + order.totalPrice + ' on delivery.', 'success');
    } else {
      // For Card and UPI, we hit the payment route
      await apiFetch(`/payment/${order._id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ 
          email: getUser().email,
          method: paymentMethod 
        })
      });
      showToast('Payment Successful! Order placed.', 'success');
    }

    // 3. Redirect to orders page
    setTimeout(() => window.location.href = '/pages/orders.html', 1500);

  } catch (err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
});

document.addEventListener('DOMContentLoaded', loadSummary);