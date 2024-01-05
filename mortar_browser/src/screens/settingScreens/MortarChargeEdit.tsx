import React, { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import {
  ChargeLookupTableLine,
  MortarShellChargeData,
} from "../../mortar_logic_src/Settings/MortarShellChargeData";
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
import TextInput from "../../EnvironmentDependentComponents/TextInput";
import TextAreaInput from "../../EnvironmentDependentComponents/TextAreaInput";
import NumericInput from "../../EnvironmentDependentComponents/NumericInput";

export default function MortarChargeEdit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  var currentShell = props.appFDC.settings.mortarShellData.find(
    (shll) => shll.id == nav.selectedMortarShell
  );

  var currentChargeId = props.navigationManager.selectedMortarShellCharge;
  var currentCharge = currentShell?.mortarShellCharges.find(
    (chrg) => chrg.id == currentChargeId
  );

  var chargeTableLinesWorkingCopy: ChargeLookupTableLine[] = JSON.parse(
    JSON.stringify(currentCharge?.chargeLookupTableLines?.slice() ?? [])
  );

  appendEmptyChargeLookupLinesForEditing(chargeTableLinesWorkingCopy, 2);

  const [chargeName, setChargeName] = useState(currentCharge?.name ?? "");
  const [chargeTableLines, setChargeTableLines] = useState(
    chargeTableLinesWorkingCopy
  );

  function sortChargeLinesByDistanceSortZeroAtEnd(
    lineA: ChargeLookupTableLine,
    lineB: ChargeLookupTableLine
  ) {
    const valueA = lineA.distance;
    const valueB = lineB.distance;

    if (valueA === 0 && valueB !== 0) return 1;
    if (valueB === 0 && valueA !== 0) return -1;

    return valueA - valueB;
  }

  function saveCharge() {
    if (currentShell == null) {
      return;
    }

    if (currentCharge == null) {
      currentCharge = new MortarShellChargeData();
      currentShell.mortarShellCharges.push(currentCharge);
    }

    currentCharge.name = chargeName;

    currentCharge.chargeLookupTableLines = chargeTableLines.filter(
      (chrgLine) => chrgLine.distance || chrgLine.elevation
    );
  }

  function removeCharge() {
    //šo dzēšanu jāpārceļ uz currentShell objektu

    if (currentCharge && currentShell) {
      const index = currentShell.mortarShellCharges.indexOf(currentCharge);
      if (index > -1) {
        currentShell.mortarShellCharges.splice(index, 1);
      }
    }
  }

  function appendEmptyChargeLookupLinesForEditing(
    chargeLookupArr: ChargeLookupTableLine[],
    count: number
  ) {
    if (chargeLookupArr == null) {
      return;
    }

    for (var k = 0; k < count; k++) {
      var newLine = new ChargeLookupTableLine();
      newLine.distance = NaN;
      newLine.elevation = NaN;
      chargeLookupArr.push(newLine);
    }
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle
        text={"Charge edit for shell " + currentShell?.name ?? "-"}
      />

      <TextInput
        label="Name"
        startValue={chargeName}
        blurCallback={(inputVal) => {
          setChargeName(inputVal);
        }}
      />

      <LineBreak />
      <LineBreak />

      <BlockContainer>
        <DataLineElement colWidth={90} margin={4}>
          <SmallText text="distance" bold={true} fontSizeEm={0.875} />
        </DataLineElement>

        <DataLineElement colWidth={90} margin={4}>
          <SmallText text="elevation" bold={true} fontSizeEm={0.875} />
        </DataLineElement>

        <DataLineElement colWidth={90} margin={4}>
          <SmallText
            text="timeOfFlight/ fuzeSetting"
            bold={true}
            fontSizeEm={0.875}
          />
        </DataLineElement>

        <DataLineElement colWidth={90} margin={4}>
          <SmallText text="endVelocity" bold={true} fontSizeEm={0.875} />
        </DataLineElement>
      </BlockContainer>

      {chargeTableLines.map((chrgLine, lineNo) => {
        return (
          <ChargeTableLineComponent
            key={lineNo.toString() + chrgLine.distance?.toString()}
            chargeLookupTableLine={chrgLine}
            blurCallback={(changedChgLine) => {
              var copiedData = chargeTableLines.slice();

              copiedData[lineNo] = changedChgLine;

              copiedData.sort(sortChargeLinesByDistanceSortZeroAtEnd);

              var lastLine = copiedData[copiedData.length - 1];

              if (lastLine.distance || lastLine.elevation) {
                appendEmptyChargeLookupLinesForEditing(copiedData, 3);
              }

              setChargeTableLines(copiedData);
            }}
          />
        );
      })}

      <LineBreak />

      <AppButton
        label="Back"
        clickCallback={() => {
          nav.navigateToSettingsShellEdit(currentShell?.id ?? "");
        }}
      />

      <AppButton
        label="Remove Charge"
        clickCallback={() => {
          removeCharge();
          nav.navigateToSettingsShellEdit(currentShell?.id ?? "");
        }}
      />

      <AppButton
        label="Save"
        clickCallback={() => {
          saveCharge();
          nav.navigateToSettingsShellEdit(currentShell?.id ?? "");
        }}
      />
    </BlockContainer>
  );
}

function ChargeTableLineComponent(props: {
  chargeLookupTableLine: ChargeLookupTableLine;
  blurCallback?: (chargeLookupTableLine: ChargeLookupTableLine) => void;
}) {
  const [distance, setDistance] = useState(
    props?.chargeLookupTableLine?.distance ?? NaN
  );
  const [elevation, setElevation] = useState(
    props?.chargeLookupTableLine?.elevation ?? NaN
  );
  const [timeOfFlight, setTimeOfFlight] = useState(
    props?.chargeLookupTableLine?.timeOfFlightSeconds ?? NaN
  );
  const [endVelocity, setEndVelocity] = useState(
    props?.chargeLookupTableLine?.endVelocity ?? NaN
  );

  return (
    <BlockContainer
      borderTop={1}
      borderBtn={1}
      margin={1}
      borderAlphaLayer={0.2}
    >
      <DataLineElement colWidth={90} margin={0}>
        <NumericInput
          startValue={distance}
          acceptNaN={true}
          margin={0}
          blurCallback={(value) => {
            setDistance(value);
            if (props?.blurCallback) {
              props.blurCallback({
                distance: value,
                elevation: elevation,
                timeOfFlightSeconds: timeOfFlight,
                endVelocity: endVelocity,
              });
            }
          }}
        />
      </DataLineElement>

      <DataLineElement colWidth={90} margin={0}>
        <NumericInput
          startValue={elevation}
          acceptNaN={true}
          margin={0}
          blurCallback={(value) => {
            setElevation(value);
            if (props?.blurCallback) {
              props.blurCallback({
                distance: distance,
                elevation: value,
                timeOfFlightSeconds: timeOfFlight,
                endVelocity: endVelocity,
              });
            }
          }}
        />
      </DataLineElement>

      <DataLineElement colWidth={90} margin={0}>
        <NumericInput
          startValue={timeOfFlight}
          acceptNaN={true}
          margin={0}
          blurCallback={(value) => {
            setTimeOfFlight(value);
            if (props?.blurCallback) {
              props.blurCallback({
                distance: distance,
                elevation: elevation,
                timeOfFlightSeconds: value,
                endVelocity: endVelocity,
              });
            }
          }}
        />
      </DataLineElement>

      <DataLineElement colWidth={90} margin={0}>
        <NumericInput
          startValue={endVelocity}
          acceptNaN={true}
          margin={0}
          blurCallback={(value) => {
            setEndVelocity(value);
            if (props?.blurCallback) {
              props.blurCallback({
                distance: distance,
                elevation: elevation,
                timeOfFlightSeconds: timeOfFlight,
                endVelocity: value,
              });
            }
          }}
        />
      </DataLineElement>
    </BlockContainer>
  );
}
