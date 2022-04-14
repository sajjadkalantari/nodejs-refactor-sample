const express = require("express");
const router = express.Router();
const { DefectInfoService } = require('../services/defect-info-service');
const defectInfoService = new DefectInfoService();

//get defectinfo by machineid
router.get("/:machineId", async (req, res) => {
    let { machineId } = req.params;
    let defectInfo = await defectInfoService.getDefectInfo(machineId);
    res.send(defectInfo);
});

//update defect
router.put("/", async (req, res) => {
    let { personalNumber, description, machineId } = req.body;
    let result = await defectInfoService.setDefect(personalNumber, description, machineId);
    res.send(result);
});

//get defect status by machineid
router.get("/status/:machineId", async (req, res) => {
    let { machineId } = req.params;
    let defectInfo = await defectInfoService.getDefectStatus(machineId);
    res.send(defectInfo);
});

//update defect status 
router.put("/status", async (req, res) => {
    let { machineId, defect_time, status } = req.body;
    let result = await defectInfoService.setDefect(machineId, defect_time, status);
    res.send(result);
});

//get all defects
router.get("/", async (req, res) => {    
    let defectInfo = await defectInfoService.getAllDefect();
    res.send(defectInfo);
});

module.exports = router;
