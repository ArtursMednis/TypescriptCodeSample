import React, { useEffect, useState } from "react";
import { AppFDC } from "../mortar_logic_src/AppFDC";
import { NavigationManager } from "../navigation/NavigationManager";
import { Helpers } from "../mortar_logic_src/Helpers";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayerGroup,
  Circle,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { tLocationPointGrid } from "../mortar_logic_src/interfaces";
import {
  lLocationIcon,
  lMortarIcon,
  lTargetIcon,
  lExplosionIcon,
  lBinocularIcon,
  lBlueExplosionIcon,
  lDingDongIcon,
  lBangIcon,
} from "./base64icons";
import * as mgrsLib from "../mortar_logic_src/mgrsLib";
import { CoordTransformFunctions } from "../mortar_logic_src/CoordTransformFunctions";

type tMapLocationData = {
  latLongPosition: LatLngExpression;
  markerIcon: L.Icon;
  popupText: string;
};

type tMapCircleData = {
  latLongPosition: LatLngExpression;
  radius: number;
  popupText: string;
};

type tMapLineData = {
  pathOptions: L.PathOptions;
  positions: L.LatLngExpression[];
};

export default function MapLeafletDisplay(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == nav.selectedFireMission
  );

  var showBlastDiameter = props.appFDC.settings.mapSettings.showBlastDiameter;

  //Šim vajadzēs funkciju, kas appFdc pārbauda visas lokācijas un ja ir 2 dažādas, tad te null;
  var defaultGridZoneForMission =
    currentFireMission?.targetInitialGridLocation?.gridZoneId;

  function createMapDataForLocation(
    locPoint?: tLocationPointGrid,
    icon?: L.Icon,
    popupText?: string
  ): tMapLocationData | null {
    if (icon == null) {
      icon = lLocationIcon;
    }

    if (popupText == null) {
      popupText = "";
    }

    var latLon = CoordTransformFunctions.extractLatLong(locPoint);

    if (latLon == null) {
      return null;
    }

    var mapData: tMapLocationData = {
      latLongPosition: latLon,
      markerIcon: icon,
      popupText: popupText,
    };

    return mapData;
  }

  var tgLoc = currentFireMission?.targetInitialGridLocation;

  var initialPos: LatLngExpression | null =
    CoordTransformFunctions.extractLatLong(
      currentFireMission?.targetInitialGridLocation,
      defaultGridZoneForMission
    );

  var mapLocDataArr: tMapLocationData[] = [];
  var circlesInMapArr: tMapCircleData[] = [];
  var linesInMapArr: tMapLineData[] = [];

  props.appFDC.mortars.forEach((mrt) => {
    var mapData = createMapDataForLocation(
      mrt.mortarLocation,
      lMortarIcon,
      mrt.name
    );
    if (mapData) {
      mapLocDataArr.push(mapData);
    }
  });

  console.log("regular lines: " + currentFireMission?.fireDateLines?.length);
  currentFireMission?.fireDateLines.forEach((fdl, lineNo) => {
    var fdlLoc = fdl.GetGrid();

    var mapData = createMapDataForLocation(
      fdlLoc,
      lBangIcon,
      lineNo.toString()
    );
    console.log("regular map data " + mapData?.latLongPosition + " ");
    if (mapData) {
      mapLocDataArr.push(mapData);

      var blastDiameter = fdl.getBlastDiameter();

      if (
        showBlastDiameter &&
        !Number.isNaN(blastDiameter) &&
        blastDiameter != 0
      ) {
        circlesInMapArr.push({
          latLongPosition: mapData.latLongPosition,
          popupText: mapData.popupText,
          radius: blastDiameter / 2,
        });
      }
    }
  });

  if (currentFireMission) {
    var mapData = createMapDataForLocation(
      currentFireMission.targetInitialGridLocation,
      lTargetIcon,
      currentFireMission.name
    );
    if (mapData) {
      mapLocDataArr.push(mapData);
    }
  }

  currentFireMission?.fireDateLinesIllum.forEach((fdl, lineNo) => {
    var fdlLoc = fdl.GetGrid();

    var mapData = createMapDataForLocation(
      fdlLoc,
      lBlueExplosionIcon,
      lineNo.toString()
    );
    if (mapData) {
      mapLocDataArr.push(mapData);
    }
  });

  currentFireMission?.linearTarget?.fireDateLines?.forEach((fdlLinear) => {
    var fdlLoc = fdlLinear.GetGrid();

    var mapData = createMapDataForLocation(
      fdlLoc,
      lExplosionIcon,
      fdlLinear.subtargetNoLetter()
    );
    if (mapData) {
      mapLocDataArr.push(mapData);

      var blastDiameter =
        props.appFDC.mortars
          .find((x) => x.id == fdlLinear.mortarId)
          ?.getBlastDiameter() ?? NaN;

      if (
        showBlastDiameter &&
        !Number.isNaN(blastDiameter) &&
        blastDiameter != 0
      ) {
        circlesInMapArr.push({
          latLongPosition: mapData.latLongPosition,
          popupText: mapData.popupText,
          radius: blastDiameter / 2,
        });
      }
    }
  });

  if (currentFireMission?.linearTarget) {
    var endpoints = currentFireMission.linearTarget.getEndingPoints();

    var endpointLatLng0 = CoordTransformFunctions.extractLatLong(
      endpoints[0],
      currentFireMission.targetInitialGridLocation.gridZoneId
    );
    var endpointLatLng1 = CoordTransformFunctions.extractLatLong(
      endpoints[1],
      currentFireMission.targetInitialGridLocation.gridZoneId
    );

    if (endpointLatLng0 && endpointLatLng1) {
      var path: LatLngExpression[] = [endpointLatLng0, endpointLatLng1];

      linesInMapArr.push({ positions: path, pathOptions: { color: "lime" } });
    }
  }

  if (currentFireMission?.frontObserverGridLocation) {
    var mapData = createMapDataForLocation(
      currentFireMission?.frontObserverGridLocation,
      lBinocularIcon,
      currentFireMission.name + "_FO"
    );
    if (mapData) {
      mapLocDataArr.push(mapData);
    }
  }

  if (initialPos == null) {
    return <div></div>;
  }

  return (
    <div>
      <h1>Map</h1>
      <button
        type="button"
        onClick={() => {
          nav.cancelMap();
        }}
      >
        Back
      </button>{" "}
      <br />
      <br />
      <span> Show blast diameter</span>
      <input
        type="checkbox"
        onChange={(e) => {
          props.appFDC.settings.mapSettings.showBlastDiameter =
            e.target.checked;
          nav.refreshComponents();
        }}
        defaultChecked={props.appFDC.settings.mapSettings.showBlastDiameter}
      />
      <br />
      <MapContainer
        center={initialPos}
        zoom={13}
        scrollWheelZoom={true}
        style={{ display: "inline-block", width: 500, height: 300 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mapLocDataArr.map((mapLocData) => (
          <Marker
            position={mapLocData.latLongPosition}
            icon={mapLocData.markerIcon}
          >
            <Popup>{mapLocData.popupText}</Popup>
          </Marker>
        ))}

        <LayerGroup>
          {circlesInMapArr.map((mapCircleData) => (
            <Circle
              center={mapCircleData.latLongPosition}
              radius={mapCircleData.radius}
            />
          ))}

          {linesInMapArr.map((lineInMap) => (
            <Polyline
              pathOptions={lineInMap.pathOptions}
              positions={lineInMap.positions}
            />
          ))}
        </LayerGroup>
      </MapContainer>
      <br />
      <br />
      <br />
      <button
        type="button"
        onClick={() => {
          nav.cancelMap();
        }}
      >
        Back
      </button>
    </div>
  );
}
