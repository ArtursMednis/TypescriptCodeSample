export default function ImportAppFromFileBtn(props:{
    clickCallback?: (fileContent : string) => void;
  }){
      
      return (
          <>
          <button type="button">
        <label htmlFor="loadAppFromFileInput">Load data from file</label>
      </button>
      <input
        id="loadAppFromFileInput"
        type="file"
        accept="application/JSON"
        name="files[]"
        size={30}
        style={{ display: "none" }}
        onChange={(fileSelectEvent) => {
          if (fileSelectEvent.target.files == null) {
            return;
          }
          var file = fileSelectEvent.target.files[0];

          if (file == null) {
            return;
          }

          var reader = new FileReader();
          reader.onload = (fileLoadEvent) => {
            var fileContent = fileLoadEvent.target?.result;
            if (
              typeof fileContent === "string" ||
              fileContent instanceof String
            ) {
              try {
                if (props.clickCallback) {
                    props.clickCallback(fileContent as string);
                }
                alert("Import done");
              } catch (ex) {
                console.log(ex);
                alert("Import failed");
              }
            }
          };
          reader.readAsText(file);
        }}
      />
          </>
      )
  }