// src/presentation/admin/scannerView.js

export const scannerView = {
  renderLayout() {
    return `
      <div class="container pt-md pb-md">
        <!-- Admin Nav -->
        <div class="flex justify-between items-center mb-lg pb-sm" style="border-bottom: 1px solid var(--color-gray-border);">
          <h1 class="text-primary" style="font-size: 2rem;">QR Scanner Kasir</h1>
          <div class="flex gap-sm">
            <a href="#/admin/dashboard" class="btn btn-outline">Analytics</a>
            <a href="#/admin/menu" class="btn btn-outline">Manajemen Menu</a>
            <a href="#/admin/scanner" class="btn btn-primary">QR Scanner</a>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <p class="text-muted text-center mb-md" style="max-width: 500px;">
            Arahkan QR Code dari layar HP Customer ke kamera. Sistem akan otomatis memverifikasi tagihan dan mengubah status pesanan menjadi <strong>Delivered</strong>.
          </p>

          <div class="card p-md" style="width: 100%; max-width: 500px; display: flex; flex-direction: column; align-items: center;">
            <div id="reader" style="width: 100%; min-height: 300px;"></div>
            
            <div id="scanResult" class="mt-md w-full text-center" style="display: none;">
              <h3 id="resultTitle" class="mb-xs"></h3>
              <p id="resultText" class="text-muted"></p>
              <button id="resetScanBtn" class="btn btn-primary mt-sm">Scan QR Code Lain</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
