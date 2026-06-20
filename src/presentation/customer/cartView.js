// src/presentation/customer/cartView.js

export const cartView = {
  renderLayout() {
    return `
      <div class="container pt-lg pb-lg">
        <div class="flex items-center justify-between mb-md">
          <h1 class="text-primary" style="font-size: 2.5rem;">Keranjang Anda</h1>
          <a href="#/" class="btn btn-outline">Kembali ke Katalog</a>
        </div>

        <div class="grid grid-cols-3 gap-lg">
          <!-- Cart Items -->
          <div class="col-span-2" id="cartItemsContainer" style="grid-column: span 2;">
            <div class="text-muted text-center p-lg card">Memuat keranjang...</div>
          </div>

          <!-- Order Summary -->
          <div class="col-span-1">
            <div class="card flex flex-col gap-sm" style="position: sticky; top: 2rem;">
              <h3 class="text-black mb-sm border-b pb-sm" style="border-bottom: 1px solid var(--color-gray-border);">Ringkasan Belanja</h3>
              
              <div class="flex justify-between text-muted">
                <span>Total Harga</span>
                <span id="cartSubtotal" class="text-black font-bold">Rp 0</span>
              </div>
              
              <div class="flex justify-between text-muted mt-xs">
                <span>Biaya Layanan</span>
                <span class="text-black font-bold">Gratis</span>
              </div>

              <div class="flex justify-between mt-sm pt-sm" style="border-top: 1px solid var(--color-gray-border);">
                <span class="text-black font-bold" style="font-size: 1.2rem;">Total Tagihan</span>
                <span id="cartTotal" class="text-primary font-bold" style="font-size: 1.2rem;">Rp 0</span>
              </div>

              <button id="checkoutBtn" class="btn btn-primary mt-md" style="width: 100%; font-size: 1.1rem; padding: 1rem;">
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderCartItems(items) {
    if (!items || items.length === 0) {
      return `
        <div class="card text-center p-lg flex flex-col items-center justify-center" style="min-height: 300px;">
          <h3 class="text-muted mb-sm">Keranjang Anda kosong</h3>
          <p class="text-muted mb-md">Sepertinya Anda belum memilih makanan apa pun.</p>
          <a href="#/" class="btn btn-primary">Mulai Belanja</a>
        </div>
      `;
    }

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    return items.map(item => `
      <div class="card flex items-center mb-sm gap-md">
        <div style="width: 100px; height: 100px; background-color: #eee; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
          ${item.imageUrl 
            ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div class="flex items-center justify-center" style="height: 100%; color: #aaa; font-size: 0.8rem;">No Image</div>`
          }
        </div>
        
        <div class="flex-grow">
          <h3 style="font-size: 1.2rem; margin-bottom: 0.25rem;">${item.name}</h3>
          <p class="text-primary font-bold">${formatPrice(item.price)}</p>
        </div>

        <div class="flex items-center gap-sm">
          <button class="btn btn-outline decrement-btn" data-id="${item.foodId}" style="padding: 0.25rem 0.75rem;">-</button>
          <span class="font-bold text-lg" style="min-width: 2rem; text-align: center;">${item.quantity}</span>
          <button class="btn btn-outline increment-btn" data-id="${item.foodId}" style="padding: 0.25rem 0.75rem;">+</button>
        </div>
        
        <button class="btn remove-btn ml-sm" data-id="${item.foodId}" style="background: transparent; color: #ff4444; border: 1px solid #ff4444; padding: 0.25rem 0.75rem;">Hapus</button>
      </div>
    `).join('');
  }
};
