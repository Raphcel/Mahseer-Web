import supabase from './supabase.js';

async function updateReadStatus(id, isRead) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: isRead })
    .eq('id', id);
  if (!error) {
    const row = document.getElementById(`row-${id}`);
    const badge = row.querySelector('.status-badge');
    const btn = row.querySelector('.toggle-read-btn');
    if (isRead) {
      badge.textContent = 'Read';
      badge.className = 'status-badge inline-block px-2 py-1 rounded bg-green-200 text-green-800 text-xs';
      btn.textContent = 'Mark as Unread';
      btn.className = 'toggle-read-btn bg-yellow-500 hover:bg-yellow-700 text-white text-xs font-bold py-1 px-3 rounded';
      row.className = 'bg-gray-100';
    } else {
      badge.textContent = 'Unread';
      badge.className = 'status-badge inline-block px-2 py-1 rounded bg-yellow-200 text-yellow-800 text-xs';
      btn.textContent = 'Mark as Read';
      btn.className = 'toggle-read-btn bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-3 rounded';
      row.className = '';
    }
  }
}

async function loadContactMessages() {
  const tbody = document.getElementById('contact-messages-body');
  tbody.innerHTML = '<tr><td colspan="8" class="text-center">Loading...</td></tr>';

  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-red-500 text-center">Failed to load messages: ${error.message}</td></tr>`;
    return;
  }

  if (!messages || messages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">No messages found.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  messages.forEach(msg => {
    const isRead = msg.is_read;
    const tr = document.createElement('tr');
    tr.id = `row-${msg.id}`;
    tr.className = isRead ? 'bg-gray-100' : '';
    tr.innerHTML = [
      `<td class="border px-4 py-2 text-center">${msg.name}</td>`,
      `<td class="border px-4 py-2 text-center">${msg.phone}</td>`,
      `<td class="border px-4 py-2 text-center">${msg.email}</td>`,
      `<td class="border px-4 py-2 text-center">${msg.subject || '-'}</td>`,
      `<td class="border px-4 py-2 text-center">${msg.message}</td>`,
      `<td class="border px-4 py-2 text-center">${new Date(msg.created_at).toLocaleString()}</td>`,
      `<td class="border px-4 py-2 text-center">
        <span class="status-badge inline-block px-2 py-1 rounded ${isRead ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'} text-xs">${isRead ? 'Read' : 'Unread'}</span>
      </td>`,
      `<td class="border px-4 py-2 text-center">
        <button class="toggle-read-btn ${isRead ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-blue-500 hover:bg-blue-700'} text-white text-xs font-bold py-1 px-3 rounded">${isRead ? 'Mark as Unread' : 'Mark as Read'}</button>
      </td>`
    ].join('');
    tbody.appendChild(tr);
    tr.querySelector('.toggle-read-btn').addEventListener('click', () => updateReadStatus(msg.id, !isRead));
  });
}

document.addEventListener('DOMContentLoaded', loadContactMessages);
