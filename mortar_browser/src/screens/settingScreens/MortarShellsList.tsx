import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { NavigationManager } from "../../navigation/NavigationManager";
import SelectPicker from "../../EnvironmentDependentComponents/SelectPicker";
import TextBlock from "../../EnvironmentDependentComponents/TextBlock";
import BlockContainer from "../../EnvironmentDependentComponents/BlockContainer";
import SmallText from "../../EnvironmentDependentComponents/SmallText";
import LineBreak from "../../EnvironmentDependentComponents/LineBreak";
import AppButton from "../../EnvironmentDependentComponents/AppButton";
import ScreenTitle from "../../EnvironmentDependentComponents/ScreenTitle";
import Card from "../../EnvironmentDependentComponents/Card";
import DataLineElement from "../../EnvironmentDependentComponents/DataLineElement";

export default function MortarShellsList(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar shells list" />

      {props.appFDC.settings.mortarShellData.map((shll) => (
        <MortarShellListItem
          appFDC={props.appFDC}
          shellId={shll.id}
          navigationManager={props.navigationManager}
        />
      ))}

      <LineBreak />

      <AppButton
        label="Create new"
        clickCallback={() => {
          nav.navigateToSettingsShellEdit();
        }}
      />

      <LineBreak />
      <LineBreak />

      <SelectPicker
        startValue={props.appFDC.settings.defaultSelectedShellId}
        label="Default shell"
        selectOptions={props.appFDC.settings.mortarShellData}
        changeCallback={(inputVal) => {
          props.appFDC.settings.defaultSelectedShellId = inputVal;
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

function MortarShellListItem(props: {
  appFDC: AppFDC;
  shellId: string;
  navigationManager: NavigationManager;
}) {
  var currentShell = props.appFDC.settings.mortarShellData.find(
    (shll) => shll.id == props.shellId
  );
  var nav = props.navigationManager;

  if (currentShell == null) {
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
        <SmallText text={currentShell.name} />
      </DataLineElement>

      <DataLineElement>
        <AppButton
          label="Edit"
          clickCallback={() => {
            nav.navigateToSettingsShellEdit(props.shellId);
          }}
        />
      </DataLineElement>
    </BlockContainer>
  );
}
