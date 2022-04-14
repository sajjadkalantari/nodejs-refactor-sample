const { dbConnecter } = require("../utils/dbConnector")


class MachineRepository {
    constructor() {
        this.table = 'machine';
    }

    async getMachineById(machineId) {
        return await dbConnecter.table(this.table).where({ 'machine_id': machineId }).first();
    }
}


module.exports = {
    MachineRepository
}