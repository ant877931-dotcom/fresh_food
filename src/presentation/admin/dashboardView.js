// src/presentation/admin/dashboardView.js

export const dashboardView = {
  renderLayout() {
    return `
      <div class="container pt-md pb-md">
        <!-- Admin Nav -->
        <div class="flex justify-between items-center mb-lg pb-sm" style="border-bottom: 1px solid var(--color-gray-border);">
          <h1 class="text-primary" style="font-size: 2rem;">Admin Dashboard</h1>
          <div class="flex gap-sm">
            <a href="#/admin/dashboard" class="btn btn-primary">Analytics</a>
            <a href="#/admin/menu" class="btn btn-outline">Manajemen Menu</a>
            <a href="#/admin/scanner" class="btn btn-outline">QR Scanner</a>
            <button id="logoutBtn" class="btn btn-outline" style="border-color: #ff4444; color: #ff4444;">Logout</button>
          </div>
        </div>

        <!-- Filter -->
        <div class="card mb-md flex gap-md items-center">
          <div>
            <label class="text-muted" style="font-size: 0.9rem; display: block; margin-bottom: 4px;">Tanggal Mulai</label>
            <input type="date" id="startDate" class="input">
          </div>
          <div>
            <label class="text-muted" style="font-size: 0.9rem; display: block; margin-bottom: 4px;">Tanggal Akhir</label>
            <input type="date" id="endDate" class="input">
          </div>
          <button id="filterBtn" class="btn btn-primary mt-md">Terapkan Filter</button>
        </div>

        <!-- Analytics Cards -->
        <div class="grid grid-cols-2 gap-md mb-md">
          <div class="card text-center">
            <h3 class="text-muted mb-sm">Total Pendapatan (Lunas)</h3>
            <p id="totalRevenue" class="text-primary font-bold" style="font-size: 2.5rem;">Rp 0</p>
          </div>
          <div class="card text-center">
            <h3 class="text-muted mb-sm">Jumlah Pesanan (Semua)</h3>
            <p id="totalOrders" class="text-black font-bold" style="font-size: 2.5rem;">0</p>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="card">
          <h3 class="text-black mb-md">Daftar Pesanan</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--color-gray-border);">
                  <th class="p-sm">ID</th>
                  <th class="p-sm">Tanggal</th>
                  <th class="p-sm">Total</th>
                  <th class="p-sm">Status</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody">
                <tr><td colspan="4" class="text-center p-md text-muted">Memuat data...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderTableRows(orders) {
    if (!orders || orders.length === 0) {
      return `<tr><td colspan="4" class="text-center p-md text-muted">Tidak ada pesanan pada rentang waktu ini.</td></tr>`;
    }

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    const formatDate = (dateString) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));

    return orders.map(order => {
      let statusColor = 'text-muted';
      if (order.status === 'completed') statusColor = 'text-primary font-bold';
      if (order.status === 'delivered') statusColor = 'text-black font-bold';
      
      return `
        <tr style="border-bottom: 1px solid var(--color-gray-border);">
          <td class="p-sm" style="font-size: 0.9rem;">${order.id.split('-')[0].toUpperCase()}</td>
          <td class="p-sm" style="font-size: 0.9rem;">${formatDate(order.created_at)}</td>
          <td class="p-sm" style="font-size: 0.9rem;">${formatPrice(order.total_amount)}</td>
          <td class="p-sm ${statusColor}" style="font-size: 0.9rem; text-transform: capitalize;">${order.status}</td>
        </tr>
      `;
    }).join('');
  }
};
