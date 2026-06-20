import { adminDashboardView } from './adminDashboardView.js';
import { getSalesChartUseCase } from '../../domain/usecases/getSalesChartUseCase.js';
import { getTopFoodsUseCase } from '../../domain/usecases/getTopFoodsUseCase.js';
import { supabase } from '../../infrastructure/config/supabase.js';

let chartInstance = null;

export const adminDashboardController = {
  async init() {
    const appDiv = document.getElementById('app');
    const publicNavbar = document.getElementById('navbar');

    // --- AUTH GUARD START ---
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.warn("Akses admin ditolak. Silakan login terlebih dahulu.");
      window.location.hash = '#/login';
      return; 
    }

    // Ambil data role dari tabel profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // STRICT GUARD: Jika bukan admin, tendang ke halaman katalog!
    if (!profile || profile.role !== 'admin') {
      console.warn("SECURITY BREACH: Customer mencoba mengakses Admin area. Redirecting...");
      window.location.hash = '#/katalog';
      return;
    }
    // --- AUTH GUARD END ---
    
    // Hide public navbar
    if (publicNavbar) {
      publicNavbar.style.display = 'none';
    }

    // Render Main Layout
    appDiv.innerHTML = adminDashboardView.renderLayout();

    // Set User Info
    const adminUsername = document.getElementById('adminUsername');
    if (session && session.user && adminUsername) {
      adminUsername.textContent = session.user.email;
    }

    // Logout Event
    document.getElementById('adminBtnLogout').addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.hash = '#/login';
    });

    // Sidebar navigation mock (only Dashboard works fully for now)
    const navItems = document.querySelectorAll('.admin-nav-item');
    const adminContent = document.getElementById('adminContent');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        navItems.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');
        const target = e.target.getAttribute('data-target');
        
        if (target === 'dashboard') {
          this.renderAnalyticsDashboard(adminContent);
        } else if (target === 'categories') {
          import('./categoryView.js').then(({ categoryView }) => {
            adminContent.innerHTML = categoryView.render();
            import('./categoryController.js').then(({ initCategoryController }) => {
              initCategoryController();
            });
          });
        } else if (target === 'foods') {
          import('./foodView.js').then(({ foodView }) => {
            adminContent.innerHTML = foodView.render();
            import('./foodController.js').then(({ initFoodController }) => {
              initFoodController();
            });
          });
        } else if (target === 'sales') {
          import('./salesView.js').then(({ salesView }) => {
            adminContent.innerHTML = salesView.render();
            import('./salesController.js').then(({ initSalesController }) => {
              initSalesController();
            });
          });
        } else if (target === 'history') {
          import('./historyView.js').then(({ historyView }) => {
            adminContent.innerHTML = historyView.render();
            import('./historyController.js').then(({ initHistoryController }) => {
              initHistoryController();
            });
          });
        } else {
          adminContent.innerHTML = `<div style="padding: 30px;"><h3>Modul ${target} (Dalam Pengembangan)</h3></div>`;
        }
      });
    });

    // Load Chart.js if not loaded
    if (!window.Chart) {
      await this.loadChartJs();
    }

    // Default to Dashboard
    this.renderAnalyticsDashboard(adminContent);
  },

  async loadChartJs() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/vendor/chart.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Gagal memuat Chart.js dari lokal vendor'));
      document.head.appendChild(script);
    });
  },

  async renderAnalyticsDashboard(container) {
    container.innerHTML = adminDashboardView.renderAnalytics();

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const timeframe = e.target.getAttribute('data-timeframe');
        await this.loadAnalyticsData(timeframe);
      });
    });

    // Load default
    await this.loadAnalyticsData('Hari Ini');
  },

  async loadAnalyticsData(timeframe) {
    try {
      const chartData = await getSalesChartUseCase.execute(timeframe);
      const topFoods = await getTopFoodsUseCase.execute(timeframe);

      this.renderChart(chartData.labels, chartData.data);
      
      const leaderboardList = document.getElementById('leaderboardList');
      if (leaderboardList) {
        leaderboardList.innerHTML = adminDashboardView.renderLeaderboardItems(topFoods);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  },

  renderChart(labels, dataPoints) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Penjualan (Rp)',
          data: dataPoints,
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
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};
