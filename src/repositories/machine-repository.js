const { dbConnecter } = require("./dbConnector")


class MachineRepository {
    constructor() {
        this.table = 'machine';
    }

    async getMachineById(machineId) {
        return await dbConnecter.table(table).where({ 'machine_id': machineId }).first();
    }
}


module.exports = {
    MachineRepository
}