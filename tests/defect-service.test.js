const { DefectInfoService } = require('../../src/services/defect-info-service');


describe('defect service with null machine', () => {
  const defectService = new DefectInfoService();
  defectService.machineRepository.getMachineById = (id) => null;

  beforeEach(async () => {

  });

  afterEach(async () => {
  });

  it('ValidateMachineExist should return 404', async () => {
    try {
      await defectService.ValidateMachineExist(1);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }

  });
  it('getDefectInfo should return 404', async () => {
    try {
      await defectService.getDefectInfo(1);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
  it('setDefect should return 404', async () => {
    try {
      await defectService.setDefect(1, 1, 1);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
  it('getDefectStatus should return 404', async () => {
    try {
      await defectService.getDefectStatus(1);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });

});


describe('defect service with null worker register', () => {
  const defectService = new DefectInfoService();
  defectService.machineRepository.getMachineById = (id) => ({ id: 1 });
  defectService.workerRegisteryRepository.getWorkerByPersonalNumber = (id) => null;

  it('ValidateMachineExist should return 404', async () => {
    try {
      await defectService.ValidateWorkerRegisteryExist(1);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }

  });
  it('setDefect should return 404', async () => {
    try {
      await defectService.setDefect(1, 1, 1);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
});


describe('defect service', () => {
  let defectService = new DefectInfoService();
  defectService.machineRepository.getMachineById = (id) => ({ id: 1 });
  defectService.defectRepository.getDefectByMachineId = (id) => ({ id: 1 });
  defectService.defectRepository.getMostRecentDefect = (id) => ({ id: 1 });
  defectService.defectRepository.insertDefect = (id) => ({ id: 1 });
  defectService.workerRegisteryRepository.getWorkerByPersonalNumber = (id) => ({ id: 1 });
  defectService.defectRepository.getAll = () => (
    [
      {
        id: 1,
        status: 1
      },
      {
        id: 2,
        status: 1
      },
      {
        id: 1,
        status: 1
      },
      {
        id: 3,
        status: 2
      },
      {
        id: 4,
        status: 3
      }
    ]);

  it('getDefectInfo should return info', async () => {

    let info = await defectService.getDefectInfo(1);
    expect(info.id).toBe(1);
  });

  it('setDefect should return info', async () => {
    let info = await defectService.setDefect(1, 1, 1);
    expect(info.id).toBe(1);
  });

  it('getDefectStatus should return info', async () => {
    let info = await defectService.getDefectStatus(1);
    expect(info.id).toBe(1);
  });

  it('getAllDefect should return info', async () => {
    let info = await defectService.getAllDefect();
    expect(info.pending.length).toBe(3);
    expect(info.in_process.length).toBe(1);
    expect(info.completed.length).toBe(1);
  });

  it('setDefectStatus should return ERROR 500', async () => {
    //arrange
    defectService.defectRepository.updateDefect = (machineId, defect_time, status) => 0;
    try {
      let info = await defectService.setDefectStatus(1, 1, 1);
    } catch (error) {
      expect(error.statusCode).toBe(500);
    }
  });

  it('setDefectStatus should return success', async () => {
    //arrange
    defectService.defectRepository.updateDefect = (machineId, defect_time, status) => 1;

    let info = await defectService.setDefectStatus(1, 1, 1);
    expect(info.success).toBe("Successfully updated the status of defect ");
  });

  it('setDefectStatus should return error 500', async () => {
    //arrange
    defectService.defectRepository.updateDefect = (machineId, defect_time, status) => 1;
    defectService.mI.setMachineStatus = (machineId, defect_time, status) => ({ error: "err" });
    try {
      let info = await defectService.setDefectStatus(1, 1, 3);
    } catch (error) {

      expect(error.statusCode).toBe(500);
    }
  });

  it('setDefectStatus should return success', async () => {
    //arrange
    defectService.defectRepository.updateDefect = (machineId, defect_time, status) => 1;
    defectService.mI.setMachineStatus = (machineId, defect_time, status) => ({ success: "success" });

    let info = await defectService.setDefectStatus(1, 1, 3);
    expect(info.success).toBe(`Successfully updated and set the status of the machine ${1}`);
  });
});