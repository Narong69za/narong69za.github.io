/*
================================================
 ULTRA SERVICE CORE LOADER
 ROOT STRUCTURE VERSION
================================================
*/

const path = require("path");

/* ===============================
   LOAD CORE SERVICES
================================ */

const modelRouter = require("../models/model.router");
const replicateService = require("./replicate/replicate.service");
const runwayService = require("./runway/runway.service");

/* ===============================
   LOAD QUEUE + WORKER
================================ */

require("./job.worker");

/* ===============================
   EXPORTS (FOR CONTROLLER)
================================ */

module.exports = {
   modelRouter,
   replicateService,
   runwayService
};
