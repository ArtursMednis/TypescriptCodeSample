import React, { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { tCorrection } from "../../mortar_logic_src/interfaces";
import { Helpers } from "../../mortar_logic_src/Helpers";
import { NavigationManager } from "../../navigation/NavigationManager";
import { CoordTransformFunctions } from "../../mortar_logic_src/CoordTransformFunctions";
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

export default function FireDataLineCorrectionEdit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  var fireDataLineNo: number = props.navigationManager.selectedFireDataLineNo;
  var currentMissionId = props.navigationManager.selectedFireMission;
  var isIllum = nav.isIllum;

  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == currentMissionId
  );
  var currentFireDataLine = isIllum
    ? currentFireMission?.fireDateLinesIllum[fireDataLineNo]
    : currentFireMission?.fireDateLines[fireDataLineNo];

  function showWarning() {
    var showWarn =
      fireDataLineNo < currentFireMission!.fireDateLines!.length - 1;
    if (showWarn) {
      return (
        <TextBlock
          text="This line is not last line. If you change it, all next lines will be recalculated"
          bold={true}
        />
      );
    }
    return null;
  }

  const [rigtCorr, setRigtCorr] = useState(
    Helpers.valueIfPositive(currentFireDataLine?.correction?.right)
  );
  const [addCorr, setAddCorr] = useState(
    Helpers.valueIfPositive(currentFireDataLine?.correction?.add)
  );
  const [leftCorr, setLeftCorr] = useState(
    Helpers.valueIfPositive(-(currentFireDataLine?.correction?.right ?? 0))
  );
  const [dropCorr, setDropCorr] = useState(
    Helpers.valueIfPositive(-(currentFireDataLine?.correction?.add ?? 0))
  );

  const [upCorr, setUpCorr] = useState(
    Helpers.valueIfPositive(currentFireDataLine?.correction?.up)
  );
  const [downCorr, setDownCorr] = useState(
    Helpers.valueIfPositive(-(currentFireDataLine?.correction?.up ?? 0))
  );

  const [changedOtLineMil, setChangedOtLineMil] = useState(
    currentFireDataLine?.correction?.changedOtLineMil ?? NaN
  );

  const [rerenderKey, setRerenderKey] = useState(Helpers.RandomId());

  var prevOtLine = currentFireDataLine
    ? CoordTransformFunctions.rad2mil(
        currentFireDataLine.getPreviousOTLineRad()
      )
    : NaN;

  function showUpDownInputs() {
    if (!isIllum) {
      return null;
    }

    return (
      <BlockContainer>
        <NumericInput
          key={rerenderKey + "_fdlUpCorr"}
          startValue={upCorr}
          label="Up"
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setUpCorr(inputVal);
            setDownCorr(0);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fdlDownCorr"}
          startValue={downCorr}
          label="Down"
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setDownCorr(inputVal);
            setUpCorr(0);
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </BlockContainer>
    );
  }

  function saveCorrection() {
    var correction: tCorrection = {
      add: addCorr - dropCorr,
      right: rigtCorr - leftCorr,
    };

    if (!Number.isNaN(changedOtLineMil)) {
      correction.changedOtLineMil = changedOtLineMil;
    }

    if (isIllum) {
      correction.up = upCorr - downCorr;
    }

    if (currentFireDataLine) {
      currentFireDataLine.correction = correction;
    }
  }

  if (currentFireMission == null || currentFireDataLine == null) {
    return (
      <AppButton
        label="Back"
        clickCallback={() => {
          nav.navigateToFireMissionEdit(nav.selectedFireMission);
        }}
      />
    );
  }

  return (
    <BlockContainer inlineBlock={true}>
      <BlockContainer>
        <NumericInput
          key={rerenderKey + "_fdlLeftCorr"}
          startValue={leftCorr}
          label="Left"
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setLeftCorr(inputVal);
            setRigtCorr(0);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fdlRigtCorr"}
          startValue={rigtCorr}
          label="Right"
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setLeftCorr(0);
            setRigtCorr(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </BlockContainer>

      <BlockContainer>
        <NumericInput
          key={rerenderKey + "_fdlAddCorr"}
          startValue={addCorr}
          label="Add"
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setAddCorr(inputVal);
            setDropCorr(0);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fdlDropCorr"}
          startValue={dropCorr}
          label="Drop"
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setAddCorr(0);
            setDropCorr(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </BlockContainer>

      {showUpDownInputs()}

      <NumericInput
        key={rerenderKey + "_fdlRigtCorr"}
        startValue={changedOtLineMil}
        label="Change OT Line for this and next corrections"
        placeholder={Helpers.numericToRoundedString(prevOtLine)}
        acceptNaN={true}
        blurCallback={(inputVal) => {
          setChangedOtLineMil(inputVal);
          setRerenderKey(Helpers.RandomId());
        }}
      />

      <BlockContainer margin={20}>{showWarning()}</BlockContainer>

      <BlockContainer>
        <AppButton
          label="Back"
          clickCallback={() => {
            nav.navigateToFireMissionEdit(nav.selectedFireMission);
          }}
        />

        <AppButton
          label="Save"
          clickCallback={() => {
            saveCorrection();
            nav.navigateToFireMissionEdit(nav.selectedFireMission);
          }}
        />
      </BlockContainer>
    </BlockContainer>
  );
}
