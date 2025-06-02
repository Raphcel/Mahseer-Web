import supabase from './supabase.js';

export default async function updateNavbar() {
const loginLink = document.querySelector('.login-link');
  const navGuest = document.getElementById('nav-guest');
  const navUser = document.getElementById('nav-user');
  const navAdmin = document.getElementById('nav-admin');

  function showGuestNavbar() {
    if (navGuest) navGuest.style.display = 'flex';
    if (navUser) navUser.style.display = 'none';
    if (navAdmin) navAdmin.style.display = 'none';
    if (loginLink) {
        loginLink.style.display = '';
        loginLink.href = '/src/pages/login.html';
    }
  }

  async function showUserNavbar() {
    const { data: user, error } = await supabase.auth.getUser();
    if (error || !user?.user) {
      showGuestNavbar();
      return;
    }

    const userId = user.user.id;
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!userData?.role) {
      showGuestNavbar();
      return;
    }

    const role = userData.role;

    if (navGuest) navGuest.style.display = 'none';
    if (loginLink) loginLink.style.display = 'none';

    if (role === 'admin') {
      if (navAdmin) navAdmin.style.display = 'flex';
      if (navUser) navUser.style.display = 'none';
    } else {
      if (navUser) navUser.style.display = 'flex';
      if (navAdmin) navAdmin.style.display = 'none';
    }

    const logoutButtons = document.querySelectorAll('.logout-button');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/index.html'; // reload ke home agar navbar reset
      });
    });
  }

  // Jalankan saat pertama kali
  showUserNavbar();

  // Dengarkan perubahan sesi login/logout
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_OUT') showGuestNavbar();
    if (event === 'SIGNED_IN') showUserNavbar();
  });
}
