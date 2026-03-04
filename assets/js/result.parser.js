/* =====================================================
PROJECT: SN DESIGN STUDIO
MODULE: result.parser.js
VERSION: v9.0.0
STATUS: production
LAYER: result-processing

CREATED: 2026
AUTHOR: SN DESIGN ENGINE SYSTEM

RESPONSIBILITY:
- parse AI task result
- normalize Runway output structure
- prepare preview media for UI rendering

USED BY:
- create.js
- render engine
- preview system

SUPPORTED PROVIDERS:
- RunwayML
- Replicate
- Pika
- Leonardo

DESCRIPTION:
AI providers return different response formats.
This module converts them into a unified structure
for the SN DESIGN multi-engine UI.

OUTPUT FORMAT:

{
 type: "image" | "video" | "audio",
 url: "media_url"
}

===================================================== */

export function parseResult(data){

    if(!data) return null

    if(data.output && Array.isArray(data.output)){

        const item = data.output[0]

        if(!item) return null

        if(item.url){

            return detectType(item.url)

        }

        if(item.uri){

            return detectType(item.uri)

        }

    }

    if(data.result){

        return detectType(data.result)

    }

    return null
}

function detectType(url){

    const lower = url.toLowerCase()

    if(lower.includes(".mp4") || lower.includes("video")){

        return {
            type:"video",
            url
        }

    }

    if(lower.includes(".png") || lower.includes(".jpg") || lower.includes(".jpeg")){

        return {
            type:"image",
            url
        }

    }

    if(lower.includes(".mp3") || lower.includes(".wav")){

        return {
            type:"audio",
            url
        }

    }

    return {
        type:"unknown",
        url
    }

    }
