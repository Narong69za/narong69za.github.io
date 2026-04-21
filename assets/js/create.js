const engineManager = {

    generate: async function(id) {

        const email = localStorage.getItem('user_email');
        if(!email) return alert("LOGIN REQUIRED");

        const payload = {
            email,
            engine_id: id,
            prompt: document.getElementById(`prompt-${id}`)?.value || "",
            resolution: Number(document.getElementById(`res-${id}`).value || 1),
            duration: Number(document.getElementById(`dur-${id}`).value || 1)
        };

        try {

            const r = await fetch("https://api.sn-designstudio.dev/api/generate/" + detectType(id), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await r.json();

            if(!data) return alert("NO RESPONSE");

            if(data.job_id){
                pollJob(data.job_id);
                return;
            }

            if(data.ok){
                alert(`[DONE] COST: ${data.cost || 0}`);
                return;
            }

            alert(data.message || "ERROR");

        } catch (e) {
            alert("GATEWAY ERROR");
        }
    }
};

function detectType(id){
    if(["01","02","08","11","12"].includes(id)) return "video";
    if(["04","05","09"].includes(id)) return "image";
    if(["03","07","10","14"].includes(id)) return "motion";
    return "upscale";
}

async function pollJob(jobId){

    const t = setInterval(async ()=>{

        try {
            const r = await fetch(`https://api.sn-designstudio.dev/api/job-status?id=${jobId}`);
            const d = await r.json();

            if(d.status === "done"){
                clearInterval(t);
                if(d.result_url) window.open(d.result_url);
            }

        } catch(e){}

    }, 3000);
}
