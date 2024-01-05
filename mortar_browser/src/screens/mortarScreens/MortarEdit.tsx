import React, { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { NavigationManager } from "../../navigation/NavigationManager";
import { Helpers } from "../../mortar_logic_src/Helpers";
import { tLocationPointGrid } from "../../mortar_logic_src/interfaces";
import { lCannonIcon } from "../base64icons";
import { Mortar } from "../../mortar_logic_src/Mortar";
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

export default function MortarEdit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  var currentMortar = props.appFDC.mortars.find(
    (mrt) => mrt.id == props.navigationManager.selectedMortar
  );
  var initialDataMortarObj = nav.mapPickerMortar ?? currentMortar;

  //sākuma pozīciju vajag kopēt no pēdējās mortāra sākuma pozīcijas, bet nosaukumam vajag counteri
  const [mortarName, setMortarName] = useState(
    initialDataMortarObj?.name ?? ""
  );

  const [mortarTypeId, setMortarTypeId] = useState(
    initialDataMortarObj?.mortarTypeId ?? props.appFDC.settings.defaultMrtType
  );

  var mrtType = props.appFDC.settings.mortarTypes.find(
    (typ) => typ.id == mortarTypeId
  );

  const [mortarEast, setMortarEast] = useState(
    initialDataMortarObj?.mortarLocation.east ?? 0
  );
  const [mortarNorth, setMortarNorth] = useState(
    initialDataMortarObj?.mortarLocation.north ?? 0
  );
  const [gridZoneDesignator, setGridZoneDesignator] = useState(
    initialDataMortarObj?.mortarLocation.gridZoneId ?? ""
  );

  const [mortarLat, setMortarLat] = useState(
    initialDataMortarObj?.mortarLocation?.latitude ?? NaN
  );
  const [mortarLon, setMortarLon] = useState(
    initialDataMortarObj?.mortarLocation?.longitude ?? NaN
  );

  function setGridFromLatLon(
    latitudeStr: string | number,
    longitudeStr: string | number
  ) {
    var lat = Number(latitudeStr);
    var lon = Number(longitudeStr);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return;
    }

    var grid = Helpers.latLon2MGRS(lat, lon);

    if (Number.isNaN(grid.east) || Number.isNaN(grid.north)) {
      return;
    }
    setGridZoneDesignator(grid.gridZoneId ?? "");
    setMortarEast(grid.east);
    setMortarNorth(grid.north);
  }

  const [directionMilPerRotation, setDirectionMilPerRotation] = useState(
    initialDataMortarObj?.getDirectionMilPerRotation() ??
      mrtType?.directionMilPerRotation ??
      0
  );
  const [elevationMilPerRotation, setElevationMilPerRotation] = useState(
    initialDataMortarObj?.getElevationMilPerRotation() ??
      mrtType?.elevationMilPerRotation ??
      0
  );

  const [leftSafetyArc, setLeftSafetyArc] = useState(
    initialDataMortarObj?.leftSafetyArc ?? NaN
  );
  const [rightSafetyArc, setRightSafetyArc] = useState(
    initialDataMortarObj?.rightSafetyArc ?? NaN
  );

  const [rerenderKey, setRerenderKey] = useState(Helpers.RandomId());

  function saveMortar() {
    if (currentMortar == null) {
      currentMortar = props.appFDC.CreateMortar();
    }

    var mortarLocation: tLocationPointGrid = {
      east: mortarEast,
      north: mortarNorth,
      gridZoneId: gridZoneDesignator ?? undefined,
      latitude: Number(mortarLat) ?? undefined,
      longitude: Number(mortarLon) ?? undefined,
    };

    currentMortar.name = mortarName;
    currentMortar.mortarLocation = mortarLocation;
    currentMortar.directionMilPerRotation = directionMilPerRotation;
    currentMortar.elevationMilPerRotation = elevationMilPerRotation;
    currentMortar.mortarTypeId = mortarTypeId;
    currentMortar.leftSafetyArc = leftSafetyArc;
    currentMortar.rightSafetyArc = rightSafetyArc;

    nav.mapPickerMortar = null;
  }

  function saveTempMortarForMapPicker() {
    if (nav.mapPickerMortar == null) {
      nav.mapPickerMortar = new Mortar();
    }

    var mortarLocation: tLocationPointGrid = {
      east: mortarEast,
      north: mortarNorth,
      gridZoneId: gridZoneDesignator ?? undefined,
      latitude: Number(mortarLat) ?? undefined,
      longitude: Number(mortarLon) ?? undefined,
    };

    nav.mapPickerMortar.name = mortarName;
    nav.mapPickerMortar.mortarLocation = mortarLocation;
    nav.mapPickerMortar.directionMilPerRotation = directionMilPerRotation;
    nav.mapPickerMortar.elevationMilPerRotation = elevationMilPerRotation;
    nav.mapPickerMortar.mortarTypeId = mortarTypeId;
    nav.mapPickerMortar.leftSafetyArc = leftSafetyArc;
    nav.mapPickerMortar.rightSafetyArc = rightSafetyArc;
  }

  function removeMortar() {
    if (currentMortar) {
      props.appFDC.removeMortar(currentMortar);
    }
  }

  function updateSearhTraverseConstatns(mrtTypeId: string) {
    var selectedType = props.appFDC.settings.mortarTypes.find(
      (typ) => typ.id == mrtTypeId
    );

    setDirectionMilPerRotation(selectedType?.directionMilPerRotation ?? 0);
    setElevationMilPerRotation(selectedType?.elevationMilPerRotation ?? 0);
    setRerenderKey(Helpers.RandomId());
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Mortar edit" />

      <Card>
        <TextInput
          startValue={mortarName}
          label="Name"
          blurCallback={(inputVal) => {
            setMortarName(inputVal);
          }}
        />

        <SelectPicker
          startValue={mortarTypeId}
          label="Mortar type"
          selectOptions={props.appFDC.settings.mortarTypes}
          changeCallback={(inputVal) => {
            setMortarTypeId(inputVal);
            updateSearhTraverseConstatns(inputVal);
          }}
        />
      </Card>

      <Card>
        <TextInput
          key={rerenderKey + "_gridZone"}
          startValue={gridZoneDesignator}
          label="Grid zone designator with square Id"
          blurCallback={(inputVal) => {
            setGridZoneDesignator(inputVal);
            setMortarLat(NaN);
            setMortarLon(NaN);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />

        <NumericInput
          key={rerenderKey + "_east"}
          startValue={mortarEast}
          label="East"
          expectedDigitsCount={5}
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setMortarEast(inputVal);
            setMortarLat(NaN);
            setMortarLon(NaN);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_north"}
          startValue={mortarNorth}
          label="North"
          expectedDigitsCount={5}
          blurCallback={(inputVal) => {
            setMortarNorth(inputVal);
            setMortarLat(NaN);
            setMortarLon(NaN);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />

        <SmallText text="* Expected 5 digits for MGRS" italic={true} />
        <LineBreak />
        <LineBreak />

        <AppButton
          label="Pick Mortar on map (using internet)"
          clickCallback={() => {
            saveTempMortarForMapPicker();
            nav.openMapPicker();
          }}
        />
      </Card>

      <Card>
        <TextBlock text="Safety arches" bold={true} />

        <TextBlock text="Set left safety arche for first and right safety arche for last mortar only" />

        <NumericInput
          startValue={leftSafetyArc}
          label="Left Safety Arch"
          acceptNaN={true}
          blurCallback={(inputVal) => {
            setLeftSafetyArc(inputVal);
          }}
        />

        <NumericInput
          startValue={rightSafetyArc}
          label="Right Safety Arch"
          acceptNaN={true}
          blurCallback={(inputVal) => {
            setRightSafetyArc(inputVal);
          }}
        />
      </Card>

      <BlockContainer padding={5} margin={5} inlineBlock={true}>
        <AppButton
          label="Back"
          clickCallback={() => {
            nav.navigateToMortarList();
          }}
        />

        <AppButton
          label="Remove"
          clickCallback={() => {
            removeMortar();
            nav.navigateToMortarList();
          }}
        />

        <AppButton
          label="Save"
          clickCallback={() => {
            saveMortar();
            nav.navigateToMortarList();
          }}
        />
      </BlockContainer>

      <LineBreak />
      <LineBreak />
      <LineBreak />
      <LineBreak />
      <LineBreak />
      <LineBreak />

      <BlockContainer padding={30} border={1} inlineBlock={true}>
        <NumericInput
          key={rerenderKey + "_lat"}
          startValue={Number(mortarLat)}
          label="Lat"
          acceptNaN={true}
          blurCallback={(inputVal) => {
            setMortarLat(inputVal);
            setGridFromLatLon(inputVal.toString(), mortarLon);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_lon"}
          startValue={Number(mortarLon)}
          label="Lon"
          acceptNaN={true}
          blurCallback={(inputVal) => {
            setMortarLon(inputVal);
            setGridFromLatLon(mortarLat, inputVal.toString());
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </BlockContainer>
    </BlockContainer>
  );
}
