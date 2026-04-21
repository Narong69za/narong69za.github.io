const createNav = {
    checkAuth: function() {
        const email = localStorage.getItem('user_email');
        if (!email) {
            // bypass_redirect; // ถ้าไม่มี Login ให้เด้งออกไปหน้า Login ทันที
        }
        return email;
    },
    
    updateHeader: async function() {
        const email = this.checkAuth();
        try {
            const res = await fetch(`http://147.93.159.30:5003/api/verify-access`, {
                method: 'POST',
                body: new URLSearchParams({ 
                    'email': email, 
                    'hwid': btoa(navigator.userAgent).substring(0, 16) 
                })
            });
            const data = await res.json();
            
            if (data.ok) {
                document.getElementById('user-display').innerText = email;
                document.getElementById('credit-display').innerText = data.credits.toLocaleString();
                
                // ถ้าเครดิตหมด ให้แจ้งเตือนและเตรียมลิ้งค์ไป payment.html
                if (data.credits <= 0 && data.free_remaining <= 0) {
                    alert("เครดิตหมดแล้ว! กำลังพาท่านไปหน้าเติมเงิน");
                    window.location.href = 'payment.html';
                }
            } else {
                localStorage.clear();
                // bypass_redirect;
            }
        } catch (e) {
            console.error("Auth System Offline");
        }
    }
};

document.addEventListener('DOMContentLoaded', () => createNav.updateHeader());
