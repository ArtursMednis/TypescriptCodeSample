export default function ScreenTitle(props: {
    text?: string;
  }) {
    var displayText = props.text ?? "";
    
    return (
      <div style={{ display: "block", margin: 0 }}>
          <p style={{ whiteSpace: "pre-line", fontWeight: "bold", fontSize:"2em", margin:10  }}>
              {displayText}
          </p>
      </div>
    );
  }
  