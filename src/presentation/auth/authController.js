// src/presentation/auth/authController.js
import { authView } from './authView.js';
import { authUseCase } from '../../domain/usecases/authUseCase.js';

export const authController = {
  /**
   * Render halaman login
   */
  async renderLogin() {
    const app = document.getElementById('app');
    
    // Jika sudah login, redirect ke home
    const user = await authUseCase.getCurrentSession();
    if (user) {
      window.location.hash = '/';
      return;
    }

    app.innerHTML = authView.renderLogin();
    this.attachLoginEvents();
  },

  /**
   * Render halaman register
   */
  async renderRegister() {
    const app = document.getElementById('app');
    
    const user = await authUseCase.getCurrentSession();
    if (user) {
      window.location.hash = '/';
      return;
    }

    app.innerHTML = authView.renderRegister();
    this.attachRegisterEvents();
  },

  /**
   * Render halaman lupa password
   */
  async renderForgotPassword() {
    const app = document.getElementById('app');
    app.innerHTML = authView.renderForgotPassword();
    this.attachForgotPasswordEvents();
  },

  /**
   * Event Listener untuk Form Login
   */
  attachLoginEvents() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        errorMsg.style.display = 'none';
        const user = await authUseCase.login(email, password);
        // Cek profil/role setelah login
        const sessionUser = await authUseCase.getCurrentSession();
        if (sessionUser && sessionUser.isAdmin()) {
          window.location.hash = '/admin/dashboard';
        } else {
          window.location.hash = '/';
        }
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
      }
    });
  },

  /**
   * Event Listener untuk Form Register
   */
  attachRegisterEvents() {
    const form = document.getElementById('registerForm');
    const errorMsg = document.getElementById('errorMsg');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        errorMsg.style.display = 'none';
        await authUseCase.register(email, password, fullName);
        alert('Pendaftaran berhasil! Jika Anda harus konfirmasi email, silakan cek inbox Anda. Jika tidak, Anda akan diarahkan ke katalog.');
        window.location.hash = '/';
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
      }
    });
  },

  /**
   * Event Listener untuk Form Lupa Password
   */
  attachForgotPasswordEvents() {
    const form = document.getElementById('forgotPasswordForm');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      
      try {
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        await authUseCase.forgotPassword(email);
        successMsg.style.display = 'block';
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
      }
    });
  }
};
