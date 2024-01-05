import { MortarShellChargeData } from "./MortarShellChargeData";
import { MortarShellData } from "./MortarShellData";
import { MortarType } from "./MortarType";

export class Settings {
  mapSettings: MapSettings = new MapSettings();

  /**
   * @deprecated Use `mortarShellData` instead.
   */
  mortarShellCharges: MortarShellChargeData[] = [];

  mortarShellData: MortarShellData[] = [];
  defaultSelectedShellId: string = "";

  mortarTypes: MortarType[] = [];
  defaultMrtType: string = "";

  predefinedShellIds: string[] = [];
  predefinedTypeIds: string[] = [];
}

export class MapSettings {
  showMilimeterPaper: boolean = true;
  showDecimals: boolean = false;
  showMapImage: boolean = false;
  distanceBtwnMajorAxis: number = 1000;

  showBlastDiameter: boolean = false;
  useInternetForMapData: boolean = false;
}
