export const salesView = {
  render() {
    return `
      <div class="container pb-lg">
        <div class="flex justify-between items-center mb-md pt-md">
          <h2 style="font-size: 2rem; margin: 0; color: var(--text-main); font-weight: 800;">Monitoring Penjualan</h2>
        </div>

        <!-- Charts Section -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px; flex-wrap: wrap;">
          <!-- Line Chart: Tren Pesanan -->
          <div class="card" style="flex: 2; min-width: 400px; background: var(--surface); padding: 25px; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); border: 1px solid rgba(0,0,0,0.02);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: var(--text-main); font-weight: 800;">Tren Jumlah Pesanan Harian</h3>
            <div style="position: relative; height: 300px; width: 100%;">
              <canvas id="lineChart"></canvas>
            </div>
          </div>
          
          <!-- Pie Chart: Status Pesanan -->
          <div class="card" style="flex: 1; min-width: 300px; background: var(--surface); padding: 25px; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); border: 1px solid rgba(0,0,0,0.02);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: var(--text-main); font-weight: 800;">Proporsi Status Pesanan</h3>
            <div style="position: relative; height: 300px; width: 100%;">
              <canvas id="pieChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Data Tables Section -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <!-- Pending Orders -->
          <div class="card" style="background: var(--surface); padding: 25px; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); border-top: 4px solid var(--primary);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: var(--text-main); font-weight: 800;">Pending (Belum Dibayar)</h3>
            <div id="pendingOrdersContainer" style="max-height: 400px; overflow-y: auto;">
              <p style="text-align: center; color: var(--text-muted);">Memuat...</p>
            </div>
          </div>

          <!-- Paid Orders -->
          <div class="card" style="background: var(--surface); padding: 25px; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); border-top: 4px solid var(--c-lime);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: var(--text-main); font-weight: 800;">Paid (Menunggu Diambil)</h3>
            <div id="paidOrdersContainer" style="max-height: 400px; overflow-y: auto;">
              <p style="text-align: center; color: var(--text-muted);">Memuat...</p>
            </div>
          </div>

          <!-- Completed Orders -->
          <div class="card" style="background: var(--surface); padding: 25px; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); border-top: 4px solid var(--c-dark-green);">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: var(--text-main); font-weight: 800;">Confirmed (Diambil)</h3>
            <div id="completedOrdersContainer" style="max-height: 400px; overflow-y: auto;">
              <p style="text-align: center; color: var(--text-muted);">Memuat...</p>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  renderOrderList(orders) {
    if (!orders || orders.length === 0) {
      return `<p style="text-align: center; color: var(--text-muted); padding: 20px 0;">Tidak ada pesanan.</p>`;
    }

    return orders.map(order => {
      let itemsHtml = '';
      if (order.order_items && order.order_items.length > 0) {
        itemsHtml = `<ul style="margin: 5px 0; padding-left: 20px; font-size: 0.9rem; color: var(--text-muted);">`;
        order.order_items.forEach(item => {
          const foodName = item.foods ? item.foods.name : 'Unknown';
          itemsHtml += `<li>${item.quantity}x ${foodName}</li>`;
        });
        itemsHtml += `</ul>`;
      } else {
        itemsHtml = `<p style="font-size: 0.9rem; color: var(--text-muted); margin: 5px 0;">Tidak ada detail makanan</p>`;
      }

      const date = new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });

      return `
        <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="color: var(--text-main);">Order #${order.id.split('-')[0].toUpperCase()}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${date}</span>
          </div>
          ${itemsHtml}
          <div style="font-weight: 700; text-align: right; margin-top: 5px; color: var(--c-dark-green);">
            Total: Rp ${order.total_amount.toLocaleString('id-ID')}
          </div>
        </div>
      `;
    }).join('');
  }
};
