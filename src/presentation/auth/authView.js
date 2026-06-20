// src/presentation/auth/authView.js

export const authView = {
  renderLogin() {
    return `
        <style>
            .login-wrapper {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                min-height: calc(100vh - 80px);
                background-color: var(--bg-color, #F8F9FA);
                padding: 12vh 20px 20px 20px;
                box-sizing: border-box;
            }
            .login-card {
                background: var(--surface, #ffffff);
                width: 100%;
                max-width: 420px;
                padding: 45px 35px;
                border-radius: var(--radius-lg, 20px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), 0 5px 15px rgba(0,0,0,0.03);
                text-align: center;
            }
            .login-card h2 {
                color: var(--text-main, #222222);
                font-size: 28px;
                margin-bottom: 8px;
                font-weight: 800;
                letter-spacing: -0.5px;
            }
            .login-card p {
                color: var(--text-muted, #737373);
                font-size: 15px;
                margin-bottom: 35px;
            }
            .input-group {
                margin-bottom: 20px;
                text-align: left;
            }
            .input-group input {
                width: 100%;
                padding: 15px 18px;
                border: 1.5px solid var(--border-color, #E5E5E5);
                border-radius: var(--radius-md, 12px);
                font-size: 15px;
                color: #333;
                background-color: #fafafa;
                transition: all 0.3s ease;
                box-sizing: border-box;
                outline: none;
            }
            .input-group input:focus {
                background-color: #ffffff;
                border-color: var(--primary, #16A34A);
                box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.35);
            }
            .btn-login {
                width: 100%;
                padding: 15px;
                background-color: var(--primary); /* WAJIB HIJAU DOMINAN */
                color: var(--primary-text); /* Teks Putih */
                border: none;
                border-radius: var(--radius-md);
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .btn-login:hover {
                background-color: var(--primary-hover);
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4); /* Shadow hijau */
            }
            .btn-login:active {
                transform: translateY(0);
            }
            .login-footer {
                margin-top: 30px;
                font-size: 14.5px;
                color: #666;
            }
            .login-footer a {
                color: var(--c-dark-green, #064E3B);
                font-weight: 700;
                text-decoration: none;
                transition: color 0.3s;
            }
            .login-footer a:hover {
                color: #047857;
                text-decoration: underline;
            }
        </style>
        
        <div class="login-wrapper">
            <div class="login-card">
                <h2>FreshFood<span style="color: var(--primary, #16A34A);">.</span></h2>
                <p>Silakan masuk untuk melanjutkan pesanan Anda</p>
                
                <form id="loginForm">
                    <div class="input-group">
                        <input type="email" id="email" placeholder="Alamat Email" required>
                    </div>
                    <div class="input-group">
                        <input type="password" id="password" placeholder="Kata Sandi" required>
                    </div>
                    <button type="submit" class="btn-login">Masuk Sekarang</button>
                </form>
                
                <div class="login-footer">
                    Belum punya akun? <a href="#/register">Daftar di sini</a>
                </div>
            </div>
        </div>
    `;
  },

  renderRegister() {
    return `
        <style>
            .login-wrapper {
                display: flex;
                align-items: flex-start; /* Mengangkat card ke atas */
                justify-content: center;
                min-height: calc(100vh - 80px);
                background-color: var(--bg-color);
                padding: 12vh 20px 20px 20px; /* Jarak dari atas */
                box-sizing: border-box;
            }
            .login-card {
                background: var(--surface);
                width: 100%;
                max-width: 420px;
                padding: 45px 35px;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-float);
                text-align: center;
            }
            .login-card h2 {
                color: var(--text-main, #222222);
                font-size: 28px;
                margin-bottom: 8px;
                font-weight: 800;
                letter-spacing: -0.5px;
            }
            .login-card p {
                color: var(--text-muted, #737373);
                font-size: 15px;
                margin-bottom: 35px;
            }
            .input-group {
                margin-bottom: 20px;
                text-align: left;
            }
            .input-group input {
                width: 100%;
                padding: 15px 18px;
                border: 1.5px solid var(--border-color, #E5E5E5);
                border-radius: var(--radius-md, 12px);
                font-size: 15px;
                color: #333;
                background-color: #fafafa;
                transition: all 0.3s ease;
                box-sizing: border-box;
                outline: none;
            }
            .input-group input:focus {
                background-color: #ffffff;
                border-color: var(--primary, #16A34A);
                box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.35);
            }
            .btn-login {
                width: 100%;
                padding: 15px;
                background-color: var(--primary, #16A34A);
                color: var(--primary-text, #FFFFFF);
                border: none;
                border-radius: var(--radius-md, 12px);
                font-size: 16px;
                font-weight: 700;
                letter-spacing: 0.5px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            .btn-login:hover {
                background-color: var(--primary-hover, #15803D);
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(22, 163, 74, 0.45);
            }
            .btn-login:active {
                transform: translateY(0);
            }
            .login-footer {
                margin-top: 30px;
                font-size: 14.5px;
                color: #666;
            }
            .login-footer a {
                color: var(--c-dark-green, #064E3B);
                font-weight: 700;
                text-decoration: none;
                transition: color 0.3s;
            }
            .login-footer a:hover {
                color: #047857;
                text-decoration: underline;
            }
        </style>
        
        <div class="login-wrapper">
            <div class="login-card">
                <h2>FreshFood<span style="color: var(--primary, #16A34A);">.</span></h2>
                <p>Silakan daftar untuk melanjutkan pesanan Anda</p>
                
                <form id="registerForm">
                    <div class="input-group">
                        <input type="text" id="name" placeholder="Nama Lengkap" required>
                    </div>
                    <div class="input-group">
                        <input type="email" id="email" placeholder="Alamat Email" required>
                    </div>
                    <div class="input-group">
                        <input type="password" id="password" placeholder="Kata Sandi (min 6 karakter)" required>
                    </div>
                    <button type="submit" class="btn-login">Daftar Sekarang</button>
                </form>
                
                <div class="login-footer">
                    Sudah punya akun? <a href="#/login">Masuk di sini</a>
                </div>
            </div>
        </div>
    `;
  },

  renderForgotPassword() {
    return `
      <div class="container flex flex-col items-center justify-center" style="min-height: 100vh;">
        <div class="card" style="width: 100%; max-width: 400px;">
          <h2 class="text-primary mb-md text-center">Lupa Password</h2>
          <p class="text-muted text-center mb-sm" style="font-size: 0.9rem;">Masukkan email Anda dan kami akan mengirimkan tautan reset password.</p>
          
          <form id="forgotPasswordForm" class="flex flex-col gap-sm">
            <div>
              <label class="text-muted" style="font-size: 0.9rem; margin-bottom: 4px; display: block;">Email</label>
              <input type="email" id="email" class="input" required>
            </div>
            
            <div id="errorMsg" class="text-primary" style="font-size: 0.9rem; display: none;"></div>
            <div id="successMsg" style="color: green; font-size: 0.9rem; display: none;">Tautan reset berhasil dikirim! Periksa inbox Anda.</div>

            <button type="submit" class="btn btn-primary mt-sm" style="width: 100%;">Kirim Link Reset</button>
          </form>

          <div class="mt-md text-center">
            <p class="text-muted" style="font-size: 0.9rem;">
              <a href="#/login" class="text-muted" style="text-decoration: underline;">Kembali ke Login</a>
            </p>
          </div>
        </div>
      </div>
    `;
  },

  renderAuthGateModal() {
    return `
      <div id="authGateModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
        <div class="card" style="width: 90%; max-width: 400px; position: relative;">
          <button id="closeModalBtn" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; font-size: 1.5rem; cursor: pointer;" class="text-muted">&times;</button>
          <h3 class="text-primary text-center mb-sm">Perlu Autentikasi</h3>
          <p class="text-muted text-center mb-md">Silakan masuk atau mendaftar terlebih dahulu untuk menambahkan item ke keranjang.</p>
          <div class="flex flex-col gap-sm">
            <a href="#/login" class="btn btn-primary" style="width: 100%; text-align: center;">Login</a>
            <a href="#/register" class="btn btn-outline" style="width: 100%; text-align: center;">Register</a>
          </div>
        </div>
      </div>
    `;
  }
};
