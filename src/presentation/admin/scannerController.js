// src/presentation/admin/scannerController.js
import { scannerView } from './scannerView.js';
import { adminUseCase } from '../../domain/usecases/adminUseCase.js';
import { authUseCase } from '../../domain/usecases/authUseCase.js';

export const scannerController = {
  html5QrcodeScanner: null,

  async renderScanner() {
    const app = document.getElementById('app');
    
    // Auth Guard
    const user = await authUseCase.getCurrentSession();
    if (!user || !user.isAdmin()) {
      window.location.hash = '/';
      return;
    }

    app.innerHTML = scannerView.renderLayout();
    
    this.initScanner();
    this.attachEvents();
  },

  initScanner() {
    if (typeof window.Html5QrcodeScanner === 'undefined') {
      alert("Library Scanner belum dimuat.");
      return;
    }

    // Hindari instance ganda jika navigasi cepat
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear();
    }

    this.html5QrcodeScanner = new window.Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250} },
      /* verbose= */ false
    );

    this.html5QrcodeScanner.render(this.onScanSuccess.bind(this), this.onScanFailure.bind(this));
  },

  async onScanSuccess(decodedText, decodedResult) {
    // Hentikan scanner saat memproses
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear();
    }

    const scanResultEl = document.getElementById('scanResult');
    const titleEl = document.getElementById('resultTitle');
    const textEl = document.getElementById('resultText');

    scanResultEl.style.display = 'block';
    titleEl.textContent = 'Memverifikasi...';
    titleEl.className = 'text-primary mb-xs';
    textEl.textContent = `Mengecek Invoice: ${decodedText}`;

    try {
      const order = await adminUseCase.scanInvoice(decodedText);
      titleEl.textContent = 'Verifikasi Berhasil!';
      titleEl.className = 'mb-xs';
      titleEl.style.color = 'green';
      textEl.textContent = `Order ${order.id.split('-')[0].toUpperCase()} telah ditandai sebagai "Delivered".`;
    } catch (error) {
      titleEl.textContent = 'Verifikasi Gagal';
      titleEl.className = 'mb-xs';
      titleEl.style.color = 'red';
      textEl.textContent = error.message;
    }
  },

  onScanFailure(error) {
    // Abaikan kegagalan scan per frame (biasa terjadi saat mencari QR)
  },

  attachEvents() {
    const resetBtn = document.getElementById('resetScanBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('scanResult').style.display = 'none';
        this.initScanner();
      });
    }
  }
};
