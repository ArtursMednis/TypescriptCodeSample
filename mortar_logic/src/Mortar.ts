import { AppFDC } from "./AppFDC";
import { Helpers } from "./Helpers";
import { iSelectableOption, tLocationPointGrid } from "./interfaces";

export class Mortar implements iSelectableOption {
  id = Helpers.RandomId();
  name: string = "";

  appFDC: AppFDC = new AppFDC();

  mortarLocation: tLocationPointGrid = { east: 0, north: 0 };

  SetLocationGrid(east: number, north: number, gridZone?: string) {
    this.mortarLocation = { east: east, north: north, gridZoneId: gridZone };
  }

  directionMilPerRotation: number = NaN;
  elevationMilPerRotation: number = NaN;

  getDirectionMilPerRotation() {
    var currentMrtType = this.appFDC.settings.mortarTypes.find(
      (mrtType) => mrtType.id == this.mortarTypeId
    );
    return (
      currentMrtType?.directionMilPerRotation ?? this.directionMilPerRotation
    );
  }

  getElevationMilPerRotation() {
    var currentMrtType = this.appFDC.settings.mortarTypes.find(
      (mrtType) => mrtType.id == this.mortarTypeId
    );
    return (
      currentMrtType?.elevationMilPerRotation ?? this.elevationMilPerRotation
    );
  }

  getBlastDiameter() {
    var currentMrtType = this.appFDC.settings.mortarTypes.find(
      (mrtType) => mrtType.id == this.mortarTypeId
    );
    return currentMrtType?.blastDiameter ?? NaN;
  }

  leftSafetyArc: number = NaN;
  rightSafetyArc: number = NaN;

  mortarTypeId: string = "";
}
