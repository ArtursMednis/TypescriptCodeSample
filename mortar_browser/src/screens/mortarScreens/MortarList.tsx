import React from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { NavigationManager } from "../../navigation/NavigationManager";
import NumericInput from "../../EnvironmentDependentComponents/NumericInput";
import TextInput from "../../EnvironmentDependentComponents/TextInput";
import SelectPicker from "../../EnvironmentDependentComponents/SelectPicker";
import TextBlock from "../../EnvironmentDependentComponents/TextBlock";
import BlockContainer from "../../EnvironmentDependentComponents/BlockContainer";
import SmallText from "../../EnvironmentDependentComponents/SmallText";
import LineBreak from "../../EnvironmentDependentComponents/LineBreak";
import AppButton from "../../EnvironmentDependentComponents/AppButton";
import ScreenTitle from "../../EnvironmentDependentComponents/ScreenTitle";
import { Helpers } from "../../mortar_logic_src/Helpers";

export default function MortarList(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  function mortarListItem(mortarId: string) {
    var currentMortar = props.appFDC.mortars.find((mrt) => mrt.id == mortarId);

    var currentMrtTypeName = props.appFDC.settings.mortarTypes.find(
      (typ) => typ.id == currentMortar?.mortarTypeId
    )?.name;

    if (currentMortar == null) {
      return null;
    }

    return (
      <BlockContainer
        borderTop={1}
        borderBtn={1}
        margin={1}
        borderAlphaLayer={0.2}
      >
        <SmallText text={currentMortar.name} bold={true} margin={5} />

        <SmallText text={currentMrtTypeName} margin={5} />

        <SmallText
          text={Helpers.formatLocationGrid(currentMortar?.mortarLocation)}
          margin={15}
        />

        <AppButton
          label="Edit"
          clickCallback={() => {
            nav.navigateToMortarEdit(mortarId);
          }}
        />
      </BlockContainer>
    );
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar list" />

      <BlockContainer
        inlineBlock={false}
        marginBotom={10}
        borderBtn={0}
        borderTop={0}
      >
        {props.appFDC.mortars.map((mrt) => mortarListItem(mrt.id))}
      </BlockContainer>

      <AppButton
        label="Create new"
        clickCallback={() => {
          nav.navigateToMortarEdit();
        }}
      />

      <LineBreak />
      <LineBreak />

      <SelectPicker
        startValue={props.appFDC.defaultSelectedMortarId}
        label="Default mortar"
        selectOptions={props.appFDC.mortars}
        changeCallback={(inputVal) => {
          props.appFDC.defaultSelectedMortarId = inputVal;
        }}
      />
    </BlockContainer>
  );
}
