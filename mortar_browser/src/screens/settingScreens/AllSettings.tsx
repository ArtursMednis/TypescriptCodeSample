import React from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { NavigationManager } from "../../navigation/NavigationManager";
import { Helpers } from "../../mortar_logic_src/Helpers";
import NumericInput from "../../EnvironmentDependentComponents/NumericInput";
import TextInput from "../../EnvironmentDependentComponents/TextInput";
import SelectPicker from "../../EnvironmentDependentComponents/SelectPicker";
import TextBlock from "../../EnvironmentDependentComponents/TextBlock";
import BlockContainer from "../../EnvironmentDependentComponents/BlockContainer";
import SmallText from "../../EnvironmentDependentComponents/SmallText";
import LineBreak from "../../EnvironmentDependentComponents/LineBreak";
import AppButton from "../../EnvironmentDependentComponents/AppButton";
import ScreenTitle from "../../EnvironmentDependentComponents/ScreenTitle";
import Card from "../../EnvironmentDependentComponents/Card";
import DataLineElement from "../../EnvironmentDependentComponents/DataLineElement";
import ExportAppInFileBtn from "../../EnvironmentDependentComponents/ExportAppInFileBtn";
import ImportAppFromFileBtn from "../../EnvironmentDependentComponents/ImportAppFromFileBtn";

export default function AllSettings(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  var exportedAppFdcData = props.appFDC.exportApp();
  var exportedSaveLink = nav.createLinkForAppExport(exportedAppFdcData);
  var exportFileName =
    "mortarFdc " + Helpers.formatDateToDTG(new Date()) + ".json";

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Settings" />

      <AppButton
        label="Mortar shells"
        clickCallback={() => {
          nav.navigateToSettingsShellList();
        }}
      />

      <LineBreak />
      <LineBreak />

      <AppButton
        label="Mortar types"
        clickCallback={() => {
          nav.navigateToSettingsMrtTypeList();
        }}
      />

      <LineBreak />
      <LineBreak />
      <TextBlock text="---------------------------" />

      <LineBreak />
      <LineBreak />

      <ExportAppInFileBtn
        exportedAppFdcData={exportedAppFdcData}
        exportFileName={exportFileName}
        navigationManager={nav}
      />

      <LineBreak />
      <LineBreak />

      <ImportAppFromFileBtn
        clickCallback={(fileContent) => {
          props.appFDC.importApp(fileContent);
        }}
      />
    </BlockContainer>
  );
}
