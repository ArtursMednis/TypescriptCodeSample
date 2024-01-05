import { Helpers } from "../Helpers";
import { iSelectableOption } from "../interfaces";
import { MortarShellChargeData } from "./MortarShellChargeData";

export class MortarShellData implements iSelectableOption {
  id = Helpers.RandomId();
  name: string = "";
  description: string = "";
  mortarShellCharges: MortarShellChargeData[] = [];
}
