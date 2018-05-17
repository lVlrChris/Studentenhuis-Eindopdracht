const express = require("express");
const deelnemerRouter = express.Router();
const deelnemerManager = require("../managers/deelnemer_manager");

deelnemerRouter.post("/", deelnemerManager.createDeelnemer);
deelnemerRouter.get("/", deelnemerManager.getDeelnemers);
// deelnemerRouter.delete("/", deelnemerRouter.deleteDeelnemer);

module.exports = deelnemerRouter;
