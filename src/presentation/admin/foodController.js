import { foodView } from './foodView.js';
import { foodRepository } from '../../infrastructure/repositories/foodRepository.js';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository.js';

export const foodController = {
  async init() {
    await this.loadInitialData();
    this.attachEventListeners();
  },

  async loadInitialData() {
    // Load categories for dropdowns
    const categorySelect = document.getElementById('foodCategoryInput');
    const editCategorySelect = document.getElementById('edit-food-category');
    
    try {
      const categories = await categoryRepository.getCategories();
      const optionsHtml = foodView.renderCategoryOptions(categories);
      if (categorySelect) categorySelect.innerHTML = optionsHtml;
      if (editCategorySelect) editCategorySelect.innerHTML = optionsHtml;
    } catch (error) {
      console.error('Failed to load categories', error);
    }

    await this.loadAndRenderFoods();
  },

  async loadAndRenderFoods() {
    const tbody = document.getElementById('foodTableBody');
    if (!tbody) return;

    try {
      const foods = await foodRepository.getFoods();
      tbody.innerHTML = foodView.renderTableRows(foods);
    } catch (error) {
      console.error(error);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: red;">Gagal memuat data makanan.</td></tr>`;
    }
  },

  attachEventListeners() {
    const addForm = document.getElementById('addFoodForm');
    const tbody = document.getElementById('foodTableBody');
    const editForm = document.getElementById('editFoodForm');
    const modal = document.getElementById('edit-food-modal');
    const btnCancelEdit = document.getElementById('btn-cancel-edit-food');

    // Handle Add Food
    if (addForm) {
      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = addForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Menyimpan...';
        submitBtn.disabled = true;

        try {
          const name = document.getElementById('foodNameInput').value.trim();
          const category_id = parseInt(document.getElementById('foodCategoryInput').value);
          const description = document.getElementById('foodDescInput').value.trim();
          const price = parseFloat(document.getElementById('foodPriceInput').value);
          const stock = parseInt(document.getElementById('foodStockInput').value);
          const fileInput = document.getElementById('foodImageInput');
          
          let image_url = null;
          
          if (fileInput.files && fileInput.files.length > 0) {
            image_url = await foodRepository.uploadFoodImage(fileInput.files[0]);
          }

          const foodData = { category_id, name, description, price, stock, image_url };
          await foodRepository.addFood(foodData);
          
          alert('Makanan berhasil ditambahkan!');
          addForm.reset();
          await this.loadAndRenderFoods();
        } catch (error) {
          console.error(error);
          alert('Gagal menambahkan makanan.');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    }

    // Handle Delete & Open Edit Modal
    if (tbody) {
      tbody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-delete-food')) {
          const id = e.target.getAttribute('data-id');
          if (confirm('Apakah Anda yakin ingin menghapus makanan ini?')) {
            try {
              await foodRepository.deleteFood(id);
              alert('Makanan berhasil dihapus!');
              await this.loadAndRenderFoods();
            } catch (error) {
              console.error(error);
              alert('Gagal menghapus makanan.');
            }
          }
        } else if (e.target.classList.contains('btn-edit-food')) {
          const id = e.target.getAttribute('data-id');
          document.getElementById('edit-food-id').value = id;
          document.getElementById('edit-food-name').value = e.target.getAttribute('data-name');
          document.getElementById('edit-food-category').value = e.target.getAttribute('data-category');
          document.getElementById('edit-food-desc').value = e.target.getAttribute('data-desc');
          document.getElementById('edit-food-price').value = e.target.getAttribute('data-price');
          document.getElementById('edit-food-stock').value = e.target.getAttribute('data-stock');
          
          document.getElementById('edit-food-image').value = ''; // clear file input
          modal.style.display = 'flex';
        }
      });
    }

    // Handle Cancel Edit
    if (btnCancelEdit) {
      btnCancelEdit.addEventListener('click', () => {
        modal.style.display = 'none';
        editForm.reset();
      });
    }

    // Handle Save Edit
    if (editForm) {
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : 'Simpan';
        if (submitBtn) {
            submitBtn.textContent = 'Menyimpan...';
            submitBtn.disabled = true;
        }

        try {
          const id = form.querySelector('[name="id"], #edit-food-id').value;
          const name = form.querySelector('[name="name"], #edit-food-name').value.trim();
          const category_id = parseInt(form.querySelector('[name="category_id"], #edit-food-category').value);
          const description = form.querySelector('[name="description"], #edit-food-desc').value.trim();
          const price = parseInt(form.querySelector('[name="price"], #edit-food-price').value) || 0;
          
          // INI YANG KRUSIAL: Ambil input stok spesifik di dalam form ini
          const stockInput = form.querySelector('[name="stock"], #edit-food-stock');
          const stock = stockInput ? parseInt(stockInput.value) : 0; 
          
          const fileInput = form.querySelector('[name="image"], #edit-food-image');
          
          const foodData = { 
            category_id: category_id, 
            name: name, 
            description: description, 
            price: price, 
            stock: stock 
          };
          
          if (fileInput.files && fileInput.files.length > 0) {
            foodData.image_url = await foodRepository.uploadFoodImage(fileInput.files[0]);
          }

          // PELACAK 1: Cek apakah Controller berhasil menyusun data
          console.log("=== DEBUG BARU: PAYLOAD ===", foodData);
          console.log("Target Food ID:", id);

          await foodRepository.updateFood(id, foodData);
          
          alert('Makanan berhasil diperbarui!');
          modal.style.display = 'none';
          await this.loadAndRenderFoods();
        } catch (error) {
          console.error("Error updating:", error);
          alert('Gagal memperbarui makanan.');
        } finally {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }
        }
      });
    }
  }
};

export function initFoodController() {
  foodController.init();
}
