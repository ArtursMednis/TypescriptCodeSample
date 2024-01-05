import { Helpers } from "../Helpers";
import { iSelectableOption } from "../interfaces";

export class MortarType implements iSelectableOption {
  id = Helpers.RandomId();
  name: string = "";

  directionMilPerRotation: number = NaN;
  elevationMilPerRotation: number = NaN;

  blastDiameter: number = NaN;
}
