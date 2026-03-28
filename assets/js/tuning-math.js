const ROWS = 16;
const COLS = 16;
let mapData = [];

// เริ่มต้นหน้าเว็บ
window.onload = () => {
    mapData = Array.from({ length: ROWS }, () => Array(COLS).fill(100));
    renderTable();
    addLog("SN DESIGN TUNING: System Ready.");
};

// โหลดไฟล์ Binary
async function loadTuningFile(fileSuffix) {
    if(!fileSuffix) return;
    const fileName = `f_0000${fileSuffix}`;
    const filePath = `Core/Data/${fileName}`;
    addLog(`System: Loading ${fileName}...`);
    try {
        const response = await fetch(filePath);
        const buffer = await response.arrayBuffer();
        const rawData = new Uint8Array(buffer);
        
        mapData = [];
        for (let i = 0; i < ROWS; i++) {
            let row = [];
            for (let j = 0; j < COLS; j++) {
                row.push(rawData[i * COLS + j] || 0);
            }
            mapData.push(row);
        }
        renderTable();
        addLog(`Success: Loaded ${fileName}`);
        document.getElementById('connection-status').innerText = "CONNECTED";
        document.getElementById('connection-status').style.background = "#00d2ff";
    } catch (err) { addLog("Error: ไม่สามารถอ่านไฟล์ได้"); }
}

function renderTable() {
    const table = document.getElementById('tuning-map');
    let html = '<thead><tr><th>kPa \\ RPM</th>';
    for (let c = 0; c < COLS; c++) html += `<th>${(c+1)*500}</th>`;
    html += '</tr></thead><tbody>';

    for (let i = 0; i < ROWS; i++) {
        html += `<tr><td>${(i+1)*10}</td>`;
        for (let j = 0; j < COLS; j++) {
            const val = mapData[i][j];
            html += `<td class="tune-cell" data-row="${i}" data-col="${j}"
                        style="background-color: ${getColor(val)};" 
                        onclick="toggleCell(this, ${val})">${val}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    table.innerHTML = html;
}

function toggleCell(el, val) {
    el.classList.toggle('selected');
    updateMonitor(val);
}

function updateMonitor(val) {
    const afrDisplay = document.getElementById('val-afr');
    if (afrDisplay) {
        const safeVal = val === 0 ? 1 : val;
        const simulatedAFR = (14.7 * (120 / safeVal)).toFixed(2);
        afrDisplay.innerText = simulatedAFR;
        afrDisplay.style.color = simulatedAFR < 13 ? '#ff003c' : (simulatedAFR > 15 ? '#00d2ff' : '#4ade80');
    }
}

function getColor(val) {
    const ratio = Math.min(Math.max(val / 255, 0), 1);
    const hue = (1 - ratio) * 240; // Blue -> Purple -> Red
    return `hsla(${hue}, 80%, 50%, 0.35)`;
}

function adjustValue(multiplier) {
    const selected = document.querySelectorAll('td.selected');
    if(selected.length === 0) return addLog("Alert: เลือกช่องก่อนจูน");
    selected.forEach(td => {
        const r = td.getAttribute('data-row');
        const c = td.getAttribute('data-col');
        let newVal = Math.round(mapData[r][c] * multiplier);
        newVal = Math.min(Math.max(newVal, 0), 255);
        mapData[r][c] = newVal;
        td.innerText = newVal;
        td.style.backgroundColor = getColor(newVal);
    });
    addLog(`Modified ${selected.length} cells.`);
}

function addLog(msg) {
    const log = document.getElementById('log-content');
    log.innerHTML += `<div>> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}
