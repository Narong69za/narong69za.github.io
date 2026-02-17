const express = require("express");
const path = require("path");

require("../db/db");

const renderRoute = require("../routes/render");
const statusRoute = require("../routes/status");
const webhookRoute = require("../routes/webhook");

const app = express();
