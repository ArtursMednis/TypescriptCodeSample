import React from "react";
import { AppFDC } from "../mortar_logic_src/AppFDC";
import { NavigationManager } from "../navigation/NavigationManager";
import { MapSvgCreator } from "../mortar_logic_src/MapSvgCreator";

export default function MapSvg(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  var currentFireMission = props.appFDC.fireMissions.find(
    (frm) => frm.id == nav.selectedFireMission
  );

  var mapSvgCreator: MapSvgCreator = new MapSvgCreator(props.appFDC);

  var mapSvg: string = currentFireMission
    ? mapSvgCreator.creataMapForFireMission(currentFireMission.id)
    : mapSvgCreator.creataMapForAll();

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
      <span>GridLines </span>
      <select
        defaultValue={
          props.appFDC.settings.mapSettings.showMilimeterPaper
            ? "showMilimeterPaper"
            : "showDecimals"
        }
        onChange={(e) => {
          var showMilimeterPaper = e.target.value == "showMilimeterPaper";

          props.appFDC.settings.mapSettings.showMilimeterPaper =
            showMilimeterPaper;
          props.appFDC.settings.mapSettings.showDecimals = !showMilimeterPaper;
          nav.refreshComponents();
        }}
      >
        <option value="showMilimeterPaper">Milimeter paper</option>
        <option value="showDecimals">Decimals</option>
      </select>
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
      <div dangerouslySetInnerHTML={{ __html: mapSvg }}></div>
      {/* {mapSvg} */}
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
