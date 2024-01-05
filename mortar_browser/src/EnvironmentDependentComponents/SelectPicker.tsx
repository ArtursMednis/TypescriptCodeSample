import { useState } from "react";
import { iSelectableOption } from "../mortar_logic_src/interfaces";

export type tSelectPickerOption = {value:string, displayText:string};


export default function SelectPicker(props: {
  startValue?: string;
  label?: string;
  changeCallback?: (num: string) => void;
  selectOptions?:iSelectableOption[];
  notNull?:boolean;
  nullValueText?:string;
  disabled?:boolean;
  margin?:number;

}) {
  var labelDisplayText = props.label ? props.label + ":" : "";

  var startValueStr = props.startValue ?? "";
  const [inputValueStr, setInputValueStr] = useState(startValueStr);

  var nullValueText = props.nullValueText ?? "";
  var margin = (props.margin != null) ? props.margin : 5;
  var innerMargin = (labelDisplayText == "") ? 0 : 3;

  var formatedOptions:JSX.Element[] = [];

  {
    formatedOptions = props.selectOptions?.map((optionData) => (
      <option value={optionData.id}>{optionData.name}</option>
    )) ?? [];
  }
  

  if(!props.notNull || (formatedOptions.length == 0)){
    formatedOptions = [<option value="">{nullValueText}</option>].concat(formatedOptions);
  }


  function executeCallback(inputValue: string) {
    if (props.changeCallback) {
        props.changeCallback(inputValue);
    }
  }

  return (
    <div style={{ display: "inline-block", margin: margin }}>
         <label>
         {labelDisplayText}
          <select
            style={{ width: "120px", marginLeft: innerMargin }}
            value={inputValueStr}
            onChange={(e) => {
                setInputValueStr(e.target.value);
                executeCallback(e.target.value);
            }}
          >
            {formatedOptions}
          </select>
        </label>
    </div>
  );
}
