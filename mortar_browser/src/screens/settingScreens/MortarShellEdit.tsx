import { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { NavigationManager } from "../../navigation/NavigationManager";
import { MortarShellData } from "../../mortar_logic_src/Settings/MortarShellData";
import SelectPicker from "../../EnvironmentDependentComponents/SelectPicker";
import TextBlock from "../../EnvironmentDependentComponents/TextBlock";
import BlockContainer from "../../EnvironmentDependentComponents/BlockContainer";
import SmallText from "../../EnvironmentDependentComponents/SmallText";
import LineBreak from "../../EnvironmentDependentComponents/LineBreak";
import AppButton from "../../EnvironmentDependentComponents/AppButton";
import ScreenTitle from "../../EnvironmentDependentComponents/ScreenTitle";
import Card from "../../EnvironmentDependentComponents/Card";
import DataLineElement from "../../EnvironmentDependentComponents/DataLineElement";
import TextInput from "../../EnvironmentDependentComponents/TextInput";
import TextAreaInput from "../../EnvironmentDependentComponents/TextAreaInput";

export default function MortarShellEdit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentShell = props.appFDC.settings.mortarShellData.find(
    (shll) => shll.id == nav.selectedMortarShell
  );
  const [shellName, setShellName] = useState(currentShell?.name ?? "");
  const [shellDescription, setShellDescription] = useState(
    currentShell?.description ?? ""
  );

  function saveShell() {
    if (currentShell == null) {
      currentShell = new MortarShellData();
      props.appFDC.settings.mortarShellData.push(currentShell);
    }

    currentShell.name = shellName;
    currentShell.description = shellDescription;
  }

  function removeShell() {
    if (currentShell) {
      var index = props.appFDC.settings.mortarShellData.indexOf(currentShell);
      if (index > -1) {
        props.appFDC.settings.mortarShellData.splice(index, 1);
      }
    }
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar shell" />

      <TextInput
        label="Name"
        startValue={shellName}
        blurCallback={(inputVal) => {
          setShellName(inputVal);
        }}
      />

      <LineBreak />

      <TextAreaInput
        label="Description"
        startValue={shellDescription}
        blurCallback={(inputVal) => {
          setShellDescription(inputVal);
        }}
      />

      <LineBreak />

      {currentShell?.mortarShellCharges.map((chrg) => (
        <MortarChargeListItem
          appFDC={props.appFDC}
          chargeId={chrg.id}
          navigationManager={props.navigationManager}
          shellId={currentShell!.id}
        />
      ))}

      <LineBreak />

      <AppButton
        label="Create new charge"
        clickCallback={() => {
          saveShell();
          nav.navigateToSettingsChargeEdit("", currentShell?.id);
        }}
      />

      <LineBreak />
      <LineBreak />

      <AppButton
        label="Back"
        clickCallback={() => {
          nav.navigateToSettingsShellList();
        }}
      />

      <AppButton
        label="Remove"
        clickCallback={() => {
          removeShell();
          nav.navigateToSettingsShellList();
        }}
      />

      <AppButton
        label="Save"
        clickCallback={() => {
          saveShell();
          nav.navigateToSettingsShellList();
        }}
      />
    </BlockContainer>
  );
}

function MortarChargeListItem(props: {
  appFDC: AppFDC;
  shellId: string;
  chargeId: string;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentShell = props.appFDC.settings.mortarShellData.find(
    (shll) => shll.id == nav.selectedMortarShell
  );

  var currentCharge = currentShell?.mortarShellCharges.find(
    (chrg) => chrg.id == props.chargeId
  );

  if (currentCharge == null) {
    return null;
  }

  return (
    <BlockContainer
      borderTop={1}
      borderBtn={1}
      margin={1}
      borderAlphaLayer={0.2}
    >
      <DataLineElement>
        <SmallText text={currentCharge.name} />
      </DataLineElement>

      <DataLineElement>
        <AppButton
          label="Edit"
          clickCallback={() => {
            nav.navigateToSettingsChargeEdit(props.chargeId, props.shellId);
          }}
        />
      </DataLineElement>
    </BlockContainer>
  );
}
