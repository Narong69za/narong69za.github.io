/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: progress.tracker.js
VERSION: v9.0.0
STATUS: production
LAYER: render-progress

CREATED: 2026
AUTHOR: SN DESIGN ENGINE SYSTEM

RESPONSIBILITY:
- track rendering progress
- convert task status → UI progress
- update progress bar

USED BY:
- create.js
- task.poller.js
- render UI

===================================================== */

const STATUS_PROGRESS = {

PENDING:10,
STARTING:20,
RUNNING:50,
PROCESSING:70,
SUCCEEDED:100,
FAILED:100

}

export function getProgress(status){

return STATUS_PROGRESS[status] || 0

}

export function updateProgressBar(status){

const bar = document.getElementById("renderProgress")

const text = document.getElementById("renderStatus")

if(!bar) return

const progress = getProgress(status)

bar.style.width = progress+"%"

if(text){

text.innerText = status+" "+progress+"%"

}

}

export function createProgressUI(engine){

const box = engine.querySelector(".engine-preview")

const container = document.createElement("div")

container.className="progress-container"

container.innerHTML=`

<div class="progress-bar-bg">
<div id="renderProgress" class="progress-bar"></div>
</div>

<div id="renderStatus">PENDING</div>

`

box.appendChild(container)

}
