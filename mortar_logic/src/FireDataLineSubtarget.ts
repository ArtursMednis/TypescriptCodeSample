import { CoordTransformFunctions } from "./CoordTransformFunctions";
import { Helpers } from "./Helpers";
import { LinearTarget } from "./LinearTarget";
import {
  tFiringDataLineOutput,
  tLocationPointGrid,
  tPolarPointer,
  tSearchAndTraverseOutput,
} from "./interfaces";

export class FireDataLineSubtarget {
  public constructor(init?: Partial<FireDataLineSubtarget>) {
    Object.assign(this, init);
  }

  mortarId: string = "";

  linearTarget: LinearTarget = new LinearTarget();

  subtargetNo: number = 0;

  subtargetNoLetter() {
    if (this.subtargetNo >= 0 && this.subtargetNo <= 25) {
      return String.fromCharCode(97 + this.subtargetNo); // ASCII code for 'a' is 97
    } else {
      return "";
    }
  }

  GetGrid(): tLocationPointGrid {
    var centerGrid =
      this.linearTarget.fireMission.GetFinalGridAfterCorrections();

    var targetLength = this.linearTarget.Length;
    var distanceBetweenTargets = this.linearTarget.distanceBetweenTargets;
    var attSin = this.linearTarget.attSin;
    var attCos = this.linearTarget.attCos;

    var positionOnTargetLine =
      -targetLength / 2 +
      distanceBetweenTargets / 2 +
      this.subtargetNo * distanceBetweenTargets;

    var subTargetPoint: tLocationPointGrid = {
      east: centerGrid.east + attSin * positionOnTargetLine,
      north: centerGrid.north + attCos * positionOnTargetLine,
      gridZoneId: centerGrid.gridZoneId,
    };

    return subTargetPoint;
  }

  CalcOutput(): tFiringDataLineOutput {
    var targetGrid = this.GetGrid();
    var outsideSafety =
      this.linearTarget.fireMission.checkIfOutsideSafetyArcs(targetGrid);

    var mortar = this.linearTarget.fireMission.appFDC.mortars.find(
      (x) => x.id == this.mortarId
    );
    var mortarGrid = mortar?.mortarLocation;

    if (mortarGrid == null) {
      return {
        directionMil: NaN,
        distanceMeters: NaN,
        grid: targetGrid,
        elevationMil: NaN,
        timeOfFlightSeconds: NaN,
        outsideSafetyArcs: outsideSafety,
      };
    }

    var mortarFireDataPolar: tPolarPointer;

    if (
      targetGrid.gridZoneId ||
      mortarGrid.gridZoneId ||
      targetGrid.gridZoneId == mortarGrid.gridZoneId
    ) {
      mortarFireDataPolar = CoordTransformFunctions.GetPoint1ToPoint2InPolar(
        mortarGrid,
        targetGrid
      );
    } else {
      mortarFireDataPolar =
        CoordTransformFunctions.GetPoint1ToPoint2InPolarDiferentGridZones(
          mortarGrid,
          targetGrid
        );
    }

    var angleMil = CoordTransformFunctions.rad2mil(mortarFireDataPolar.radians);
    var distance = mortarFireDataPolar.radius;

    var mrtShell =
      this.linearTarget.fireMission.appFDC.settings.mortarShellData.find(
        (shellData) => shellData.id == this.linearTarget.shellId
      );
    var chargeData = mrtShell?.mortarShellCharges.find(
      (chrg) => chrg.id == this.linearTarget.shellChargeId
    );

    if (chargeData == null) {
      chargeData =
        this.linearTarget.fireMission.appFDC.settings.mortarShellCharges.find(
          (shellData) => shellData.id == this.linearTarget.shellChargeId
        );
    }

    var elevation = chargeData
      ? chargeData.getElevationForDistance(distance)
      : NaN;
    var timeOfFlightSeconds = chargeData
      ? chargeData.getTimeOfFlightForDistance(distance)
      : NaN;

    var output: tFiringDataLineOutput = {
      directionMil: angleMil,
      distanceMeters: distance,
      grid: targetGrid,
      elevationMil: elevation,
      timeOfFlightSeconds: timeOfFlightSeconds,
      outsideSafetyArcs: outsideSafety,
    };

    return output;
  }

  calcSearchAndTraverse(): tSearchAndTraverseOutput {
    var stOutput: tSearchAndTraverseOutput = {
      upCount: NaN,
      downCount: NaN,
      searchElevationMil: NaN,
      searchElevationRotations: NaN,
      traverseDirectionMil: NaN,
      traverseDirectionRotations: NaN,
      directionFirst: NaN,
      directionLast: NaN,
      directionDif: NaN,
      elevationFirst: NaN,
      elevationLast: NaN,
      elevationDiff: NaN,
      message: "",
    };

    var searchTraverseCount = this.linearTarget.SubTargetCount - 1;

    stOutput.upCount = searchTraverseCount - this.subtargetNo;
    stOutput.downCount = this.subtargetNo;

    var mortar = this.linearTarget.fireMission.appFDC.mortars.find(
      (x) => x.id == this.mortarId
    );

    if (mortar == null || searchTraverseCount == 0) {
      return stOutput;
    }

    var mortarGrid = mortar!.mortarLocation;

    var centerGrid =
      this.linearTarget.fireMission.GetFinalGridAfterCorrections();

    var targetLength = this.linearTarget.Length;
    var distanceBetweenTargets = this.linearTarget.distanceBetweenTargets;
    var attSin = this.linearTarget.attSin;
    var attCos = this.linearTarget.attCos;

    var positionOnTargetLineForFirstTarget =
      -targetLength / 2 +
      distanceBetweenTargets / 2 +
      0 * distanceBetweenTargets;
    var positionOnTargetLineForLastTarget =
      -targetLength / 2 +
      distanceBetweenTargets / 2 +
      (this.linearTarget.SubTargetCount - 1) * distanceBetweenTargets;

    var subTargetPointFirst: tLocationPointGrid = {
      east: centerGrid.east + attSin * positionOnTargetLineForFirstTarget,
      north: centerGrid.north + attCos * positionOnTargetLineForFirstTarget,
      gridZoneId: centerGrid.gridZoneId,
    };

    var subTargetPointLast: tLocationPointGrid = {
      east: centerGrid.east + attSin * positionOnTargetLineForLastTarget,
      north: centerGrid.north + attCos * positionOnTargetLineForLastTarget,
      gridZoneId: centerGrid.gridZoneId,
    };

    var mortarFireDataPolarFirst =
      CoordTransformFunctions.GetPoint1ToPoint2InPolar(
        mortarGrid,
        subTargetPointFirst
      );
    var mortarFireDataPolarLast =
      CoordTransformFunctions.GetPoint1ToPoint2InPolar(
        mortarGrid,
        subTargetPointLast
      );

    stOutput.directionFirst = CoordTransformFunctions.rad2mil(
      mortarFireDataPolarFirst.radians
    );
    stOutput.directionLast = CoordTransformFunctions.rad2mil(
      mortarFireDataPolarLast.radians
    );

    stOutput.directionDif = Helpers.makeAngleNarrowMil(
      stOutput.directionLast - stOutput.directionFirst
    );
    stOutput.traverseDirectionMil = stOutput.directionDif / searchTraverseCount;
    stOutput.traverseDirectionRotations = mortar.getDirectionMilPerRotation()
      ? stOutput.traverseDirectionMil / mortar.getDirectionMilPerRotation()
      : NaN;

    var mrtShell =
      this.linearTarget.fireMission.appFDC.settings.mortarShellData.find(
        (shellData) => shellData.id == this.linearTarget.shellId
      );
    var chargeData = mrtShell?.mortarShellCharges.find(
      (chrg) => chrg.id == this.linearTarget.shellChargeId
    );

    if (chargeData == null) {
      chargeData =
        this.linearTarget.fireMission.appFDC.settings.mortarShellCharges.find(
          (chrg) => chrg.id == this.linearTarget.shellChargeId
        );
    }

    stOutput.elevationFirst = chargeData
      ? chargeData.getElevationForDistance(mortarFireDataPolarFirst.radius)
      : NaN;
    stOutput.elevationLast = chargeData
      ? chargeData.getElevationForDistance(mortarFireDataPolarLast.radius)
      : NaN;

    stOutput.elevationDiff =
      isNaN(stOutput.elevationFirst) || isNaN(stOutput.elevationLast)
        ? NaN
        : stOutput.elevationLast - stOutput.elevationFirst;
    stOutput.searchElevationMil = stOutput.elevationDiff / searchTraverseCount;
    stOutput.searchElevationRotations = mortar.getElevationMilPerRotation()
      ? stOutput.searchElevationMil / mortar.getElevationMilPerRotation()
      : NaN;

    stOutput.message = this.GetSearchAndTraverseMessage(stOutput);

    return stOutput;
  }

  private GetSearchAndTraverseMessage(stOutput: tSearchAndTraverseOutput) {
    var dirRotations = Math.round(stOutput.traverseDirectionRotations);
    var elevRotations = Math.round(stOutput.searchElevationRotations);

    if (Number.isNaN(dirRotations) && Number.isNaN(elevRotations)) {
      return "";
    }

    var outputMessageParts: string[] = [];
    var directionAndElevation = this.CalcOutput();
    outputMessageParts.push(
      "Target mortar at direction " +
        Helpers.numericToMilString(directionAndElevation.directionMil) +
        " and elevation " +
        Helpers.numericToMilString(directionAndElevation.elevationMil) +
        " and fire. "
    );

    if (stOutput.upCount > 0) {
      outputMessageParts.push("\n");
      if (dirRotations || elevRotations) {
        outputMessageParts.push("Then turn mortar");
      }

      if (dirRotations > 0) {
        outputMessageParts.push(
          " " + Math.abs(dirRotations) + " rotations right"
        );
      }

      if (dirRotations < 0) {
        outputMessageParts.push(
          " " + Math.abs(dirRotations) + " rotations left"
        );
      }

      if (dirRotations && elevRotations) {
        outputMessageParts.push(" and ");
      }

      if (elevRotations > 0) {
        outputMessageParts.push(
          " " + Math.abs(elevRotations) + " rotations up"
        );
      }

      if (elevRotations < 0) {
        outputMessageParts.push(
          " " + Math.abs(elevRotations) + " rotations down"
        );
      }

      outputMessageParts.push(". Fire.");

      if (stOutput.upCount > 1) {
        outputMessageParts.push(" Do it for " + stOutput.upCount + " times.");
      }
    }

    if (stOutput.upCount > 0 && stOutput.downCount > 0) {
      outputMessageParts.push("\n");
      outputMessageParts.push(
        "Return mortar back at direction " +
          Helpers.numericToMilString(directionAndElevation.directionMil) +
          " and elevation " +
          Helpers.numericToMilString(directionAndElevation.elevationMil) +
          ". "
      );
    }

    if (stOutput.downCount > 0) {
      outputMessageParts.push("\n");
      if (dirRotations || elevRotations) {
        outputMessageParts.push("Then turn mortar ");
      }

      if (dirRotations > 0) {
        outputMessageParts.push(
          "" + Math.abs(dirRotations) + " rotations left"
        );
      }

      if (dirRotations < 0) {
        outputMessageParts.push(
          "" + Math.abs(dirRotations) + " rotations right"
        );
      }

      if (dirRotations && elevRotations) {
        outputMessageParts.push(" and ");
      }

      if (elevRotations > 0) {
        outputMessageParts.push(
          "" + Math.abs(elevRotations) + " rotations down"
        );
      }

      if (elevRotations < 0) {
        outputMessageParts.push("" + Math.abs(elevRotations) + " rotations up");
      }

      outputMessageParts.push(". Fire.");

      if (stOutput.downCount > 1) {
        outputMessageParts.push(" Do it for " + stOutput.downCount + " times.");
      }
    }

    return outputMessageParts.join("");
  }
}
