const { dbConnecter } = require("../utils/dbConnector")

class WorkerRegisteryRepository {
    constructor() {
        this.table = 'worker_registry';
    }

    async getWorkerByPersonalNumber(personalNumber) {
        return await dbConnecter.table(this.table).where({ 'personal_number': personalNumber });
    }
}


module.exports = {
    WorkerRegisteryRepository
}