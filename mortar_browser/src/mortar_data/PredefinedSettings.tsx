import { MortarShellData } from "../mortar_logic_src/Settings/MortarShellData";
import { MortarType } from "../mortar_logic_src/Settings/MortarType";
import HE_120_Hirtenberger from "./PredefinedChargeData/HE_120_Hirtenberger";
import HE_81 from "./PredefinedChargeData/HE_81";
import HE_81_austriesu from "./PredefinedChargeData/HE_81_austriesu";
import ILL_SMK_120_Hirtenberger from "./PredefinedChargeData/ILL_SMK_120_Hirtenberger";
import M48_120_HE from "./PredefinedChargeData/M48_120_HE";
import Mrt120mm from "./PredefinedMortarTypes/Mrt120mm";
import Mrt81mm from "./PredefinedMortarTypes/Mrt81mm";

export class PredefinedSettings {
  mortarShellData: MortarShellData[] = [
    HE_120_Hirtenberger,
    ILL_SMK_120_Hirtenberger,
    M48_120_HE,
    HE_81,
    HE_81_austriesu,
  ];
  mortarTypes: MortarType[] = [Mrt120mm, Mrt81mm];
}
