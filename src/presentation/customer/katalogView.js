export const katalogView = {
  renderLayout(categories) {
    let categoryOptions = `<option value="">Semua Kategori</option>`;
    if (categories && categories.length > 0) {
      categoryOptions += categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    return `
      <style>
          /* Layout Utama */
          .katalog-wrapper {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: var(--bg-color, #F8F9FA);
              min-height: 100vh;
              box-sizing: border-box;
          }
          
          /* Header & Filter */
          .katalog-header-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 35px;
              flex-wrap: wrap;
              gap: 20px;
          }
          .katalog-title {
              color: var(--text-main);
              font-size: 32px;
              font-weight: 800;
              margin: 0;
              letter-spacing: -0.5px;
          }
          .filter-group {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
          }
          .filter-group input, .filter-group select {
              padding: 12px 20px;
              border: 1.5px solid var(--border-color, #E5E5E5);
              border-radius: var(--radius-md, 12px);
              font-size: 15px;
              outline: none;
              background: var(--surface, #fff);
              transition: all 0.3s ease;
              box-shadow: 0 4px 10px rgba(0,0,0,0.02);
          }
          .filter-group input:focus, .filter-group select:focus {
              border-color: var(--primary, #16A34A);
              box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.35);
          }

          /* Grid & Kartu Makanan */
          .food-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
              gap: 25px;
          }
          .food-card {
              background: var(--surface, #ffffff);
              border-radius: var(--radius-lg, 20px);
              padding: 15px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.04);
              transition: all 0.3s ease;
              display: flex;
              flex-direction: column;
              border: 2px solid transparent;
          }
          .food-card:hover {
              transform: translateY(-6px);
              border-color: var(--primary, #16A34A);
              box-shadow: 0 20px 40px rgba(22, 163, 74, 0.15);
          }
          .food-img-placeholder {
              width: 100%;
              height: 180px;
              background: linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.35) 100%);
              border-radius: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 15px;
              color: var(--c-dark-green, #064E3B);
              overflow: hidden;
          }
          .food-card-title {
              font-size: 18px;
              font-weight: 700;
              color: var(--text-main, #1a1a1a);
              margin: 0 0 5px 0;
          }
          .food-card-desc {
              font-size: 13.5px;
              color: var(--text-muted, #737373);
              margin: 0 0 15px 0;
              flex-grow: 1;
          }
          .food-card-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: auto;
          }
          .food-price {
              font-size: 18px;
              font-weight: 800;
              color: var(--c-dark-green);
          }
          .btn-add-to-cart {
              background-color: var(--primary);
              color: var(--primary-text);
              border: none;
              padding: 8px 16px;
              border-radius: var(--radius-sm, 8px);
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s;
          }
          .btn-add-to-cart:hover {
              background: var(--primary-hover, #15803D);
              box-shadow: 0 4px 12px rgba(22, 163, 74, 0.45);
              transform: translateY(-1px);
          }
      </style>

      <div class="katalog-wrapper">
          <div class="katalog-header-container">
              <h1 class="katalog-title">Katalog Makanan</h1>
              <div class="filter-group">
                  <input type="text" id="katalogSearch" placeholder="Cari Makanan...">
                  <select id="katalogCategory">
                      ${categoryOptions}
                  </select>
              </div>
          </div>
          
          <div id="productGrid" class="food-grid">
              <p style="grid-column: 1 / -1; text-align: center; color: #999; padding: 50px;">Memuat katalog...</p>
          </div>
      </div>
      
      <!-- Toast Notification -->
      <div id="cartToast" style="display: none; position: fixed; bottom: 30px; right: 30px; background: var(--c-dark-green, #064E3B); color: #fff; padding: 15px 25px; border-radius: var(--radius-sm, 8px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; transition: opacity 0.3s ease;">
        Berhasil ditambahkan ke keranjang!
      </div>

      <!-- Cart Sidebar -->
      <div id="cart-sidebar" style="position: fixed; top: 0; right: 0; width: 350px; height: 100vh; background: var(--surface, #fff); box-shadow: -4px 0 15px rgba(0,0,0,0.1); transform: translateX(100%); transition: transform 0.3s ease; z-index: 2000; display: flex; flex-direction: column;">
          <div style="padding: 20px 24px; background-color: var(--primary, #16A34A); display: flex; justify-content: space-between; align-items: center;">
              <h2 style="margin: 0; color: var(--primary-text, #FFFFFF); font-weight: 800;">Keranjang</h2>
              <button id="close-cart-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--primary-text, #FFFFFF); font-weight: 700;">&times;</button>
          </div>
          <div id="cart-items-container" style="padding: 20px; flex-grow: 1; overflow-y: auto;">
          </div>
          <div style="padding: 20px; border-top: 1px solid var(--border-color, #eee); background: var(--bg-color, #F8F9FA);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-weight: bold; font-size: 18px;">
                  <span>Total:</span>
                  <span id="cart-total-price" style="color: var(--c-dark-green, #064E3B);">Rp 0</span>
              </div>
              <button id="checkout-btn" style="width: 100%; padding: 15px; background: var(--primary, #16A34A); color: var(--primary-text, #FFFFFF); border: none; border-radius: var(--radius-sm, 8px); font-weight: 800; cursor: pointer; font-size: 15px; transition: all 0.2s ease;">Lanjut Pembayaran</button>
          </div>
      </div>
      <div id="cart-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1999; display: none;"></div>
    `;
  },

  renderProducts(foods) {
    if (!foods || foods.length === 0) {
      return `<p style="grid-column: 1 / -1; text-align: center; color: #999; padding: 50px; font-size: 1.1rem;">Tidak ada makanan yang ditemukan.</p>`;
    }

    return foods.map(food => `
      <div class="food-card">
        <div class="food-img-placeholder">
          ${food.image_url 
            ? `<img src="${food.image_url}" alt="${food.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
          }
        </div>
        <h3 class="food-card-title">${food.name}</h3>
        <p class="food-card-desc">${food.description || 'Tidak ada deskripsi'}</p>
        
        <div class="food-card-footer">
            <span class="food-price">Rp ${food.price.toLocaleString('id-ID')}</span>
            <button class="btn-add-to-cart" data-food='${JSON.stringify(food)}'>
                + Tambah
            </button>
        </div>
      </div>
    `).join('');
  }
};
