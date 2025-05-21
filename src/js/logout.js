import supabase from './supabase.js';

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    sessionStorage.clear();
    window.location.href = '../../index.html';
  });
}
