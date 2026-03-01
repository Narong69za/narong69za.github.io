// =====================================================
// PROJECT: SN DESIGN ENGINE AI
// MODULE: services/engine.map.js
// VERSION: 1.0.0
// STATUS: production
// LAST FIX: initial engine lock mapping
// =====================================================

const ENGINE_MAP = {
  "runway-lipsync": {
    provider: "runway",
    modelId: "runwayml/lipsync-v1",
    cost: 5,
    version: "v1"
  },
  "runway-dance": {
    provider: "runway",
    modelId: "runwayml/motion-control-v2",
    cost: 8,
    version: "v2"
  }
};

function getEngine(key) {
  const engine = ENGINE_MAP[key];
  if (!engine) throw new Error("ENGINE_NOT_FOUND");
  return engine;
}

module.exports = {
  getEngine,
};
