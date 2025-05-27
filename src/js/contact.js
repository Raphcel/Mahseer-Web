import supabase from '../js/supabase.js';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Optionally, check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to submit the form.');
      return;
    }

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Insert into Supabase
    const { error } = await supabase.from('contact_messages').insert([
      { name, phone, email, subject, message }
    ]);

    if (error) {
      alert('Failed to send message: ' + error.message);
    } else {
      alert('Message sent successfully!');
      form.reset();
    }
  });
});
