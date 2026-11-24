// frontend/js/chatbot.js
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in to show personalized message
  const user = getUser();
  const userName = user ? user.name.split(' ')[0] : 'Guest';

  // Create Chat Widget HTML
  const chatHTML = `
    <div id="chatWidget" style="position:fixed; bottom:20px; right:20px; z-index:1000; font-family:'Inter', sans-serif;">
      <!-- Chat Button -->
      <button id="chatToggleBtn" style="background:var(--primary); color:white; border:none; border-radius:50%; width:60px; height:60px; font-size:1.5rem; cursor:pointer; box-shadow:var(--shadow-lg); display:flex; align-items:center; justify-content:center; transition:transform 0.2s;">
        💬
      </button>
      
      <!-- Chat Window -->
      <div id="chatWindow" style="display:none; position:absolute; bottom:80px; right:0; width:320px; height:450px; background:white; border-radius:12px; box-shadow:var(--shadow-lg); flex-direction:column; overflow:hidden; border:1px solid var(--border);">
        <div style="background:var(--primary); color:white; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>AI Support</strong>
            <div style="font-size:0.75rem; opacity:0.8;">Online</div>
          </div>
          <button id="chatCloseBtn" style="background:none; border:none; color:white; font-size:1.2rem; cursor:pointer;">×</button>
        </div>
        
        <div id="chatMessages" style="flex:1; padding:1rem; overflow-y:auto; display:flex; flex-direction:column; gap:0.5rem; background:#f9fafb;">
          <div style="background:#e0e7ff; color:var(--dark); padding:0.6rem 1rem; border-radius:12px 12px 12px 0; max-width:80%; font-size:0.9rem;">
            Hi ${userName}! Welcome to ShopHub. How can I help you today?
          </div>
        </div>
        
        <div style="padding:0.8rem; border-top:1px solid var(--border); display:flex; gap:0.5rem; background:white;">
          <input type="text" id="chatInput" placeholder="Type a message..." style="flex:1; padding:0.6rem; border:1px solid var(--border); border-radius:20px; outline:none; font-size:0.9rem;">
          <button id="chatSendBtn" style="background:var(--primary); color:white; border:none; border-radius:50%; width:35px; height:35px; cursor:pointer;">➤</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const toggleBtn = document.getElementById('chatToggleBtn');
  const closeBtn = document.getElementById('chatCloseBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle Chat Window
  toggleBtn.addEventListener('click', () => {
    const isVisible = chatWindow.style.display === 'flex';
    chatWindow.style.display = isVisible ? 'none' : 'flex';
  });
  closeBtn.addEventListener('click', () => chatWindow.style.display = 'none');

  // AI Logic (Rule-based)
  const getAIResponse = (msg) => {
    msg = msg.toLowerCase();
    if (msg.includes('order') || msg.includes('track')) return "You can track your orders by clicking on 'My Orders' in the navigation bar.";
    if (msg.includes('refund') || msg.includes('return')) return "We offer a 7-day return policy. Please go to My Orders and select the item you want to return.";
    if (msg.includes('payment') || msg.includes('cod')) return "We accept Card, UPI, and Cash on Delivery. You can choose your preferred method at checkout.";
    if (msg.includes('shipping') || msg.includes('delivery')) return "Standard delivery takes 3-5 business days. Shipping is free for orders over ₹1000.";
    if (msg.includes('contact') || msg.includes('human')) return "You can reach our human support team via the Contact Us page in the footer.";
    if (msg.includes('hi') || msg.includes('hello')) return "Hello! How can I assist you today?";
    return "I'm a simple AI assistant. For complex queries, please use our Contact Us page or email support@shophub.com.";
  };

  // Send Message
  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add user message
    chatMessages.innerHTML += `
      <div style="background:var(--primary); color:white; padding:0.6rem 1rem; border-radius:12px 12px 0 12px; max-width:80%; align-self:flex-end; font-size:0.9rem;">
        ${text}
      </div>
    `;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI typing
    setTimeout(() => {
      const response = getAIResponse(text);
      chatMessages.innerHTML += `
        <div style="background:#e0e7ff; color:var(--dark); padding:0.6rem 1rem; border-radius:12px 12px 12px 0; max-width:80%; font-size:0.9rem;">
          ${response}
        </div>
      `;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  };

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
});