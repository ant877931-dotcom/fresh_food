export const qrScannerService = {
  /**
   * Menginisialisasi HTML5 QR Code Scanner
   * @param {string} elementId - ID dari elemen kontainer
   * @param {function} onScanSuccess - Callback ketika QR berhasil dibaca
   */
  startScanner(elementId, onScanSuccess) {
    if (!window.Html5QrcodeScanner) {
      console.error("Library Html5QrcodeScanner belum dimuat!");
      return null;
    }
    
    // Konfigurasi scanner minimalis
    const html5QrcodeScanner = new window.Html5QrcodeScanner(
      elementId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    
    html5QrcodeScanner.render(onScanSuccess, (error) => {
      // Abaikan error per frame (misal QR tidak ditemukan)
    });
    
    return html5QrcodeScanner;
  }
};
