import { categoryView } from './categoryView.js';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository.js';

export const categoryController = {
  async init() {
    await this.loadAndRenderCategories();
    this.attachEventListeners();
  },

  async loadAndRenderCategories() {
    const tbody = document.getElementById('categoryTableBody');
    if (!tbody) return;

    try {
      const categories = await categoryRepository.getCategories();
      tbody.innerHTML = categoryView.renderTableRows(categories);
    } catch (error) {
      console.error(error);
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 2rem; color: red;">Gagal memuat kategori.</td></tr>`;
    }
  },

  attachEventListeners() {
    const form = document.getElementById('addCategoryForm');
    const tbody = document.getElementById('categoryTableBody');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('categoryNameInput');
        const name = input.value.trim();

        if (!name) {
          alert('Nama kategori tidak boleh kosong!');
          return;
        }

        try {
          await categoryRepository.addCategory(name);
          input.value = '';
          alert('Kategori berhasil ditambahkan!');
          await this.loadAndRenderCategories();
        } catch (error) {
          console.error(error);
          alert('Gagal menambahkan kategori. Pastikan nama tidak duplikat atau periksa koneksi.');
        }
      });
    }

    if (tbody) {
      tbody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-category-btn')) {
          const id = e.target.getAttribute('data-id');
          if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            try {
              await categoryRepository.deleteCategory(id);
              alert('Kategori berhasil dihapus!');
              await this.loadAndRenderCategories();
            } catch (error) {
              console.error(error);
              alert('Gagal menghapus kategori.');
            }
          }
        } else if (e.target.classList.contains('btn-edit')) {
          const id = e.target.getAttribute('data-id');
          const currentName = e.target.getAttribute('data-name');
          
          document.getElementById('edit-category-id').value = id;
          document.getElementById('edit-category-name').value = currentName;
          document.getElementById('edit-modal').style.display = 'flex';
        }
      });
    }

    const modal = document.getElementById('edit-modal');
    const btnCancel = document.getElementById('btn-cancel-edit');
    const btnSave = document.getElementById('btn-save-edit');

    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('edit-category-id').value = '';
        document.getElementById('edit-category-name').value = '';
      });
    }

    if (btnSave) {
      btnSave.addEventListener('click', async () => {
        const id = document.getElementById('edit-category-id').value;
        const newName = document.getElementById('edit-category-name').value.trim();
        
        if (!newName) {
          alert('Nama kategori tidak boleh kosong!');
          return;
        }

        try {
          await categoryRepository.updateCategory(id, newName);
          alert('Kategori berhasil diperbarui!');
          modal.style.display = 'none';
          await categoryController.loadAndRenderCategories();
        } catch (error) {
          console.error(error);
          alert('Gagal memperbarui kategori.');
        }
      });
    }
  }
};

export function initCategoryController() {
  categoryController.init();
}
