export function renderLogin() {
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
            .login-input-group {
                margin-bottom: 20px;
                text-align: left;
            }
            .login-input-group input {
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
                font-family: var(--font-family-base, 'Inter', sans-serif);
            }
            .login-input-group input:focus {
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
            .login-footer-text {
                margin-top: 30px;
                font-size: 14.5px;
                color: #666;
            }
            .login-footer-text a {
                color: var(--c-dark-green, #064E3B);
                font-weight: 700;
                text-decoration: none;
                transition: color 0.3s;
            }
            .login-footer-text a:hover {
                color: #047857;
                text-decoration: underline;
            }
        </style>

        <div class="login-wrapper">
            <div class="login-card">
                <h2>FreshFood<span style="color: var(--primary, #16A34A);">.</span></h2>
                <p>Silakan masuk untuk melanjutkan pesanan Anda</p>

                <form id="loginForm">
                    <div class="login-input-group">
                        <input type="email" id="email" placeholder="Alamat Email" required autocomplete="email">
                    </div>
                    <div class="login-input-group">
                        <input type="password" id="password" autocomplete="current-password" placeholder="Kata Sandi" required>
                    </div>
                    <button type="submit" class="btn-login">Masuk Sekarang</button>
                </form>

                <div class="login-footer-text">
                    Belum punya akun? <a href="#/register">Daftar di sini</a>
                </div>
            </div>
        </div>
    `;
}
