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

export default function MortarChargesList(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar shells and charges list" />

      {props.appFDC.settings.mortarShellCharges.map((chrg) => (
        <MortarChargeListItem
          appFDC={props.appFDC}
          chargeId={chrg.id}
          navigationManager={props.navigationManager}
        />
      ))}

      <LineBreak />

      <AppButton
        label="Create new"
        clickCallback={() => {
          nav.navigateToSettingsChargeEdit();
        }}
      />
    </BlockContainer>
  );
}

function MortarChargeListItem(props: {
  appFDC: AppFDC;
  chargeId: string;
  navigationManager: NavigationManager;
}) {
  var currentCharge = props.appFDC.settings.mortarShellCharges.find(
    (chrg) => chrg.id == props.chargeId
  );
  var nav = props.navigationManager;

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
            nav.navigateToSettingsChargeEdit(props.chargeId);
          }}
        />
      </DataLineElement>
    </BlockContainer>
  );
}
