import React, { useEffect, useRef, useState } from "react";
import { AppFDC } from "../mortar_logic_src/AppFDC";
import {
  MainMenuOptions,
  NavigationManager,
} from "../navigation/NavigationManager";
import { Helpers } from "../mortar_logic_src/Helpers";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import {
  TargetMethod,
  tLocationPointGrid,
} from "../mortar_logic_src/interfaces";
import {
  lBinocularIcon,
  lFlagIcon,
  lLocationIcon,
  lMortarIcon,
  lTargetIcon,
} from "./base64icons";
import { CoordTransformFunctions } from "../mortar_logic_src/CoordTransformFunctions";
import { Mortar } from "../mortar_logic_src/Mortar";
import { FireMission } from "../mortar_logic_src/FireMission";

/**
 * 
https://github.com/pavel-corsaghin/react-native-leaflet
 */

export default function MapLeafletPicker(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;

  var markerIcon = SelectMarkerIcon(nav);
  var selectedLocationGrid =
    GetInitialMarkerLocationFromNavigationMapPickerObj(nav);
  var selectedLocationLatLon = selectedLocationGrid
    ? CoordTransformFunctions.extractLatLong(selectedLocationGrid)
    : null;

  var pickingEnabled = IsPickingEnabled(nav);

  var initialMapCenter = selectedLocationLatLon ?? nav.startingPositionLatLon;

  const [userLocation, setUserLocation] = useState(selectedLocationLatLon);
  const [mapCenter, setMapCenter] = useState(initialMapCenter);

  const [locationMgrsText, setLocationMgrsText] = useState(
    "" +
      selectedLocationGrid?.gridZoneId +
      " " +
      selectedLocationGrid?.east +
      " " +
      selectedLocationGrid?.north
  );

  const markerRef = useRef<any>(null);

  useEffect(() => {
    console.log("userlocation");
    if (userLocation && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, []);

  const handleMapClick = (event: LeafletMouseEvent) => {
    if (!pickingEnabled) {
      return;
    }

    const { lat, lng } = event.latlng;
    setUserLocation([lat, lng]);
    var grid = Helpers.latLon2MGRS(lat, lng);

    setLocationMgrsText(
      "" + grid?.gridZoneId + " " + grid?.east + " " + grid?.north
    );
    SetLocationToNavigationMapPickerObj(grid, nav);

    if (userLocation && markerRef.current) {
      markerRef.current.openPopup();
    }
  };

  return (
    <div>
      <strong>Select on map</strong>
      <br />
      <button
        type="button"
        onClick={() => {
          nav.cancelMap();
        }}
      >
        OK
      </button>{" "}
      <br />
      <br />
      <br />
      <div style={{ display: "inline-block" }}>
        {mapCenter && (
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={false}
            style={{ display: "inline-block", width: 500, height: 300 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HandleMapClick handleMapClick={handleMapClick} />

            {userLocation && (
              <Marker position={userLocation} icon={markerIcon} ref={markerRef}>
                <Popup>{locationMgrsText}</Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

function HandleMapClick(props: { handleMapClick: Function }) {
  useMapEvents({
    click: (event) => {
      props.handleMapClick(event);
    },
  });

  return null;
}

//    https://leafletjs.com/examples/quick-start/

function GetInitialMarkerLocationFromNavigationMapPickerObj(
  nav: NavigationManager
): tLocationPointGrid | null {
  if (nav.mainMenu == MainMenuOptions.Mortar) {
    return nav.mapPickerMortar?.mortarLocation ?? null;
  }

  switch (nav.mapPickerFireMission?.targetMethod) {
    case TargetMethod.grid:
      return nav.mapPickerFireMission?.targetInitialGridLocation ?? null;
    case TargetMethod.polar:
      return nav.mapPickerFireMission?.frontObserverGridLocation ?? null;
    case TargetMethod.shift:
      return nav.mapPickerFireMission?.shiftPrevTargetFinalGridLocation ?? null;
    default:
      return null;
  }
}

function SelectMarkerIcon(nav: NavigationManager): L.Icon {
  if (nav.mainMenu == MainMenuOptions.Mortar) {
    return lMortarIcon;
  }

  switch (nav.mapPickerFireMission?.targetMethod) {
    case TargetMethod.grid:
      return lTargetIcon;
    case TargetMethod.polar:
      return lBinocularIcon;
    case TargetMethod.shift:
      return lFlagIcon;
    default:
      return lLocationIcon;
  }
}

function IsPickingEnabled(nav: NavigationManager) {
  var isSelectedPreviousTarget = Boolean(
    nav.mapPickerFireMission?.shiftPrevTargetId
  );
  return !isSelectedPreviousTarget;
}

function SetLocationToNavigationMapPickerObj(
  grid: tLocationPointGrid,
  nav: NavigationManager
) {
  if (nav.mainMenu == MainMenuOptions.Mortar) {
    if (!nav.mapPickerMortar) {
      nav.mapPickerMortar = new Mortar();
    }

    nav.mapPickerMortar.mortarLocation = grid;
    return;
  }

  if (nav.mapPickerFireMission == null) {
    nav.mapPickerFireMission = new FireMission();
  }

  switch (nav.mapPickerFireMission.targetMethod) {
    case TargetMethod.grid:
      nav.mapPickerFireMission.targetInitialGridLocation = grid;
      return;
    case TargetMethod.polar:
      nav.mapPickerFireMission.frontObserverGridLocation = grid;
      return;
    case TargetMethod.shift:
      nav.mapPickerFireMission.shiftPrevTargetFinalGridLocation = grid;
      return;
  }
}
