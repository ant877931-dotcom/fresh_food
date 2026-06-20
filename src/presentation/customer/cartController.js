// src/presentation/customer/cartController.js
import { cartView } from './cartView.js';
import { cartUseCase } from '../../domain/usecases/cartUseCase.js';
import { authUseCase } from '../../domain/usecases/authUseCase.js';
import { checkoutUseCase } from '../../domain/usecases/checkoutUseCase.js';

export const cartController = {
  user: null,

  async renderCart() {
    const app = document.getElementById('app');
    
    this.user = await authUseCase.getCurrentSession();
    if (!this.user) {
      window.location.hash = '/login';
      return;
    }

    app.innerHTML = cartView.renderLayout();
    this.loadAndRenderCartItems();
    this.attachCheckoutEvent();
  },

  loadAndRenderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const items = cartUseCase.getCart(this.user.id);
    
    container.innerHTML = cartView.renderCartItems(items);
    this.updateTotals(items);
    this.attachItemEvents();
  },

  updateTotals(items) {
    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTotalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(subtotal);

    if (checkoutBtn) {
      checkoutBtn.disabled = items.length === 0;
      if (items.length === 0) {
        checkoutBtn.classList.add('btn-outline');
        checkoutBtn.classList.remove('btn-primary');
      } else {
        checkoutBtn.classList.add('btn-primary');
        checkoutBtn.classList.remove('btn-outline');
      }
    }
  },

  attachItemEvents() {
    document.querySelectorAll('.increment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        // Retrieve full item to get price etc
        const currentItem = cartUseCase.getCart(this.user.id).find(i => i.foodId === id);
        if (currentItem) {
           cartUseCase.addToCart(this.user.id, { id: currentItem.foodId, name: currentItem.name, price: currentItem.price, imageUrl: currentItem.imageUrl });
           this.loadAndRenderCartItems();
        }
      });
    });

    document.querySelectorAll('.decrement-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        cartUseCase.decrementItem(this.user.id, id);
        this.loadAndRenderCartItems();
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        cartUseCase.removeItem(this.user.id, id);
        this.loadAndRenderCartItems();
      });
    });
  },

  attachCheckoutEvent() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', async () => {
      const items = cartUseCase.getCart(this.user.id);
      if (items.length === 0) return;

      try {
        checkoutBtn.textContent = 'Memproses...';
        checkoutBtn.disabled = true;

        await checkoutUseCase.processCheckout(this.user.id, this.user, items);
        
      } catch (error) {
        console.error("Checkout Error:", error);
        alert(`Gagal memproses pembayaran: ${error.message}`);
        checkoutBtn.textContent = 'Bayar Sekarang';
        checkoutBtn.disabled = false;
      }
    });
  }
};
