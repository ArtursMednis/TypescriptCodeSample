import { AppFDC } from "../mortar_logic_src/AppFDC";
import { NavigationManager } from "../navigation/NavigationManager";


export default function ExportAppInFileBtn(props:{
    exportFileName: string;
    exportedAppFdcData:string;
    navigationManager: NavigationManager;
    clickCallback?: () => void;
  }){

    var exportedSaveLink = props.navigationManager.createLinkForAppExport(props.exportedAppFdcData);
      
      return (

        <a
        href={exportedSaveLink}
        download={props.exportFileName}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <button type="button">Save all data in file</button>
      </a>
      )
  }