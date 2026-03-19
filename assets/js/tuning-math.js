const ROWS = 16;
const COLS = 16;
let mapData = [];

// ฟังก์ชันสร้างตารางเปล่า 16x16
function initMap() {
    mapData = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    renderTable();
}

// ฟังก์ชันวาดตารางลงหน้าเว็บ
function renderTable() {
    const container = document.getElementById('map-table');
    if (!container) return;

    let html = '<table border="1" style="border-collapse: collapse; width: 100%; text-a>
    for (let i = 0; i < ROWS; i++) {
        html += '<tr>';
        for (let j = 0; j < COLS; j++) {
            html += '<td style="padding: 5px; border: 1px solid #334155;">' + mapData[i>
        }
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;
}

// ฟังก์ชันจำลองการโหลดไฟล์ (ที่เราคุยกัน)
function loadTuningMap(fileNumber) {
    alert("กำลังเตรียมโหลดไฟล์ f_0000" + fileNumber + " เข้าสู่ตาราง...");
    // ขั้นตอนนี้จะรอให้เราเอาค่า Hex จากไฟล์ f_xxxx มาใส่จริง
    initMap();
}

// เริ่มต้นระบบเมื่อเปิดหน้าเว็บ
window.onload = initMap;
