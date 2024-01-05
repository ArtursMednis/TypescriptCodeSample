import React from "react";
import { gitDownloadIcon } from "./base64icons";

export default class Welcome extends React.Component {
  render() {
    return (
      <div>
        <h1>FDC Mortar App</h1>

        <br />
        <h2>info</h2>
        <div style={{ width: 500, textAlign: "left", display: "inline-block" }}>
          <ul>
            <li>In the "Mortars" section, you can specify the position of the mortars</li>
            <li>
            In the "Fire missions" section, you can enter fire missions and calculate fire data lines
            </li>
            <li>
            If somewhere a dash "-" or NaN (not a number) appears instead of a number it means that some input data is missing for calculation
            </li>
            <li>
            In the "Settings" section, you can save entered data in file and later load it from the file
            </li>
          </ul>
        </div>

        <br />
        <br />
        <br />

        <h2> version 0.13 - 28.11.2023 </h2>
      </div>
    );
  }
}
