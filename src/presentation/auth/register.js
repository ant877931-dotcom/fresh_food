export function renderRegister() {
    return `
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #ffffff;">
            <div style="width: 100%; max-width: 400px; padding: 2.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #eaeaea;">
                <h2 style="text-align: center; margin-bottom: 2rem; color: #333; font-family: sans-serif;">Register</h2>
                <form id="registerForm" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <input type="text" id="name" placeholder="Nama Lengkap" required style="padding: 0.875rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; outline: none; font-family: sans-serif;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <input type="email" id="email" placeholder="Email" required style="padding: 0.875rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; outline: none; font-family: sans-serif;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <input type="password" id="password" autocomplete="new-password" placeholder="Password" required style="padding: 0.875rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; outline: none; font-family: sans-serif;">
                    </div>
                    <button type="submit" style="margin-top: 0.5rem; padding: 0.875rem; background-color: var(--primary); color: var(--primary-text); border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: sans-serif;">
                        Daftar
                    </button>
                </form>
                <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; font-family: sans-serif; color: #666;">
                    Sudah punya akun? <a href="#/login" style="color: var(--primary); text-decoration: none; font-weight: bold;">Login di sini</a>
                </div>
            </div>
        </div>
    `;
}
