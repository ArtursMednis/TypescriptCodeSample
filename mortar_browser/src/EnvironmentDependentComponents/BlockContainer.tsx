import { ReactNode } from "react";

export default function BlockContainer(props: {
    [x: string]: ReactNode;
    marginTop?: number;
    marginBotom?: number;
    margin?:number;
    
    border?: number;
    borderTop?: number;
    borderBtn?: number;
    
    borderAlphaLayer?: number;

    padding?: number;
    inlineBlock?: boolean;



  }) {
    var marginTop = props.marginTop ?? props.margin ?? 0;
    var marginBottom = props.marginBotom ?? props.margin ?? 0;
    var marginLeft = props.margin ?? 0;
    var marginRight = props.margin ?? 0;
    var border = props.border ?? 0;

    var borderAlphaLayer = props.borderAlphaLayer ? props.borderAlphaLayer.toString() : "0.75";
    var borderColor = "rgba(0, 0, 0, "+ borderAlphaLayer+ ")";

    var borderTop = (props.borderTop ?? props.border)
    ?(props.borderTop ?? props.border)?.toString()+ "px solid " + borderColor 
    : ""; 

    var borderBtn = (props.borderBtn ?? props.border)
    ?(props.borderBtn ?? props.border)?.toString()+ "px solid " + borderColor 
    : ""; 

    var borderLeft = props.border
    ? props.border.toString()+ "px solid " + borderColor 
    : ""; 

    var borderRight = props.border
    ? props.border.toString()+ "px solid " + borderColor 
    : ""; 
 

    var padding = props.padding ?? 0;
    var display = props.inlineBlock ? "inline-block" : "block";
  
    
    return (
      <div style={{ display: display, 
      marginTop: marginTop, 
      marginBottom: marginBottom, 
      marginLeft:marginLeft, 
      marginRight:marginRight, 

      borderTop: borderTop,
      borderBottom:borderBtn,
      borderLeft:borderLeft,
      borderRight:borderRight,
      
      padding:padding }}>
          {props.children}
      </div>
    );
  }
  