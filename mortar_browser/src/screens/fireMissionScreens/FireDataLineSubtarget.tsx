import React, { useState } from "react";
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

export default function FireDataLineSubtarget(props: {
  appFDC: AppFDC;
  fireMissionId: string;
  subTgFireDataLineNo: number;
  navigationManager: NavigationManager;
}) {
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == props.fireMissionId
  );
  var availableMortars = currentFireMission?.getAvailableMortars() ?? [];
  var currentSbTgFireDataLine =
    currentFireMission?.linearTarget?.fireDateLines[props.subTgFireDataLineNo];

  var sbTgFireLineOutput = currentSbTgFireDataLine?.CalcOutput();
  var searchAndTraverseOutput =
    currentSbTgFireDataLine?.calcSearchAndTraverse();
  var subtargetGrid = currentSbTgFireDataLine?.GetGrid() ?? {
    east: NaN,
    north: NaN,
  };
  var nav = props.navigationManager;

  const [mortarId, setMortarId] = useState(
    currentSbTgFireDataLine?.mortarId ?? ""
  );

  const [showSearchTraverse, setShowSearchTraverse] = useState(false);

  const [rerenderKey, setRerenderKey] = useState(Helpers.RandomId());

  function searchAndTraverseView() {
    if (!showSearchTraverse) {
      return (
        <AppButton
          label="Search and traverse"
          clickCallback={() => {
            setShowSearchTraverse(true);
          }}
        />
      );
    }

    return (
      <BlockContainer>
        <AppButton
          label="Close Search and traverse view"
          clickCallback={() => {
            setShowSearchTraverse(false);
          }}
        />

        <BlockContainer>
          <TextBlock
            text={
              "Direction range: " +
              Helpers.numericToMilString(
                searchAndTraverseOutput?.directionFirst
              ) +
              " - " +
              Helpers.numericToMilString(searchAndTraverseOutput?.directionLast)
            }
          />

          <TextBlock
            text={
              "Direction difference: " +
              Helpers.numericToMilString(searchAndTraverseOutput?.directionDif)
            }
          />

          <TextBlock
            text={
              currentFireMission?.linearTarget?.fireDateLines?.length +
              " target points and " +
              availableMortars.find((mrt) => mrt.id == mortarId)
                ?.directionMilPerRotation +
              " Mils per rotation"
            }
          />

          <TextBlock
            text={
              "Direction rotations: " +
              Helpers.numericToRoundedString(
                searchAndTraverseOutput?.traverseDirectionRotations
              )
            }
          />

          <LineBreak />

          <TextBlock
            text={
              "Elevation range: " +
              Helpers.numericToMilString(
                searchAndTraverseOutput?.elevationFirst
              ) +
              " - " +
              Helpers.numericToMilString(searchAndTraverseOutput?.elevationLast)
            }
          />

          <TextBlock
            text={
              "Elevation difference: " +
              Helpers.numericToMilString(searchAndTraverseOutput?.elevationDiff)
            }
          />

          <TextBlock
            text={
              currentFireMission?.linearTarget?.fireDateLines?.length +
              "target points and " +
              availableMortars.find((mrt) => mrt.id == mortarId)
                ?.elevationMilPerRotation +
              " Mils per rotation"
            }
          />

          <TextBlock
            text={
              "Elevation rotations: " +
              Helpers.numericToRoundedString(
                searchAndTraverseOutput?.searchElevationRotations
              )
            }
          />

          <LineBreak />

          <TextBlock text={searchAndTraverseOutput?.message} />
        </BlockContainer>
      </BlockContainer>
    );
  }

  function changeMortar(newMortarId: string) {
    if (currentSbTgFireDataLine) {
      currentSbTgFireDataLine.mortarId = newMortarId;
      sbTgFireLineOutput = currentSbTgFireDataLine.CalcOutput();
      searchAndTraverseOutput = currentSbTgFireDataLine.calcSearchAndTraverse();
      props.navigationManager.refreshComponents();
    }

    setMortarId(newMortarId);
  }

  if (currentFireMission == null || currentSbTgFireDataLine == null) {
    return null;
  }

  return (
    <BlockContainer
      borderTop={1}
      borderBtn={1}
      margin={1}
      borderAlphaLayer={0.2}
    >
      <SmallText
        text={currentSbTgFireDataLine?.subtargetNoLetter() + ")"}
        bold={true}
        margin={5}
      />

      <SelectPicker
        key={rerenderKey + "_sbTgMortarId"}
        startValue={mortarId}
        label="Mortar"
        selectOptions={availableMortars}
        changeCallback={(inputVal) => {
          changeMortar(inputVal);
          setRerenderKey(Helpers.RandomId());
        }}
      />

      <SmallText
        text={
          "Distance: " +
          Helpers.numericToRoundedString(sbTgFireLineOutput?.distanceMeters)
        }
        margin={5}
      />

      <SmallText
        text={
          "Direction: " +
          Helpers.numericToMilString(sbTgFireLineOutput?.directionMil)
        }
        margin={5}
      />

      <SmallText
        text={
          "Elevation: " +
          Helpers.numericToMilString(sbTgFireLineOutput?.elevationMil)
        }
        margin={5}
      />

      <SmallText
        text={
          "TimeOfFlight: " +
          Helpers.numericToRoundedString(
            sbTgFireLineOutput?.timeOfFlightSeconds
          )
        }
        margin={5}
      />

      <BlockContainer>{searchAndTraverseView()}</BlockContainer>
    </BlockContainer>
  );
}
