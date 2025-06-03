import supabase from '../js/supabase.js';

const form = document.querySelector('.funfact-edit-form');
const titleInput = form.querySelector('input[name="title"]');
const subtitleInput = form.querySelector('input[name="subtitle"]');
const contentInput = form.querySelector('textarea[name="content"]');
const sumberInput = form.querySelector('input[name="sumber"]');
const imageInput = form.querySelector('input[name="image"]');
const imagePreview = document.getElementById('funfact-edit-image-preview');
const saveBtn = form.querySelector('.btn-save-funfact');

// Get funfact id from URL
const urlParams = new URLSearchParams(window.location.search);
const funfactId = urlParams.get('id');

async function loadFunfact() {
  if (!funfactId) return;
  const { data: funfact, error } = await supabase
    .from('funfacts')
    .select('*')
    .eq('id', funfactId)
    .single();
  if (error || !funfact) {
    alert('Failed to load funfact data.');
    return;
  }
  titleInput.value = funfact.title || '';
  subtitleInput.value = funfact.subtitle || '';
  contentInput.value = funfact.content || '';
  sumberInput.value = funfact.sumber || '';
  if (funfact.image_url) imagePreview.src = funfact.image_url;
}

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    imagePreview.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

saveBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  let imageUrl = imagePreview.src;
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `funfact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('funfact-images')
      .upload(fileName, file);
    if (uploadError) {
      alert('Image upload failed: ' + uploadError.message);
      return;
    }
    imageUrl = supabase.storage.from('funfact-images').getPublicUrl(fileName).data.publicUrl;
  }
  const { error } = await supabase
    .from('funfacts')
    .update({
      title: titleInput.value,
      subtitle: subtitleInput.value,
      content: contentInput.value,
      sumber: sumberInput.value,
      image_url: imageUrl
    })
    .eq('id', funfactId);
  if (error) {
    alert('Failed to update funfact: ' + error.message);
    return;
  }
  alert('Funfact updated successfully!');
  window.location.href = 'add-funfact.html';
});

window.addEventListener('DOMContentLoaded', loadFunfact);
