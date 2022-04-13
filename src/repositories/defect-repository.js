const { dbConnecter } = require("./dbConnector")
const table = 'defect';

const getDefectByMachineId = async (machineId) => {
    return await dbConnecter.table('defect').where({ 'machine_id': machineId });    
}

exports.getDefectByMachineId = getDefectByMachineId;