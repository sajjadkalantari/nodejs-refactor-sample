const { dbConnecter } = require("./dbConnector")
const table = 'machine';

const getMachineById = async (machineId) => {
    return await dbConnecter.table(table).where({ 'machine_id': machineId }).first();
}

exports.getMachineById = getMachineById;