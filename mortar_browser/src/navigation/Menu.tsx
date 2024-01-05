import { AppFDC } from "../mortar_logic_src/AppFDC";
import { NavigationManager } from "./NavigationManager";

export default function Menu(props: {
  appFDC: AppFDC;
  navigationManager: NavigationManager;
}) {
  var nav = props.navigationManager;
  return (
    <div style={{marginTop:15}}>
      <button
        type="button"
        onClick={() => {
          nav.navigateToWelcome();
        }}
      >
        {" "}
        Welcome{" "}
      </button>
      |
      <button
        type="button"
        onClick={() => {
          nav.navigateToAllSettings();
        }}
      >
        {" "}
        Settings{" "}
      </button>
      |
      <button
        type="button"
        onClick={() => {
          nav.navigateToMortarList();
        }}
      >
        {" "}
        Mortars{" "}
      </button>
      |
      <button
        type="button"
        onClick={() => {
          nav.navigateToFireMissionList();
        }}
      >
        {" "}
        Fire missions{" "}
      </button>
    </div>
  );
}
