import { CoordTransformFunctions } from "./CoordTransformFunctions";
import { FireDataLineSubtarget } from "./FireDataLineSubtarget";
import { FireMission } from "./FireMission";
import { Helpers } from "./Helpers";
import {
  tLinearTargetProperties,
  tLocationPointGrid,
  tSearchAndTraverseOutput,
} from "./interfaces";

export class LinearTarget {
  SetLinearTargetProperties(props: tLinearTargetProperties) {
    var subtargtCountChanged: boolean = false;
    this.AttitudeMil = props.AttitudeMil;
    this.Length = props.Length;

    if (this.SubTargetCount != props.SubTargetCount) {
      subtargtCountChanged = true;
      this.SubTargetCount = props.SubTargetCount;
    }

    var attitudeRad: number = CoordTransformFunctions.mil2rad(this.AttitudeMil);

    if (this.SubTargetCount == 0) {
      this.SubTargetCount = 1;
    }

    this.distanceBetweenTargets = this.Length / this.SubTargetCount;
    this.attSin = Math.sin(attitudeRad);
    this.attCos = Math.cos(attitudeRad);

    if (subtargtCountChanged) {
      this.createSubtargets();
    }
  }

  createSubtargets() {
    var mrtId = this.fireMission.GetMortarIdFromLastLine();
    this.fireDateLines.length = 0;
    for (var i = 0; i < this.SubTargetCount; i++) {
      var subtargetLine = new FireDataLineSubtarget({
        subtargetNo: i,
        linearTarget: this,
        mortarId: mrtId,
      });
      this.fireDateLines.push(subtargetLine);
    }
  }

  getEndingPoints(): [tLocationPointGrid, tLocationPointGrid] {
    var centerGrid = this.fireMission.GetFinalGridAfterCorrections();

    var subTargetPoint1: tLocationPointGrid = {
      east: centerGrid.east - (this.attSin * this.Length) / 2,
      north: centerGrid.north - (this.attCos * this.Length) / 2,
    };
    var subTargetPoint2: tLocationPointGrid = {
      east: centerGrid.east + (this.attSin * this.Length) / 2,
      north: centerGrid.north + (this.attCos * this.Length) / 2,
    };

    return [subTargetPoint1, subTargetPoint2];
  }

  calcOptimalSubtargetCount(length: number) {
    length = Number(length);
    if (!length) {
      return 1;
    }
    var appFdc = this.fireMission.appFDC;
    var defMrt = appFdc.getMortarById(appFdc.defaultSelectedMortarId);

    if (!defMrt) {
      return 1;
    }

    var blastDiameter = defMrt.getBlastDiameter();

    if (!blastDiameter) {
      return 1;
    }

    var subTgCount = length / blastDiameter;

    return Math.round(subTgCount);
  }

  getSearchAndTraverseMessage() {
    var outputMessageParts: string[] = [];

    var subtargetLinesGroupedByMortar: {
      [key: string]: FireDataLineSubtarget[];
    } = {};

    for (var k = 0; k < this.fireDateLines.length; k++) {
      var sbtg = this.fireDateLines[k]!;
      if (!sbtg?.mortarId) {
        continue;
      }
      var subtargetsForMrt = subtargetLinesGroupedByMortar[sbtg.mortarId] ?? [];
      subtargetsForMrt.push(sbtg);
      subtargetLinesGroupedByMortar[sbtg.mortarId] = subtargetsForMrt;
    }

    for (var key in subtargetLinesGroupedByMortar) {
      // skip loop if the property is from prototype
      if (!subtargetLinesGroupedByMortar.hasOwnProperty(key)) continue;

      var obj = subtargetLinesGroupedByMortar[key];
      if (!obj?.length) continue;

      if (this.InvertedSearchTraverseMsg) {
        obj = obj.reverse();
      }

      var mrt = this.fireMission.appFDC.getMortarById(key);
      var prevLine: FireDataLineSubtarget | null = null;
      var firstStOutput: tSearchAndTraverseOutput | null = null;
      var dirRotations = 0;
      var elevRotations = 0;
      var messageSearchTraverseParts: string[] = [];

      for (var n = 0; n < obj.length; n++) {
        var fdlForMrt = obj[n]!;

        if (prevLine == null) {
          firstStOutput = fdlForMrt?.calcSearchAndTraverse();
          dirRotations = Math.round(firstStOutput.traverseDirectionRotations);
          elevRotations = Math.round(firstStOutput.searchElevationRotations);

          var directionAndElevation = fdlForMrt?.CalcOutput();

          messageSearchTraverseParts.push(
            'Target mortar "' +
              mrt?.name +
              '" at direction ' +
              Helpers.numericToMilString(directionAndElevation?.directionMil) +
              " and elevation " +
              Helpers.numericToMilString(directionAndElevation?.elevationMil) +
              " (for subtarget " +
              fdlForMrt?.subtargetNoLetter() +
              ")" +
              " and fire. "
          );
        } else {
          var step = fdlForMrt.subtargetNo - prevLine.subtargetNo;

          var turnMrtPart = 'Then turn mortar "' + mrt?.name + '"';

          if (dirRotations) {
            var isLeftDirection = this.InvertedSearchTraverseMsg
              ? dirRotations > 0
              : dirRotations < 0;
            var directionDirection = isLeftDirection ? "left" : "right";
            turnMrtPart =
              turnMrtPart +
              " " +
              Math.abs(step * dirRotations) +
              " rotations " +
              directionDirection;
          }

          if (dirRotations && elevRotations) {
            turnMrtPart = turnMrtPart + " and ";
          }

          if (elevRotations) {
            var isDownDirection = this.InvertedSearchTraverseMsg
              ? elevRotations > 0
              : elevRotations < 0;
            var elevDirection = isDownDirection ? "down" : "up";
            turnMrtPart =
              turnMrtPart +
              " " +
              Math.abs(step * elevRotations) +
              " rotations " +
              elevDirection;
          }
          turnMrtPart = turnMrtPart + ". Fire!";

          messageSearchTraverseParts.push(turnMrtPart);
        }

        prevLine = fdlForMrt;
      }

      messageSearchTraverseParts = this.removeSequentialDuplicates(
        messageSearchTraverseParts
      );
      outputMessageParts = outputMessageParts.concat(
        messageSearchTraverseParts
      );
    }

    return outputMessageParts.join("\n");
  }

  private removeSequentialDuplicates(arr: string[]): string[] {
    const result: string[] = [];

    let currentStr = arr[0];
    let count = 1;

    for (let i = 1; i < arr.length; i++) {
      if (!currentStr) {
        continue;
      }

      if (arr[i] === currentStr) {
        count++;
      } else {
        result.push(
          count > 1 ? `${currentStr} Do it ${count} times` : currentStr
        );

        currentStr = arr[i];
        count = 1;
      }
    }

    if (currentStr)
      result.push(
        count > 1 ? `${currentStr} Do it ${count} times` : currentStr
      );

    return result;
  }

  InvertedSearchTraverseMsg: boolean = false;

  AttitudeMil: number = 0;

  Length: number = 0;
  SubTargetCount: number = 0;

  distanceBetweenTargets: number = 0;
  attSin: number = 0;
  attCos: number = 0;

  fireDateLines: FireDataLineSubtarget[] = [];

  fireMission: FireMission = new FireMission();

  id = Helpers.RandomId();

  shellChargeId: string = "";
  shellId: string = "";
}
