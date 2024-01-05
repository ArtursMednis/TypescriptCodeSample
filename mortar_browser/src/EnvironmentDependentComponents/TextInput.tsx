import { useState } from "react";

export default function TextInput(props: {
  startValue?: string;
  label?: string;
  blurCallback?: (num: string) => void;
  disabled?:boolean;
  width?: number;

}) {
  var labelDisplayText = props.label ? props.label + ":" : "";
  var width = props.width ? props.width.toString() + "px" : "80px";
  var startValueStr = props.startValue ?? "";
  const [inputValueStr, setInputValueStr] = useState(startValueStr);

  function executeCallback(inputValue: string) {
    if (props.blurCallback) {
        props.blurCallback(inputValue);
    }
  }


  return (
    <div style={{ display: "inline-block", margin: 5 }}>
      <label>
        {labelDisplayText}
        <input
          style={{ width: width, margin: 3 }}
          type="text"
          value={inputValueStr}
          disabled={props.disabled ?? false}
          onChange={(e) => {
            setInputValueStr(e.target.value);
          }}
          onBlur={(e) => {
            executeCallback(e.target.value);
          }}
        />
      </label>
    </div>
  );
}
