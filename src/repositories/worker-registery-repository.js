const { dbConnecter } = require("./dbConnector")

class WorkerRegisteryRepository {
    constructor() {
        this.table = 'worker_registry';
    }

    async getWorkerByPersonalNumber(personalNumber) {
        return await dbConnecter.table(table).where({ 'personal_number': personalNumber });
    }
}


module.exports = {
    WorkerRegisteryRepository
}