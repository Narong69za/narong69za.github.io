/* /assets/js/endpoint.router.js - RESTORED */
import { ENGINE_DATA } from "./engine.data.js";
const API_BASE = "https://api.sn-designstudio.dev";

export async function routeEngine(engineId, payload) {
    const engine = ENGINE_DATA[engineId];
    if (!engine) throw new Error("ENGINE NOT FOUND");

    const { provider, model } = engine;

    // 🚀 RESTORED: ใส่หัวใจการยิง API กลับเข้าไป
    if (provider === "runway") {
        const res = await fetch(`${API_BASE}/api/runway/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Backend จะใช้ Key ของมันเอง
            body: JSON.stringify({ model, payload })
        });
        return await res.json();
    }

    if (provider === "replicate") {
        // ต้องมี Token ของ Replicate ในการคุยกับ Vendor
        const res = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Token ${window.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ version: model, input: payload })
        });
        return await res.json();
    }
    // ... (Gemini / ElevenLabs ทำแบบเดียวกัน)
}
