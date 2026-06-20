export const historyView = {
  render() {
    return `
      <style>
        .admin-view-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          padding: 25px;
          border: 1px solid rgba(0,0,0,0.02);
          margin-bottom: 20px;
        }
        .admin-view-title {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--text-main);
          font-weight: 800;
          font-size: 18px;
        }
        .admin-input {
          width: 100%;
          padding: 12px 16px;
          background-color: #fafafa;
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--text-main);
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .admin-input:focus {
          background-color: #ffffff;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.35);
        }
        .admin-btn-solid {
          background-color: var(--primary);
          color: var(--primary-text);
          font-weight: 700;
          border-radius: var(--radius-md);
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-btn-solid:hover {
          background-color: var(--primary-hover);
          transform: translateY(-2px);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admin-table th {
          background-color: var(--bg-color);
          color: var(--text-muted);
          font-weight: 600;
          padding: 15px;
          text-align: left;
        }
        .admin-table td {
          border-bottom: 1px solid var(--border-color);
          padding: 15px;
          color: var(--text-main);
        }
        .qr-link {
          color: var(--c-dark-green);
          font-weight: bold;
          text-decoration: none;
        }
        .qr-link:hover {
          text-decoration: underline;
        }
      </style>
      <div class="container pb-lg">
        <div class="flex justify-between items-center mb-md pt-md">
          <h2 style="font-size: 2rem; margin: 0; color: var(--text-main); font-weight: 800;">Riwayat & Scanner</h2>
          <button id="btn-activate-scanner" class="admin-btn-solid">
            <span id="scanner-btn-text">Aktifkan Scanner QR</span>
          </button>
        </div>

        <div id="scanner-container" style="display: none; margin-bottom: 20px; text-align: center;">
          <div id="reader" style="width: 100%; max-width: 500px; margin: 0 auto; border: 2px solid var(--primary); border-radius: var(--radius-md); overflow: hidden;"></div>
          <button id="btn-cancel-scanner" style="margin-top: 10px; background: transparent; color: #d9534f; border: 1px solid #d9534f; padding: 5px 15px; border-radius: var(--radius-md); cursor: pointer;">Tutup Scanner</button>
        </div>

        <!-- Filter Panel -->
        <div class="admin-view-card">
          <h3 class="admin-view-title">Filter Analitik</h3>
          <form id="filterForm" style="display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end;">
            
            <div style="flex: 1; min-width: 150px;">
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">Mulai Tanggal</label>
              <input type="date" id="filter-start-date" class="admin-input">
            </div>
            <div style="flex: 1; min-width: 150px;">
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">Sampai Tanggal</label>
              <input type="date" id="filter-end-date" class="admin-input">
            </div>

            <div style="display: flex; gap: 10px; flex: 1; min-width: 200px;">
              <button type="button" id="btn-hari-ini" class="quick-filter-btn admin-btn-solid" data-type="today" style="flex: 1; padding: 12px 10px; font-size: 0.85rem;">Hari Ini</button>
              <button type="button" id="btn-bulan-ini" class="quick-filter-btn admin-btn-solid" data-type="month" style="flex: 1; padding: 12px 10px; font-size: 0.85rem;">Bulan Ini</button>
              <button type="button" id="btn-tahun-ini" class="quick-filter-btn admin-btn-solid" data-type="year" style="flex: 1; padding: 12px 10px; font-size: 0.85rem;">Tahun Ini</button>
            </div>

            <div style="flex: 1; min-width: 150px;">
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">Kategori</label>
              <select id="filter-kategori" class="admin-input">
                <option value="">Semua Kategori</option>
              </select>
            </div>

            <div style="flex: 1; min-width: 150px;">
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">Nama Makanan</label>
              <input type="text" id="filter-makanan" placeholder="Cari Makanan..." class="admin-input">
            </div>

            <div style="flex: 1; min-width: 120px;">
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">Urutkan</label>
              <select id="filter-sort" class="admin-input">
                <option value="newest">Terbaru</option>
                <option value="highest">Tertinggi</option>
                <option value="lowest">Terendah</option>
              </select>
            </div>

            <div>
              <button type="button" id="btn-apply-filter" class="admin-btn-solid" style="padding: 12px 25px;">Terapkan Filter</button>
            </div>
          </form>
        </div>

        <!-- Charts Section -->
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div class="admin-view-card" style="flex: 2; min-width: 400px;">
            <h3 class="admin-view-title">Tren Riwayat</h3>
            <div style="position: relative; height: 300px; width: 100%;">
              <canvas id="historyLineChart"></canvas>
            </div>
          </div>
          <div class="admin-view-card" style="flex: 1; min-width: 300px;">
            <h3 class="admin-view-title">Proporsi Status</h3>
            <div style="position: relative; height: 300px; width: 100%;">
              <canvas id="historyPieChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="admin-view-card">
          <h3 class="admin-view-title">Daftar Riwayat Transaksi</h3>
          <div style="overflow-x: auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID Invoice</th>
                  <th>Tanggal</th>
                  <th>Makanan</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th>QR Code</th>
                </tr>
              </thead>
              <tbody id="historyTableBody">
                <tr>
                  <td colspan="6" style="text-align: center; color: var(--text-muted);">Memuat riwayat...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderTableRows(orders) {
    if (!orders || orders.length === 0) {
      return `<tr><td colspan="6" style="text-align:center; color:red;">Data tidak ditemukan.</td></tr>`;
    }

    return orders.map(order => {
      // 1. Ekstrak Makanan (Bisa lebih dari 1 item)
      let foodsText = '-';
      if (order.order_items && order.order_items.length > 0) {
        foodsText = order.order_items.map(item =>
          `${item.foods?.name || 'Unknown'} (x${item.quantity})`
        ).join('<br>');
      }

      // 2. Ekstrak Total Harga & Status
      const total = order.total_amount || 0;
      const status = order.status ? order.status.toUpperCase() : 'UNKNOWN';

      let statusBadge = '';
      if (status === 'COMPLETED') {
        statusBadge = `<span style="background-color: var(--c-pale); color: var(--c-dark-green); font-weight: 700; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">${status}</span>`;
      } else if (status === 'PENDING') {
        statusBadge = `<span style="background-color: rgba(22, 163, 74, 0.2); color: #15803d; font-weight: 700; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">${status}</span>`;
      } else {
        statusBadge = `<span style="background-color: #f3f4f6; color: #555; font-weight: 700; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">${status}</span>`;
      }

      // 3. Ekstrak QR Code (invoices bisa berupa array atau object tunggal)
      const invoice = Array.isArray(order.invoices) ? order.invoices[0] : order.invoices;
      const qrLink = invoice?.qr_code_url
        ? `<a href="${invoice.qr_code_url}" target="_blank" class="qr-link">Lihat QR</a>`
        : '<span style="color: var(--text-muted);">No QR</span>';

      // 4. Tanggal & ID pendek
      const dateStr = order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-';
      const shortId = order.id ? order.id.substring(0, 8).toUpperCase() : '-';

      return `
        <tr>
          <td>${shortId}</td>
          <td>${dateStr}</td>
          <td>${foodsText}</td>
          <td style="font-weight: 600;">Rp ${total.toLocaleString('id-ID')}</td>
          <td>${statusBadge}</td>
          <td>${qrLink}</td>
        </tr>
      `;
    }).join('');
  }
};
