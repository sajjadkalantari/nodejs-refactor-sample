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
const { ClientError } = require('./utils/error')

class defectInfo {

    constructor() { }

    async getDefectInfo(machineId) {
        try {
            //check machine exist
            let machine = await machineRepository.getMachineById(machineId);
            if (!machine)
                throw new ClientError(Constants.HTTP_CODE.NOT_FOUND, "Machine Id doesn't exist");

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
            if (!workerRegistery)
                throw new ClientError(Constants.HTTP_CODE.NOT_FOUND, "Invalid personal number");


            //check machine exist
            let machine = await machineRepository.getMachineById(machineId);
            if (!machine)
                throw new ClientError(Constants.HTTP_CODE.NOT_FOUND, "Invalid machine id");

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
            if (!machine)
                throw new ClientError(Constants.HTTP_CODE.NOT_FOUND, "Machine Id doesn't exist");

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

            if (result !== 1)
                throw new ClientError(Constants.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to set the status of the machine ${machineId}`);

            if (status !== Constants.DEFECT_STATUS.COMPLETED)
                return { success: "Successfully updated the status of defect " };

            let updateMachineResult = await mI.setMachineStatus(machineId, 1)
            if (!updateMachineResult.success)
                throw new ClientError(Constants.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to set the status of the machine ${machineId}`);

            let message = `Successfully updated and set the status of the machine ${machineId}`;
            logger.log({ level: "info", message: message })
            return { success: message };

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
