import supabase from '../js/supabase.js';

// Load funfacts and render in table
async function loadFunfactsTable() {
  const tbody = document.getElementById('funfacts-table-body');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading...</td></tr>';

  const { data: funfacts, error } = await supabase
    .from('funfacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-red-500 text-center">Failed to load funfacts: ${error.message}</td></tr>`;
    return;
  }

  if (!funfacts || funfacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No funfacts found.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  funfacts.forEach(fact => {
    const tr = document.createElement('tr');
    tr.innerHTML = [
      `<td class="border px-4 py-2 text-center">${fact.title || ''}</td>`,
      `<td class="border px-4 py-2 text-center">${fact.subtitle || ''}</td>`,
      `<td class="border px-4 py-2 text-center">${(fact.content || '').slice(0, 80)}${(fact.content && fact.content.length > 80 ? '...' : '')}</td>`,
      `<td class="border px-4 py-2 text-center">${fact.sumber || ''}</td>`,
      `<td class="border px-4 py-2 text-center">${fact.image_url ? `<img src='${fact.image_url}' alt='img' style='max-width:60px;max-height:60px;border-radius:6px;'>` : '-'}</td>`,
      `<td class="border px-4 py-2 text-center">${fact.created_at ? new Date(fact.created_at).toLocaleString() : '-'}</td>`,
      `<td class="border px-4 py-2 text-center">
        <button class="edit-funfact-btn bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold py-1 px-3 rounded mr-2" data-id="${fact.id}">Edit</button>
        <button class="delete-funfact-btn bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded" data-id="${fact.id}">Delete</button>
      </td>`
    ].join('');
    tbody.appendChild(tr);
  });

  // Add event listeners for edit and delete
  document.querySelectorAll('.edit-funfact-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      window.location.href = `edit-funfact.html?id=${id}`;
    });
  });
  document.querySelectorAll('.delete-funfact-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this funfact?')) {
        const { error } = await supabase.from('funfacts').delete().eq('id', id);
        if (error) {
          alert('Failed to delete funfact: ' + error.message);
        } else {
          // Reload table after delete
          loadFunfactsTable();
        }
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', loadFunfactsTable);
