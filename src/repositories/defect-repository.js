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

const getAll = async (status) => {
    let query = dbConnecter.table(table)
        .join('worker_registry', 'defect.personal_number', '=', 'worker_registry.personal_number')
        .select();

    if (status)
        query.where({ 'defect.status': status });

    return await query;
}

exports.getDefectByMachineId = getDefectByMachineId;
exports.getMostRecentDefect = getMostRecentDefect;
exports.getAll = getAll;
exports.insertDefect = insertDefect;
exports.updateDefect = updateDefect;