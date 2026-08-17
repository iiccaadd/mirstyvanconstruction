/**
 * Auth Guard: Memproteksi halaman yang membutuhkan login
 */
(async function initAuthGuard() {
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath.includes('login.html') ||
                     currentPath.includes('register.html') ||
                     currentPath.includes('forgot-password.html') ||
                     currentPath.includes('reset-password.html');

  const token = API.getAccessToken();

  if (!token) {
    // Coba refresh token secara background dari httpOnly cookie
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success && data.accessToken) {
        API.setAccessToken(data.accessToken);
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }

        // Jika sudah login dan membuka halaman login/register, arahkan ke dashboard
        if (isAuthPage) {
          window.location.href = 'dashboard.html';
          return;
        }
      } else {
        // Unauthenticated
        if (!isAuthPage && !currentPath.includes('verify-email.html')) {
          window.location.href = 'login.html';
          return;
        }
      }
    } catch (err) {
      if (!isAuthPage && !currentPath.includes('verify-email.html')) {
        window.location.href = 'login.html';
        return;
      }
    }
  } else {
    // Token ada di client
    if (isAuthPage) {
      window.location.href = 'dashboard.html';
    }
  }
})();
