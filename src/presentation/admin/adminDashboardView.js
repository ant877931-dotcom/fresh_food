export const adminDashboardView = {
  renderLayout() {
    return `
      <style>
        .admin-layout {
          display: flex;
          height: 100vh;
          width: 100%;
          font-family: 'Inter', sans-serif;
        }
        .admin-sidebar {
          width: 250px;
          background-color: var(--c-dark-green);
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .admin-sidebar-header h1 {
          color: var(--c-yellow);
          margin: 0;
          font-size: 1.5rem;
        }
        .admin-nav {
          display: flex;
          flex-direction: column;
          padding: 20px 15px;
        }
        .admin-nav-item {
          padding: 15px 20px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          margin-bottom: 5px;
        }
        .admin-nav-item:hover, .admin-nav-item.active {
          background-color: var(--primary); 
          color: var(--primary-text); 
          font-weight: 700; 
          border-radius: 8px;
        }
        .admin-main {
          flex: 1;
          background-color: var(--bg-color);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-topbar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 15px 30px;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border-color);
        }
        .admin-topbar-user {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .admin-btn-logout {
          background: transparent;
          color: var(--c-dark-green);
          border: 2px solid var(--primary);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-btn-logout:hover {
          background: var(--primary);
          color: var(--primary-text);
        }
        .admin-content-area {
          padding: 30px;
          overflow-y: auto;
          flex: 1;
        }
      </style>
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <h2 class="sidebar-brand" style="color: var(--text-main); font-weight: 800; margin: 0; font-size: 1.5rem;">FreshFood <span style="color: var(--primary); font-weight: 600;">Admin</span></h2>
          </div>
          <nav class="admin-nav" id="adminNav">
            <a class="admin-nav-item active" data-target="dashboard">Dashboard</a>
            <a class="admin-nav-item" data-target="categories">Manajemen Kategori</a>
            <a class="admin-nav-item" data-target="foods">Manajemen Makanan</a>
            <a class="admin-nav-item" data-target="sales">Monitoring Penjualan</a>
            <a class="admin-nav-item" data-target="history">Riwayat & Scanner</a>
          </nav>
        </aside>
        <main class="admin-main">
          <header class="admin-topbar">
            <div class="admin-topbar-user">
              <span id="adminUsername" style="font-weight: 500;">Admin User</span>
              <button id="adminBtnLogout" class="admin-btn-logout">Logout</button>
            </div>
          </header>
          <div class="admin-content-area" id="adminContent">
            <!-- Dynamic content goes here -->
          </div>
        </main>
      </div>
    `;
  },

  renderAnalytics() {
    return `
      <style>
        .analytics-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .filter-group {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .filter-btn {
          background-color: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active, .filter-btn:hover {
          background-color: var(--primary); 
          color: var(--primary-text); 
          font-weight: 700; 
          border: none;
        }
        .charts-row {
          display: flex;
          gap: 20px;
        }
        .chart-card, .leaderboard-card {
          background: var(--surface); 
          border-radius: var(--radius-lg); 
          box-shadow: var(--shadow-card); 
          padding: 25px; 
          border: 1px solid rgba(0,0,0,0.02);
        }
        .chart-card {
          flex: 2;
        }
        .leaderboard-card {
          flex: 1;
        }
        .chart-title {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 18px;
          color: var(--text-main);
          font-weight: 800;
        }
        .leaderboard-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .leaderboard-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .leaderboard-item:last-child {
          border-bottom: none;
        }
        .food-name {
          font-weight: 500;
        }
        .food-qty {
          color: var(--c-dark-green);
          font-weight: 700;
        }
      </style>
      <div class="analytics-container">
        <h2 style="margin-top: 0;">Dashboard Analitik</h2>
        <div class="filter-group" id="timeframeFilters">
          <button class="filter-btn active" data-timeframe="Hari Ini">Hari Ini</button>
          <button class="filter-btn" data-timeframe="Bulan Ini">Bulan Ini</button>
          <button class="filter-btn" data-timeframe="Tahun Ini">Tahun Ini</button>
        </div>
        
        <div class="charts-row">
          <div class="chart-card">
            <h3 class="chart-title">Tren Penjualan</h3>
            <canvas id="salesChart" style="width: 100%; max-height: 350px;"></canvas>
          </div>
          
          <div class="leaderboard-card">
            <h3 class="chart-title">Top Penjualan</h3>
            <ul class="leaderboard-list" id="leaderboardList">
              <li style="text-align:center; padding: 20px; color: #888;">Memuat data...</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },
  
  renderLeaderboardItems(items) {
    if (!items || items.length === 0) {
      return `<li style="text-align:center; padding: 20px; color: #888;">Belum ada penjualan.</li>`;
    }
    
    return items.map((item, index) => `
      <li class="leaderboard-item">
        <div>
          <span style="color: #888; margin-right: 10px;">#${index + 1}</span>
          <span class="food-name">${item.name}</span>
        </div>
        <span class="food-qty">${item.totalSold} terjual</span>
      </li>
    `).join('');
  }
};
