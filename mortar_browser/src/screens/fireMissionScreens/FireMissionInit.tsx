import React, { useState } from "react";
import { AppFDC } from "../../mortar_logic_src/AppFDC";
import { TargetMethod, tCorrection, tLocationPointGrid} from "../../mortar_logic_src/interfaces";
import { Helpers } from "../../mortar_logic_src/Helpers";
import { NavigationManager } from "../../navigation/NavigationManager";
import { lBinocularIcon, lFlagIcon, lTargetIcon } from "../base64icons";
import { FireMission } from "../../mortar_logic_src/FireMission";
import NumericInput from "../../EnvironmentDependentComponents/NumericInput";
import TextInput from "../../EnvironmentDependentComponents/TextInput";
import SelectPicker from "../../EnvironmentDependentComponents/SelectPicker";
import TextBlock from "../../EnvironmentDependentComponents/TextBlock";
import BlockContainer from "../../EnvironmentDependentComponents/BlockContainer";
import SmallText from "../../EnvironmentDependentComponents/SmallText";
import LineBreak from "../../EnvironmentDependentComponents/LineBreak";
import AppButton from "../../EnvironmentDependentComponents/AppButton";
import RadioInput from "../../EnvironmentDependentComponents/RadioInput";
import ScreenTitle from "../../EnvironmentDependentComponents/ScreenTitle";
import Card from "../../EnvironmentDependentComponents/Card";

export default function FireMissionInit(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == nav.selectedFireMission
  );
  var initialDataFireMissionObj =
    nav.mapPickerFireMission ?? currentFireMission;

  const [targetMethod, setTargetMethod] = useState(
    initialDataFireMissionObj?.targetMethod ?? TargetMethod.grid
  );

  const [fireMissionName, setFireMissionName] = useState(
    initialDataFireMissionObj?.name ?? ""
  );

  const [fireMissionGridEast, setFireMissionGridEast] = useState(
    initialDataFireMissionObj?.targetInitialGridLocation.east ?? 0
  );
  const [fireMissionGridNorth, setFireMissionGridNorth] = useState(
    initialDataFireMissionObj?.targetInitialGridLocation.north ?? 0
  );

  const [gridZoneDesignatorGrid, setGridZoneDesignatorGrid] = useState(
    initialDataFireMissionObj?.targetInitialGridLocation.gridZoneId ?? ""
  );
  const [gridZoneDesignatorPolar, setGridZoneDesignatorPolar] = useState(
    initialDataFireMissionObj?.frontObserverGridLocation?.gridZoneId ?? ""
  );
  const [gridZoneDesignatorShift, setGridZoneDesignatorShift] = useState(
    initialDataFireMissionObj?.shiftPrevTargetFinalGridLocation?.gridZoneId ??
      ""
  );

  const [frontObserverEast, setFrontObserverEast] = useState(
    initialDataFireMissionObj?.frontObserverGridLocation?.east ?? 0
  );
  const [frontObserverNorth, setFrontObserverNorth] = useState(
    initialDataFireMissionObj?.frontObserverGridLocation?.north ?? 0
  );
  const [polarDistance, setPolarDistance] = useState(
    initialDataFireMissionObj?.polarDistance ?? 0
  );

  const [otLineMil, setOtLineMil] = useState(
    initialDataFireMissionObj?.otLineMil ?? 0
  );

  const [rigtCorr, setRigtCorr] = useState(
    Helpers.valueIfPositive(initialDataFireMissionObj?.shiftCorrection?.right)
  );
  const [addCorr, setAddCorr] = useState(
    Helpers.valueIfPositive(initialDataFireMissionObj?.shiftCorrection?.add)
  );
  const [leftCorr, setLeftCorr] = useState(
    Helpers.valueIfPositive(
      -(initialDataFireMissionObj?.shiftCorrection?.right ?? 0)
    )
  );
  const [dropCorr, setDropCorr] = useState(
    Helpers.valueIfPositive(
      -(initialDataFireMissionObj?.shiftCorrection?.add ?? 0)
    )
  );
  const [shiftPrevTargetId, setShiftPrevTargetId] = useState(
    initialDataFireMissionObj?.shiftPrevTargetId ?? ""
  );

  const [shiftFromGridEast, setShiftFromGridEast] = useState(
    initialDataFireMissionObj?.shiftPrevTargetFinalGridLocation?.east ?? 0
  );
  const [shiftFromGridNorth, setShiftFromGridNorth] = useState(
    initialDataFireMissionObj?.shiftPrevTargetFinalGridLocation?.north ?? 0
  );

  // Jāpārskata, kods: iespējams, ka šo un frmLat, frmLon nemaz nelieto vairs
  var locationForMap: tLocationPointGrid | undefined =
    initialDataFireMissionObj?.targetInitialGridLocation;

  if (targetMethod == TargetMethod.polar) {
    locationForMap =
      initialDataFireMissionObj?.frontObserverGridLocation ?? undefined;
  } else if (targetMethod == TargetMethod.shift) {
    locationForMap =
      initialDataFireMissionObj?.shiftPrevTargetFinalGridLocation ?? undefined;
  }

  const [frmLat, setFrmLat] = useState(
    locationForMap?.latitude?.toString() ?? ""
  );
  const [frmLon, setFrmLon] = useState(
    locationForMap?.longitude?.toString() ?? ""
  );

  function getMapIconForTargetMethod(targetMethod: TargetMethod | undefined) {
    if (targetMethod == TargetMethod.polar) {
      return lBinocularIcon;
    }

    if (targetMethod == TargetMethod.shift) {
      return lFlagIcon;
    }

    return lTargetIcon;
  }

  const [mapIcon, setMapIcon] = useState(
    getMapIconForTargetMethod(initialDataFireMissionObj?.targetMethod)
  );

  const [rerenderKey, setRerenderKey] = useState(Helpers.RandomId());

  function setGridFromLatLon(latitudeStr: string, longitudeStr: string) {
    var lat = Number(latitudeStr);
    var lon = Number(longitudeStr);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return;
    }

    var grid = Helpers.latLon2MGRS(lat, lon);

    if (Number.isNaN(grid.east) || Number.isNaN(grid.north)) {
      return;
    }

    if (targetMethod == "grid") {
      setFireMissionGridEast(grid.east);
      setFireMissionGridNorth(grid.north);
      setGridZoneDesignatorGrid(grid.gridZoneId ?? "");
    }

    if (targetMethod == "polar") {
      setFrontObserverEast(grid.east);
      setFrontObserverNorth(grid.north);
      setGridZoneDesignatorPolar(grid.gridZoneId ?? "");
    }

    if (targetMethod == "shift" && shiftPrevTargetId == "") {
      setShiftFromGridEast(grid.east);
      setShiftFromGridNorth(grid.north);
      setGridZoneDesignatorShift(grid.gridZoneId ?? "");
    }
  }

  function updateShiftFrom(targetId: string) {
    var prevTarget = props.appFDC.fireMissions.find(
      (frm) => frm.id == targetId
    );
    var shiftFromLocation = prevTarget?.GetFinalGridAfterCorrections() ?? {
      east: 0,
      north: 0,
    };

    setShiftFromGridEast(shiftFromLocation.east);
    setShiftFromGridNorth(shiftFromLocation.north);
    setGridZoneDesignatorShift(shiftFromLocation.gridZoneId ?? "");
  }

  function gridInputForm() {
    return (
      <>
        <TextBlock text="Method: GRID" bold={true} />

        <TextInput
          key={rerenderKey + "_zoneIdGrid"}
          startValue={gridZoneDesignatorGrid}
          label="Grid zone designator with square Id"
          blurCallback={(inputVal) => {
            setGridZoneDesignatorGrid(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fireMissionGridEast"}
          startValue={fireMissionGridEast}
          label="East"
          expectedDigitsCount={5}
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setFireMissionGridEast(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fireMissionGridNorth"}
          startValue={fireMissionGridNorth}
          label="North"
          expectedDigitsCount={5}
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setFireMissionGridNorth(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />
        <SmallText text="* Expected 5 digits for MGRS" italic={true} />

        <LineBreak />
        <LineBreak />

        <AppButton
          label="Pick target on map (using internet)"
          clickCallback={() => {
            saveTempFireMissionForMapPicker();
            nav.openMapPicker();
          }}
        />
      </>
    );
  }

  function polarInputForm() {
    return (
      <>
        <TextBlock text="Method: POLAR" bold={true} />

        <TextInput
          key={rerenderKey + "_zoneIdPolar"}
          startValue={gridZoneDesignatorPolar}
          label="Grid zone designator with square Id"
          blurCallback={(inputVal) => {
            setGridZoneDesignatorPolar(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fireMissionPolarEast"}
          startValue={frontObserverEast}
          label="FO East"
          expectedDigitsCount={5}
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setFrontObserverEast(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fireMissionPolarNorth"}
          startValue={frontObserverNorth}
          label="FO North"
          expectedDigitsCount={5}
          acceptNaN={false}
          blurCallback={(inputVal) => {
            setFrontObserverNorth(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />
        <SmallText text="* Expected 5 digits for MGRS" italic={true} />

        <LineBreak />
        <LineBreak />

        <AppButton
          label="Pick FO on map (using internet)"
          clickCallback={() => {
            saveTempFireMissionForMapPicker();
            nav.openMapPicker();
          }}
        />

        <LineBreak />
        <LineBreak />

        <NumericInput
          startValue={polarDistance}
          label="Distance"
          blurCallback={(inputVal) => {
            setPolarDistance(inputVal);
          }}
        />
      </>
    );
  }

  function shiftInputForm() {
    return (
      <>
        <TextBlock text="Method: SHIFT" bold={true} />

        <SelectPicker
          startValue={initialDataFireMissionObj?.shiftPrevTargetId ?? ""}
          label="Shift from target"
          nullValueText="-- new location --"
          selectOptions={props.appFDC.fireMissions.filter(
            (frm) => frm.id != initialDataFireMissionObj?.id
          )}
          changeCallback={(inputVal) => {
            setShiftPrevTargetId(inputVal);
            updateShiftFrom(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />

        <TextInput
          key={rerenderKey + "_zoneIdShift"}
          startValue={gridZoneDesignatorShift}
          label="Grid zone designator with square Id"
          disabled={shiftPrevTargetId != ""}
          blurCallback={(inputVal) => {
            setGridZoneDesignatorShift(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fireMissionShiftEast"}
          startValue={shiftFromGridEast}
          label="East"
          expectedDigitsCount={5}
          acceptNaN={false}
          disabled={shiftPrevTargetId != ""}
          blurCallback={(inputVal) => {
            setShiftFromGridEast(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_fireMissionShiftNorth"}
          startValue={shiftFromGridNorth}
          label="North"
          expectedDigitsCount={5}
          acceptNaN={false}
          disabled={shiftPrevTargetId != ""}
          blurCallback={(inputVal) => {
            setShiftFromGridNorth(inputVal);
            setFrmLat("");
            setFrmLon("");
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />
        <SmallText text="* Expected 5 digits for MGRS" italic={true} />

        <LineBreak />
        <LineBreak />

        <AppButton
          label={
            shiftPrevTargetId == ""
              ? "Pick reference location on map (using internet)"
              : "Show reference target on map (using internet)"
          }
          clickCallback={() => {
            saveTempFireMissionForMapPicker();
            nav.openMapPicker();
          }}
        />

        <LineBreak />
        <LineBreak />

        <NumericInput
          key={rerenderKey + "_shiftCorrLeft"}
          startValue={leftCorr}
          label="Left"
          blurCallback={(inputVal) => {
            setLeftCorr(inputVal);
            setRigtCorr(0);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_shiftCorrRight"}
          startValue={rigtCorr}
          label="Right"
          blurCallback={(inputVal) => {
            setLeftCorr(0);
            setRigtCorr(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <LineBreak />

        <NumericInput
          key={rerenderKey + "_shiftCorrAdd"}
          startValue={addCorr}
          label="Add"
          blurCallback={(inputVal) => {
            setAddCorr(inputVal);
            setDropCorr(0);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_shiftCorrDrop"}
          startValue={dropCorr}
          label="Drop"
          blurCallback={(inputVal) => {
            setAddCorr(0);
            setDropCorr(inputVal);
            setRerenderKey(Helpers.RandomId());
          }}
        />
        <LineBreak />
      </>
    );
  }

  function inputFormSelector() {
    if (targetMethod == "polar") {
      return polarInputForm();
    }

    if (targetMethod == "shift") {
      return shiftInputForm();
    }

    return gridInputForm();
  }

  function saveFireMission() {
    if (currentFireMission == null) {
      currentFireMission = props.appFDC.CreateFireMission();
    }

    currentFireMission.name = fireMissionName;

    if (targetMethod == "grid") {
      var tgLocation: tLocationPointGrid = {
        east: fireMissionGridEast,
        north: fireMissionGridNorth,
        gridZoneId: gridZoneDesignatorGrid ?? undefined,
        latitude: Number(frmLat) ?? undefined,
        longitude: Number(frmLon) ?? undefined,
      };
      currentFireMission.SetInitialTargetGrid(tgLocation, otLineMil);
    }

    if (targetMethod == "polar") {
      var foLocation: tLocationPointGrid = {
        east: frontObserverEast,
        north: frontObserverNorth,
        gridZoneId: gridZoneDesignatorPolar ?? undefined,
        latitude: Number(frmLat) ?? undefined,
        longitude: Number(frmLon) ?? undefined,
      };
      currentFireMission.SetInitialTargetPolar(
        foLocation,
        otLineMil,
        polarDistance
      );
    }

    if (targetMethod == "shift") {
      var shiftCorr: tCorrection = {
        add: addCorr - dropCorr,
        right: rigtCorr - leftCorr,
      };

      var shiftFromLocation: tLocationPointGrid = {
        east: shiftFromGridEast,
        north: shiftFromGridNorth,
        gridZoneId: gridZoneDesignatorShift ?? undefined,
        latitude: Number(frmLat) ?? undefined,
        longitude: Number(frmLon) ?? undefined,
      };

      currentFireMission.SetInitialTargetShift(
        shiftFromLocation,
        otLineMil,
        shiftCorr,
        shiftPrevTargetId
      );
    }

    nav.mapPickerFireMission = null;
  }

  function saveTempFireMissionForMapPicker() {
    if (nav.mapPickerFireMission == null) {
      nav.mapPickerFireMission = new FireMission();
    }

    nav.mapPickerFireMission.name = fireMissionName;

    if (targetMethod == "grid") {
      var tgLocation: tLocationPointGrid = {
        east: fireMissionGridEast,
        north: fireMissionGridNorth,
        gridZoneId: gridZoneDesignatorGrid ?? undefined,
        latitude: Number(frmLat) ?? undefined,
        longitude: Number(frmLon) ?? undefined,
      };
      nav.mapPickerFireMission.SetInitialTargetGrid(tgLocation, otLineMil);
    }

    if (targetMethod == "polar") {
      var foLocation: tLocationPointGrid = {
        east: frontObserverEast,
        north: frontObserverNorth,
        gridZoneId: gridZoneDesignatorPolar ?? undefined,
        latitude: Number(frmLat) ?? undefined,
        longitude: Number(frmLon) ?? undefined,
      };
      nav.mapPickerFireMission.SetInitialTargetPolar(
        foLocation,
        otLineMil,
        polarDistance
      );
    }

    if (targetMethod == "shift") {
      var shiftCorr: tCorrection = {
        add: addCorr - dropCorr,
        right: rigtCorr - leftCorr,
      };

      var shiftFromLocation: tLocationPointGrid = {
        east: shiftFromGridEast,
        north: shiftFromGridNorth,
        gridZoneId: gridZoneDesignatorShift ?? undefined,
        latitude: Number(frmLat) ?? undefined,
        longitude: Number(frmLon) ?? undefined,
      };

      nav.mapPickerFireMission.SetInitialTargetShift(
        shiftFromLocation,
        otLineMil,
        shiftCorr,
        shiftPrevTargetId
      );
    }
  }

  function navigateBack() {
    currentFireMission?.id
      ? nav.navigateToFireMissionEdit(currentFireMission!.id)
      : nav.navigateToFireMissionList();
  }

  return (
    <BlockContainer inlineBlock={true}>
      <ScreenTitle text="Fire Mission Set Target" />

      <TextInput
        startValue={fireMissionName}
        label="Name"
        width={200}
        blurCallback={(inputVal) => {
          setFireMissionName(inputVal);
        }}
      />

      <BlockContainer>
        <RadioInput
          key={rerenderKey + "_locationMethod"}
          startValue={targetMethod}
          changeCallback={(inputVal) => {
            setTargetMethod(inputVal as TargetMethod);
            setMapIcon(getMapIconForTargetMethod(inputVal as TargetMethod));
            setRerenderKey(Helpers.RandomId());
          }}
          options={[
            { value: TargetMethod.grid, displayText: "GRID" },
            { value: TargetMethod.polar, displayText: "POLAR" },
            { value: TargetMethod.shift, displayText: "SHIFT" },
          ]}
        />
      </BlockContainer>

      <Card padding={5} border={1} margin={5}>
        {inputFormSelector()}

        <LineBreak />

        <NumericInput
          startValue={otLineMil}
          label="OT line (mil)"
          blurCallback={(inputVal) => {
            setOtLineMil(inputVal);
          }}
        />
      </Card>

      <BlockContainer padding={5} margin={5} inlineBlock={true}>
        <AppButton
          label="Back"
          clickCallback={() => {
            navigateBack();
          }}
        />

        <AppButton
          label="Save"
          clickCallback={() => {
            saveFireMission();
            navigateBack();
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
          startValue={Number(frmLat)}
          label="Lat"
          acceptNaN={true}
          blurCallback={(inputVal) => {
            setFrmLat(inputVal.toString());
            setGridFromLatLon(inputVal.toString(), frmLon);
            setRerenderKey(Helpers.RandomId());
          }}
        />

        <NumericInput
          key={rerenderKey + "_lon"}
          startValue={Number(frmLon)}
          label="Lon"
          acceptNaN={true}
          blurCallback={(inputVal) => {
            setFrmLon(inputVal.toString());
            setGridFromLatLon(frmLat, inputVal.toString());
            setRerenderKey(Helpers.RandomId());
          }}
        />
      </BlockContainer>
    </BlockContainer>
  );
}
