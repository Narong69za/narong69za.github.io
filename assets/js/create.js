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

            const response = await fetch("http://147.93.159.30:5002/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if(!data) return alert("NO RESPONSE");

            if(data.job_id){
                pollJob(data.job_id);
                return;
            }

            if(data.success){
                alert(`[DONE] COST: ${data.cost || 0}`);
                return;
            }

            alert(data.message || "ERROR");

        } catch (e) {
            alert("GATEWAY ERROR");
        }
    }
};

// FINAL POLLING (BACKOFF + STOP SAFE)
async function pollJob(jobId){

    let delay = 2000;
    let attempts = 0;
    const maxAttempts = 30;

    const t = setInterval(async ()=>{

        attempts++;

        try {
            const res = await fetch(`http://147.93.159.30:5002/api/job-status?id=${jobId}`);
            const data = await res.json();

            if(data.status === "done"){
                clearInterval(t);
                if(data.result_url) window.open(data.result_url);
                return;
            }

            if(data.status === "failed"){
                clearInterval(t);
                alert("JOB FAILED");
                return;
            }

        } catch (e) {}

        if(attempts >= maxAttempts){
            clearInterval(t);
            alert("JOB TIMEOUT");
        }

        delay = Math.min(delay + 1000, 8000);

    }, delay);
}
