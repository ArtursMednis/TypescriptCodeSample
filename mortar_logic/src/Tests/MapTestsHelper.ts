 import { SVG } from "@svgdotjs/svg.js";

export type svgElementSearchParams = {
  type: string;
  color?: string;
  x?: number;
  y?: number;
};

export class MapTestsHelper {
  public static checkIfElementExist(
    svgString: string,
    searchParams: svgElementSearchParams
  ): boolean {
    var svgCanvas = SVG().svg(svgString);

    var elementsWithType = svgCanvas.find(searchParams.type);

    for (var x = 0; x < elementsWithType.length; x++) {
      var element = elementsWithType[x]!;

      var fillCheckPass = searchParams.color
        ? searchParams.color == element.fill()
        : true;
      var xCheckPass = searchParams.x
        ? searchParams.x == element.x() || searchParams.x == element.cx()
        : true;
      var yCheckPass = searchParams.y
        ? searchParams.y == element.y() || searchParams.y == element.cy()
        : true;

      if (fillCheckPass && xCheckPass && yCheckPass) return true;
    }

    return false;
  }
}
