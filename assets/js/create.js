const engineManager = {
    generate: async function(id) {
        const email = localStorage.getItem('user_email');
        if(!email) return alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");

        // ดึงค่า Config พื้นฐานที่ User เลือก
        const resMult = document.getElementById(`res-${id}`).value;
        const durMult = document.getElementById(`dur-${id}`).value;
        const prompt = document.getElementById(`prompt-${id}`)?.value || "";

        const formData = new FormData();
        formData.append('email', email);
        formData.append('engine_id', id); // ส่งแค่ ID 01-14 ไปหลอกคนแกะโค้ด
        formData.append('res_mult', resMult);
        formData.append('dur_mult', durMult);
        formData.append('prompt', prompt);

        try {
            const response = await fetch('http://147.93.159.30:5003/api/use-service', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if(data.success) {
                alert(`[COMPLETE] Engine ${id} รับงานเรียบร้อย! หักเครดิต: ${data.cost}`);
                location.reload();
            } else {
                alert("ระบบขัดข้อง: " + data.message);
            }
        } catch (e) {
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์เรนเดอร์ได้");
        }
    }
};
