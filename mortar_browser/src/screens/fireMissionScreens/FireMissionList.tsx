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
import DataLineElement from "../../EnvironmentDependentComponents/DataLineElement";

export default function FireMissionList(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Fire Mission list" />

      {props.appFDC.fireMissions.map((frm) => (
        <FireMissionListItem
          appFDC={props.appFDC}
          fireMissionId={frm.id}
          navigationManager={props.navigationManager}
        />
      ))}

      <LineBreak />

      <AppButton
        label="Create new"
        clickCallback={() => {
          nav.navigateToFireMissionInit();
        }}
      />
    </BlockContainer>
  );
}

function FireMissionListItem(props: {
  appFDC: AppFDC;
  fireMissionId: string;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == props.fireMissionId
  );

  function formatMissionTimeString() {
    var startTime =
      currentFireMission?.missionStartTime?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) ?? "-";

    var fireDataLinesFired = currentFireMission?.fireDateLines?.filter(
      (x) => x.firingTime
    );
    var lastFiredFireDataLine = fireDataLinesFired?.length
      ? fireDataLinesFired[fireDataLinesFired.length - 1]
      : undefined;
    var firingTime =
      lastFiredFireDataLine?.firingTime?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) ?? "-";

    var missionTimeFormated = "Mission time: " + startTime + " - " + firingTime;

    return missionTimeFormated;
  }

  if (currentFireMission == null) {
    return null;
  }

  return (
    <BlockContainer
      borderTop={1}
      borderBtn={1}
      margin={1}
      borderAlphaLayer={0.2}
    >
      <DataLineElement colWidth={150}>
        <SmallText text={currentFireMission.name} bold={true} />
      </DataLineElement>

      <DataLineElement colWidth={200}>
        <SmallText
          text={Helpers.formatLocationGrid(
            currentFireMission?.GetFinalGridAfterCorrections()
          )}
        />
      </DataLineElement>

      <DataLineElement colWidth={200}>
        <SmallText text={formatMissionTimeString()} />
      </DataLineElement>

      <AppButton
        label="Edit"
        clickCallback={() => {
          nav.navigateToFireMissionEdit(props.fireMissionId);
        }}
      />
    </BlockContainer>
  );
}
