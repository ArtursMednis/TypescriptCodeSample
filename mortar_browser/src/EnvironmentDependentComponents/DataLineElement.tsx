import { ReactNode } from "react";

export default function DataLineElement(props: {
    [x: string]: ReactNode;
    marginTop?: number;
    marginBotom?: number;
    margin?:number;
    colWidth?:number;
    
  }) {

    var width = (props.colWidth) 
    ? props.colWidth + "px"
    : "auto";

    var margin = (props.margin != null) ? props.margin : 5;

    return (
      <div style={{ display: "inline-block", 
      width:width,
      margin:margin
       }}>
          {props.children}
      </div>
    );
  }
  