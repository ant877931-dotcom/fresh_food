import { salesView } from './salesView.js';
import { salesRepository } from '../../infrastructure/repositories/salesRepository.js';

let lineChartInstance = null;
let pieChartInstance = null;

export const salesController = {
  async init() {
    await this.loadChartJs();
    await this.loadAndRenderData();
  },

  async loadChartJs() {
    if (window.Chart) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/vendor/chart.js';
      script.onload = () => resolve();
      script.onerror = () => {
        console.warn('Gagal memuat Chart.js lokal, mencoba CDN...');
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        cdnScript.onload = () => resolve();
        cdnScript.onerror = () => reject(new Error('Gagal memuat Chart.js'));
        document.head.appendChild(cdnScript);
      };
      document.head.appendChild(script);
    });
  },

  async loadAndRenderData() {
    try {
      const orders = await salesRepository.getOrdersData();
      this.processAndRenderCharts(orders);
      this.renderOrderLists(orders);
    } catch (error) {
      console.error('Failed to load sales data:', error);
      alert('Gagal memuat data penjualan.');
    }
  },

  processAndRenderCharts(orders) {
    if (!orders) return;

    // Process for Line Chart: Total orders per day
    const ordersPerDay = {};
    let pendingCount = 0;
    let paidCount = 0;
    let confirmedCount = 0;

    orders.forEach(order => {
      // For Pie Chart
      if (order.status === 'pending') pendingCount++;
      else if (order.status === 'paid') paidCount++;
      else if (order.status === 'completed' || order.status === 'confirmed') confirmedCount++;

      // For Line Chart
      const date = new Date(order.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!ordersPerDay[date]) {
        ordersPerDay[date] = 0;
      }
      ordersPerDay[date]++;
    });

    // Sort dates
    const sortedDates = Object.keys(ordersPerDay).sort();
    const lineData = sortedDates.map(date => ordersPerDay[date]);

    // Render Line Chart
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
      if (lineChartInstance) lineChartInstance.destroy();
      lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: sortedDates,
            datasets: [{
              label: 'Jumlah Pesanan',
              data: lineData,
              borderColor: '#16A34A',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              pointBackgroundColor: '#FFFFFF',
              pointBorderColor: '#16A34A',
              borderWidth: 2,
              fill: true,
              tension: 0.3
            }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    }

    // Render Pie Chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
      if (pieChartInstance) pieChartInstance.destroy();
      pieChartInstance = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Pending', 'Paid', 'Confirmed'],
          datasets: [{
            data: [pendingCount, paidCount, confirmedCount],
            backgroundColor: ['#E5E5E5', '#16A34A', '#0E6B38'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  },

  renderOrderLists(orders) {
    if (!orders) return;

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const paidOrders = orders.filter(o => o.status === 'paid');
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'confirmed');

    const pendingContainer = document.getElementById('pendingOrdersContainer');
    const paidContainer = document.getElementById('paidOrdersContainer');
    const completedContainer = document.getElementById('completedOrdersContainer');

    if (pendingContainer) pendingContainer.innerHTML = salesView.renderOrderList(pendingOrders);
    if (paidContainer) paidContainer.innerHTML = salesView.renderOrderList(paidOrders);
    if (completedContainer) completedContainer.innerHTML = salesView.renderOrderList(completedOrders);
  }
};

export function initSalesController() {
  salesController.init();
}
