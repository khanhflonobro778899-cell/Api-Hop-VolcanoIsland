const express = require('express');
const app = express();
const PORT = process.env.PORT || 3008; 

app.use(express.json());

let totalExecute = 0;
let volcanoServers = new Map(); 

function getSeaName(placeId) {
    const id = String(placeId);
    if (id === "7449423635") return "Volcano Island Sea 3";
    return `Volcano Island (Place: ${id})`;
}

app.post('/update-volcano', (req, res) => {
    const { jobid, players, placeId } = req.body;
    if (!jobid) return res.status(400).send("Thiếu JobId");

    if (String(placeId) !== "7449423635") return res.status(403).send("Chỉ nhận dữ liệu từ Sea 3");

    totalExecute++; 
    volcanoServers.set(jobid, {
        "placeId": Number(placeId) || 0,
        "jobId": jobid,
        "players": Number(players) || 1,
        "name": getSeaName(placeId),
        "updatedAt": Date.now()
    });

    console.log(`✅ [Web] Đã lưu Server Volcano Island! JobId: ${jobid}`);
    res.status(200).send("Cập nhật thành công Server!");
});

app.get('/api', (req, res) => res.json(Array.from(volcanoServers.values())));

setInterval(() => {
    const now = Date.now();
    for (let [jobid, data] of volcanoServers.entries()) {
        if (now - data.updatedAt > 15 * 60 * 1000) volcanoServers.delete(jobid);
    }
}, 60000); 

app.get('/', (req, res) => {
    const dataArray = Array.from(volcanoServers.values());
    const finalData = {
        "Total Execute": totalExecute, "by": "tranduykhanh", "sea_filter": "Only Sea 3",
        "total_volcano_servers": dataArray.length, "volcano_data": dataArray
    };
    res.send(`<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Volcano Island Tracker</title><style>body { background-color: #121212; color: #e0e0e0; font-family: monospace; padding: 15px; margin: 0; } .controls { margin-bottom: 10px; font-size: 14px; user-select: none; } pre { background-color: #181818; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; font-size: 13px; margin: 0; }</style></head><body><div class="controls"><label><input type="checkbox" id="prettyPrint" checked onchange="renderJSON()"> Tạo bản in đẹp</label></div><pre id="jsonContent"></pre><script>const rawData = ${JSON.stringify(finalData)}; function renderJSON() { const isPretty = document.getElementById('prettyPrint').checked; const container = document.getElementById('jsonContent'); if (isPretty) { container.textContent = JSON.stringify(rawData, null, 2); } else { container.textContent = JSON.stringify(rawData); } } renderJSON(); setTimeout(() => { location.reload(); }, 8000);</script></body></html>`);
});

app.listen(PORT, () => console.log(`🚀 Web Volcano Island đang chạy tại port ${PORT} (Chỉ Sea 3)`));
      
