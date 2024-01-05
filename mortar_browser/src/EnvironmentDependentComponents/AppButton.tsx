export default function AppButton(props:{
  label?: string;
  clickCallback?: () => void;
  disabled?:boolean;
}){
    var labelDisplayText = props.label ?? "";
    var disabled = props.disabled ?? false;
    return (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (props.clickCallback) {
                props.clickCallback();
            }
          }}
        >
          {labelDisplayText}
        </button>
    )
}