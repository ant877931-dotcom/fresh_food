export const categoryView = {
  render() {
    return `
      <div class="container pb-lg">
        <div class="flex justify-between items-center mb-md pt-md">
          <h2 style="font-size: 2rem; margin: 0; color: var(--text-main); font-weight: 800;">Manajemen Kategori</h2>
        </div>

        <div class="card mb-md" style="background: var(--surface); border-radius: var(--radius-lg); padding: 25px; box-shadow: var(--shadow-card); border: 1px solid rgba(0,0,0,0.02); margin-bottom: 25px;">
          <h3 class="mb-sm" style="margin-top: 0; color: var(--text-main); font-weight: 800;">Tambah Kategori</h3>
          <form id="addCategoryForm" class="flex gap-sm" style="display: flex; gap: 10px;">
            <input type="text" id="categoryNameInput" class="input" placeholder="Nama Kategori" required style="flex-grow: 1; padding: 12px 16px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); outline: none; background: #fafafa;">
            <button type="submit" style="background: var(--primary); color: var(--primary-text); border: none; font-weight: 700; border-radius: var(--radius-sm); padding: 10px 20px; transition: all 0.2s; cursor: pointer;">Tambah</button>
          </form>
        </div>

        <div class="card" style="background: var(--surface); border-radius: var(--radius-lg); padding: 25px; box-shadow: var(--shadow-card); border: 1px solid rgba(0,0,0,0.02); margin-bottom: 25px;">
          <h3 class="mb-sm" style="margin-top: 0; color: var(--text-main); font-weight: 800;">Daftar Kategori</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr>
                  <th style="padding: 15px; color: var(--text-muted); background-color: var(--bg-color); font-weight: 600;">ID</th>
                  <th style="padding: 15px; color: var(--text-muted); background-color: var(--bg-color); font-weight: 600;">Nama Kategori</th>
                  <th style="padding: 15px; color: var(--text-muted); background-color: var(--bg-color); font-weight: 600; text-align: right;">Aksi</th>
                </tr>
              </thead>
              <tbody id="categoryTableBody">
                <tr>
                  <td colspan="3" style="text-align: center; padding: 2rem; color: var(--text-muted);">Memuat kategori...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="edit-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div style="background: var(--surface); padding: 30px; border-radius: var(--radius-lg); width: 400px; max-width: 90%; box-shadow: var(--shadow-card);">
                <h3 style="margin-top: 0; color: var(--text-main); font-weight: 800;">Edit Kategori</h3>
                <input type="hidden" id="edit-category-id">
                <input type="text" id="edit-category-name" style="width: 100%; padding: 12px 16px; margin-bottom: 20px; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); background: #fafafa; outline: none;">
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="btn-cancel-edit" style="padding: 10px 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-muted); font-weight: 600; border-radius: var(--radius-sm); cursor: pointer;">Batal</button>
                    <button id="btn-save-edit" style="background: var(--primary); color: var(--primary-text); border: none; font-weight: 700; border-radius: var(--radius-sm); padding: 10px 20px; transition: all 0.2s; cursor: pointer;">Simpan</button>
                </div>
            </div>
        </div>
      </div>
    `;
  },

  renderTableRows(categories) {
    if (!categories || categories.length === 0) {
      return `
        <tr>
          <td colspan="3" style="text-align: center; padding: 2rem; color: var(--text-muted);">Tidak ada kategori.</td>
        </tr>
      `;
    }

    return categories.map(category => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 15px; color: var(--text-main);">${category.id}</td>
        <td style="padding: 15px; color: var(--text-main);"><strong>${category.name}</strong></td>
        <td style="padding: 15px; text-align: right;">
          <button class="btn-edit" data-id="${category.id}" data-name="${category.name}" style="border: 1px solid var(--c-dark-green); color: var(--c-dark-green); background: transparent; padding: 4px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer; transition: all 0.2s;">Edit</button>
          <button class="btn btn-outline delete-category-btn" data-id="${category.id}" style="border: 1px solid #dc3545; color: #dc3545; background: transparent; padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: all 0.2s;">Hapus</button>
        </td>
      </tr>
    `).join('');
  }
};
