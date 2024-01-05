import { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { NavigationManager } from "../../navigation/NavigationManager";
import { MortarType } from "../../mortar_logic_src/Settings/MortarType";
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

export default function MortarTypeEdit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentType = props.appFDC.settings.mortarTypes.find(
    (typ) => typ.id == nav.selectedMortarType
  );

  const [mrtTypeName, setMrtTypeName] = useState(currentType?.name ?? "");

  const [directionMilPerRotation, setDirectionMilPerRotation] = useState(
    currentType?.directionMilPerRotation ?? 0
  );
  const [elevationMilPerRotation, setElevationMilPerRotation] = useState(
    currentType?.elevationMilPerRotation ?? 0
  );
  const [blastDiameter, setBlastDiameter] = useState(
    currentType?.blastDiameter ?? 0
  );

  function saveMrtType() {
    if (currentType == null) {
      currentType = new MortarType();
      props.appFDC.settings.mortarTypes.push(currentType);
    }

    currentType.name = mrtTypeName;
    currentType.directionMilPerRotation = directionMilPerRotation;
    currentType.elevationMilPerRotation = elevationMilPerRotation;
    currentType.blastDiameter = blastDiameter;
  }

  function removeMrtType() {
    if (currentType) {
      var index = props.appFDC.settings.mortarTypes.indexOf(currentType);
      if (index > -1) {
        props.appFDC.settings.mortarTypes.splice(index, 1);
      }
    }
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar type" />

      <TextInput
        label="Name"
        startValue={mrtTypeName}
        blurCallback={(inputVal) => {
          setMrtTypeName(inputVal);
        }}
      />

      <LineBreak />
      <LineBreak />

      <NumericInput
        startValue={directionMilPerRotation}
        label="Direction Mils Per Rotation (for search and traverse)"
        blurCallback={(inputVal) => {
          setDirectionMilPerRotation(inputVal);
        }}
      />

      <NumericInput
        startValue={elevationMilPerRotation}
        label="Elevation MilsPer Rotation (for search and traverse)"
        blurCallback={(inputVal) => {
          setElevationMilPerRotation(inputVal);
        }}
      />

      <LineBreak />
      <LineBreak />

      <NumericInput
        startValue={blastDiameter}
        label="Blast Diameter (for visualization in map)"
        blurCallback={(inputVal) => {
          setBlastDiameter(inputVal);
        }}
      />

      <LineBreak />
      <LineBreak />

      <AppButton
        label="Back"
        clickCallback={() => {
          nav.navigateToSettingsMrtTypeList();
        }}
      />

      <AppButton
        label="Remove"
        clickCallback={() => {
          removeMrtType();
          nav.navigateToSettingsMrtTypeList();
        }}
      />

      <AppButton
        label="Save"
        clickCallback={() => {
          saveMrtType();
          nav.navigateToSettingsMrtTypeList();
        }}
      />
    </BlockContainer>
  );
}
