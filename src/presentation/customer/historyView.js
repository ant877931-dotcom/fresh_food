// src/presentation/customer/historyView.js

export const historyView = {
  renderLayout() {
    return `
      <div class="container pt-lg pb-lg">
        <div class="flex items-center justify-between mb-md">
          <h1 class="text-primary" style="font-size: 2.5rem;">Riwayat Pembelian</h1>
          <a href="#/" class="btn btn-outline">Kembali ke Katalog</a>
        </div>

        <div id="ordersContainer" class="flex flex-col gap-md">
          <div class="text-muted text-center p-lg card">Memuat data pesanan...</div>
        </div>
      </div>
    `;
  },

  renderOrders(orders) {
    if (!orders || orders.length === 0) {
      return `
        <div class="card text-center p-lg">
          <h3 class="text-muted mb-sm">Belum ada riwayat pesanan</h3>
          <p class="text-muted">Anda belum melakukan pembelian apa pun.</p>
        </div>
      `;
    }

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    const formatDate = (dateString) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));

    return orders.map(order => {
      // Periksa apakah invoice tersedia (array invoices atau single object tergantung skema)
      const invoiceObj = Array.isArray(order.invoices) ? order.invoices[0] : order.invoices;
      const invoiceCode = invoiceObj ? invoiceObj.invoice_code : null;

      let qrSection = '';
      if (invoiceCode && order.status === 'completed') {
        qrSection = `
          <div class="flex flex-col items-center justify-center p-sm ml-auto" style="border-left: 1px solid var(--color-gray-border); min-width: 150px;">
            <p class="text-muted mb-xs" style="font-size: 0.8rem; text-align: center;">Tunjukkan QR Code ini ke Kasir</p>
            <canvas id="qr-${invoiceCode}"></canvas>
            <p class="text-black font-bold mt-xs" style="font-size: 0.8rem;">${invoiceCode}</p>
          </div>
        `;
      } else {
        qrSection = `
          <div class="flex flex-col items-center justify-center p-sm ml-auto" style="border-left: 1px solid var(--color-gray-border); min-width: 150px;">
            <span class="text-muted text-center" style="font-size: 0.9rem;">Menunggu<br/>Pembayaran</span>
          </div>
        `;
      }

      const itemsHtml = order.order_items ? order.order_items.map(item => `
        <div class="flex justify-between text-muted" style="font-size: 0.9rem;">
          <span>${item.quantity}x ${item.foods ? item.foods.name : 'Item'}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('') : '';

      return `
        <div class="card flex" style="align-items: stretch; gap: var(--spacing-sm);">
          <div class="flex-grow flex flex-col justify-center">
            <div class="flex justify-between items-center mb-sm border-b pb-xs" style="border-bottom: 1px solid var(--color-gray-border);">
              <span class="text-black font-bold">Order ID: ${order.id.split('-')[0].toUpperCase()}</span>
              <span class="text-muted" style="font-size: 0.8rem;">${formatDate(order.created_at)}</span>
            </div>
            
            <div class="mb-sm">
              ${itemsHtml}
            </div>

            <div class="flex justify-between mt-auto pt-xs">
              <span class="font-bold">Total:</span>
              <span class="text-primary font-bold">${formatPrice(order.total_amount)}</span>
            </div>
          </div>

          ${qrSection}
        </div>
      `;
    }).join('');
  }
};
