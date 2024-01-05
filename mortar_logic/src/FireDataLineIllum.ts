import { FireDataLine } from "./FireDataLine";

export class FireDataLineIllum extends FireDataLine {
  override GetPreviousFireDataLine() {
    var fireDateLinesIllum = this.fireMission.fireDateLinesIllum;

    for (var i = 1; i < fireDateLinesIllum.length; i++) {
      if (fireDateLinesIllum[i]?.id === this.id) {
        var prevFireDataLine = fireDateLinesIllum[i - 1];

        return prevFireDataLine ? prevFireDataLine : null;
      }
    }

    return null;
  }
}
