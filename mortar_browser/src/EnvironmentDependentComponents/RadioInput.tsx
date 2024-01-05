import { Helpers } from "../mortar_logic_src/Helpers";
import { tSelectPickerOption } from "./SelectPicker";

export default function RadioInput(props:{
    options?:tSelectPickerOption[];
    name?:string;
    startValue?: string;
    changeCallback?: (num: string) => void;
    
}){
    var inputName = props.name ?? Helpers.RandomId();

    function executeCallback(inputValue: string) {
        if (props.changeCallback) {
            props.changeCallback(inputValue);
        }
      }

      return (
        <>
            {props.options?.map((optionData) => (
                <label style={{display:"inline-block", margin:5}}>
                {optionData.displayText}
                <input
                type="radio"
                name={inputName}
                value={optionData.value}
                checked={props.startValue == optionData.value}
                onChange={(x) => {
                    executeCallback(x.currentTarget.value);
                }}
                />
            </label>
            ))}
        </>
      );
}