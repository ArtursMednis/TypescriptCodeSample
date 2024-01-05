import { AppFDC } from "./AppFDC";
import { CoordTransformFunctions } from "./CoordTransformFunctions";
import { FireDataLine } from "./FireDataLine";
import { FireDataLineIllum } from "./FireDataLineIllum";
import { Helpers } from "./Helpers";
import {
  tLocationPointGrid,
  tCorrection,
  tPolarPointer,
  TargetMethod,
  iSelectableOption,
} from "./interfaces";
import { LinearTarget } from "./LinearTarget";

export class FireMission implements iSelectableOption {
  public constructor(init?: Partial<FireMission>) {
    Object.assign(this, init);
  }

  missionStartTime: Date = new Date();

  SetInitialTargetGrid(location: tLocationPointGrid, otLineMil: number = 0) {
    this.targetInitialGridLocation = location;
    this.otLineMil = otLineMil;
    this.otLineRad = CoordTransformFunctions.mil2rad(otLineMil);
    this.targetMethod = TargetMethod.grid;
  }

  SetInitialTargetPolar(
    foLocation: tLocationPointGrid,
    otLineMil: number,
    distance: number
  ) {
    var otLineRad = CoordTransformFunctions.mil2rad(otLineMil);
    var foPointerToTarget: tPolarPointer = {
      radius: distance,
      radians: otLineRad,
    };
    var targetGridLocation =
      CoordTransformFunctions.GetPointingLocationFromPoint1(
        foLocation,
        foPointerToTarget
      );

    this.otLineMil = otLineMil;
    this.otLineRad = otLineRad;
    this.polarDistance = distance;
    this.frontObserverGridLocation = foLocation;
    this.targetInitialGridLocation = targetGridLocation;

    this.targetMethod = TargetMethod.polar;
  }

  SetInitialTargetShift(
    prevTargetLocation: tLocationPointGrid,
    otLineMil: number,
    shiftCorrection: tCorrection,
    shiftPrevTargetId?: string
  ) {
    var otLineRad = CoordTransformFunctions.mil2rad(otLineMil);
    var targetGridLocation = CoordTransformFunctions.ShiftPoint(
      prevTargetLocation,
      shiftCorrection,
      otLineRad
    );

    this.targetInitialGridLocation = targetGridLocation;

    this.otLineMil = otLineMil;
    this.otLineRad = otLineRad;
    this.targetInitialGridLocation = targetGridLocation;
    this.shiftPrevTargetFinalGridLocation = prevTargetLocation;
    this.shiftCorrection = shiftCorrection;
    this.shiftPrevTargetId = shiftPrevTargetId ?? null;

    this.targetMethod = TargetMethod.shift;
  }

  IsAngleTInEffect(mortarId: string): boolean {
    var mortar = this.appFDC.mortars.find((x) => x.id == mortarId);

    if (mortar === undefined || mortar === null)
      throw "Mortar " + mortarId + " is not avalable to target";

    var mortarGrid = mortar.mortarLocation;

    var mortarFireDataPolar = CoordTransformFunctions.GetPoint1ToPoint2InPolar(
      mortarGrid,
      this.targetInitialGridLocation
    );
    var gtLineMil = CoordTransformFunctions.rad2mil(
      mortarFireDataPolar.radians
    );

    var gtLineOtLineDiffMil = Math.abs(gtLineMil - this.otLineMil);

    while (gtLineOtLineDiffMil > 6400) {
      gtLineOtLineDiffMil = gtLineOtLineDiffMil - 6400;
    }
    gtLineOtLineDiffMil = Math.abs(gtLineOtLineDiffMil);

    var angleTinEffect = false;

    if (gtLineOtLineDiffMil >= 500 && gtLineOtLineDiffMil <= 2700) {
      angleTinEffect = true;
    }

    if (gtLineOtLineDiffMil >= 3700 && gtLineOtLineDiffMil <= 5900) {
      angleTinEffect = true;
    }

    return angleTinEffect;
  }

  CreateNewFireDataLine(init?: Partial<FireDataLine>): FireDataLine {
    var newFireDataLine = new FireDataLine(init);
    newFireDataLine.fireMission = this;

    if (newFireDataLine.mortarId == "") {
      newFireDataLine.mortarId = this.GetMortarIdFromLastLine();
    }

    newFireDataLine.shellId = this.getShellIdFromLastLine();
    newFireDataLine.shellChargeId = this.GetChargeIdFromLastLine();
    this.fireDateLines.push(newFireDataLine);
    return newFireDataLine;
  }

  CreateNewFireDataLineForIllum(
    init?: Partial<FireDataLineIllum>
  ): FireDataLineIllum {
    var newFireDataLine = new FireDataLineIllum(init);
    newFireDataLine.fireMission = this;

    if (newFireDataLine.mortarId == "") {
      newFireDataLine.mortarId = this.getMortarIdFromLastIllumLine();
    }

    newFireDataLine.shellId = this.getShellIdFromLastIllumLine();
    newFireDataLine.shellChargeId = this.getChargeIdFromLastIllumLine();
    this.fireDateLinesIllum.push(newFireDataLine);
    return newFireDataLine;
  }

  removeFireDataLine(fireDataLine: FireDataLine | number) {
    var fireDataLineToRemove =
      fireDataLine instanceof FireDataLine
        ? fireDataLine
        : this.fireDateLines[fireDataLine];

    if (fireDataLineToRemove) {
      var index = this.fireDateLines.indexOf(fireDataLineToRemove);
      if (index > -1) {
        this.fireDateLines.splice(index, 1);
      }
    }
  }

  removeFireDataLineIllum(fireDataLine: FireDataLineIllum | number) {
    var fireDataLineToRemove =
      fireDataLine instanceof FireDataLineIllum
        ? fireDataLine
        : this.fireDateLinesIllum[fireDataLine];

    if (fireDataLineToRemove) {
      var index = this.fireDateLinesIllum.indexOf(fireDataLineToRemove);
      if (index > -1) {
        this.fireDateLinesIllum.splice(index, 1);
      }
    }
  }

  GetMortarIdFromLastLine() {
    if (this.fireDateLines.length == 0) {
      return this.appFDC.defaultSelectedMortarId;
    }
    var lastLine = this.fireDateLines[this.fireDateLines.length - 1]!;

    return lastLine.mortarId != ""
      ? lastLine.mortarId
      : this.appFDC.defaultSelectedMortarId;
  }

  getMortarIdFromLastIllumLine() {
    if (this.fireDateLinesIllum.length == 0) {
      return this.appFDC.defaultSelectedMortarId;
    }
    var lastLine = this.fireDateLinesIllum[this.fireDateLinesIllum.length - 1]!;

    return lastLine.mortarId != ""
      ? lastLine.mortarId
      : this.appFDC.defaultSelectedMortarId;
  }

  getShellIdFromLastLine() {
    if (this.fireDateLines.length == 0) {
      return this.appFDC.settings.defaultSelectedShellId;
    }
    var lastLine = this.fireDateLines[this.fireDateLines.length - 1]!;
    return lastLine.shellId;
  }

  getShellIdFromLastIllumLine() {
    if (this.fireDateLinesIllum.length == 0) {
      return this.appFDC.settings.defaultSelectedShellId;
    }
    var lastLine = this.fireDateLinesIllum[this.fireDateLinesIllum.length - 1]!;
    return lastLine.shellId;
  }

  GetChargeIdFromLastLine() {
    if (this.fireDateLines.length == 0) {
      return "";
    }
    var lastLine = this.fireDateLines[this.fireDateLines.length - 1]!;
    return lastLine.shellChargeId;
  }

  getChargeIdFromLastIllumLine() {
    if (this.fireDateLinesIllum.length == 0) {
      return "";
    }
    var lastLine = this.fireDateLinesIllum[this.fireDateLinesIllum.length - 1]!;
    return lastLine.shellChargeId;
  }

  GetFinalGridAfterCorrections(): tLocationPointGrid {
    if (this.fireDateLines.length == 0) {
      return this.targetInitialGridLocation;
    }

    var finalCorrection = this.fireDateLines[this.fireDateLines.length - 1]!;
    return finalCorrection.GetGrid();
  }

  GetFinalGridAfterIllumCorrections(): tLocationPointGrid {
    if (this.fireDateLinesIllum.length == 0) {
      return this.targetInitialGridLocation;
    }

    var finalCorrection =
      this.fireDateLinesIllum[this.fireDateLinesIllum.length - 1]!;
    return finalCorrection.GetGrid();
  }

  CreateLinearTarget(): LinearTarget {
    var newLinearTarget = new LinearTarget();
    newLinearTarget.fireMission = this;
    this.linearTarget = newLinearTarget;
    newLinearTarget.shellId = this.getShellIdFromLastLine();
    newLinearTarget.shellChargeId = this.GetChargeIdFromLastLine();
    return newLinearTarget;
  }

  targetInitialGridLocation: tLocationPointGrid = { east: 0, north: 0 };

  frontObserverGridLocation: tLocationPointGrid | null = null;

  getAvailableMortars() {
    return this.appFDC.mortars; // doma, ka vēlāk varēs filtrēt pēc PAM
  }

  isOriginalTargetOutsideSafetyArcs() {
    return this.checkIfOutsideSafetyArcs(this.targetInitialGridLocation);
  }

  checkIfOutsideSafetyArcs(targetGrid: tLocationPointGrid) {
    var allMortars = this.getAvailableMortars();
    var bigestLeftMargin =
      allMortars
        .map((mrt) => mrt.leftSafetyArc)
        .filter((margin) => !isNaN(margin))
        .sort()
        .pop() ?? NaN;
    var smallestRightMargin =
      allMortars
        .map((mrt) => mrt.rightSafetyArc)
        .filter((margin) => !isNaN(margin))
        .sort()
        .shift() ?? NaN;

    if (isNaN(bigestLeftMargin) || isNaN(smallestRightMargin)) {
      return false;
    }

    var leftMarginMrt = allMortars.find(
      (mrt) => mrt.leftSafetyArc == bigestLeftMargin
    )!;
    var leftMortarFireDataPolar =
      CoordTransformFunctions.GetPoint1ToPoint2InPolar(
        leftMarginMrt.mortarLocation,
        targetGrid
      );
    var leftMrtAngleMil = CoordTransformFunctions.rad2mil(
      leftMortarFireDataPolar.radians
    );
    var leftMarginOk = bigestLeftMargin < leftMrtAngleMil;

    var rightMarginMrt = allMortars.find(
      (mrt) => mrt.rightSafetyArc == smallestRightMargin
    )!;
    var rightMortarFireDataPolar =
      CoordTransformFunctions.GetPoint1ToPoint2InPolar(
        rightMarginMrt.mortarLocation,
        targetGrid
      );
    var rightMrtAngleMil = CoordTransformFunctions.rad2mil(
      rightMortarFireDataPolar.radians
    );
    var rightMarginOk = smallestRightMargin > rightMrtAngleMil;

    if (smallestRightMargin >= bigestLeftMargin) {
      return !(leftMarginOk && rightMarginOk);
    } else {
      return !(leftMarginOk || rightMarginOk);
    }
  }

  appFDC: AppFDC = new AppFDC();
  id = Helpers.RandomId();
  name: string = "";

  fireDateLines: FireDataLine[] = [];
  fireDateLinesIllum: FireDataLineIllum[] = [];
  linearTarget: LinearTarget | null = null;

  otLineRad: number = 0;
  otLineMil: number = 0;

  getLastOtLineMil(): number {
    if (this.fireDateLines.length == 0) {
      return this.otLineMil;
    } else {
      var lastlineOtRad =
        this.fireDateLines[this.fireDateLines.length - 1]!.getActualOTLineRad();
      var lastLineOtMil = CoordTransformFunctions.rad2mil(lastlineOtRad);
      return lastLineOtMil;
    }
  }

  polarDistance: number = 0;

  shiftCorrection: tCorrection | null = null;
  shiftPrevTargetFinalGridLocation: tLocationPointGrid | null = {
    east: 0,
    north: 0,
  };
  shiftPrevTargetId: string | null = null;

  targetMethod: TargetMethod = TargetMethod.grid;
}
