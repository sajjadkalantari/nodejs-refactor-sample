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

const updateDefect = async (machineId, defect_time, status) => {
    return await dbConnecter.table(table)
        .update({ 'status': status })
        .where({ 'machine_id': machineId })
        .andWhere({ 'defect_time': defect_time });
}

exports.getDefectByMachineId = getDefectByMachineId;
exports.getMostRecentDefect = getMostRecentDefect;
exports.insertDefect = insertDefect;
exports.updateDefect = updateDefect;