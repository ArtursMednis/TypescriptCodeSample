import React, { useState } from "react";
import "./App.css";
import Menu from "./navigation/Menu";
import { AppFDC } from "./mortar_logic_src/AppFDC";
import { NavigationManager } from "./navigation/NavigationManager";
import { Console } from "console";

function App(props: { appFDC: AppFDC; navigationManager: NavigationManager }) {
  const [refresh, setRefresh] = useState(false);

  props.navigationManager.refreshComponents = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <Menu appFDC={props.appFDC} navigationManager={props.navigationManager} />

      <div style={{ borderTop: "2px solid rgba(0, 0, 0)" }}>
        {props.navigationManager.getCurrentScreenComponent()}
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default App;
