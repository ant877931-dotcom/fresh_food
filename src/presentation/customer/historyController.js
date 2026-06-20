// src/presentation/customer/historyController.js
import { historyView } from './historyView.js';
import { historyUseCase } from '../../domain/usecases/historyUseCase.js';
import { authUseCase } from '../../domain/usecases/authUseCase.js';
import { supabase } from '../../infrastructure/config/supabase.js';

export const historyController = {
  async renderHistory() {
    const app = document.getElementById('app');
    
    // --- AUTH GUARD START ---
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn("Akses ditolak. Silakan login terlebih dahulu.");
      window.location.hash = '#/login';
      return; // Hentikan eksekusi kode di bawahnya
    }
    // --- AUTH GUARD END ---
    
    const user = session.user;

    app.innerHTML = historyView.renderLayout();

    await this.loadAndRenderOrders(user.id);
  },

  async loadAndRenderOrders(userId) {
    const container = document.getElementById('ordersContainer');
    
    try {
      const orders = await historyUseCase.getOrders(userId);
      container.innerHTML = historyView.renderOrders(orders);
      
      // Generate QR Code untuk invoice yang memiliki kode (berstatus completed)
      if (typeof window.QRious !== 'undefined') {
        orders.forEach(order => {
          if (order.status === 'completed') {
            const invoiceObj = Array.isArray(order.invoices) ? order.invoices[0] : order.invoices;
            if (invoiceObj && invoiceObj.invoice_code) {
              const canvas = document.getElementById(`qr-${invoiceObj.invoice_code}`);
              if (canvas) {
                new window.QRious({
                  element: canvas,
                  value: invoiceObj.invoice_code,
                  size: 120, // Ukuran QR dalam pixel
                  level: 'M' // Error correction level
                });
              }
            }
          }
        });
      } else {
        console.warn("Library QRious tidak dimuat.");
      }
      
    } catch (error) {
      container.innerHTML = `
        <div class="card p-md text-center" style="color: red;">
          Terjadi kesalahan: ${error.message}
        </div>
      `;
    }
  }
};
