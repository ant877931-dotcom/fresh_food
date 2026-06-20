// src/presentation/admin/menuView.js

export const menuView = {
  renderLayout() {
    return `
      <div class="container pt-md pb-md">
        <!-- Admin Nav -->
        <div class="flex justify-between items-center mb-lg pb-sm" style="border-bottom: 1px solid var(--color-gray-border);">
          <h1 class="text-primary" style="font-size: 2rem;">Manajemen Menu</h1>
          <div class="flex gap-sm">
            <a href="#/admin/dashboard" class="btn btn-outline">Analytics</a>
            <a href="#/admin/menu" class="btn btn-primary">Manajemen Menu</a>
            <a href="#/admin/scanner" class="btn btn-outline">QR Scanner</a>
          </div>
        </div>

        <div class="flex justify-end mb-md">
          <button id="addMenuBtn" class="btn btn-primary">+ Tambah Menu Baru</button>
        </div>

        <!-- Menu Grid -->
        <div id="adminMenuGrid" class="grid grid-cols-4 gap-md">
          <div style="grid-column: 1 / -1; text-align: center;" class="text-muted p-md">Memuat data menu...</div>
        </div>

        <!-- Form Modal (Hidden by default) -->
        <div id="menuModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; z-index: 1000;">
          <div class="card" style="width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;">
            <div class="flex justify-between items-center mb-md border-b pb-sm">
              <h2 id="modalTitle" class="text-primary">Tambah Menu</h2>
              <button id="closeModalBtn" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>

            <form id="menuForm" class="flex flex-col gap-sm">
              <input type="hidden" id="foodId">
              
              <div>
                <label class="text-muted" style="font-size: 0.9rem; margin-bottom: 4px; display: block;">Nama Makanan</label>
                <input type="text" id="foodName" class="input" required>
              </div>

              <div>
                <label class="text-muted" style="font-size: 0.9rem; margin-bottom: 4px; display: block;">Kategori</label>
                <select id="foodCategory" class="input" required>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label class="text-muted" style="font-size: 0.9rem; margin-bottom: 4px; display: block;">Harga (Rp)</label>
                <input type="number" id="foodPrice" class="input" min="0" required>
              </div>

              <div>
                <label class="text-muted" style="font-size: 0.9rem; margin-bottom: 4px; display: block;">Deskripsi</label>
                <textarea id="foodDesc" class="input" rows="3" style="resize: vertical;"></textarea>
              </div>

              <div>
                <label class="text-muted" style="font-size: 0.9rem; margin-bottom: 4px; display: block;">Gambar</label>
                <input type="file" id="foodImage" class="input" accept="image/*">
                <p class="text-muted mt-xs" style="font-size: 0.8rem;" id="imageHelper">Biarkan kosong jika tidak ingin mengubah gambar.</p>
              </div>

              <div id="formError" class="text-primary" style="font-size: 0.9rem; display: none;"></div>

              <button type="submit" id="submitMenuBtn" class="btn btn-primary mt-sm" style="width: 100%;">Simpan Menu</button>
            </form>
          </div>
        </div>

      </div>
    `;
  },

  renderMenuItems(foods) {
    if (!foods || foods.length === 0) {
      return `<div style="grid-column: 1 / -1; text-align: center;" class="text-muted p-md">Belum ada menu yang terdaftar.</div>`;
    }

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    return foods.map(food => `
      <div class="card flex flex-col relative" style="overflow: hidden;">
        <!-- Status Label Kategori -->
        <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; z-index: 10;">${food.category}</span>
        
        <div style="width: 100%; height: 160px; background-color: #eee; border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm); overflow: hidden;">
          ${food.imageUrl 
            ? `<img src="${food.imageUrl}" alt="${food.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div class="flex items-center justify-center" style="height: 100%; color: #aaa;">No Image</div>`
          }
        </div>
        
        <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${food.name}</h3>
        <p class="text-primary font-bold mb-xs">${formatPrice(food.price)}</p>
        
        <div class="flex gap-xs mt-auto pt-sm border-t" style="border-top: 1px solid var(--color-gray-border);">
          <button class="btn btn-outline edit-btn" style="flex: 1; padding: 0.25rem; font-size: 0.8rem;" data-id="${food.id}">Edit</button>
          <button class="btn delete-btn" style="flex: 1; padding: 0.25rem; font-size: 0.8rem; border: 1px solid #ff4444; color: #ff4444; background: transparent;" data-id="${food.id}">Hapus</button>
        </div>
      </div>
    `).join('');
  }
};
