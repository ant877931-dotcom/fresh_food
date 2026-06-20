import { katalogView } from './katalogView.js';
import { cartUseCase } from '../../domain/usecases/cartUseCase.js';
import { foodRepository } from '../../infrastructure/repositories/foodRepository.js';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository.js';
import { supabase } from '../../infrastructure/config/supabase.js';

let allFoods = [];

export const katalogController = {
  async renderKatalog() {
    const appDiv = document.getElementById('app');

    // --- AUTH GUARD START ---
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn("Akses ditolak. Silakan login terlebih dahulu.");
      window.location.hash = '#/login';
      return; // Hentikan eksekusi kode di bawahnya
    }
    // --- AUTH GUARD END ---
    
    // update navbar with cart icon
    this.updateNavbar();

    try {
      // 1. Fetch Kategori dan Makanan secara paralel
      const [categories, foods] = await Promise.all([
        categoryRepository.getCategories(),
        foodRepository.getFoods()
      ]);
      
      allFoods = foods || [];

      // 2. Render Dropdown Kategori & Layout
      appDiv.innerHTML = katalogView.renderLayout(categories || []);
      
      // 3. Render Grid Makanan Awal
      this.renderGrid(allFoods);
      
      // 4. Pasang Event Listener untuk Search & Filter
      this.attachEventListeners();
      this.renderCartUI();

    } catch (e) {
      console.error("Gagal memuat data katalog:", e);
      alert("Terjadi kesalahan koneksi saat memuat menu. Silakan refresh halaman.");
      appDiv.innerHTML = katalogView.renderLayout([]);
      const grid = document.getElementById('productGrid');
      if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Gagal memuat katalog makanan.</p>`;
    }
  },

  async updateNavbar() {
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;

    const count = cartUseCase.getCartCount();
    const { data: { session } } = await supabase.auth.getSession();

    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 20px;">
        ${session ? `
          <a href="#/riwayat-pesanan" style="text-decoration: none; color: #1A1A1A; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #ddd; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='transparent'">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Riwayat Pesanan
          </a>
        ` : ''}
        <div id="cartIcon" style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 45px; height: 45px; border-radius: 50%; background: #fff; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='#fff'">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#333" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          ${count > 0 ? `<span id="cartBadge" style="position: absolute; top: 0px; right: 0px; background: var(--primary); color: var(--primary-text); border-radius: 50%; font-size: 0.75rem; min-width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">${count}</span>` : ''}
        </div>
        ${session ? `
          <button id="logout-btn" style="background: transparent; border: 1px solid var(--c-dark-green); color: var(--c-dark-green); padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s;" onmouseover="this.style.background='var(--c-dark-green)'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='var(--c-dark-green)';">
            Logout
          </button>
        ` : ''}
      </div>
    `;

    document.getElementById('cartIcon').addEventListener('click', async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Silakan login terlebih dahulu untuk melihat keranjang dan melanjutkan pembayaran.");
        window.location.hash = '#/login';
      } else {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar && overlay) {
          sidebar.style.transform = 'translateX(0)';
          overlay.style.display = 'block';
        }
      }
    });

    // Setup Event Listener untuk Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
        if (!confirmLogout) return;

        try {
          logoutBtn.textContent = 'Keluar...';
          logoutBtn.disabled = true;

          // 1. Akhiri sesi di backend Supabase
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          // 2. Bersihkan keranjang belanja di LocalStorage demi keamanan
          localStorage.removeItem('cart');

          // 3. Arahkan kembali ke halaman Login
          window.location.hash = '#/login';

        } catch (error) {
          console.error("Logout Error:", error);
          alert("Gagal melakukan logout: " + error.message);
          logoutBtn.textContent = 'Logout';
          logoutBtn.disabled = false;
        }
      });
    }
  },



  renderGrid(foods) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    productGrid.innerHTML = katalogView.renderProducts(foods);
  },

  attachEventListeners() {
    const searchInput = document.getElementById('katalogSearch');
    const categorySelect = document.getElementById('katalogCategory');
    const productGrid = document.getElementById('productGrid');

    const doFilter = () => {
      const keyword = searchInput && searchInput.value ? searchInput.value.toLowerCase() : '';
      const selectedCategoryId = categorySelect && categorySelect.value ? categorySelect.value : '';

      const filtered = allFoods.filter(food => {
        const foodName = food.name ? food.name.toLowerCase() : '';
        const categoryName = food.categories?.name ? food.categories.name.toLowerCase() : '';
        
        // Cek keyword di nama makanan atau nama kategori
        const matchesSearch = foodName.includes(keyword) || categoryName.includes(keyword);
        
        // Cek kategori dropdown cocok
        const matchesCategory = selectedCategoryId === '' || String(food.category_id) === selectedCategoryId;

        return matchesSearch && matchesCategory;
      });
      
      this.renderGrid(filtered);
    };

    if (searchInput) {
      searchInput.addEventListener('input', doFilter);
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', doFilter);
    }

    // Add to cart click inside grid
    if (productGrid) {
      productGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-to-cart');
        if (btn) {
          const foodData = JSON.parse(btn.getAttribute('data-food'));
          cartUseCase.addToCart(foodData);
          
          this.updateNavbar();
          this.renderCartUI();
          this.showToast();
        }
      });
    }

    // Sidebar Close logic
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');

    const closeCart = () => {
      if (sidebar && overlay) {
        sidebar.style.transform = 'translateX(100%)';
        overlay.style.display = 'none';
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    // Checkout Logic with Midtrans Snap
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', async () => {
        const items = cartUseCase.getCartItems();
        if (items.length === 0) {
          alert('Keranjang kosong!');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('Harap login terlebih dahulu!');
          window.location.hash = '#/login';
          return;
        }

        const user = session.user;
        const total = cartUseCase.calculateTotal();

        checkoutBtn.textContent = 'Memproses...';
        checkoutBtn.disabled = true;

        try {
          // 1. Insert order
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{ user_id: user.id, total_amount: total, status: 'pending' }])
            .select()
            .single();

          if (orderError) {
              console.error("Supabase Order Error Details:", orderError);
              throw new Error("Gagal menyimpan pesanan: " + orderError.message);
          }

          const orderId = orderData.id;

          // 2. Insert order items
          const orderItemsData = items.map(item => ({
            order_id: orderId,
            food_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

          if (itemsError) {
              console.error("Supabase Order Items Error Details:", itemsError);
              throw new Error("Gagal menyimpan detail makanan: " + itemsError.message);
          }

          // 4. Panggil Edge Function Midtrans
          console.log("Memanggil Edge Function create-transaction...");
          const { data: midtransData, error: functionError } = await supabase.functions.invoke('create-transaction', {
              body: { order_id: orderId, total_amount: total }
          });

          if (functionError) {
              console.error("Edge Function Error:", functionError);
              throw new Error("Gagal terhubung ke layanan pembayaran.");
          }

          // midtransData berisi JSON balasan dari Midtrans
          // Kita harus mengambil properti 'token' di dalamnya
          const snapToken = midtransData?.token;

          if (!snapToken) {
              console.error("Response dari server:", midtransData);
              throw new Error("Token pembayaran tidak diterima dari server.");
          }

          console.log("Token berhasil didapatkan:", snapToken);

          // 5. Tampilkan Pop-up Snap Midtrans
          window.snap.pay(snapToken, {
              onSuccess: async (result) => {
                  try {
                      // 1. Siapkan data QR dan nama file
                      const qrDataString = `FRESHFREEZE-${orderId}`;
                      const fileName = `qr_${orderId}.png`;

                      console.log("Membuat gambar QR Code...");

                      // 2. Generate QR Code Image menggunakan API publik (menghasilkan Blob gambar)
                      const qrResponse = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataString)}`);
                      if (!qrResponse.ok) throw new Error("Gagal membuat gambar QR dari API.");
                      const qrBlob = await qrResponse.blob();

                      console.log("Mengunggah QR ke Supabase Storage bucket 'qr-codes'...");

                      // 3. Upload file Blob ke Supabase Storage
                      const { data: uploadData, error: uploadError } = await supabase.storage
                          .from('qr-codes')
                          .upload(fileName, qrBlob, {
                              contentType: 'image/png',
                              upsert: true // Timpa jika nama file sama
                          });

                      if (uploadError) {
                          console.error("Storage Upload Error:", uploadError);
                          throw new Error("Gagal mengunggah gambar QR ke Storage.");
                      }

                      // 4. Dapatkan Public URL dari gambar yang baru diunggah
                      const { data: publicUrlData } = supabase.storage
                          .from('qr-codes')
                          .getPublicUrl(fileName);

                      const qrImageUrl = publicUrlData.publicUrl;
                      console.log("URL QR Code berhasil didapatkan:", qrImageUrl);

                      // 5. Insert data ke tabel invoices dengan URL gambar yang sebenarnya
                      const invoicePayload = {
                          order_id: orderId,
                          midtrans_transaction_id: result.transaction_id || `TRX-${Date.now()}`,
                          qr_code_url: qrImageUrl
                      };

                      const { error: invoiceError } = await supabase
                          .from('invoices')
                          .insert([invoicePayload]);

                      if (invoiceError) throw new Error(`Gagal menyimpan invoice: ${invoiceError.message}`);

                      // 6. UPDATE STATUS ORDERS (Ini yang paling krusial!)
                      console.log("Mengupdate status order menjadi paid...");
                      const { error: updateOrderError } = await supabase
                          .from('orders')
                          .update({ 
                              status: 'paid',
                              payment_type: result.payment_type || 'midtrans'
                          })
                          .eq('id', orderId); // Menggunakan orderId yang sudah ada di memori

                      if (updateOrderError) {
                          console.error("Gagal mengupdate orders:", updateOrderError);
                          throw new Error("Invoice terbuat, tetapi gagal mengupdate status pesanan.");
                      }

                      // 7. Sukses, bersihkan keranjang dan alihkan ke riwayat pesanan
                      alert("Pembayaran berhasil! Silakan cek Riwayat Pesanan Anda.");
                      cartUseCase.clearCart();
                      this.renderCartUI();
                      this.updateNavbar();
                      window.location.hash = '#/riwayat-pesanan'; // Langsung arahkan ke halaman riwayat

                  } catch (error) {
                      console.error("Error post-payment process:", error);
                      alert(`Terjadi kendala sistem: ${error.message}. Hubungi admin.`);
                  }
              },
              onPending: function(result) {
                  alert("Menunggu pembayaran Anda diselesaikan!");
              },
              onError: function(result) {
                  alert("Pembayaran gagal diproses!");
              },
              onClose: function() {
                  alert("Anda menutup halaman pembayaran sebelum menyelesaikannya.");
              }
          });

        } catch (error) {
          console.error("Checkout process error:", error);
          alert(error.message || 'Terjadi kesalahan saat memproses pembayaran.');
          checkoutBtn.textContent = 'Lanjut Pembayaran';
          checkoutBtn.disabled = false;
        }
      });
    }

    // Cart items container (+ / - buttons)
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
      cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-cart-minus')) {
          const id = parseInt(e.target.getAttribute('data-id'));
          const currentQty = parseInt(e.target.getAttribute('data-qty'));
          cartUseCase.updateQuantity(id, currentQty - 1);
          this.updateNavbar();
          this.renderCartUI();
        } else if (e.target.classList.contains('btn-cart-plus')) {
          const id = parseInt(e.target.getAttribute('data-id'));
          const currentQty = parseInt(e.target.getAttribute('data-qty'));
          cartUseCase.updateQuantity(id, currentQty + 1);
          this.updateNavbar();
          this.renderCartUI();
        }
      });
    }
  },

  renderCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    if (!container || !totalEl) return;

    const items = cartUseCase.getCartItems();
    
    if (items.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: #999; margin-top: 50px;">Keranjang kosong.</div>`;
    } else {
      container.innerHTML = items.map(item => `
        <div style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
          <img src="${item.image_url || 'https://via.placeholder.com/50'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
          <div style="flex-grow: 1;">
            <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${item.name}</div>
            <div style="color: var(--c-dark-green); font-weight: bold;">Rp ${item.price.toLocaleString('id-ID')}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn-cart-minus" data-id="${item.id}" data-qty="${item.quantity}" style="width: 28px; height: 28px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
            <span style="font-weight: bold; width: 20px; text-align: center;">${item.quantity}</span>
            <button class="btn-cart-plus" data-id="${item.id}" data-qty="${item.quantity}" style="width: 28px; height: 28px; border: none; background: var(--primary); color: var(--primary-text); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
          </div>
        </div>
      `).join('');
    }

    totalEl.textContent = `Rp ${cartUseCase.calculateTotal().toLocaleString('id-ID')}`;
  },

  showToast() {
    const toast = document.getElementById('cartToast');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }
  }
};
