export default function SmallText(props: {
    text?: string;
    bold?: boolean;
    italic?:boolean;
    fontSizeEm?:number;
    margin?:number;
    color?:string;
  }) {
    var displayText = props.text ?? "";
    var fontWeight = props.bold ? "bold" : "normal";
    var fontStyle = props.italic ? "italic" : "normal";
    var fontSizeEm = props.fontSizeEm ? props.fontSizeEm + "em" : "1em";
    var margin = props.margin ?? 0;
    var color = props.color ?? "black";
  
    return (
          <span style={{ whiteSpace: "pre-line", fontWeight: fontWeight, fontStyle: fontStyle, fontSize:fontSizeEm, margin: margin, color:color   }}>
              {displayText}
          </span>
    );
  }
  