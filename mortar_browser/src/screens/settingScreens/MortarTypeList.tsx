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
import Card from "../../EnvironmentDependentComponents/Card";
import DataLineElement from "../../EnvironmentDependentComponents/DataLineElement";

export default function MortarTypeList(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar types list" />

      {props.appFDC.settings.mortarTypes.map((mrtType) => (
        <MortarTypeListItem
          appFDC={props.appFDC}
          typeId={mrtType.id}
          navigationManager={props.navigationManager}
        />
      ))}

      <LineBreak />

      <AppButton
        label="Create new"
        clickCallback={() => {
          nav.navigateToSettingsMrtTypeEdit();
        }}
      />

      <LineBreak />
      <LineBreak />

      <SelectPicker
        startValue={props.appFDC.settings.defaultMrtType}
        label="Default mortar type"
        selectOptions={props.appFDC.settings.mortarTypes}
        changeCallback={(inputVal) => {
          props.appFDC.settings.defaultMrtType = inputVal;
        }}
      />

      <LineBreak />
      <LineBreak />

      <AppButton
        label="Back"
        clickCallback={() => {
          nav.navigateToAllSettings();
        }}
      />
    </BlockContainer>
  );
}

function MortarTypeListItem(props: {
  appFDC: AppFDC;
  typeId: string;
  navigationManager: NavigationManager;
}) {
  var currentType = props.appFDC.settings.mortarTypes.find(
    (mrtType) => mrtType.id == props.typeId
  );
  var nav = props.navigationManager;

  if (currentType == null) {
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
        <SmallText text={currentType.name} />
      </DataLineElement>

      <DataLineElement>
        <AppButton
          label="Edit"
          clickCallback={() => {
            nav.navigateToSettingsMrtTypeEdit(props.typeId);
          }}
        />
      </DataLineElement>
    </BlockContainer>
  );
}
