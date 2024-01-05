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

export default function LinearTarget(props: {
  appFDC: AppFDC;
  currentFireMission: FireMission;
  navigationManager: NavigationManager;
}) {
  var currentLinTarget = props.currentFireMission.linearTarget;
  var subtargetFireDataLines = currentLinTarget?.fireDateLines ?? [];

  var searchTraverseMessage =
    currentLinTarget?.getSearchAndTraverseMessage() ?? "";

  var chargesForShell: MortarShellChargeData[] =
    props.appFDC.settings.mortarShellData.find(
      (shll) => shll.id == currentLinTarget?.shellId
    )?.mortarShellCharges ?? [];

  const [length, setLength] = useState(currentLinTarget?.Length ?? 0);
  const [attitude, setAttitude] = useState(currentLinTarget?.AttitudeMil ?? 0);
  const [subTargetCount, setSubTargetCount] = useState(
    currentLinTarget?.SubTargetCount ?? 1
  );

  const [chargeId, setChargeId] = useState(
    currentLinTarget?.shellChargeId ?? ""
  );
  const [shellId, setShellId] = useState(currentLinTarget?.shellId ?? "");
  const [rerenderKey, setRerenderKey] = useState(Helpers.RandomId());

  function changeShell(newShellId: string) {
    if (currentLinTarget) {
      currentLinTarget.shellId = newShellId;

      chargesForShell =
        props.appFDC.settings.mortarShellData.find(
          (shll) => shll.id == newShellId
        )?.mortarShellCharges ?? [];
      var firstChargeId = chargesForShell[0]?.id ?? "";

      currentLinTarget.shellChargeId = firstChargeId;

      setShellId(newShellId);
      setChargeId(firstChargeId);
      props.navigationManager.refreshComponents();
    }
  }

  function changeCharge(newChargeId: string) {
    if (currentLinTarget) {
      currentLinTarget.shellChargeId = newChargeId;
    }

    setChargeId(newChargeId);
    props.navigationManager.refreshComponents();
  }

  function createLinTarget() {
    currentLinTarget = props.currentFireMission.CreateLinearTarget();
    subtargetFireDataLines = currentLinTarget.fireDateLines;
    setChargeId(props.currentFireMission.GetChargeIdFromLastLine());
    props.navigationManager.refreshComponents();
  }

  function recalcSubtargetFireDataLines(
    attitude1: number,
    length1: number,
    subTargetCount1: number
  ) {
    currentLinTarget?.SetLinearTargetProperties({
      AttitudeMil: attitude1,
      Length: length1,
      SubTargetCount: subTargetCount1,
    });
    subtargetFireDataLines = currentLinTarget?.fireDateLines ?? [];

    props.navigationManager.refreshComponents();
  }

  function linTargetPropertiesInputs() {
    return (
      <BlockContainer>
        <NumericInput
          key={rerenderKey + "_linLen"}
          startValue={length}
          label="Length"
          blurCallback={(inputVal) => {
            setLength(inputVal);
            var optimalSubTgCount =
              currentLinTarget?.calcOptimalSubtargetCount(inputVal) ?? 1;
            setSubTargetCount(optimalSubTgCount);
            recalcSubtargetFireDataLines(attitude, inputVal, optimalSubTgCount);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_linAtt"}
          startValue={attitude}
          label="Attitude (mil)"
          blurCallback={(inputVal) => {
            setAttitude(inputVal);
            recalcSubtargetFireDataLines(inputVal, length, subTargetCount);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_linSbtgCount"}
          startValue={subTargetCount}
          label="Sub-target count"
          blurCallback={(inputVal) => {
            setSubTargetCount(inputVal);
            recalcSubtargetFireDataLines(attitude, length, inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <SelectPicker
          key={rerenderKey + "_shellId"}
          startValue={shellId}
          label="Shell"
          selectOptions={props.appFDC.settings.mortarShellData}
          changeCallback={(inputVal) => {
            changeShell(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <SelectPicker
          key={rerenderKey + "_chrgId"}
          startValue={chargeId}
          label="Charge"
          selectOptions={chargesForShell}
          changeCallback={(inputVal) => {
            changeCharge(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </BlockContainer>
    );
  }

  if (currentLinTarget == null) {
    return (
      <>
        <AppButton
          label="Create linear target"
          clickCallback={() => {
            createLinTarget();
          }}
        />
      </>
    );
  }

  return (
    <>
      <TextBlock text="Linear target" bold={true} />

      {linTargetPropertiesInputs()}

      <BlockContainer inlineBlock={true} margin={15}>
        {subtargetFireDataLines.map((subFDL, lineNo) => (
          <FireDataLineSubtarget
            appFDC={props.appFDC}
            fireMissionId={props.currentFireMission!.id}
            subTgFireDataLineNo={lineNo}
            navigationManager={props.navigationManager}
            key={Helpers.RandomId()}
          />
        ))}
      </BlockContainer>

      <TextBlock text={searchTraverseMessage} />

      <AppButton
        label="Invert direction"
        clickCallback={() => {
          if (currentLinTarget) {
            currentLinTarget.InvertedSearchTraverseMsg =
              !currentLinTarget.InvertedSearchTraverseMsg;
            props.navigationManager.refreshComponents();
          }
        }}
      />
    </>
  );
}
