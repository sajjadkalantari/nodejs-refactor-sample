const express = require("express");
const router = express.Router();
const { DefectInfoService } = require('../services/defect-info-service');
const defectInfoService = new DefectInfoService();

router.get("/:machineId", async (req, res) => {
    let { machineId } = req.params;
    let defectInfo = await defectInfoService.getDefectInfo(machineId);
    res.send(defectInfo);
});

router.put("/", async (req, res) => {
    let { personalNumber, description, machineId } = req.body;
    let result = await defectInfoService.setDefect(personalNumber, description, machineId);
    res.send(result);
});


router.get("/status/:machineId", async (req, res) => {
    let { machineId } = req.params;
    let defectInfo = await defectInfoService.getDefectStatus(machineId);
    res.send(defectInfo);
});


router.put("/status", async (req, res) => {
    let { machineId, defect_time, status } = req.body;
    let result = await defectInfoService.setDefect(machineId, defect_time, status);
    res.send(result);
});

router.get("/", async (req, res) => {    
    let defectInfo = await defectInfoService.getAllDefect();
    res.send(defectInfo);
});

module.exports = router;
