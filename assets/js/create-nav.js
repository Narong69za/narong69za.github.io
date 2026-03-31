/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: assets/js/create-nav.js
 * DESCRIPTION: ดักรับ Token และดึงข้อมูล User มาโชว์
 * =====================================================
 */

(function() {
    // [1] ดักรับ Token ทันทีที่กลับมาจาก Google
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        // ล้าง URL ให้สวยงาม
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // [2] ฟังก์ชันดึงข้อมูลจาก Backend มาแสดงผล
    async function fetchUserProfile() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('https://api.sn-designstudio.dev/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (data.ok) {
                const user = data.user;

                // หยอดข้อมูลลง ID ที่พี่ตั้งไว้ใน HTML
                if(document.getElementById('userEmail')) 
                    document.getElementById('userEmail').innerText = user.email;
                
                if(document.getElementById('userRole')) 
                    document.getElementById('userRole').innerText = user.role.toUpperCase();
                
                if(document.getElementById('userCredits')) 
                    document.getElementById('userCredits').innerText = user.credits ?? 0;

                // หยอดตัวอักษรแรกของเมลในวงกลมด้านบน
                if(document.getElementById('userShort'))
                    document.getElementById('userShort').innerText = user.email.charAt(0).toUpperCase();

                console.log("✅ ข้อมูลโปรไฟล์อัปเดตแล้ว");
            } else {
                console.error("Token หมดอายุ หรือไม่ถูกต้อง");
                // localStorage.removeItem('token'); // เลือกเปิดถ้าต้องการให้หลุดล็อคอิน
            }
        } catch (err) {
            console.error("เชื่อมต่อ API ล้มเหลว:", err);
        }
    }

    // รันทันทีเมื่อโหลดหน้า
    document.addEventListener('DOMContentLoaded', fetchUserProfile);

})();

