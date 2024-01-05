import { CoordTransformFunctions } from "./CoordTransformFunctions";
import { FireMission } from "./FireMission";
import { Helpers } from "./Helpers";
import {
  tCorrection,
  tFiringDataLineOutput,
  tLocationPointGrid,
  tPolarPointer,
} from "./interfaces";

export class FireDataLine {
  public constructor(init?: Partial<FireDataLine>) {
    Object.assign(this, init);
  }

  mortarId: string = "";
  shellChargeId: string = "";
  shellId: string = "";
  correction: tCorrection = { right: 0, add: 0 };

  fireMission: FireMission = new FireMission();

  id = Helpers.RandomId();

  firingTime: Date | null = null;

  GetGrid(): tLocationPointGrid {
    var prevDataLine = this.GetPreviousFireDataLine();
    var startingGrid = prevDataLine
      ? prevDataLine.GetGrid()
      : this.fireMission.targetInitialGridLocation;
    var otLineRad = this.getActualOTLineRad();

    var finalGrid = CoordTransformFunctions.ShiftPoint(
      startingGrid,
      this.correction,
      otLineRad
    );

    return finalGrid;
  }

  getActualOTLineRad(): number {
    if (this.correction.changedOtLineMil != null) {
      var otLineRad = CoordTransformFunctions.mil2rad(
        this.correction.changedOtLineMil
      );
      return otLineRad;
    } else {
      return this.getPreviousOTLineRad();
    }
  }

  getPreviousOTLineRad(): number {
    var prevDataLine = this.GetPreviousFireDataLine();
    var prevOtLine = prevDataLine
      ? prevDataLine.getActualOTLineRad()
      : this.fireMission.otLineRad;
    return prevOtLine;
  }

  getTotalUpCorrection(): number {
    var prevDataLine = this.GetPreviousFireDataLine();
    var prevUpCorrection = prevDataLine
      ? prevDataLine.getTotalUpCorrection()
      : 0;
    var currentUpCorrection = this.correction.up ?? 0;

    return prevUpCorrection + currentUpCorrection;
  }

  CalcOutput(): tFiringDataLineOutput {
    var targetGrid = this.GetGrid();
    var outsideSafety = this.fireMission.checkIfOutsideSafetyArcs(targetGrid);
    var mortar = this.fireMission.appFDC.mortars.find(
      (x) => x.id == this.mortarId
    );
    var mortarGrid = mortar?.mortarLocation;

    if (mortarGrid == null) {
      return {
        directionMil: NaN,
        elevationMil: NaN,
        distanceMeters: NaN,
        grid: targetGrid,
        timeOfFlightSeconds: NaN,
        endVelocity: NaN,
        fuzeSetting: NaN,
        outsideSafetyArcs: outsideSafety,
      };
    }

    var mortarFireDataPolar: tPolarPointer =
      CoordTransformFunctions.GetPoint1ToPoint2InPolar(mortarGrid, targetGrid);

    var angleMil = mortarFireDataPolar
      ? CoordTransformFunctions.rad2mil(mortarFireDataPolar.radians)
      : NaN;
    var distance = mortarFireDataPolar ? mortarFireDataPolar.radius : NaN;

    var mrtShell = this.fireMission.appFDC.settings.mortarShellData.find(
      (shellData) => shellData.id == this.shellId
    );
    var charge = mrtShell?.mortarShellCharges.find(
      (chrg) => chrg.id == this.shellChargeId
    );

    if (charge == null) {
      charge = this.fireMission.appFDC.settings.mortarShellCharges.find(
        (shellData) => shellData.id == this.shellChargeId
      );
    }

    var elevation = charge ? charge.getElevationForDistance(distance) : NaN;
    var timeOfFlightSeconds = charge
      ? charge.getTimeOfFlightForDistance(distance)
      : NaN;

    var endVelocity = charge ? charge.getEndVelocityForDistance(distance) : NaN;

    var verticalUpCorrection = this.getTotalUpCorrection();

    var fuzeUpCorr = verticalUpCorrection / endVelocity;
    var fuzeSetting = timeOfFlightSeconds - fuzeUpCorr;

    var output: tFiringDataLineOutput = {
      directionMil: angleMil,
      elevationMil: elevation,
      distanceMeters: distance,
      grid: targetGrid,
      timeOfFlightSeconds: timeOfFlightSeconds,
      endVelocity: endVelocity,
      fuzeSetting: fuzeSetting,
      outsideSafetyArcs: outsideSafety,
    };

    return output;
  }

  getBlastDiameter(): number {
    var mortar = this.fireMission.appFDC.mortars.find(
      (x) => x.id == this.mortarId
    );
    var blastDiameter = mortar?.getBlastDiameter();
    return blastDiameter ?? NaN;
  }

  GetPreviousFireDataLine() {
    var fireDateLines = this.fireMission.fireDateLines;

    for (var i = 1; i < fireDateLines.length; i++) {
      if (fireDateLines[i]?.id === this.id) {
        var prevFireDataLine = fireDateLines[i - 1];

        return prevFireDataLine ? prevFireDataLine : null;
      }
    }

    return null;
  }
}
