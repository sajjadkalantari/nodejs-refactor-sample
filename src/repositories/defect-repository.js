const { dbConnecter } = require("./dbConnector")
const table = 'defect';

const getDefectByMachineId = async (machineId) => {
    return await dbConnecter.table(table).where({ 'machine_id': machineId });
}

const insertDefect = async (model) => {
    return await dbConnecter.table(table).insert(model);
}

exports.getDefectByMachineId = getDefectByMachineId;
exports.insertDefect = insertDefect;