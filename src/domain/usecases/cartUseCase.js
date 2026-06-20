export const cartUseCase = {
  getCartItems() {
    const items = localStorage.getItem('freshfreeze_cart');
    return items ? JSON.parse(items) : [];
  },

  saveCartItems(items) {
    localStorage.setItem('freshfreeze_cart', JSON.stringify(items));
  },

  addToCart(foodItem) {
    const items = this.getCartItems();
    const existing = items.find(i => i.id === foodItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: foodItem.id,
        name: foodItem.name,
        price: foodItem.price,
        image_url: foodItem.image_url,
        quantity: 1
      });
    }
    this.saveCartItems(items);
  },

  removeFromCart(foodId) {
    let items = this.getCartItems();
    items = items.filter(i => i.id !== foodId);
    this.saveCartItems(items);
  },

  updateQuantity(foodId, newQuantity) {
    let items = this.getCartItems();
    const existing = items.find(i => i.id === foodId);
    if (existing) {
      existing.quantity = newQuantity;
      if (existing.quantity <= 0) {
         items = items.filter(i => i.id !== foodId);
      }
    }
    this.saveCartItems(items);
  },

  calculateTotal() {
    const items = this.getCartItems();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartCount() {
    const items = this.getCartItems();
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  clearCart() {
    localStorage.removeItem('freshfreeze_cart');
    localStorage.removeItem('cart'); // For backward compatibility if needed
  }
};
