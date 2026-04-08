/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: admin/dashboard.js
 * RESPONSIBILITY: Fetch & Render Finance Data
 * =====================================================
 */

async function initDashboard() {
    try {
        const token = localStorage.getItem("token"); // ดึง Token Admin

        // 1. ดึงข้อมูล Summary และ Partner Balance
        const res = await fetch("https://api.sn-designstudio.dev/api/admin/finance/summary", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.local) {
            document.getElementById("totalCreditSold").innerText = data.local.totalCreditSold.toLocaleString() + " THB";
            document.getElementById("totalCreditUsed").innerText = data.local.totalCreditUsed.toLocaleString();
            document.getElementById("netCreditBalance").innerText = data.local.netCreditBalance.toLocaleString();
            document.getElementById("activeUsers").innerText = data.local.activeUsers;
        }

        if (data.partners) {
            document.getElementById("elevenBalance").innerText = data.partners.elevenlabs.remaining?.toLocaleString() + " chars";
            document.getElementById("replicateStatus").innerText = data.partners.replicate.status;
        }

        // 2. ดึงข้อมูลรายการจ่ายเงินล่าสุด
        const resRecent = await fetch("https://api.sn-designstudio.dev/api/admin/finance/recent", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const recentData = await resRecent.json();
        renderRecentTable(recentData);

    } catch (err) {
        console.error("Dashboard Load Error:", err);
    }
}

function renderRecentTable(transactions) {
    const tbody = document.getElementById("recentTransactions");
    tbody.innerHTML = ""; // ล้างข้อมูลเก่า

    transactions.forEach(tx => {
        const row = `
            <tr>
                <td>${tx.user_id}</td>
                <td>${tx.method.toUpperCase()}</td>
                <td>${tx.amount} ${tx.currency}</td>
                <td class="status-${tx.status}">${tx.status}</td>
                <td>${new Date(tx.created_at).toLocaleString()}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// เริ่มทำงานเมื่อโหลดหน้าเสร็จ
document.addEventListener("DOMContentLoaded", initDashboard);
