// src/presentation/admin/menuController.js
import { menuView } from './menuView.js';
import { adminUseCase } from '../../domain/usecases/adminUseCase.js';
import { authUseCase } from '../../domain/usecases/authUseCase.js';
import { getFoodsUseCase } from '../../domain/usecases/getFoodsUseCase.js';

export const menuController = {
  foodsCache: [],

  async renderMenu() {
    const app = document.getElementById('app');
    
    // Auth Guard
    const user = await authUseCase.getCurrentSession();
    if (!user || !user.isAdmin()) {
      window.location.hash = '/';
      return;
    }

    app.innerHTML = menuView.renderLayout();
    
    this.attachModalEvents();
    await this.loadFoods();
  },

  async loadFoods() {
    const grid = document.getElementById('adminMenuGrid');
    grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center;" class="text-muted p-md">Memuat data menu...</div>';

    try {
      this.foodsCache = await getFoodsUseCase.execute();
      grid.innerHTML = menuView.renderMenuItems(this.foodsCache);
      this.attachItemEvents();
    } catch (error) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: red;" class="p-md">Error: ${error.message}</div>`;
    }
  },

  attachModalEvents() {
    const modal = document.getElementById('menuModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const addBtn = document.getElementById('addMenuBtn');
    const form = document.getElementById('menuForm');

    addBtn.addEventListener('click', () => {
      this.openModal();
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitMenuBtn');
      const errEl = document.getElementById('formError');
      errEl.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Menyimpan...';

      const id = document.getElementById('foodId').value;
      const name = document.getElementById('foodName').value;
      const category = document.getElementById('foodCategory').value;
      const price = document.getElementById('foodPrice').value;
      const desc = document.getElementById('foodDesc').value;
      const imageFile = document.getElementById('foodImage').files[0];

      try {
        if (id) {
          // Update
          await adminUseCase.updateFood(id, name, desc, price, category, imageFile);
        } else {
          // Add
          await adminUseCase.addFood(name, desc, price, category, imageFile);
        }
        modal.style.display = 'none';
        await this.loadFoods();
      } catch (error) {
        errEl.textContent = error.message;
        errEl.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Simpan Menu';
      }
    });
  },

  attachItemEvents() {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const food = this.foodsCache.find(f => f.id === id);
        if (food) this.openModal(food);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Yakin ingin menghapus menu ini?')) return;
        const id = e.target.getAttribute('data-id');
        try {
          await adminUseCase.deleteFood(id);
          await this.loadFoods();
        } catch (error) {
          alert(`Gagal menghapus: ${error.message}`);
        }
      });
    });
  },

  openModal(food = null) {
    const modal = document.getElementById('menuModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('menuForm');
    const helper = document.getElementById('imageHelper');

    form.reset();

    if (food) {
      title.textContent = 'Edit Menu';
      helper.style.display = 'block';
      document.getElementById('foodId').value = food.id;
      document.getElementById('foodName').value = food.name;
      document.getElementById('foodCategory').value = food.category;
      document.getElementById('foodPrice').value = food.price;
      document.getElementById('foodDesc').value = food.description;
    } else {
      title.textContent = 'Tambah Menu';
      helper.style.display = 'none';
      document.getElementById('foodId').value = '';
    }

    modal.style.display = 'flex';
  }
};
