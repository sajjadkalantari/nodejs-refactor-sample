const moment = require('moment-timezone');
const Constants = require('../utils/constants');
const { logger } = require("./logger");
const { machineInfo } = require("./machine");
const { MachineRepository } = require('../repositories/machine-repository');
const { DefectRepository } = require('../repositories/defect-repository');
const { WorkerRegisteryRepository } = require('../repositories/worker-registery-repository');
const { ClientError } = require('../utils/error')

class DefectInfoService {

    constructor() {
        this.mI = new machineInfo();
        this.defectRepository = new DefectRepository();
        this.machineRepository = new MachineRepository();
        this.workerRegisteryRepository = new WorkerRegisteryRepository();
    }

    async ValidateMachineExist(machineId) {
        let machine = await machineRepository.getMachineById(machineId);
        if (!machine)
            throw new ClientError(Constants.HTTP_CODE.NOT_FOUND, "Machine Id doesn't exist");

    }

    async getDefectInfo(machineId) {
        //check machine exist
        await ValidateMachineExist(machineId);

        //get defect info
        let defect = await defectRepository.getDefectByMachineId(machineId);
        return defect;
    }

    async setDefect(personalNumber, description, machineId) {
        //check machine exist
        await ValidateMachineExist(machineId);

        // check worker registery exist
        let workerRegistery = await workerRegisteryRepository.getWorkerByPersonalNumber(personalNumber);
        if (!workerRegistery)
            throw new ClientError(Constants.HTTP_CODE.NOT_FOUND, "Invalid personal number");

        //creating new defect
        const model = {
            personal_number: personalNumber,
            description: description,
            machine_id: machineId,
            defect_time: moment().tz('Europe/Berlin').format('YYYYMMDD HHmmss'),
            status: Constants.DEFECT_STATUS.FAILED
        };
        return await defectRepository.insertDefect(model);

    }

    async getDefectStatus(machineId) {
        //check machine exist
        await ValidateMachineExist(machineId);

        //get most recent defect
        let lastDefect = await defectRepository.getMostRecentDefect(machineId);
        return lastDefect;
    }

    async setDefectStatus(machineId, defect_time, status) {
        //update defect status
        let result = await defectRepository.updateDefect(machineId, defect_time, status);

        //check update result
        if (result !== 1)
            throw new ClientError(Constants.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to set the status of the machine ${machineId}`);

        //return success for COMPLETED
        if (status !== Constants.DEFECT_STATUS.COMPLETED)
            return { success: "Successfully updated the status of defect " };

        //update status of machine
        let updateMachineResult = await mI.setMachineStatus(machineId, 1)
        if (!updateMachineResult.success)
            throw new ClientError(Constants.HTTP_CODE.INTERNAL_SERVER_ERROR, `Failed to set the status of the machine ${machineId}`);

        //return response
        let message = `Successfully updated and set the status of the machine ${machineId}`;
        logger.log({ level: "info", message: message })
        return { success: message };

    }

    async getAllDefect() {
        //get all defects
        let allDefects = await defectRepository.getAll();

        //form response model
        let result = {
            pending: allDefects.filter(m => m.status === Constants.DEFECT_STATUS.PENDING),
            in_process: allDefects.filter(m => m.status === Constants.DEFECT_STATUS.IN_PROCESS),
            completed: allDefects.filter(m => m.status === Constants.DEFECT_STATUS.COMPLETED),
        };

        return result;
    }

}

module.exports = {
    DefectInfoService
}
