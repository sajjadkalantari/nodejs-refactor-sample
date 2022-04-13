const { dbConnecter } = require("./dbConnector")
const table = 'worker_registry';

const getWorkerByPersonalNumber = async (personalNumber) => {
    return await dbConnecter.table(table).where({ 'personal_number': personalNumber });       
}

exports.getWorkerByPersonalNumber = getWorkerByPersonalNumber;