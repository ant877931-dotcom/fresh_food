import { historyView } from './historyView.js';
import { historyRepository } from '../../infrastructure/repositories/historyRepository.js';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository.js';

let historyLineChartInstance = null;
let historyPieChartInstance = null;
let html5QrcodeScanner = null;
let allHistoryData = []; // Cache data asli dari Supabase

export const historyController = {
  async init() {
    await this.loadDependencies();
    this.attachEventListeners();
    await this.loadAndRenderData(); // Fetch sekali, filter client-side
    this.setupFilters(); // Setup filter setelah data & DOM siap

    // Populasi dropdown kategori dari database
    try {
      const categories = await categoryRepository.getCategories();
      const categorySelect = document.getElementById('filter-kategori');
      if (categorySelect && categories) {
        categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.name;
          option.textContent = cat.name;
          categorySelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Gagal memuat daftar kategori untuk filter:", error);
    }
  },

  async loadDependencies() {
    // Load Chart.js if not loaded
    if (!window.Chart) {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'assets/vendor/chart.js';
        script.onload = () => resolve();
        script.onerror = () => {
          const cdn = document.createElement('script');
          cdn.src = 'https://cdn.jsdelivr.net/npm/chart.js';
          cdn.onload = () => resolve();
          document.head.appendChild(cdn);
        };
        document.head.appendChild(script);
      });
    }

    // Load html5-qrcode
    if (!window.Html5Qrcode) {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'assets/vendor/html5-qrcode.min.js';
        script.onload = () => resolve();
        script.onerror = () => {
          const cdn = document.createElement('script');
          cdn.src = 'https://unpkg.com/html5-qrcode';
          cdn.onload = () => resolve();
          document.head.appendChild(cdn);
        };
        document.head.appendChild(script);
      });
    }
  },

  attachEventListeners() {
    const btnActivateScanner = document.getElementById('btn-activate-scanner');
    const btnCancelScanner = document.getElementById('btn-cancel-scanner');
    const scannerContainer = document.getElementById('scanner-container');

    if (btnActivateScanner) {
      btnActivateScanner.addEventListener('click', () => {
        scannerContainer.style.display = 'block';
        this.startScanner();
      });
    }

    if (btnCancelScanner) {
      btnCancelScanner.addEventListener('click', () => {
        this.stopScanner();
        scannerContainer.style.display = 'none';
      });
    }
  },

  async loadAndRenderData() {
    const tbody = document.getElementById('historyTableBody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #999;">Memuat data...</td></tr>`;

    try {
      // Fetch sekali, simpan ke cache
      allHistoryData = await historyRepository.getHistoryData();
      this.renderData(allHistoryData);
    } catch (error) {
      console.error(error);
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: red;">Gagal memuat data riwayat.</td></tr>`;
    }
  },

  renderData(orders) {
    const tbody = document.getElementById('historyTableBody');
    if (tbody) tbody.innerHTML = historyView.renderTableRows(orders);
    this.processAndRenderCharts(orders);
  },

  setupFilters() {
    const startDate = document.getElementById('filter-start-date');
    const endDate = document.getElementById('filter-end-date');

    // Helper: set date inputs to YYYY-MM-DD format
    const setDates = (start, end) => {
        // Fungsi untuk merender tanggal lokal ke format YYYY-MM-DD
        const formatLocal = (dateObj) => {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        if (startDate) startDate.value = formatLocal(start);
        if (endDate) endDate.value = formatLocal(end);
    };

    // Tombol cepat Hari Ini
    document.getElementById('btn-hari-ini')?.addEventListener('click', () => {
      const today = new Date();
      setDates(today, today);
    });

    // Tombol cepat Bulan Ini
    document.getElementById('btn-bulan-ini')?.addEventListener('click', () => {
      const date = new Date();
      setDates(
        new Date(date.getFullYear(), date.getMonth(), 1),
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
      );
    });

    // Tombol cepat Tahun Ini
    document.getElementById('btn-tahun-ini')?.addEventListener('click', () => {
      const date = new Date();
      setDates(
        new Date(date.getFullYear(), 0, 1),
        new Date(date.getFullYear(), 11, 31)
      );
    });

    // Tombol Terapkan Filter
    document.getElementById('btn-apply-filter')?.addEventListener('click', () => this.applyFilters());

    // Auto-filter saat dropdown Urutkan berubah
    document.getElementById('filter-sort')?.addEventListener('change', () => this.applyFilters());
  },

  applyFilters() {
    if (!allHistoryData || allHistoryData.length === 0) return;
    let filtered = [...allHistoryData];

    // A. Filter Tanggal
    const startVal = document.getElementById('filter-start-date')?.value;
    const endVal = document.getElementById('filter-end-date')?.value;
    if (startVal && endVal) {
      const start = new Date(startVal).setHours(0, 0, 0, 0);
      const end = new Date(endVal).setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at).getTime();
        return orderDate >= start && orderDate <= end;
      });
    }

    // B. Filter Kategori & Nama Makanan
    const catVal = document.getElementById('filter-kategori')?.value; // Tidak perlu toLowerCase karena exact match dari dropdown
    const foodVal = document.getElementById('filter-makanan')?.value.toLowerCase().trim() || '';

    if (catVal || foodVal) {
      filtered = filtered.filter(order => {
        if (!order.order_items) return false;
        return order.order_items.some(item => {
          const foodName = item.foods?.name?.toLowerCase() || '';
          // Menarik nama kategori dari relasi nested Supabase
          const catName = item.foods?.categories?.name || '';

          const matchesFood = foodVal ? foodName.includes(foodVal) : true;
          // Jika catVal ada isinya, lakukan pencocokan persis (exact match). Jika kosong, berarti "Semua Kategori"
          const matchesCat = catVal ? (catName === catVal) : true;

          return matchesFood && matchesCat;
        });
      });
    }

    // C. Sorting
    const sortVal = document.getElementById('filter-sort')?.value || 'newest';
    if (sortVal === 'highest') {
      filtered.sort((a, b) => (b.total_amount ?? 0) - (a.total_amount ?? 0));
    } else if (sortVal === 'lowest') {
      filtered.sort((a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0));
    } else if (sortVal.toLowerCase().includes('terlama')) {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else {
      // newest / terbaru (default)
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    this.renderData(filtered);
  },

  processAndRenderCharts(orders) {
    if (!orders) return;

    const dataPerDay = {};
    let totalPending = 0;
    let totalPaid = 0;
    let totalConfirmed = 0;

    orders.forEach(order => {
      // Pie chart — baca status langsung dari order
      if (order.status === 'pending') {
        totalPending++;
      } else if (order.status === 'paid') {
        totalPaid++;
      } else if (order.status === 'confirmed' || order.status === 'completed') {
        totalConfirmed++;
      }

      // Line chart — gunakan total_amount dari order
      const date = new Date(order.created_at).toLocaleDateString('en-CA');
      if (!dataPerDay[date]) dataPerDay[date] = 0;
      dataPerDay[date] += (order.total_amount || 0);
    });

    const sortedDates = Object.keys(dataPerDay).sort();
    const lineData = sortedDates.map(date => dataPerDay[date]);

    // Line Chart
    const lineCtx = document.getElementById('historyLineChart');
    if (lineCtx) {
      if (historyLineChartInstance) historyLineChartInstance.destroy();
      historyLineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: sortedDates,
          datasets: [{
            label: 'Total Penjualan (Rp)',
            data: lineData,
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
          plugins: { legend: { display: false } }
        }
      });
    }

    // Pie Chart
    const pieCtx = document.getElementById('historyPieChart');
    if (pieCtx) {
      if (historyPieChartInstance) historyPieChartInstance.destroy();
      historyPieChartInstance = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Pending', 'Paid', 'Confirmed'],
          datasets: [{
            data: [totalPending, totalPaid, totalConfirmed],
            backgroundColor: [
              '#E5E5E5', // Pending (Abu-abu)
              '#16A34A', // Paid (Hijau)
              '#0E6B38'  // Confirmed (Hijau Tua)
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  },

  startScanner() {
    if (!window.Html5Qrcode) return;
    
    html5QrcodeScanner = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrcodeScanner.start({ facingMode: "environment" }, config, async (decodedText, decodedResult) => {
      // On Success
      try {
        this.stopScanner();
        document.getElementById('scanner-container').style.display = 'none';
        
        // Asumsi QR code is token (or JSON with token)
        let token = decodedText;
        try {
          const parsed = JSON.parse(decodedText);
          if (parsed.token) token = parsed.token;
        } catch (e) {
          // not json, use raw text
        }

        await historyRepository.completeOrderByInvoice(token);
        alert('QR Code Berhasil Dipindai! Pesanan telah diselesaikan.');
        
        // Refresh with current filters
        document.getElementById('filterForm').dispatchEvent(new Event('submit'));
      } catch (err) {
        console.error(err);
        alert('Gagal memproses QR Code. Token tidak valid atau error sistem.');
      }
    }, (errorMessage) => {
      // On Error - usually ignored as it scans continuously
    }).catch(err => {
      console.error("Gagal memulai kamera", err);
      alert('Gagal mengakses kamera.');
    });
  },

  stopScanner() {
    if (html5QrcodeScanner) {
      try {
        html5QrcodeScanner.stop();
      } catch(e) {}
    }
  }
};

export function initHistoryController() {
  historyController.init();
}
