/* =====================================================
VERSION: v10.0.0 (CLEAN PAYLOAD)
===================================================== */

export function buildPayload(alias, data) {
    // ส่งเฉพาะข้อมูลที่จำเป็นไปให้ Render Controller
    return {
        alias: alias,
        prompt: data.prompt || "",
        image: data.image || null,
        video: data.video || null,
        audio: data.audio || null,
        options: {
            resolution: data.resolution || "720",
            duration: data.duration || 5,
            ratio: data.ratio || "16:9"
        },
        master_key: "SN_ULTRA_2026_SECRET" // บายพาส Admin
    };
}
