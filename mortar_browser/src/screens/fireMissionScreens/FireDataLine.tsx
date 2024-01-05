import React, { useEffect, useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { tCorrection } from "../../mortar_logic_src/interfaces";
import { NavigationManager } from "../../navigation/NavigationManager";
import { Helpers } from "../../mortar_logic_src/Helpers";
import { MortarShellChargeData } from "../../mortar_logic_src/Settings/MortarShellChargeData";
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
import DataLineElement from "../../EnvironmentDependentComponents/DataLineElement";

export default function FireDataLine(props: {
  appFDC: AppFDC;
  fireMissionId: string;
  fireDataLineNo: number;
  navigationManager: NavigationManager;
  isIllum?: boolean;
}) {
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == props.fireMissionId
  );
  var availableMortars = currentFireMission?.getAvailableMortars() ?? [];
  var currentFireDataLine = props.isIllum
    ? currentFireMission?.fireDateLinesIllum[props.fireDataLineNo]
    : currentFireMission?.fireDateLines[props.fireDataLineNo];

  var chargesForShell: MortarShellChargeData[] =
    props.appFDC.settings.mortarShellData.find(
      (shll) => shll.id == currentFireDataLine?.shellId
    )?.mortarShellCharges ?? [];

  var fireLineOutput = currentFireDataLine?.CalcOutput();
  var nav = props.navigationManager;
  const [rerenderKey, setRerenderKey] = useState(Helpers.RandomId());

  function changeMortar(newMortarId: string) {
    if (currentFireDataLine) {
      currentFireDataLine.mortarId = newMortarId;
      fireLineOutput = currentFireDataLine.CalcOutput();
    }

    setMortarId(newMortarId);
  }

  function changeShell(newShellId: string) {
    if (currentFireDataLine) {
      currentFireDataLine.shellId = newShellId;

      chargesForShell =
        currentFireDataLine.fireMission.appFDC.settings.mortarShellData.find(
          (shll) => shll.id == newShellId
        )?.mortarShellCharges ?? [];
      var firstChargeId = chargesForShell[0]?.id ?? "";

      currentFireDataLine.shellChargeId = firstChargeId;

      fireLineOutput = currentFireDataLine.CalcOutput();

      setShellId(newShellId);
      setChargeId(firstChargeId);
    }
  }

  function changeCharge(newChargeId: string) {
    if (currentFireDataLine) {
      currentFireDataLine.shellChargeId = newChargeId;
      fireLineOutput = currentFireDataLine.CalcOutput();
    }

    setChargeId(newChargeId);
  }

  function removeFireDataLine() {
    if (currentFireMission) {
      props.isIllum
        ? currentFireMission.removeFireDataLineIllum(props.fireDataLineNo)
        : currentFireMission.removeFireDataLine(props.fireDataLineNo);
    }
  }

  function outsideSecurityArchesWarning() {
    if (fireLineOutput?.outsideSafetyArcs) {
      return (
        <>
          <SmallText bold={true} color="red" text="Outside safety arches !" />
          {/* <strong style={{ color: "red" }}>Outside safety arches !</strong>
          <span> | </span> */}
        </>
      );
    } else {
      return null;
    }
  }

  const [mortarId, setMortarId] = useState(currentFireDataLine?.mortarId ?? "");
  const [chargeId, setChargeId] = useState(
    currentFireDataLine?.shellChargeId ?? ""
  );
  const [shellId, setShellId] = useState(currentFireDataLine?.shellId ?? "");

  if (currentFireMission == null || currentFireDataLine == null) {
    return null;
  }

  return (
    <BlockContainer
      borderTop={1}
      borderBtn={1}
      margin={1}
      borderAlphaLayer={0.2}
    >
      <SelectPicker
        startValue={currentFireDataLine?.mortarId ?? ""}
        label="Mortar"
        selectOptions={availableMortars}
        changeCallback={(inputVal) => {
          changeMortar(inputVal);
        }}
      />

      <DataLineElement>
        <SmallText
          text={
            "Correction: " +
            Helpers.displayCorrection(currentFireDataLine.correction)
          }
        />

        <AppButton
          label="Edit correction"
          clickCallback={() => {
            nav.navigateToFDLCorrectionEdit(
              props.fireMissionId,
              props.fireDataLineNo,
              props.isIllum ?? false
            );
          }}
        />
      </DataLineElement>

      <DataLineElement>
        {"Distance: " +
          Helpers.numericToRoundedString(fireLineOutput?.distanceMeters)}
      </DataLineElement>

      <DataLineElement>
        {"Direction: " +
          Helpers.numericToMilString(fireLineOutput?.directionMil)}
      </DataLineElement>

      <DataLineElement>
        <SelectPicker
          startValue={shellId}
          label="Shell&Charge"
          margin={0}
          selectOptions={props.appFDC.settings.mortarShellData}
          changeCallback={(inputVal) => {
            changeShell(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <SelectPicker
          key={rerenderKey + "_lineChrgId"}
          startValue={chargeId}
          label=""
          margin={0}
          selectOptions={chargesForShell}
          changeCallback={(inputVal) => {
            changeCharge(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </DataLineElement>

      <DataLineElement>
        {"Elevation: " +
          Helpers.numericToMilString(fireLineOutput?.elevationMil)}
      </DataLineElement>

      <DataLineElement>
        {props.isIllum ? "Fuzze-setting" : "Time-Of-Flight"}:
        {Helpers.numericTo1DecimalString(
          (props.isIllum
            ? fireLineOutput?.fuzeSetting
            : fireLineOutput?.timeOfFlightSeconds) ?? NaN
        )}
      </DataLineElement>

      <DataLineElement>{outsideSecurityArchesWarning()}</DataLineElement>

      <DataLineElement>
        <FireTimer
          appFDC={props.appFDC}
          fireMissionId={props.fireMissionId}
          fireDataLineNo={props.fireDataLineNo}
          mortarId={mortarId}
          chargeId={chargeId}
          isIllum={props.isIllum}
        />
      </DataLineElement>

      <DataLineElement>
        <AppButton
          label="Remove line"
          clickCallback={() => {
            removeFireDataLine();
            nav.refreshComponents();
          }}
        />
      </DataLineElement>
    </BlockContainer>
  );
}

function FireTimer(props: {
  appFDC: AppFDC;
  fireMissionId: string;
  fireDataLineNo: number;
  mortarId: string;
  chargeId: string;
  isIllum?: boolean;
}) {
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == props.fireMissionId
  );

  var currentFireDataLine = props.isIllum
    ? currentFireMission?.fireDateLinesIllum[props.fireDataLineNo]
    : currentFireMission?.fireDateLines[props.fireDataLineNo];

  var fireLineOutput = currentFireDataLine?.CalcOutput();

  const [firingTime, setFiringTime] = useState<Date | null>(
    currentFireDataLine?.firingTime ?? null
  );
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [toggleColor, setToggleColor] = useState(false);

  function fire() {
    if (currentFireDataLine == null) {
      return;
    }

    setIsTimerActive(true);
    setRemainingSeconds(fireLineOutput?.timeOfFlightSeconds ?? 0);
    currentFireDataLine.firingTime = new Date();
    setFiringTime(currentFireDataLine.firingTime);
  }

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    if (isTimerActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        if (remainingSeconds < 11) {
          setToggleColor(!toggleColor);
        }

        setRemainingSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, remainingSeconds, props.mortarId, props.chargeId]);

  if (currentFireMission == null || currentFireDataLine == null) {
    return null;
  }

  if (isTimerActive) {
    return (
      <SmallText
        text={
          "Remaining time of flight: " +
          Helpers.numericToRoundedString(remainingSeconds)
        }
        bold={true}
        color={toggleColor ? "red" : "black"}
      />
    );
  }

  if (firingTime) {
    return (
      <SmallText
        text={
          "Firing time: " +
          firingTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        }
      />
    );
  }

  return (
    <AppButton
      label="FIRE !"
      clickCallback={() => {
        fire();
      }}
    />
  );
}
