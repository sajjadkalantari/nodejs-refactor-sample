const { dbConnecter } = require("./dbConnector")
const table = 'defect';

const getDefectByMachineId = async (machineId) => {
    return await dbConnecter.table(table).where({ 'machine_id': machineId });
}


const getMostRecentDefect = async (machineId) => {
    return await dbConnecter.table(table)
        .where({ 'machine_id': machineId })
        .orderBy('defect_time', 'desc').first();
}

const insertDefect = async (model) => {
    return await dbConnecter.table(table).insert(model);
}

exports.getDefectByMachineId = getDefectByMachineId;
exports.getMostRecentDefect = getMostRecentDefect;
exports.insertDefect = insertDefect;