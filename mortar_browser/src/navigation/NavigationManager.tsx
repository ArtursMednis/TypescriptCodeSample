import { AppFDC } from "../mortar_logic_src/AppFDC";
import { FireMission } from "../mortar_logic_src/FireMission";
import { Mortar } from "../mortar_logic_src/Mortar";
import MapLeafletDisplay from "../screens/MapLeafletDisplay";
import MapLeafletPicker from "../screens/MapLeafletPicker";
import MapSvg from "../screens/MapSvg";
import Welcome from "../screens/Welcome";
import FireDataLineCorrectionEdit from "../screens/fireMissionScreens/FireDataLineCorrectionEdit";
import FireMissionEdit from "../screens/fireMissionScreens/FireMissionEdit";
import FireMissionInit from "../screens/fireMissionScreens/FireMissionInit";
import FireMissionList from "../screens/fireMissionScreens/FireMissionList";
import MortarEdit from "../screens/mortarScreens/MortarEdit";
import MortarList from "../screens/mortarScreens/MortarList";
import AllSettings from "../screens/settingScreens/AllSettings";
import MortarChargeEdit from "../screens/settingScreens/MortarChargeEdit";
import MortarShellEdit from "../screens/settingScreens/MortarShellEdit";
import MortarShellsList from "../screens/settingScreens/MortarShellsList";
import MortarTypeEdit from "../screens/settingScreens/MortarTypeEdit";
import MortarTypeList from "../screens/settingScreens/MortarTypeList";
import React, { useEffect, useState } from "react";

export class NavigationManager {
  private appFDC: AppFDC;

  public constructor(appFdcRef: AppFDC) {
    this.appFDC = appFdcRef;
  }

  mainMenu: MainMenuOptions = MainMenuOptions.Welcome;

  private settingsMenu: SettingsMenuOptions = SettingsMenuOptions.ChargeList;

  selectedMortarShellCharge: string = "";

  selectedMortarShell: string = "";
  selectedMortarType: string = "";

  private mortarMenu: MortarMenuOptions = MortarMenuOptions.List;
  selectedMortar: string = "";
  private mortarEditSubMenu: string = "";

  private fireMissionMenu: FireMissionMenuOptions = FireMissionMenuOptions.List;
  selectedFireMission: string = "";
  private fireMissionEditSubMenu: string = "";
  selectedFireDataLineNo: number = NaN;

  private showMap: boolean = false;
  private showWorldMap: boolean = false;
  private showMapPicker: boolean = false;

  mapPickerMortar: Mortar | null = null;
  mapPickerFireMission: FireMission | null = null;
  //mapPickerSubject:MapPickerSubjectOptions = MapPickerSubjectOptions.None;

  //startingPositionLatLon:{lat:number,lon:number}|null = null;
  startingPositionLatLon: [number, number] | null = null;

  isIllum: boolean = false;

  public refreshComponents = () => {};

  private downloadExportedFileUrl: string | null = null;

  public getCurrentScreenComponent(): JSX.Element {
    if (this.showMap) {
      return <MapSvg appFDC={this.appFDC} navigationManager={this} />;
    }

    if (this.showWorldMap) {
      console.log("display");
      return (
        <MapLeafletDisplay appFDC={this.appFDC} navigationManager={this} />
      );
    }

    if (this.showMapPicker) {
      return this.startingPositionLatLon == null ? (
        <FillStartingPositionAndRefresh
          appFDC={this.appFDC}
          navigationManager={this}
        />
      ) : (
        <MapLeafletPicker appFDC={this.appFDC} navigationManager={this} />
      );
    }

    if (this.mainMenu == MainMenuOptions.Mortar) {
      if (this.mortarMenu == MortarMenuOptions.Edit) {
        return <MortarEdit appFDC={this.appFDC} navigationManager={this} />;
      }

      return <MortarList appFDC={this.appFDC} navigationManager={this} />;
    }

    if (this.mainMenu == MainMenuOptions.FireMission) {
      if (this.fireMissionMenu == FireMissionMenuOptions.Edit) {
        return (
          <FireMissionEdit appFDC={this.appFDC} navigationManager={this} />
        );
      }

      if (this.fireMissionMenu == FireMissionMenuOptions.Init) {
        return (
          <FireMissionInit appFDC={this.appFDC} navigationManager={this} />
        );
      }

      if (
        this.fireMissionMenu == FireMissionMenuOptions.FireDataLineCorrection
      ) {
        return (
          <FireDataLineCorrectionEdit
            appFDC={this.appFDC}
            navigationManager={this}
          />
        );
      }

      return <FireMissionList appFDC={this.appFDC} navigationManager={this} />;
    }

    if (this.mainMenu == MainMenuOptions.Settings) {
      if (this.settingsMenu == SettingsMenuOptions.ChargeEdit) {
        return (
          <MortarChargeEdit appFDC={this.appFDC} navigationManager={this} />
        );
      }

      if (this.settingsMenu == SettingsMenuOptions.ShellEdit) {
        return (
          <MortarShellEdit appFDC={this.appFDC} navigationManager={this} />
        );
      }

      if (this.settingsMenu == SettingsMenuOptions.ShellList) {
        return (
          <MortarShellsList appFDC={this.appFDC} navigationManager={this} />
        );
      }

      if (this.settingsMenu == SettingsMenuOptions.MrtTypeEdit) {
        return <MortarTypeEdit appFDC={this.appFDC} navigationManager={this} />;
      }

      if (this.settingsMenu == SettingsMenuOptions.MrtTypeList) {
        return <MortarTypeList appFDC={this.appFDC} navigationManager={this} />;
      }

      return <AllSettings appFDC={this.appFDC} navigationManager={this} />;
    }

    return <Welcome />;
  }

  public navigateToWelcome() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mapPickerMortar = null;
    this.mapPickerFireMission = null;
    this.mainMenu = MainMenuOptions.Welcome;
    this.refreshComponents();
  }

  public navigateToMortarList() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mapPickerMortar = null;
    this.mapPickerFireMission = null;
    this.mainMenu = MainMenuOptions.Mortar;
    this.mortarMenu = MortarMenuOptions.List;
    this.refreshComponents();
  }

  public navigateToMortarEdit(mortarId: string = "") {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.Mortar;
    this.mortarMenu = MortarMenuOptions.Edit;
    this.selectedMortar = mortarId;
    this.refreshComponents();
  }

  public navigateToFireMissionList() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mapPickerMortar = null;
    this.mapPickerFireMission = null;
    this.mainMenu = MainMenuOptions.FireMission;
    this.fireMissionMenu = FireMissionMenuOptions.List;
    this.refreshComponents();
  }

  public navigateToFireMissionInit(fireMissionId: string = "") {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.FireMission;
    this.fireMissionMenu = FireMissionMenuOptions.Init;
    this.selectedFireMission = fireMissionId;
    this.refreshComponents();
  }

  public navigateToFireMissionEdit(fireMissionId: string) {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mapPickerMortar = null;
    this.mapPickerFireMission = null;
    this.mainMenu = MainMenuOptions.FireMission;
    this.fireMissionMenu = FireMissionMenuOptions.Edit;
    this.selectedFireMission = fireMissionId;
    this.selectedFireDataLineNo = NaN;
    this.refreshComponents();
  }

  public navigateToFDLCorrectionEdit(
    fireMissionId: string,
    fireDataLineNo: number,
    isIllum: boolean = false
  ) {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mapPickerMortar = null;
    this.mapPickerFireMission = null;
    this.mainMenu = MainMenuOptions.FireMission;
    this.fireMissionMenu = FireMissionMenuOptions.FireDataLineCorrection;
    this.isIllum = isIllum;
    this.selectedFireMission = fireMissionId;
    this.selectedFireDataLineNo = fireDataLineNo;
    this.refreshComponents();
  }

  public navigateToAllSettings() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mapPickerMortar = null;
    this.mapPickerFireMission = null;
    this.mainMenu = MainMenuOptions.Settings;
    this.settingsMenu = SettingsMenuOptions.AllSettings;
    this.refreshComponents();
  }

  public navigateToSettingsShellList() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.Settings;
    this.settingsMenu = SettingsMenuOptions.ShellList;
    this.selectedMortarShellCharge = "";
    this.selectedMortarShell = "";
    this.refreshComponents();
  }

  public navigateToSettingsChargeEdit(chargeId: string = "", shellId?: string) {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.Settings;
    this.settingsMenu = SettingsMenuOptions.ChargeEdit;
    this.selectedMortarShellCharge = chargeId;
    this.selectedMortarShell = shellId ?? "";
    this.refreshComponents();
  }

  public navigateToSettingsShellEdit(shellId: string = "") {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.Settings;
    this.settingsMenu = SettingsMenuOptions.ShellEdit;
    this.selectedMortarShellCharge = "";
    this.selectedMortarShell = shellId;
    this.refreshComponents();
  }

  public navigateToSettingsMrtTypeEdit(typeId: string = "") {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.Settings;
    this.settingsMenu = SettingsMenuOptions.MrtTypeEdit;
    this.selectedMortarType = typeId;
    this.refreshComponents();
  }

  public navigateToSettingsMrtTypeList() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.mainMenu = MainMenuOptions.Settings;
    this.settingsMenu = SettingsMenuOptions.MrtTypeList;
    this.selectedMortarType = "";
    this.refreshComponents();
  }

  public displayMao() {
    this.showMap = true;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.refreshComponents();
  }

  public displayWorldMap() {
    this.showWorldMap = true;
    this.showMap = false;
    this.showMapPicker = false;
    this.refreshComponents();
  }

  public cancelMap() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = false;
    this.refreshComponents();
  }

  public openMapPicker() {
    this.showMap = false;
    this.showWorldMap = false;
    this.showMapPicker = true;
    this.refreshComponents();
  }

  public createLinkForAppExport(appFDCData: string) {
    var data = new Blob([appFDCData], { type: "text/plain" });

    this.clearLinkForAppExport();

    this.downloadExportedFileUrl = window.URL.createObjectURL(data);

    return this.downloadExportedFileUrl;
  }

  public clearLinkForAppExport() {
    if (this.downloadExportedFileUrl !== null) {
      window.URL.revokeObjectURL(this.downloadExportedFileUrl);
    }
  }
}

export enum MainMenuOptions {
  Welcome = "Welcome",
  Mortar = "Mortar",
  FireMission = "FireMission",
  Settings = "Settings",
}

enum SettingsMenuOptions {
  ChargeList = "ChargeList",
  ChargeEdit = "ChargeEdit",
  ShellEdit = "ShellEdit",
  ShellList = "ShellList",
  MrtTypeList = "MrtTypeList",
  MrtTypeEdit = "MrtTypeEdit",
  AllSettings = "AllSettings",
}

enum MortarMenuOptions {
  List = "List",
  Edit = "Edit",
}

enum FireMissionMenuOptions {
  List = "List",
  Edit = "Edit",
  Init = "Init",
  FireDataLineCorrection = "FireDataLineCorrection",
}

function FillStartingPositionAndRefresh(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        nav.startingPositionLatLon = [latitude, longitude];
        nav.refreshComponents();
      },
      (error) => {
        console.error("Error getting user location:", error);
        nav.startingPositionLatLon = [51.505, -0.09];
        nav.refreshComponents();
      }
    );
  }, []);

  return (
    <div>
      <p>Hello there!</p>
    </div>
  );
}
