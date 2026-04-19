"use strict";

const API_BASE = "https://api.sn-designstudio.dev";

// ฟังก์ชันดึง API พื้นฐาน
async function apiFetch(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('sn_jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        let res = await fetch(API_BASE + endpoint, options);
        if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            location.reload();
            throw new Error("Unauthorized");
        }
        return await res.json();
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}

// ระบบ Login
async function loginAdmin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const err = document.getElementById('login-error');
    const btn = document.getElementById('btn-login');

    if (!user || !pass) return;

    try {
        btn.innerText = "WAIT...";
        btn.disabled = true;

        const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        
        const data = await res.json();

        if (data.success) {
            localStorage.setItem('sn_jwt', data.token);
            localStorage.setItem('sn_role', data.role || 'ADMIN');
            location.reload();
        } else {
            err.innerText = "INVALID CREDENTIALS";
            err.style.display = 'block';
            btn.innerText = "LOGIN";
            btn.disabled = false;
        }
    } catch (e) {
        err.innerText = "SERVER OFFLINE";
        err.style.display = 'block';
        btn.innerText = "LOGIN";
        btn.disabled = false;
    }
}

function logoutAdmin() {
    localStorage.clear();
    location.reload();
}

// ฟังก์ชันจัดการ Database (ใน Modal)
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

// ตัวช่วย UI
function openUserModal() { document.getElementById('user-modal').style.display = 'flex'; }
function closeUserModal() { document.getElementById('user-modal').style.display = 'none'; }

