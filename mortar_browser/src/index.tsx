import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AppFDC } from "./mortar_logic_src/AppFDC";
import { NavigationManager } from "./navigation/NavigationManager";
import { PredefinedSettings } from "./mortar_data/PredefinedSettings";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const appFDC: AppFDC = new AppFDC();
const navigationManager: NavigationManager = new NavigationManager(appFDC);
var predSettings = new PredefinedSettings();

appFDC.settings.mortarTypes = predSettings.mortarTypes;
appFDC.settings.defaultMrtType = predSettings.mortarTypes[0]?.id ?? "";
appFDC.settings.mortarShellData = predSettings.mortarShellData;
appFDC.settings.defaultSelectedShellId =
  predSettings.mortarShellData[0]?.id ?? "";
appFDC.settings.predefinedShellIds = predSettings.mortarShellData.map(
  (mshd) => mshd.id
);
appFDC.settings.predefinedTypeIds = predSettings.mortarTypes.map(
  (mrtType) => mrtType.id
);

root.render(
  <React.StrictMode>
    <App appFDC={appFDC} navigationManager={navigationManager} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.onbeforeunload = function (e) {
  return "If you leave, then data will be lost";
};

//TO DO nohandlot back pogu
