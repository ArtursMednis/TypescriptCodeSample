import { FireMission } from "./FireMission";
import { Mortar } from "./Mortar";
import { Settings } from "./Settings/Settings";

import { FireDataLine } from "./FireDataLine";
import { FireDataLineIllum } from "./FireDataLineIllum";
import { FireDataLineSubtarget } from "./FireDataLineSubtarget";
import { LinearTarget } from "./LinearTarget";
import { MortarShellChargeData } from "./Settings/MortarShellChargeData";
import { MortarShellData } from "./Settings/MortarShellData";
import { MortarType } from "./Settings/MortarType";

export class AppFDC {
  mortars: Mortar[] = [];
  fireMissions: FireMission[] = [];
  settings: Settings = new Settings();

  defaultSelectedMortarId: string = "";

  CreateMortar(): Mortar {
    var mortar = new Mortar();
    mortar.appFDC = this;
    mortar.mortarTypeId = this.settings.defaultMrtType;
    this.mortars.push(mortar);

    if (this.defaultSelectedMortarId == "") {
      this.defaultSelectedMortarId = mortar.id;
    }

    return mortar;
  }

  getMortarById(mortarId: string) {
    return this.mortars.find((mrt) => mrt.id == mortarId);
  }

  removeMortar(mortar: Mortar | string) {
    var mortarToRemove =
      mortar instanceof Mortar
        ? mortar
        : this.mortars.find((mrt) => mrt.id == mortar);

    if (mortarToRemove) {
      var index = this.mortars.indexOf(mortarToRemove);
      if (index > -1) {
        this.mortars.splice(index, 1);
      }

      if ((this.defaultSelectedMortarId = mortarToRemove.id)) {
        this.defaultSelectedMortarId = this.mortars[0]?.id ?? "";
      }
    }
  }

  CreateFireMission(): FireMission {
    var fireMission = new FireMission();
    fireMission.appFDC = this;
    this.fireMissions.push(fireMission);
    return fireMission;
  }

  removeFireMission(fireMission: FireMission | string) {
    var fireMissionToRemove =
      fireMission instanceof FireMission
        ? fireMission
        : this.fireMissions.find((frm) => frm.id == fireMission);

    if (fireMissionToRemove) {
      var index = this.fireMissions.indexOf(fireMissionToRemove);
      if (index > -1) {
        this.fireMissions.splice(index, 1);
      }
    }
  }

  exportApp(): string {
    const exportedObjects = new Map<object, number>();
    let objectIdCounter = 1;
    let predefinedShellIds = this.settings.predefinedShellIds;
    let predefinedTypeIds = this.settings.predefinedTypeIds;

    function replacer(key: string, value: any) {
      if (key === "mortarShellData" && Array.isArray(value)) {
        var shellDataForExport = value.slice(0);
        for (var k = 0; k < predefinedShellIds.length; k++) {
          var currentPredefShellId = predefinedShellIds[k];
          shellDataForExport = shellDataForExport.filter(
            (shellData: MortarShellData) =>
              shellData.id !== currentPredefShellId
          );
        }
        return shellDataForExport;
      }

      if (key === "mortarTypes" && Array.isArray(value)) {
        var mrTypeForExport = value.slice(0);
        for (var k = 0; k < predefinedTypeIds.length; k++) {
          var currentPredefTypeId = predefinedTypeIds[k];
          mrTypeForExport = mrTypeForExport.filter(
            (mrtType: MortarType) => mrtType.id !== currentPredefTypeId
          );
        }
        return mrTypeForExport;
      }

      if (key == "appFDC") {
        return undefined;
      }

      if (key == "fireMission") {
        return undefined;
      }

      if (typeof value === "object" && value !== null) {
        if (exportedObjects.has(value)) {
          return { __circularRef: exportedObjects.get(value) };
        }
        exportedObjects.set(value, objectIdCounter);
        objectIdCounter++;
      }
      return value;
    }

    const serializedAppFDC = JSON.stringify(this, replacer);

    exportedObjects.clear();

    return serializedAppFDC;
  }

  importApp(serializedAppFDC: string) {
    var importedApp: AppFDC = Object.assign(
      new AppFDC(),
      JSON.parse(serializedAppFDC)
    );

    importedApp.mortars.forEach((importedMrtData) => {
      var importedMrt = new Mortar();
      Object.assign(importedMrt, importedMrtData);
      importedMrt.appFDC = this;
      importedMrt.leftSafetyArc =
        importedMrtData.leftSafetyArc == null
          ? NaN
          : importedMrtData.leftSafetyArc;
      importedMrt.rightSafetyArc =
        importedMrtData.rightSafetyArc == null
          ? NaN
          : importedMrtData.rightSafetyArc;

      this.removeMortar(importedMrt.id);
      this.mortars.push(importedMrt);
    });

    this.defaultSelectedMortarId = importedApp.defaultSelectedMortarId;

    importedApp.fireMissions.forEach((importedFrmData) => {
      var importedFrm = new FireMission();
      Object.assign(importedFrm, importedFrmData);
      importedFrm.appFDC = this;
      importedFrm.missionStartTime = new Date(importedFrmData.missionStartTime);

      importedFrm.fireDateLines = (importedFrmData.fireDateLines || []).map(
        (fdlData) => {
          const fdl = new FireDataLine();
          Object.assign(fdl, fdlData);
          fdl.fireMission = importedFrm;
          fdl.firingTime = fdlData.firingTime
            ? new Date(fdlData.firingTime)
            : null;
          return fdl;
        }
      );

      importedFrm.fireDateLinesIllum = (
        importedFrmData.fireDateLinesIllum || []
      ).map((fdlData) => {
        const fdl = new FireDataLineIllum();
        Object.assign(fdl, fdlData);
        fdl.fireMission = importedFrm;
        fdl.firingTime = fdlData.firingTime
          ? new Date(fdlData.firingTime)
          : null;
        return fdl;
      });

      if (importedFrmData.linearTarget) {
        importedFrm.linearTarget = new LinearTarget();
        Object.assign(importedFrm.linearTarget, importedFrmData.linearTarget);
        importedFrm.linearTarget.fireMission = importedFrm;

        importedFrm.linearTarget.fireDateLines = (
          importedFrmData.linearTarget.fireDateLines || []
        ).map((fdlData) => {
          const fdl = new FireDataLineSubtarget();
          Object.assign(fdl, fdlData);
          fdl.linearTarget = importedFrm.linearTarget!;
          return fdl;
        });
      }

      this.removeFireMission(importedFrm.id);
      this.fireMissions.push(importedFrm);
    });

    importedApp.settings.mortarTypes.forEach((importedMrtTypeData) => {
      var mortarTypeToRemove = this.settings.mortarTypes.find(
        (mrtType) => mrtType.id == importedMrtTypeData.id
      );

      if (mortarTypeToRemove) {
        var index = this.settings.mortarTypes.indexOf(mortarTypeToRemove);
        if (index > -1) {
          this.settings.mortarTypes.splice(index, 1);
        }
      }

      var importedMrtType = new MortarType();
      Object.assign(importedMrtType, importedMrtTypeData);

      this.settings.mortarTypes.push(importedMrtType);
    });

    importedApp.settings.mortarShellData.forEach((importedShellDataData) => {
      var shellDataToRemove = this.settings.mortarShellData.find(
        (mrtShell) => mrtShell.id == importedShellDataData.id
      );

      if (shellDataToRemove) {
        var index = this.settings.mortarShellData.indexOf(shellDataToRemove);
        if (index > -1) {
          this.settings.mortarShellData.splice(index, 1);
        }
      }

      var importedMrtShell = new MortarShellData();
      Object.assign(importedMrtShell, importedShellDataData);

      importedMrtShell.mortarShellCharges = (
        importedShellDataData.mortarShellCharges || []
      ).map((chargeData) => {
        const charge = new MortarShellChargeData();
        Object.assign(charge, chargeData);
        return charge;
      });

      this.settings.mortarShellData.push(importedMrtShell);
    });

    importedApp.settings.mortarShellCharges.forEach(
      (importedShellChargeDataData) => {
        var shellChargeToRemove = this.settings.mortarShellCharges.find(
          (mrtChrg) => mrtChrg.id == importedShellChargeDataData.id
        );

        if (shellChargeToRemove) {
          var index =
            this.settings.mortarShellCharges.indexOf(shellChargeToRemove);
          if (index > -1) {
            this.settings.mortarShellCharges.splice(index, 1);
          }
        }

        var importedCharge = new MortarShellChargeData();
        Object.assign(importedCharge, importedShellChargeDataData);

        this.settings.mortarShellCharges.push(importedCharge);
      }
    );

    this.settings.defaultMrtType = importedApp.settings.defaultMrtType;
    this.settings.defaultSelectedShellId =
      importedApp.settings.defaultSelectedShellId;
  }
}
