// ปรับปรุงฟังก์ชัน getColor ให้เป็นโทน น้ำเงิน-ม่วง-แดง (ดุดัน)
function getColor(val) {
    const ratio = Math.min(Math.max(val / 255, 0), 1);
    // 240 (Blue) -> 300 (Purple) -> 0 (Red)
    const hue = (1 - ratio) * 240; 
    return `hsla(${hue}, 80%, 50%, 0.35)`;
}

// เพิ่มระบบเลือกหลายช่อง (Multi-select)
function renderTable() {
    const table = document.getElementById('tuning-map');
    let html = '<thead><tr><th>RPM \\ kPa</th>';
    for (let c = 0; c < COLS; c++) html += `<th>${(c+1)*500}</th>`;
    html += '</tr></thead><tbody>';

    for (let i = 0; i < ROWS; i++) {
        html += `<tr><td>${(i+1)*10}</td>`;
        for (let j = 0; j < COLS; j++) {
            const val = mapData[i][j];
            html += `<td class="tune-cell" 
                        data-row="${i}" data-col="${j}"
                        style="background-color: ${getColor(val)};" 
                        onclick="this.classList.toggle('selected')">
                        ${val}
                    </td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    table.innerHTML = html;
}

// ฟังก์ชันปรับค่า (คำนวณจากช่องที่เลือกทั้งหมด)
function adjustValue(multiplier) {
    const selected = document.querySelectorAll('td.selected');
    if(selected.length === 0) {
        addLog("Alert: เลือกช่องในตารางก่อนปรับค่าครับ");
        return;
    }
    selected.forEach(td => {
        let r = td.getAttribute('data-row');
        let c = td.getAttribute('data-col');
        let newVal = Math.round(parseInt(td.innerText) * multiplier);
        if(newVal > 255) newVal = 255;
        if(newVal < 0) newVal = 0;
        
        mapData[r][c] = newVal;
        td.innerText = newVal;
        td.style.backgroundColor = getColor(newVal);
    });
    addLog(`System: ปรับจูนค่า ${selected.length} จุดเรียบร้อย`);
                     }
