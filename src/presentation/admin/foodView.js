export const foodView = {
  render() {
    return `
      <div class="container pb-lg">
        <div class="flex justify-between items-center mb-md pt-md">
          <h1 class="page-title" style="color: var(--text-main); font-weight: 800; margin: 0; font-size: 2rem;">Manajemen Makanan</h1>
        </div>

        <!-- Add Food Form -->
        <div class="card mb-md" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 class="mb-sm" style="margin-top: 0;">Tambah Makanan</h3>
          <form id="addFoodForm" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; gap: 15px;">
              <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Nama Makanan</label>
                <input type="text" id="foodNameInput" class="input" placeholder="Misal: Nasi Goreng" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Kategori</label>
                <select id="foodCategoryInput" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                  <option value="">Pilih Kategori...</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Deskripsi</label>
              <textarea id="foodDescInput" rows="2" placeholder="Deskripsi makanan..." style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>

            <div style="display: flex; gap: 15px;">
              <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Harga (Rp)</label>
                <input type="number" id="foodPriceInput" required min="0" placeholder="Misal: 15000" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Stok</label>
                <input type="number" id="foodStockInput" required min="0" placeholder="Misal: 50" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div style="flex: 1;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Gambar (Opsional)</label>
                <input type="file" id="foodImageInput" accept="image/*" style="width: 100%; padding: 7px; border: 1px solid #ccc; border-radius: 4px; background: #fff;">
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end;">
              <button type="submit" class="btn btn-primary" style="background-color: var(--primary); color: var(--primary-text); border: none; font-weight: 700; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Simpan Makanan</button>
            </div>
          </form>
        </div>

        <!-- Food List Table -->
        <div class="card" style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 class="mb-sm" style="margin-top: 0;">Daftar Makanan</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid #eee;">
                  <th style="padding: 1rem 0.5rem; color: #666; width: 60px;">Gambar</th>
                  <th style="padding: 1rem 0.5rem; color: #666;">Nama</th>
                  <th style="padding: 1rem 0.5rem; color: #666;">Kategori</th>
                  <th style="padding: 1rem 0.5rem; color: #666;">Harga</th>
                  <th style="padding: 1rem 0.5rem; color: #666;">Stok</th>
                  <th style="padding: 1rem 0.5rem; color: #666; text-align: right;">Aksi</th>
                </tr>
              </thead>
              <tbody id="foodTableBody">
                <tr>
                  <td colspan="6" style="text-align: center; padding: 2rem; color: #999;">Memuat makanan...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Edit Modal -->
        <div id="edit-food-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div style="background: white; padding: 30px; border-radius: 8px; width: 500px; max-width: 90%;">
                <h3 style="margin-top: 0; margin-bottom: 20px;">Edit Makanan</h3>
                <form id="editFoodForm" style="display: flex; flex-direction: column; gap: 15px;">
                  <input type="hidden" id="edit-food-id" name="id">
                  
                  <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Nama Makanan</label>
                    <input type="text" id="edit-food-name" name="name" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                  </div>
                  
                  <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Kategori</label>
                    <select id="edit-food-category" name="category_id" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                    </select>
                  </div>
                  
                  <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Deskripsi</label>
                    <textarea id="edit-food-desc" name="description" rows="2" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                  </div>

                  <div style="display: flex; gap: 15px;">
                    <div style="flex: 1;">
                      <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Harga (Rp)</label>
                      <input type="number" id="edit-food-price" name="price" required min="0" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                    <div style="flex: 1;">
                      <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Stok</label>
                      <input type="number" id="edit-food-stock" name="stock" required min="0" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                  </div>
                  
                  <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; color: #555;">Ganti Gambar (Opsional)</label>
                    <input type="file" id="edit-food-image" name="image" accept="image/*" style="width: 100%; padding: 7px; border: 1px solid #ccc; border-radius: 4px; background: #fff;">
                    <small style="color: #888;">Biarkan kosong jika tidak ingin mengganti gambar.</small>
                  </div>

                  <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                      <button type="button" id="btn-cancel-edit-food" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Batal</button>
                      <button type="submit" id="btn-save-edit-food" style="padding: 8px 16px; border: none; background-color: var(--primary); color: var(--primary-text); font-weight: 700; border-radius: var(--radius-sm, 4px); cursor: pointer;">Simpan</button>
                  </div>
                </form>
            </div>
        </div>
      </div>
    `;
  },

  renderCategoryOptions(categories) {
    let html = '<option value="">Pilih Kategori...</option>';
    if (categories && categories.length > 0) {
      html += categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    return html;
  },

  renderTableRows(foods) {
    if (!foods || foods.length === 0) {
      return `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: #999;">Tidak ada makanan.</td>
        </tr>
      `;
    }

    return foods.map(food => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 1rem 0.5rem;">
          <div style="width: 50px; height: 50px; border-radius: 4px; background-color: #f0f0f0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            ${food.image_url 
              ? `<img src="${food.image_url}" alt="${food.name}" style="width: 100%; height: 100%; object-fit: cover;">`
              : `<span style="font-size: 0.7rem; color: #aaa;">No Img</span>`
            }
          </div>
        </td>
        <td style="padding: 1rem 0.5rem;"><strong>${food.name}</strong></td>
        <td style="padding: 1rem 0.5rem;">${food.categories ? food.categories.name : '-'}</td>
        <td style="padding: 1rem 0.5rem;">Rp ${food.price.toLocaleString('id-ID')}</td>
        <td style="padding: 1rem 0.5rem;">${food.stock}</td>
        <td style="padding: 1rem 0.5rem; text-align: right;">
          <button class="btn-edit-food" 
            data-id="${food.id}" 
            data-name="${food.name}" 
            data-category="${food.category_id}" 
            data-desc="${food.description || ''}" 
            data-price="${food.price}" 
            data-stock="${food.stock}" 
            style="color: var(--c-dark-green); border: 1px solid var(--c-dark-green); background: transparent; padding: 0.25rem 0.75rem; font-size: 0.85rem; border-radius: 4px; margin-right: 5px; cursor: pointer;">Edit</button>
          <button class="btn-delete-food" data-id="${food.id}" style="color: red; border: 1px solid red; background: transparent; padding: 0.25rem 0.75rem; font-size: 0.85rem; border-radius: 4px; cursor: pointer;">Hapus</button>
        </td>
      </tr>
    `).join('');
  }
};
