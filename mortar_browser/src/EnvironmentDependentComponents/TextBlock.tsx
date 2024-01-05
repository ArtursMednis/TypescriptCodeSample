export default function TextBlock(props: {
  text?: string;
  bold?: boolean;
  italic?:boolean;
  fontSizeEm?:number;
  margin?:number;
}) {
  var displayText = props.text ?? "";
  var fontWeight = props.bold ? "bold" : "normal";
  var fontStyle = props.italic ? "italic" : "normal";
  var fontSizeEm = props.fontSizeEm ? props.fontSizeEm + "em" : "1em";
  var margin = props.margin ?? 0;

  return (
    <div style={{ display: "block", margin: 0 }}>
        <p style={{ whiteSpace: "pre-line", fontWeight: fontWeight, fontStyle: fontStyle, fontSize:fontSizeEm, margin:margin   }}>
            {displayText}
        </p>
    </div>
  );
}
