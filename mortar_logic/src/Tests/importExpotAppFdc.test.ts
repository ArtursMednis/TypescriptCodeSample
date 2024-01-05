import { AppFDC } from "../AppFDC";
import { MortarShellChargeData } from "../Settings/MortarShellChargeData";
import { MortarShellData } from "../Settings/MortarShellData";

describe("AppFdc can be exported and imported", () => {
  it("Exported json contais data ", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();
    mortar.SetLocationGrid(1, 0);
    fireMission.SetInitialTargetGrid({ east: 2, north: 0 });

    fireMission.CreateNewFireDataLine({ mortarId: mortar.id });

    var exportedApp = appFDC.exportApp();

    expect(exportedApp).toContain("fireMissions");
  });

  it("ArtilleryShellData are exported and imported", () => {
    var exportingAppFDC: AppFDC = new AppFDC();
    var expMortar = exportingAppFDC.CreateMortar();
    var expFireMission = exportingAppFDC.CreateFireMission();

    expMortar.SetLocationGrid(0, 0);
    expFireMission.SetInitialTargetGrid({ east: 5, north: 0 });

    var expMortarShellData = new MortarShellData();
    exportingAppFDC.settings.mortarShellData.push(expMortarShellData);

    var expShellChargeData = new MortarShellChargeData();
    expShellChargeData.chargeLookupTableLines.push({
      distance: 4,
      elevation: 40,
      timeOfFlightSeconds: 30,
    });
    expShellChargeData.chargeLookupTableLines.push({
      distance: 6,
      elevation: 60,
      timeOfFlightSeconds: 40,
    });
    expMortarShellData.mortarShellCharges.push(expShellChargeData);

    var expFireDataLine = expFireMission.CreateNewFireDataLine({
      mortarId: expMortar.id,
    });
    expFireDataLine.shellId = expMortarShellData.id;
    expFireDataLine.shellChargeId = expShellChargeData.id;

    var exportedApp = exportingAppFDC.exportApp();

    var importingAppFDC: AppFDC = new AppFDC();
    expect(importingAppFDC.fireMissions.length).toBe(0);

    importingAppFDC.importApp(exportedApp);
    expect(importingAppFDC.fireMissions.length).toBe(1);
    expect(importingAppFDC.fireMissions[0]?.fireDateLines.length).toBe(1);

    var importedFireDataOutput =
      importingAppFDC.fireMissions[0]?.fireDateLines[0]?.CalcOutput();
    expect(importedFireDataOutput?.elevationMil).toBeCloseTo(50);
    expect(importedFireDataOutput?.timeOfFlightSeconds).toBeCloseTo(35);
  });

  it("linearTarget fireDateLines are exported and imported", () => {
    var exportingAppFDC: AppFDC = new AppFDC();
    var expMortar = exportingAppFDC.CreateMortar();
    var expFireMission = exportingAppFDC.CreateFireMission();

    expMortar.SetLocationGrid(10, 10);

    expFireMission.SetInitialTargetGrid({ east: 10, north: 11 });

    var expLinTarget = expFireMission.CreateLinearTarget();
    expLinTarget.SetLinearTargetProperties({
      AttitudeMil: 1600,
      Length: 3,
      SubTargetCount: 3,
    });

    var expSubtargetLines = expLinTarget.fireDateLines;
    expect(expSubtargetLines.length).toBeCloseTo(3);

    expSubtargetLines[0]!.mortarId = expMortar.id;
    expSubtargetLines[1]!.mortarId = expMortar.id;
    expSubtargetLines[2]!.mortarId = expMortar.id;

    var exportedApp = exportingAppFDC.exportApp();

    var importingAppFDC: AppFDC = new AppFDC();
    expect(importingAppFDC.fireMissions.length).toBe(0);

    importingAppFDC.importApp(exportedApp);
    expect(importingAppFDC.fireMissions.length).toBe(1);

    var impSubtargetLines =
      importingAppFDC.fireMissions[0]?.linearTarget?.fireDateLines;
    expect(impSubtargetLines?.length).toBeCloseTo(3);

    var subtargetLine0 = impSubtargetLines![0];
    var subtargetGrid0 = subtargetLine0?.GetGrid();
    expect(subtargetGrid0!.east).toBeCloseTo(9);
    expect(subtargetGrid0!.north).toBeCloseTo(11);
    var firingData0 = subtargetLine0!.CalcOutput();
    expect(firingData0?.distanceMeters).toBeCloseTo(1.4142135623731);
    expect(firingData0?.directionMil).toBeCloseTo(5600);

    var subtargetLine1 = impSubtargetLines![1];
    var subtargetGrid1 = subtargetLine1?.GetGrid();
    expect(subtargetGrid1!.east).toBeCloseTo(10);
    expect(subtargetGrid1!.north).toBeCloseTo(11);
    var firingData1 = subtargetLine1!.CalcOutput();
    expect(firingData1?.distanceMeters).toBeCloseTo(1);
    var correctFiringData2Direction =
      approximatelyEqual(firingData1!.directionMil, 6400) ||
      approximatelyEqual(firingData1!.directionMil, 0);
    expect(correctFiringData2Direction).toBeTruthy();

    var subtargetLine2 = impSubtargetLines![2];
    var subtargetGrid2 = subtargetLine2?.GetGrid();
    expect(subtargetGrid2!.east).toBeCloseTo(11);
    expect(subtargetGrid2!.north).toBeCloseTo(11);
    var firingData2 = subtargetLine2!.CalcOutput();
    expect(firingData2?.distanceMeters).toBeCloseTo(1.4142135623731);
    expect(firingData2?.directionMil).toBeCloseTo(800);
  });
});

function approximatelyEqual(num1: number, num2: number) {
  var epsilon = 0.001;

  return Math.abs(num1 - num2) < epsilon;
}
