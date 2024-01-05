import { useState } from "react";

export default function NumericInput(props: {
  startValue?: number;
  label?: string;
  acceptNaN?: boolean;
  blurCallback?: (num: number) => void;
  expectedDigitsCount?:number;
  disabled?:boolean;
  placeholder?:string;
  width?: number;
  margin?:number;

}) {
  var labelDisplayText = props.label ? props.label + ":" : "";

  var startValueStr = (Number.isNaN(props.startValue) || props.startValue == null) ? "" : formatValueToExpectedDigitCount(props.startValue.toString());
  const [inputValueStr, setInputValueStr] = useState(startValueStr);

  const [inputChanged, setInputChanged] = useState(false);

  var width = props.width ? props.width.toString() + "px" : "80px";
  var innerMargin = (labelDisplayText == "") ? 0 : 3;
  var margin = (props.margin != null) ? props.margin : 5;

  function convertValueToNumberAndExecuteCallback(inputValue: string) {
    if (!props.blurCallback) {
      return;
    }

    var inputValueTrim = inputValue?.trim();

    if (!inputValueTrim) {
      props.acceptNaN ? setInputValueStr("") : setInputValueStr(formatValueToExpectedDigitCount("0"));
      props.acceptNaN ? props.blurCallback(NaN) : props.blurCallback(0);
      return;
    }

    var inputValueNum = Number(inputValueTrim);
    if (Number.isNaN(inputValueNum)) {
      props.acceptNaN ? setInputValueStr("") : setInputValueStr(formatValueToExpectedDigitCount("0"));
      props.acceptNaN ? props.blurCallback(NaN) : props.blurCallback(0);
      return;
    } else {
      setInputValueStr(formatValueToExpectedDigitCount(inputValueTrim));
      props.blurCallback(inputValueNum);
      return;
    }
  }

  function formatValueToExpectedDigitCount(inputString:string){
    if(!props.expectedDigitsCount){
      return inputString;
    }

    const [integerPart, decimalPart] = inputString.split('.');

    if (integerPart.length < props.expectedDigitsCount) {
      const numberOfZerosToAdd = props.expectedDigitsCount - integerPart.length;
      const zeros = '0'.repeat(numberOfZerosToAdd);
      const formattedIntegerPart = zeros + integerPart;
      const formattedResult = decimalPart !== undefined ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
      return formattedResult;
    }
    else{
      return inputString;
    }
  }

  return (
    <div style={{ display: "inline-block", margin: margin }}>
      <label>
        {labelDisplayText}
        <input
          style={{ width: width, marginLeft: innerMargin }}
          type="text"
          value={inputValueStr}
          disabled={props.disabled ?? false}
          placeholder ={props.placeholder}
          onChange={(e) => {
            setInputValueStr(e.target.value);
            setInputChanged(true);
          }}
          onBlur={(e) => {
            if(inputChanged){
              setInputChanged(false);
              convertValueToNumberAndExecuteCallback(e.target.value);
            }
          }}
        />
      </label>
    </div>
  );
}
