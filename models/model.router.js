const MODEL_MAP={

"dark-viral":"owner/model1",
"ai-lipsync":"owner/model2",
"dance-motion":"owner/model3",
"face-swap":"owner/model4"

};

function getModel(template){

return MODEL_MAP[template];

}

module.exports={ getModel };
