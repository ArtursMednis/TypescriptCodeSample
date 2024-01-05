import { AppFDC } from "../AppFDC";
import { tLocationPointGrid } from "../interfaces";
import * as mgrsLib from "../mgrsLib";

describe("Mortar and target at diferent gridZones", () => {
  
  it("Grid Mission calculates correct fire data", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    mortar.mortarLocation = { east: 82344, north: 17237, gridZoneId: "34VFJ" };
    var fireMission = appFDC.CreateFireMission();

    fireMission.SetInitialTargetGrid({
      east: 17732,
      north: 17428,
      gridZoneId: "35VLD",
    });

    var fireDataLine = fireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(284.95);
    expect(fireDataOutput.directionMil).toBeCloseTo(623.65);
  });

  it("Grid Mission with correction through GridZones calculates correct fire data", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    mortar.mortarLocation = { east: 82344, north: 17237, gridZoneId: "34VFJ" };
    var fireMission = appFDC.CreateFireMission();

    fireMission.SetInitialTargetGrid({
      east: 17732,
      north: 17428,
      gridZoneId: "35VLD",
    });

    var fireDataLine0 = fireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });
    fireDataLine0.correction = { right: -300, add: -100 };
    var fireDataLine1 = fireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });

    var fireDataOutput = fireDataLine1.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(163.67);
    expect(fireDataOutput.directionMil).toBeCloseTo(5449.3);
  });

  it("Polar missions calculates correct fire data", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(82344, 17237, "34VFJ");

    fireMission.SetInitialTargetPolar(
      { east: 17732, north: 17428, gridZoneId: "35VLD" },
      624,
      200
    );

    var fireDataLine = fireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(513.58);
    expect(fireDataOutput.directionMil).toBeCloseTo(567.23);
  });

  it("Shift mision calculates correct fire data", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var previousFireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(82344, 17237, "34VFJ");

    previousFireMission.SetInitialTargetGrid({ east: 1, north: 0 });
    previousFireMission.SetInitialTargetGrid({
      east: 17732,
      north: 17428,
      gridZoneId: "35VLD",
    });

    var prevTagetGrid = previousFireMission.GetFinalGridAfterCorrections();

    var actualFireMission = appFDC.CreateFireMission();
    actualFireMission.SetInitialTargetShift(prevTagetGrid, 624, {
      right: 0,
      add: 200,
    });

    var fireDataLine = actualFireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(513.58);
    expect(fireDataOutput.directionMil).toBeCloseTo(567.23);
  });

  it("Linear target calculates correct fire data", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.mortarLocation = { east: 82344, north: 17237, gridZoneId: "34VFJ" };
    fireMission.SetInitialTargetGrid({
      east: 17732,
      north: 17428,
      gridZoneId: "35VLD",
    });

    var linTarget = fireMission.CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 1600,
      Length: 3,
      SubTargetCount: 3,
    });

    var subtargetLines = linTarget.fireDateLines;

    var subtargetLine1 = subtargetLines[1];
    var subtargetGrid1 = subtargetLine1?.GetGrid();
    expect(subtargetGrid1!.east).toBeCloseTo(17732);
    expect(subtargetGrid1!.north).toBeCloseTo(17428);
    expect(subtargetGrid1!.gridZoneId).toBe("35VLD");

    subtargetLine1!.mortarId = mortar.id;
    var firingData1 = subtargetLine1!.CalcOutput();
    expect(firingData1?.distanceMeters).toBeCloseTo(284.95);
    expect(firingData1?.directionMil).toBeCloseTo(623.65);
  });

  it("AngleT calculated correct", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.mortarLocation = { east: 82344, north: 17237, gridZoneId: "34VFJ" };

    fireMission.SetInitialTargetGrid(
      { east: 17732, north: 17428, gridZoneId: "35VLD" },
      623
    );
    expect(fireMission.IsAngleTInEffect(mortar.id)).toBeFalsy();

    fireMission.SetInitialTargetGrid(
      { east: 17732, north: 17428, gridZoneId: "35VLD" },
      2223
    );
    expect(fireMission.IsAngleTInEffect(mortar.id)).toBeTruthy();
  });

  it("Safety warning true if outside safety arcs ", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar = appFDC.CreateMortar();
    mortar.mortarLocation = { east: 82344, north: 17237, gridZoneId: "34VFJ" };

    mortar.leftSafetyArc = 100;
    mortar.rightSafetyArc = 624;

    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 12, north: 11 });
    fireMission.SetInitialTargetGrid({
      east: 17732,
      north: 17428,
      gridZoneId: "35VLD",
    });

    var fireDataLine = fireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });

    fireDataLine.correction = { right: -20, add: 20 };
    var safeOutput = fireDataLine.CalcOutput();
    expect(safeOutput.outsideSafetyArcs).toBeFalsy();

    fireDataLine.correction = { right: 20, add: -20 };
    var notSafeOutput = fireDataLine.CalcOutput();
    expect(notSafeOutput.outsideSafetyArcs).toBeTruthy();
  });

});


describe("GridZone special cases", () => {
  
  it("Mortar with gridzone, target without gridzone - ignore gridzone in calculation ", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    mortar.mortarLocation = { east: 1, north: 1, gridZoneId: "34VFJ" };
    var fireMission = appFDC.CreateFireMission();
  
    fireMission.SetInitialTargetGrid({ east: 2, north: 1, gridZoneId: "" });
    
    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    var fireDataOutput = fireDataLine.CalcOutput();
  
    expect(fireDataOutput.distanceMeters).toBeCloseTo(1);
    expect(fireDataOutput.directionMil).toBeCloseTo(1600);
  });

  it("calculated data null if invalid gridzone", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    mortar.mortarLocation = { east: 1, north: 1, gridZoneId: "XXXX" };
    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 2, north: 1, gridZoneId: "YYYY" });
    
    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    var fireDataOutput = fireDataLine.CalcOutput();
  
    expect(fireDataOutput.distanceMeters).toBeNaN();
    expect(fireDataOutput.directionMil).toBeNaN();
  });

  it("GridPoint outside GridZone can be calculated to LatLon and back, but while calculating back it is set to correct grid zone", () => {
    var realLocation: tLocationPointGrid = {
      east: 82344,
      north: 17237,
      gridZoneId: "34VFJ",
    };
    var mgrsStrReal =
      realLocation.gridZoneId +
      realLocation.east.toString() +
      realLocation.north.toString();
    var lonLatReal = mgrsLib.toPoint(mgrsStrReal);
    var mgrsStrCalculatedBack = mgrsLib.forward(lonLatReal);
    expect(mgrsStrReal).toBe(mgrsStrCalculatedBack);

    var outsideZoneGridLocation: tLocationPointGrid = {
      east: 82644,
      north: 17237,
      gridZoneId: "34VFJ",
    };
    var mgrsStrOutsideZone =
      outsideZoneGridLocation.gridZoneId +
      outsideZoneGridLocation.east.toString() +
      outsideZoneGridLocation.north.toString();
    var lonLatOutside = mgrsLib.toPoint(mgrsStrOutsideZone);
    var mgrsStrCalculatedBackFromOutside = mgrsLib.forward(lonLatOutside);
    expect(mgrsStrOutsideZone == mgrsStrCalculatedBackFromOutside).toBeFalsy();
  });

});


/**
	
	mgrs map
	https://www.map.army/map
	
	lat lon picker
	https://www.latlong.net/
	
	latLon2Mgrs
	https://www.earthpoint.us/convert.aspx
	
	mgrs find on map
	https://dominoc925-pages.appspot.com/mapplets/cs_mgrs.html
	 
 */
