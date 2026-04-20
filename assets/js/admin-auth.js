const API_BASE = "https://api.sn-designstudio.dev";

function showToast(msg, type = "success") {
    const container = document.getElementById("toast-container");
    if(!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

async function apiFetch(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('sn_jwt');
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(API_BASE + endpoint, options);
    return await res.json();
}

async function loginAdmin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const err = document.getElementById('login-error');
    const btn = document.getElementById('btn-login');

    err.style.display = 'none';
    if (!user || !pass) {
        err.innerText = "Please enter username and password";
        err.style.display = 'block';
        return;
    }

    try {
        if(btn) btn.innerText = "WAIT...";
        const res = await fetch(API_BASE + '/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (!res.ok) {
            err.innerText = `SERVER ERROR: ${res.status}`;
            err.style.display = 'block';
            if(btn) btn.innerText = "LOGIN";
            return;
        }

        const data = await res.json();
        if (data.success || data.token) {
            localStorage.setItem('sn_jwt', data.token);
            localStorage.setItem('sn_role', data.role || 'ADMIN');
            location.reload(); 
        } else {
            err.innerText = "WRONG USERNAME OR PASSWORD";
            err.style.display = 'block';
            if(btn) btn.innerText = "LOGIN";
        }
    } catch(e) {
        err.innerText = "NETWORK ERROR / API OFFLINE";
        err.style.display = 'block';
        if(btn) btn.innerText = "LOGIN";
    }
}

function logoutAdmin() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
}

function openUserModal() { document.getElementById('user-modal').style.display = 'flex'; }
function closeUserModal() { document.getElementById('user-modal').style.display = 'none'; }

async function saveUser() {
    const user = document.getElementById('mng-user').value;
    const credit = document.getElementById('mng-credit').value;
    if(!user || !credit) return showToast("Fill all fields", "error");
    try {
        const res = await apiFetch('/api/admin/users/save', 'POST', { username: user, credit: parseFloat(credit) });
        if(res.success) { showToast("User Saved"); closeUserModal(); }
    } catch(e) { showToast("DB Error", "error"); }
}

async function deleteUser() {
    const user = document.getElementById('mng-ban-user').value;
    if(!user) return showToast("Enter user ID", "error");
    try {
        const res = await apiFetch('/api/admin/users/delete', 'POST', { username: user });
        if(res.success) { showToast("User Banned", "warning"); closeUserModal(); }
    } catch(e) { showToast("DB Error", "error"); }
}

