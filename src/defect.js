const { dbConnecter } = require("./dbConnector")
const { logger } = require("./logger");
const moment = require('moment-timezone');

const { machineInfo } = require("./machine");
var mI = new machineInfo();
const { processInfo } = require("./process");
var processInfoObj = new processInfo();

const machineRepository = require('./repositories/machine-repository');
const defectRepository = require('./repositories/defect-repository');
const workerRegisteryRepository = require('./repositories/worker-registery-repository');
const Constants = require('./utils/constants');

class defectInfo {

    constructor() { }

    async getDefectInfo(machineId) {
        try {
            //check machine exist
            let machine = await machineRepository.getMachineById(machineId);

            if (!machine) {
                let result = {}
                result["error"] = {}
                result["error"]["code"] = 400
                result["error"]["message"] = "Machine Id doesn't exist"
                return result
            }

            //get defct info
            let defect = await defectRepository.getDefectByMachineId(machineId);
            return defect;

        } catch (error) {
            logger.log({
                level: 'error',
                message: error.toString(),
            })
            let result = {}
            result["error"] = {}
            result["error"]["code"] = 500
            result["error"]["message"] = error.toString()
            return result
        }
    }
    async setDefect(personalNumber, description, machineId) {
        try {
            // check worker registery exist
            let workerRegistery = await workerRegisteryRepository.getWorkerByPersonalNumber(personalNumber);
            if (!workerRegistery) {
                let result = {}
                result["error"] = {}
                result["error"]['code'] = 400
                result["error"]['message'] = "Invalid personal number"
                return result
            }

            //check machine exist
            let machine = await machineRepository.getMachineById(machineId);
            if (!machine) {
                let result = {}
                result["error"] = {}
                result["error"]['code'] = 400
                result["error"]['message'] = "Invalid machine id"
                return result
            }

            //creating new defect
            const model = {
                personal_number: personalNumber,
                description: description,
                machine_id: machineId,
                defect_time: moment().tz('Europe/Berlin').format('YYYYMMDD HHmmss'),
                status: Constants.DEFECT_STATUS.FAILED
            };
            return await defectRepository.insertDefect(model);
            return dbConnecter.table('defect')
                .insert({ 'personal_number': personalNumber, 'description': description, 'machine_id': machineId, 'defect_time': moment().tz('Europe/Berlin').format('YYYYMMDD HHmmss'), 'status': 1 })
                .then(async (result, error) => {
                    if (result.rowCount == '1') {
                        logger.log({
                            level: 'info',
                            message: "Successfully set the defect for machine " + machineId + " with " + description + "by -" + personalNumber
                        })
                        let result = {}
                        result["success"] = "Successfully set the defect"
                        return result
                    }
                    else {
                        logger.log({
                            level: 'error',
                            message: "Failed to insert into defect"
                        })
                        let result = {}
                        result["error"] = {}
                        result["error"]["code"] = 500
                        result["error"]["message"] = "Failed to insert into defect"
                    }
                }).catch((error) => {
                    logger.log({
                        level: 'error',
                        message: error.toString(),
                    })
                    let result = {}
                    result["error"] = {}
                    result["error"]["code"] = 500
                    result["error"]["message"] = error.toString()
                    return result
                })
        } catch (error) {
            logger.log({
                level: 'error',
                message: error.toString(),
            })
            let result = {}
            result["error"] = {}
            result["error"]["code"] = 500
            result["error"]["message"] = error.toString()
            return result
        }
    }

    async getDefectStatus(machineId) {
        try {

            //check machine exist
            let machine = await machineRepository.getMachineById(machineId);

            if (!machine) {
                let result = {}
                result["error"] = {}
                result["error"]["code"] = 400
                result["error"]["message"] = "Machine Id doesn't exist"
                return result
            }

            //get most recent defect
            let lastDefect = await defectRepository.getMostRecentDefect(machineId);
            return lastDefect;

        } catch (error) {
            logger.log({
                level: 'error',
                message: error.toString(),
            })
            let result = {}
            result["error"] = {}
            result["error"]["code"] = 500
            result["error"]["message"] = error.toString()
            return result

        }
    }

    async setDefectStatus(machineId, defect_time, status) {
        try {

            let result = await defectRepository.updateDefect(machineId, defect_time, status);

            if (status == Constants.DEFECT_STATUS.Third && result == 1) {
                let result = await mI.setMachineStatus(machineId, 1)
                console.log(result)
                if (result.success != '') {
                    logger.log({
                        level: "info",
                        message: "Successfully updated and set the status of the machine " + machineId
                    })
                    let result = {}
                    result["success"] = "Successfully updated and set the status of the machine " + machineId
                    return result

                } else {
                    logger.log({
                        level: "error",
                        message: "Failed to set the status of the machine" + machineId
                    })
                    let result = {}
                    result["error"] = {}
                    result["error"]["code"] = 500
                    result["error"]["message"] = "Failed to set the status of the machine" + machineId
                    return result
                }
            } else if (result == 1) {
                let result = {}
                result["success"] = "Successfully updated the status of defect "
                return result
            } else {
                let result = {}
                result["error"] = {}
                result["error"]["code"] = 500
                result["error"]["message"] = "Failed to set the status of the machine" + machineId
                return result
            }



            return dbConnecter.table('defect')
                .update({ 'status': status })
                .where({ 'machine_id': machineId })
                .andWhere({ 'defect_time': defect_time })
                .then(async (result) => {
                    console.log(result)
                    if (status == '3' && result == 1) {
                        let result = await mI.setMachineStatus(machineId, 1)
                        console.log(result)
                        if (result.success != '') {
                            logger.log({
                                level: "info",
                                message: "Successfully updated and set the status of the machine " + machineId
                            })
                            let result = {}
                            result["success"] = "Successfully updated and set the status of the machine " + machineId
                            return result

                        } else {
                            logger.log({
                                level: "error",
                                message: "Failed to set the status of the machine" + machineId
                            })
                            let result = {}
                            result["error"] = {}
                            result["error"]["code"] = 500
                            result["error"]["message"] = "Failed to set the status of the machine" + machineId
                            return result
                        }
                    } else if (result == 1) {
                        let result = {}
                        result["success"] = "Successfully updated the status of defect "
                        return result
                    } else {
                        let result = {}
                        result["error"] = {}
                        result["error"]["code"] = 500
                        result["error"]["message"] = "Failed to set the status of the machine" + machineId
                        return result
                    }
                }).catch((error) => {
                    logger.log({
                        level: 'error',
                        message: error.toString(),
                    })
                    let result = {}
                    result["error"] = {}
                    result["error"]["code"] = 500
                    result["error"]["message"] = error.toString()
                    return result
                })
        } catch (error) {
            logger.log({
                level: 'error',
                message: error.toString(),
            })
            let result = {}
            result["error"] = {}
            result["error"]["code"] = 500
            result["error"]["message"] = error.toString()
            return result
        }
    }

    async getAllDefect() {
        try {

            let allDefects = await defectRepository.getAll();

            let result = {
                pending: allDefects.filter(m => m.status === Constants.DEFECT_STATUS.PENDING),
                in_process: allDefects.filter(m => m.status === Constants.DEFECT_STATUS.IN_PROCESS),
                completed: allDefects.filter(m => m.status === Constants.DEFECT_STATUS.COMPLETED),
            };

            return result;
        } catch (error) {
            logger.log({
                level: 'error',
                message: error.toString(),
            })
            let result = {}
            result["error"] = {}
            result["error"]["code"] = 500
            result["error"]["message"] = error.toString()
            return result
        }
    }

}

module.exports.defectInfo = defectInfo
