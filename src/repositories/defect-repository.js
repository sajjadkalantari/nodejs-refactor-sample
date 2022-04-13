const { dbConnecter } = require("./dbConnector")

class DefectRepository {
    constructor() {
        this.table = 'defect';
    }

    async getDefectByMachineId(machineId) {
        return await dbConnecter.table(table).where({ 'machine_id': machineId });
    }


    async getMostRecentDefect(machineId) {
        return await dbConnecter.table(table)
            .where({ 'machine_id': machineId })
            .orderBy('defect_time', 'desc').first();
    }

    async insertDefect(model) {
        return await dbConnecter.table(table).insert(model);
    }

    async updateDefect(machineId, defect_time, status) {
        return await dbConnecter.table(table)
            .update({ 'status': status })
            .where({ 'machine_id': machineId })
            .andWhere({ 'defect_time': defect_time });
    }

    async getAll(status) {
        let query = dbConnecter.table(table)
            .join('worker_registry', 'defect.personal_number', '=', 'worker_registry.personal_number')
            .select();

        if (status)
            query.where({ 'defect.status': status });

        return await query;
    }
}


module.exports = {
    DefectRepository
}
