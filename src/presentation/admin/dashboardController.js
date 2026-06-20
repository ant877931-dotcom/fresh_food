// src/presentation/admin/dashboardController.js
import { dashboardView } from './dashboardView.js';
import { adminUseCase } from '../../domain/usecases/adminUseCase.js';
import { authUseCase } from '../../domain/usecases/authUseCase.js';

export const dashboardController = {
  async renderDashboard() {
    const app = document.getElementById('app');
    
    // Auth Guard
    const user = await authUseCase.getCurrentSession();
    if (!user || !user.isAdmin()) {
      window.location.hash = '/';
      return;
    }

    app.innerHTML = dashboardView.renderLayout();
    
    this.attachEvents();
    
    // Load default: 7 hari terakhir
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    document.getElementById('startDate').value = lastWeek.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];

    this.loadAnalytics();
  },

  attachEvents() {
    document.getElementById('filterBtn').addEventListener('click', () => {
      this.loadAnalytics();
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await authUseCase.logout();
      window.location.hash = '/login';
    });
  },

  async loadAnalytics() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const tableBody = document.getElementById('ordersTableBody');
    const revEl = document.getElementById('totalRevenue');
    const countEl = document.getElementById('totalOrders');

    tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-md text-muted">Memuat data...</td></tr>`;

    try {
      const { orders, totalRevenue, totalOrders } = await adminUseCase.getAnalytics(startDate, endDate);
      
      const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
      
      revEl.textContent = formatPrice(totalRevenue);
      countEl.textContent = totalOrders;
      tableBody.innerHTML = dashboardView.renderTableRows(orders);

    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-md" style="color: red;">Error: ${error.message}</td></tr>`;
    }
  }
};
