import React, { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import FireDataLine from "./FireDataLine";
import { Helpers } from "../../mortar_logic_src/Helpers";
import { FireMission } from "../../mortar_logic_src/FireMission";
import { NavigationManager } from "../../navigation/NavigationManager";
import FireDataLineSubtarget from "./FireDataLineSubtarget";
import { MortarShellChargeData } from "../../mortar_logic_src/Settings/MortarShellChargeData";
import { TargetMethod } from "../../mortar_logic_src/interfaces";
import NumericInput from "../../EnvironmentDependentComponents/NumericInput";
import TextInput from "../../EnvironmentDependentComponents/TextInput";
import SelectPicker from "../../EnvironmentDependentComponents/SelectPicker";
import TextBlock from "../../EnvironmentDependentComponents/TextBlock";
import BlockContainer from "../../EnvironmentDependentComponents/BlockContainer";
import SmallText from "../../EnvironmentDependentComponents/SmallText";
import LineBreak from "../../EnvironmentDependentComponents/LineBreak";
import AppButton from "../../EnvironmentDependentComponents/AppButton";
import LinearTarget from "./LinearTarget";
import ScreenTitle from "../../EnvironmentDependentComponents/ScreenTitle";
import Card from "../../EnvironmentDependentComponents/Card";

export default function FireMissionEdit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == nav.selectedFireMission
  );
  var availableMortars = currentFireMission?.getAvailableMortars() ?? [];

  //sākuma pozīciju vajag kopēt no pēdējās FM sākuma pozīcijas, bet nosaukumam vajag counteri
  const [fireMissionName, setFireMissionName] = useState(
    currentFireMission?.name ?? ""
  );

  function saveFireMissionName() {
    if (currentFireMission) currentFireMission.name = fireMissionName;
  }

  function removeFireMission() {
    if (currentFireMission) {
      props.appFDC.removeFireMission(currentFireMission);
    }
  }

  function printAngleTMessage() {
    var mortarNamesWithAngleTEffect: string[] = [];

    if (availableMortars.length == 0) {
      return "";
    }

    availableMortars?.forEach((mrt) => {
      var angleTEff = currentFireMission?.IsAngleTInEffect(mrt.id);
      if (angleTEff) {
        mortarNamesWithAngleTEffect.push(mrt.name);
      }
    });

    if (mortarNamesWithAngleTEffect.length == 0) {
      return "Angle T not in effect";
    }

    if (mortarNamesWithAngleTEffect.length == availableMortars?.length) {
      return "Angle T in effect";
    }

    return (
      "Angle T in effect for particular mortars: " +
      mortarNamesWithAngleTEffect.join(", ")
    );
  }

  function printTargetLocationInfo() {
    if (currentFireMission?.targetMethod == TargetMethod.grid) {
      return (
        <>
          <SmallText
            text="Target location method: Grid"
            bold={true}
            margin={15}
          />
          <SmallText
            text={
              "Target Grid: " +
              Helpers.formatLocationGrid(
                currentFireMission?.targetInitialGridLocation
              )
            }
          />
          <SmallText
            text={
              "OT line: " +
              Helpers.numericToMilString(currentFireMission?.otLineMil)
            }
            margin={15}
          />
          <LineBreak />
        </>
      );
    }

    if (currentFireMission?.targetMethod == TargetMethod.polar) {
      return (
        <>
          <SmallText
            text="Target location method: Polar"
            bold={true}
            margin={15}
          />

          <SmallText
            text={
              "FO Grid: " +
              Helpers.formatLocationGrid(
                currentFireMission?.frontObserverGridLocation
              )
            }
            margin={15}
          />

          <SmallText
            text={
              "OT line: " +
              Helpers.numericToMilString(currentFireMission?.otLineMil)
            }
            margin={15}
          />

          <SmallText
            text={
              "Distance: " +
              Helpers.numericToRoundedString(currentFireMission?.polarDistance)
            }
            margin={15}
          />

          <LineBreak />
          <LineBreak />
          <SmallText
            text={
              "Calculated target Grid: " +
              Helpers.formatLocationGrid(
                currentFireMission?.targetInitialGridLocation
              )
            }
            margin={15}
          />
          <LineBreak />
        </>
      );
    }

    if (currentFireMission?.targetMethod == TargetMethod.shift) {
      var shiftFromTargetName =
        props.appFDC.fireMissions.find(
          (frm) => frm.id == currentFireMission?.shiftPrevTargetId
        )?.name ?? "";
      var shiftFromTargetNameFormated =
        shiftFromTargetName == "" ? "" : " (" + shiftFromTargetName + ")";

      return (
        <>
          <SmallText
            text="Target location method: Shift"
            bold={true}
            margin={15}
          />

          <SmallText
            text={
              "Shifted from " +
              shiftFromTargetNameFormated +
              ": " +
              Helpers.formatLocationGrid(
                currentFireMission?.shiftPrevTargetFinalGridLocation
              )
            }
            margin={15}
          />

          <SmallText
            text={
              "OT line: " +
              Helpers.numericToMilString(currentFireMission?.otLineMil)
            }
            margin={15}
          />
          <SmallText
            text={
              "Corrections: " +
              Helpers.displayCorrection(currentFireMission?.shiftCorrection)
            }
            margin={15}
          />

          <LineBreak />
          <LineBreak />

          <SmallText
            text={
              "Calculated target Grid: " +
              Helpers.formatLocationGrid(
                currentFireMission?.targetInitialGridLocation
              )
            }
            margin={15}
          />
          <LineBreak />
        </>
      );
    }

    return null;
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Fire Mission edit" />

      <AppButton
        label="Display map"
        clickCallback={() => {
          nav.displayMao();
        }}
      />

      <AppButton
        label="Display world map (require internet)"
        clickCallback={() => {
          nav.displayWorldMap();
        }}
      />

      <Card>
        <TextInput
          startValue={fireMissionName}
          label="Name"
          width={200}
          blurCallback={(inputVal) => {
            setFireMissionName(inputVal);
          }}
        />

        <AppButton
          label="Save name change"
          clickCallback={() => {
            saveFireMissionName();
          }}
        />

        <LineBreak />
        <LineBreak />

        <SmallText text="Fire mission start: " margin={5} bold={true} />
        <SmallText
          text={Helpers.formatDate(currentFireMission?.missionStartTime)}
          margin={5}
        />
        <SmallText
          text={currentFireMission?.missionStartTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          margin={5}
        />
        <SmallText
          text={
            "DTG: " +
            Helpers.formatDateToDTG(currentFireMission?.missionStartTime)
          }
          margin={5}
        />
      </Card>

      <Card>
        {printTargetLocationInfo()}

        <AppButton
          label="Change original target"
          clickCallback={() => {
            nav.navigateToFireMissionInit(nav.selectedFireMission);
          }}
        />
      </Card>

      <Card>
        <TextBlock text={printAngleTMessage()} bold={true} />
      </Card>

      <Card>
        <TextBlock text="Illum fire data lines" bold={true} />

        {currentFireMission?.fireDateLinesIllum.map((frdl, lineNo) => (
          <FireDataLine
            appFDC={props.appFDC}
            fireMissionId={currentFireMission!.id}
            fireDataLineNo={lineNo}
            navigationManager={props.navigationManager}
            key={lineNo}
            isIllum={true}
          />
        ))}

        <AppButton
          label="Add illum fire data line"
          clickCallback={() => {
            currentFireMission?.CreateNewFireDataLineForIllum();
            nav.refreshComponents();
          }}
        />

        <TextBlock
          text={
            "Calculated target Grid after applied Illum correction lines: " +
            Helpers.formatLocationGrid(
              currentFireMission?.GetFinalGridAfterIllumCorrections()
            )
          }
          margin={15}
        />
      </Card>

      <Card>
        <TextBlock text="HE fire data lines" bold={true} />

        {currentFireMission?.fireDateLines.map((frdl, lineNo) => (
          <FireDataLine
            appFDC={props.appFDC}
            fireMissionId={currentFireMission!.id}
            fireDataLineNo={lineNo}
            navigationManager={props.navigationManager}
            key={lineNo}
          />
        ))}

        <AppButton
          label="Add fire data line"
          clickCallback={() => {
            currentFireMission?.CreateNewFireDataLine();
            nav.refreshComponents();
          }}
        />

        <TextBlock
          text={
            "Calculated target Grid after applied correction lines: " +
            Helpers.formatLocationGrid(
              currentFireMission?.GetFinalGridAfterCorrections()
            )
          }
          margin={15}
        />
      </Card>

      <Card>
        <LinearTarget
          appFDC={props.appFDC}
          currentFireMission={currentFireMission ?? new FireMission()}
          navigationManager={nav}
        />
      </Card>

      <LineBreak />
      <LineBreak />
      <LineBreak />

      <AppButton
        label="Back"
        clickCallback={() => {
          nav.navigateToFireMissionList();
        }}
      />

      <LineBreak />
      <LineBreak />

      <AppButton
        label="Remove Fire Mission"
        clickCallback={() => {
          removeFireMission();
          nav.navigateToFireMissionList();
        }}
      />
    </BlockContainer>
  );
}
