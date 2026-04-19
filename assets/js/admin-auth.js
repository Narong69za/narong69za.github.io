"use strict";

// ==========================================
// 1. CONFIG & GLOBAL STATE
// ==========================================
const ENV = {
    API_BASE: "https://api.sn-designstudio.dev"
};

const STATE = {
    socket: null,
    sysChart: null,
    timers: { key: null, faucet: null, hamster: null },
    faucetTotal: 0,
    reconnectAttempts: 0
};

// ==========================================
// 2. DOM UTILS & SANITIZATION
// ==========================================
function qs(id) { return document.getElementById(id); }

function safeText(id, text) { 
    const el = qs(id); 
    if (el) el.textContent = text; 
}

function showToast(msg, type = "success") {
    const container = qs("toast-container");
    if(!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type} flex items-center gap-3`; 
    
    let iconClass = "fa-check-circle text-green-400";
    if(type === 'error') iconClass = "fa-times-circle text-red-400";
    if(type === 'warning') iconClass = "fa-exclamation-triangle text-amber-400";

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${sanitizeHTML(msg)}</span>`;
    container.appendChild(toast); 
    setTimeout(() => toast.remove(), 5000);
}

function sanitizeHTML(str) {
    return String(str).replace(/[&<>'"]/g, match => 
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[match])
    );
}

// ==========================================
// 3. SECURE API WRAPPER
// ==========================================
function getAuthToken() {
    return sessionStorage.getItem('sn_jwt') || localStorage.getItem('sn_jwt');
}

function setAuthData(data) {
    sessionStorage.setItem('sn_jwt', data.token);
    sessionStorage.setItem('sn_role', data.role || 'ADMIN');
    localStorage.setItem('sn_user', data.user || 'admin'); 
}

async function apiFetch(endpoint, method = 'GET', body = null) {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        let res = await fetch(ENV.API_BASE + endpoint, options);
        if (res.status === 401 || res.status === 403) {
            showToast("Session expired. Logging out...", "error");
            setTimeout(logoutAdmin, 1500);
            throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("[API Error]:", err.message);
        throw err;
    }
}

// ==========================================
// 4. AUTHENTICATION & ANTI-BRUTE FORCE
// ==========================================
async function loginAdmin() {
    const userEl = qs('admin-user');
    const passEl = qs('admin-pass');
    const errEl = qs('login-error');
    
    const username = userEl.value.trim(); 
    const password = passEl.value;

    const lockTime = localStorage.getItem('sn_login_lock');
    if (lockTime && Date.now() < parseInt(lockTime)) {
        errEl.textContent = `TOO MANY ATTEMPTS. TRY AGAIN LATER.`;
        errEl.style.display = 'block';
        return;
    }

    try {
        const res = await fetch(`${ENV.API_BASE}/api/admin/login`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ username, password }) 
        });
        const data = await res.json();

        if (data.success) { 
            data.user = username;
            setAuthData(data);
            localStorage.removeItem('sn_login_fails');
            location.reload(); 
        } else { 
            let fails = parseInt(localStorage.getItem('sn_login_fails') || '0') + 1;
            localStorage.setItem('sn_login_fails', fails);
            if (fails >= 5) {
                localStorage.setItem('sn_login_lock', Date.now() + 60000); // Lock 1 minute
                errEl.textContent = "LOCKED OUT FOR 1 MINUTE";
            } else {
                errEl.textContent = `INVALID CREDENTIALS (${5 - fails} ATTEMPTS LEFT)`;
            }
            errEl.style.display = 'block';
        }
    } catch (e) { 
        showToast("API Server Offline", "error"); 
    }
}

async function logoutAdmin() { 
    try { await apiFetch('/api/admin/logout', 'POST'); } catch(e) {} 
    sessionStorage.clear(); localStorage.clear(); location.reload(); 
}

// ==========================================
// 5. USER MANAGEMENT (CRUD Modal)
// ==========================================
function openUserModal() { qs('user-modal').style.display = 'flex'; }
function closeUserModal() { qs('user-modal').style.display = 'none'; }

async function saveUser() {
    const user = qs('mng-user').value.trim();
    const credit = qs('mng-credit').value.trim();
    if(!user || !credit) return showToast("Please fill all fields", "error");
    const btn = qs('btn-save-user'); btn.textContent = "SAVING..."; btn.disabled = true;

    try {
        const res = await apiFetch('/api/admin/users/save', 'POST', { username: user, credit: parseFloat(credit) });
        showToast(res.success ? "User updated successfully" : "Save failed", res.success ? "success" : "error");
        if(res.success) closeUserModal();
    } catch(e) { showToast("Failed to connect to DB", "error"); }
    finally { btn.textContent = "SAVE USER DATA"; btn.disabled = false; }
}

async function deleteUser() {
    const user = qs('mng-ban-user').value.trim();
    if(!user) return showToast("Enter username to ban", "error");
    const btn = qs('btn-delete-user'); btn.textContent = "EXECUTING..."; btn.disabled = true;

    try {
        const res = await apiFetch('/api/admin/users/delete', 'POST', { username: user });
        showToast(res.success ? "User banned/removed" : "Ban failed", res.success ? "warning" : "error");
        if(res.success) closeUserModal();
    } catch(e) { showToast("Failed to connect to DB", "error"); }
    finally { btn.textContent = "EXECUTE BAN"; btn.disabled = false; }
}

