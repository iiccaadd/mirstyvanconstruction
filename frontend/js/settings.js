document.addEventListener('DOMContentLoaded', () => {
  let currentUser = null;

  // Tab switching elements
  const tabButtons = document.querySelectorAll('.settings-tab-btn');
  const sections = document.querySelectorAll('.settings-section');
  const globalAlert = document.getElementById('settingsGlobalAlert');

  // Profile elements
  const formProfile = document.getElementById('formProfile');
  const profileName = document.getElementById('profileName');
  const profilePhone = document.getElementById('profilePhone');
  const profileBio = document.getElementById('profileBio');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const btnSaveProfile = document.getElementById('btnSaveProfile');

  // Change email elements
  const formChangeEmail = document.getElementById('formChangeEmail');
  const currentEmailDisplay = document.getElementById('currentEmailDisplay');
  const newEmailInput = document.getElementById('newEmailInput');
  const btnChangeEmail = document.getElementById('btnChangeEmail');

  // Password elements
  const formChangePassword = document.getElementById('formChangePassword');
  const oldPassword = document.getElementById('oldPassword');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
  const btnSavePassword = document.getElementById('btnSavePassword');

  // 2FA elements
  const settings2FABadge = document.getElementById('settings2FABadge');
  const btnSettingsToggle2FA = document.getElementById('btnSettingsToggle2FA');
  const modalSetup2FA = document.getElementById('modalSetup2FA');
  const btnClose2FAModal = document.getElementById('btnClose2FAModal');
  const qrCodeImg = document.getElementById('qrCodeImg');
  const secretText = document.getElementById('secretText');
  const setupSecretKey = document.getElementById('setupSecretKey');
  const setupOtpCode = document.getElementById('setupOtpCode');
  const formVerifySetup2FA = document.getElementById('formVerifySetup2FA');
  const btnSubmitSetup2FA = document.getElementById('btnSubmitSetup2FA');
  const modal2FAAlert = document.getElementById('modal2FAAlert');

  const modalDisable2FA = document.getElementById('modalDisable2FA');
  const btnCloseDisableModal = document.getElementById('btnCloseDisableModal');
  const btnCancelDisable = document.getElementById('btnCancelDisable');
  const formDisable2FA = document.getElementById('formDisable2FA');
  const disablePassword = document.getElementById('disablePassword');
  const btnConfirmDisable = document.getElementById('btnConfirmDisable');
  const modalDisableAlert = document.getElementById('modalDisableAlert');

  // Sessions elements
  const settingsSessionsList = document.getElementById('settingsSessionsList');
  const btnSettingsRevokeAll = document.getElementById('btnSettingsRevokeAll');

  // Preferences elements
  const formPreferences = document.getElementById('formPreferences');
  const prefEmailNotif = document.getElementById('prefEmailNotif');
  const prefPushNotif = document.getElementById('prefPushNotif');
  const prefTheme = document.getElementById('prefTheme');
  const btnSavePreferences = document.getElementById('btnSavePreferences');

  // Delete account elements
  const btnOpenDeleteModal = document.getElementById('btnOpenDeleteModal');
  const modalDeleteAccount = document.getElementById('modalDeleteAccount');
  const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const formConfirmDelete = document.getElementById('formConfirmDelete');
  const deletePasswordInput = document.getElementById('deletePasswordInput');
  const deleteEmailInput = document.getElementById('deleteEmailInput');
  const deleteEmailConfirmTarget = document.getElementById('deleteEmailConfirmTarget');
  const modalDeleteAlert = document.getElementById('modalDeleteAlert');
  const btnExecuteDelete = document.getElementById('btnExecuteDelete');
  const btnLogout = document.getElementById('btnLogout');

  // ==========================================================================
  // HELPERS & ALERTS
  // ==========================================================================

  function showGlobalAlert(message, type = 'success') {
    globalAlert.textContent = message;
    globalAlert.className = `alert alert-${type}`;
    globalAlert.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      globalAlert.style.display = 'none';
    }, 5000);
  }

  function showModalAlert(element, message, type = 'error') {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.style.display = 'block';
  }

  function hideModalAlert(element) {
    element.style.display = 'none';
  }

  function setLoading(button, isLoading, text = 'Menyimpan...') {
    const textSpan = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    button.disabled = isLoading;

    if (isLoading) {
      if (textSpan) textSpan.textContent = text;
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      if (textSpan) textSpan.textContent = text;
      if (spinner) spinner.style.display = 'none';
    }
  }

  function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m]));
  }

  // ==========================================================================
  // 1. TAB SWITCHING
  // ==========================================================================

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove('active'));
      sections.forEach((s) => s.classList.remove('active'));

      btn.classList.add('active');
      const targetSection = document.getElementById(targetTab);
      if (targetSection) targetSection.classList.add('active');
    });
  });

  // ==========================================================================
  // 2. LOAD USER PROFILE & SETTINGS
  // ==========================================================================

  async function loadInitialData() {
    try {
      const res = await API.get('/api/user/profile');
      if (res.success && res.data) {
        currentUser = res.data;
        populateProfile(currentUser);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }

    loadPreferences();
    loadSessions();
  }

  function populateProfile(user) {
    profileName.value = user.name || '';
    profilePhone.value = user.phoneNumber || '';
    profileBio.value = user.bio || '';
    currentEmailDisplay.textContent = user.email || '';
    deleteEmailConfirmTarget.textContent = user.email || '';

    if (user.avatarUrl) {
      avatarPreview.src = user.avatarUrl;
    }

    if (user.twoFactorEnabled) {
      settings2FABadge.innerHTML = '<span class="badge badge-success">✓ Aktif</span>';
      btnSettingsToggle2FA.textContent = 'Nonaktifkan 2FA';
      btnSettingsToggle2FA.className = 'btn btn-danger';
    } else {
      settings2FABadge.innerHTML = '<span class="badge badge-secondary">Nonaktif</span>';
      btnSettingsToggle2FA.textContent = 'Aktifkan 2FA';
      btnSettingsToggle2FA.className = 'btn btn-primary';
    }
  }

  // ==========================================================================
  // 3. EDIT PROFILE & AVATAR
  // ==========================================================================

  formProfile.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = profileName.value.trim();
    const phoneNumber = profilePhone.value.trim();
    const bio = profileBio.value.trim();

    if (!name) {
      showGlobalAlert('Nama lengkap wajib diisi.', 'error');
      return;
    }

    setLoading(btnSaveProfile, true, 'Menyimpan...');

    try {
      const res = await API.put('/api/settings/profile', { name, phoneNumber, bio });
      if (res.success) {
        showGlobalAlert(res.message || 'Profil berhasil diperbarui.', 'success');
        if (currentUser) {
          currentUser.name = name;
          currentUser.phoneNumber = phoneNumber;
          currentUser.bio = bio;
        }
      } else {
        showGlobalAlert(res.message || 'Gagal memperbarui profil.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan koneksi server.', 'error');
    } finally {
      setLoading(btnSaveProfile, false, 'Simpan Perubahan Profil');
    }
  });

  // Avatar Upload Listener
  avatarFileInput.addEventListener('change', async () => {
    const file = avatarFileInput.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showGlobalAlert('Ukuran foto maksimal 2MB.', 'error');
      avatarFileInput.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      showGlobalAlert('Mengunggah foto profil...', 'warning');
      const res = await API.upload('/api/settings/avatar', formData);

      if (res.success && res.data && res.data.avatarUrl) {
        avatarPreview.src = res.data.avatarUrl;
        showGlobalAlert('Foto profil berhasil diunggah dan disimpan.', 'success');
      } else {
        showGlobalAlert(res.message || 'Gagal mengunggah foto profil.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan saat mengunggah avatar.', 'error');
    }
  });

  // Change Email Listener
  formChangeEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = newEmailInput.value.trim();

    if (!newEmail) {
      showGlobalAlert('Masukkan alamat email baru.', 'error');
      return;
    }

    setLoading(btnChangeEmail, true, 'Mengirim Tautan...');

    try {
      const res = await API.put('/api/settings/email', { newEmail });
      if (res.success) {
        showGlobalAlert(res.message || 'Tautan konfirmasi telah dikirim ke email baru.', 'success');
        newEmailInput.value = '';
      } else {
        showGlobalAlert(res.message || 'Gagal memproses perubahan email.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setLoading(btnChangeEmail, false, 'Kirim Tautan Verifikasi Email Baru');
    }
  });

  // ==========================================================================
  // 4. UBAH PASSWORD
  // ==========================================================================

  formChangePassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPwd = oldPassword.value;
    const newPwd = newPasswordInput.value;
    const confirmPwd = confirmNewPasswordInput.value;

    if (!oldPwd || !newPwd) {
      showGlobalAlert('Semua kolom password wajib diisi.', 'error');
      return;
    }

    if (newPwd.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPwd)) {
      showGlobalAlert('Password baru minimal 8 karakter dan kombinasi huruf besar, kecil, dan angka.', 'error');
      return;
    }

    if (newPwd !== confirmPwd) {
      showGlobalAlert('Konfirmasi password baru tidak cocok.', 'error');
      return;
    }

    setLoading(btnSavePassword, true, 'Menyimpan...');

    try {
      const res = await API.put('/api/settings/password', {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });

      if (res.success) {
        showGlobalAlert(res.message || 'Password berhasil diubah.', 'success');
        formChangePassword.reset();
      } else {
        showGlobalAlert(res.message || 'Gagal mengubah password.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan saat mengubah password.', 'error');
    } finally {
      setLoading(btnSavePassword, false, 'Perbarui Password');
    }
  });

  // ==========================================================================
  // 5. 2FA (ENABLE / DISABLE)
  // ==========================================================================

  btnSettingsToggle2FA.addEventListener('click', async () => {
    if (currentUser && currentUser.twoFactorEnabled) {
      // Disable modal
      disablePassword.value = '';
      hideModalAlert(modalDisableAlert);
      modalDisable2FA.classList.add('active');
      disablePassword.focus();
    } else {
      // Enable modal
      hideModalAlert(modal2FAAlert);
      setupOtpCode.value = '';

      try {
        const res = await API.post('/api/auth/2fa/enable');
        if (res.success && res.data) {
          qrCodeImg.src = res.data.qrCode;
          secretText.textContent = res.data.secret;
          setupSecretKey.value = res.data.secret;
          modalSetup2FA.classList.add('active');
          setupOtpCode.focus();
        } else {
          showGlobalAlert(res.message || 'Gagal membuat konfigurasi 2FA.', 'error');
        }
      } catch (err) {
        showGlobalAlert('Terjadi kesalahan koneksi 2FA.', 'error');
      }
    }
  });

  btnClose2FAModal.addEventListener('click', () => modalSetup2FA.classList.remove('active'));
  btnCloseDisableModal.addEventListener('click', () => modalDisable2FA.classList.remove('active'));
  btnCancelDisable.addEventListener('click', () => modalDisable2FA.classList.remove('active'));

  formVerifySetup2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modal2FAAlert);

    const secret = setupSecretKey.value;
    const otp = setupOtpCode.value.trim();

    if (!otp || otp.length !== 6) {
      showModalAlert(modal2FAAlert, 'Masukkan 6 digit angka kode OTP.');
      return;
    }

    btnSubmitSetup2FA.disabled = true;

    try {
      const res = await API.post('/api/auth/2fa/verify-setup', { secret, otp });
      if (res.success) {
        modalSetup2FA.classList.remove('active');
        showGlobalAlert('2FA berhasil diaktifkan untuk akun Anda.', 'success');
        if (currentUser) currentUser.twoFactorEnabled = true;
        populateProfile(currentUser);
      } else {
        showModalAlert(modal2FAAlert, res.message || 'Kode OTP salah.');
      }
    } catch (err) {
      showModalAlert(modal2FAAlert, 'Gagal memverifikasi 2FA.');
    } finally {
      btnSubmitSetup2FA.disabled = false;
    }
  });

  formDisable2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modalDisableAlert);

    const password = disablePassword.value;
    if (!password) {
      showModalAlert(modalDisableAlert, 'Masukkan password Anda.');
      return;
    }

    btnConfirmDisable.disabled = true;

    try {
      const res = await API.post('/api/auth/2fa/disable', { password });
      if (res.success) {
        modalDisable2FA.classList.remove('active');
        showGlobalAlert('2FA berhasil dinonaktifkan.', 'success');
        if (currentUser) currentUser.twoFactorEnabled = false;
        populateProfile(currentUser);
      } else {
        showModalAlert(modalDisableAlert, res.message || 'Password salah.');
      }
    } catch (err) {
      showModalAlert(modalDisableAlert, 'Gagal menonaktifkan 2FA.');
    } finally {
      btnConfirmDisable.disabled = false;
    }
  });

  // ==========================================================================
  // 6. KELOLA SESI AKTIF (MULTI-DEVICE)
  // ==========================================================================

  async function loadSessions() {
    try {
      const res = await API.get('/api/settings/sessions');
      if (res.success && Array.isArray(res.data)) {
        renderSessions(res.data);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  }

  function renderSessions(sessions) {
    if (sessions.length === 0) {
      settingsSessionsList.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--slate-400); padding: 1.5rem;">Tidak ada sesi aktif.</td>
        </tr>
      `;
      return;
    }

    settingsSessionsList.innerHTML = sessions.map((s) => {
      const isCurrent = s.isCurrent;
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--slate-900); font-size: 0.875rem;">${escapeHtml(s.deviceInfo)}</div>
          </td>
          <td><code style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--slate-600);">${s.ipAddress}</code></td>
          <td style="color: var(--slate-600); font-size: 0.825rem;">${formatDate(s.lastActiveAt)}</td>
          <td>
            ${isCurrent
              ? '<span class="badge badge-success">Perangkat Ini (Aktif)</span>'
              : '<span class="badge badge-secondary">Aktif</span>'
            }
          </td>
          <td>
            ${isCurrent
              ? '<span style="font-size: 0.775rem; color: var(--slate-400);">-</span>'
              : `<button class="btn btn-secondary btn-revoke-session" data-id="${s.id}" style="width: auto; padding: 0.25rem 0.6rem; font-size: 0.75rem;">Cabut</button>`
            }
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.btn-revoke-session').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const sessionId = btn.dataset.id;
        if (confirm('Cabut sesi perangkat ini?')) {
          try {
            const res = await API.delete(`/api/settings/sessions/${sessionId}`);
            if (res.success) {
              showGlobalAlert('Sesi perangkat berhasil dicabut.', 'success');
              loadSessions();
            } else {
              showGlobalAlert(res.message || 'Gagal mencabut sesi.', 'error');
            }
          } catch (err) {
            showGlobalAlert('Terjadi kesalahan koneksi.', 'error');
          }
        }
      });
    });
  }

  btnSettingsRevokeAll.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin logout dari semua perangkat lain?')) {
      try {
        const res = await API.delete('/api/settings/sessions/all');
        if (res.success) {
          showGlobalAlert(res.message || 'Sesi pada perangkat lain berhasil dicabut.', 'success');
          loadSessions();
        } else {
          showGlobalAlert(res.message || 'Gagal mencabut sesi.', 'error');
        }
      } catch (err) {
        showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
      }
    }
  });

  // ==========================================================================
  // 7. PREFERENSI NOTIFIKASI & TEMA
  // ==========================================================================

  async function loadPreferences() {
    try {
      const res = await API.get('/api/settings/preferences');
      if (res.success && res.data) {
        prefEmailNotif.checked = res.data.email_notifications;
        prefPushNotif.checked = res.data.push_notifications;
        if (res.data.theme) prefTheme.value = res.data.theme;
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  }

  formPreferences.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailNotifications = prefEmailNotif.checked;
    const pushNotifications = prefPushNotif.checked;
    const theme = prefTheme.value;

    setLoading(btnSavePreferences, true, 'Menyimpan...');

    try {
      const res = await API.put('/api/settings/preferences', {
        emailNotifications,
        pushNotifications,
        theme,
      });

      if (res.success) {
        showGlobalAlert(res.message || 'Preferensi berhasil disimpan.', 'success');
      } else {
        showGlobalAlert(res.message || 'Gagal menyimpan preferensi.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setLoading(btnSavePreferences, false, 'Simpan Preferensi');
    }
  });

  // ==========================================================================
  // 8. HAPUS AKUN (SOFT DELETE)
  // ==========================================================================

  btnOpenDeleteModal.addEventListener('click', () => {
    deletePasswordInput.value = '';
    deleteEmailInput.value = '';
    hideModalAlert(modalDeleteAlert);
    modalDeleteAccount.classList.add('active');
  });

  btnCloseDeleteModal.addEventListener('click', () => modalDeleteAccount.classList.remove('active'));
  btnCancelDelete.addEventListener('click', () => modalDeleteAccount.classList.remove('active'));

  formConfirmDelete.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modalDeleteAlert);

    const password = deletePasswordInput.value;
    const confirmEmail = deleteEmailInput.value.trim();

    if (!password && !confirmEmail) {
      showModalAlert(modalDeleteAlert, 'Masukkan password akun atau ketik ulang email Anda.');
      return;
    }

    setLoading(btnExecuteDelete, true, 'Menghapus Akun...');

    try {
      const res = await API.delete('/api/settings/account', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmEmail }),
      });

      if (res.success) {
        modalDeleteAccount.classList.remove('active');
        alert('Akun Anda telah dinonaktifkan. Terima kasih telah menggunakan layanan kami.');
        API.clearAuth();
        window.location.href = 'login.html';
      } else {
        showModalAlert(modalDeleteAlert, res.message || 'Konfirmasi salah. Gagal menghapus akun.');
      }
    } catch (err) {
      showModalAlert(modalDeleteAlert, 'Terjadi kesalahan server saat menghapus akun.');
    } finally {
      setLoading(btnExecuteDelete, false, 'Ya, Hapus Akun');
    }
  });

  // ==========================================================================
  // 9. LOGOUT
  // ==========================================================================

  btnLogout.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await API.post('/api/auth/logout');
      } catch (e) {
        // Ignore network errors on logout
      } finally {
        API.clearAuth();
        window.location.href = 'login.html';
      }
    }
  });

  // Init
  loadInitialData();
});
