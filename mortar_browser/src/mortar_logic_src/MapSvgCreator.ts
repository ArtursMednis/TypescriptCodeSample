import { tLocationPointGrid } from "./interfaces";
import { AppFDC } from "./AppFDC";
import { SVG, registerWindow } from "@svgdotjs/svg.js";
import { Mortar } from "./Mortar";
import { CoordTransformFunctions } from "./CoordTransformFunctions";

export class MapSvgCreator {
  private minX: number = 0;
  private maxX: number = 0;
  private minY: number = 0;
  private maxY: number = 0;
  private dstncBtwnGridLinesBold: number;
  private showMilimeterPaperGrid: boolean;
  private showDecimalsGrid: boolean;
  private showBlastDiameter: boolean;

  private boldLineWidth = 0.05;
  private fontSize = 1;
  private locPointRadius = 0.2;
  private locPointBigRadius = 0.8;
  private startingX = 0;
  private endingX = 0;
  private startingY = 0;
  private endingY = 0;

  appFdc: AppFDC;

  constructor(appFdc: AppFDC) {
    this.appFdc = appFdc;
    var mapSvgParams = appFdc.settings.mapSettings;

    this.dstncBtwnGridLinesBold = mapSvgParams?.distanceBtwnMajorAxis
      ? mapSvgParams.distanceBtwnMajorAxis
      : 1000;
    this.showDecimalsGrid = mapSvgParams?.showDecimals ?? false;
    this.showMilimeterPaperGrid = mapSvgParams?.showMilimeterPaper ?? false;
    this.showBlastDiameter = mapSvgParams?.showBlastDiameter ?? false;

    if (typeof window === "undefined") {
      //@ts-ignore
      const { createSVGWindow } = require("svgdom");
      const window = createSVGWindow();
      registerWindow(window, window.document);
    }
  }

  creataMapForFireMission(fireMissionId: string) {
    var sameGridZone = this.areSameGridZone(this.getAllLocations());
    if (!sameGridZone) {
      var svgCanvas = SVG();

      svgCanvas
        .text("Coordinate grid is not supported for multiple grid zones")
        .fill("red");

      return svgCanvas.svg();
    }

    this.trackMapMarginsAndCalcConstants();

    var svgCanvas = SVG();

    if (true) {
      var gridLines = this.drawGridLines();
      gridLines.addTo(svgCanvas);
    }

    svgCanvas.viewbox(
      this.startingX,
      -1 * this.endingY,
      this.endingX - this.startingX,
      this.endingY - this.startingY
    );

    var fireMissionsWithId = this.appFdc.fireMissions.filter(
      (frms) => frms.id == fireMissionId
    );

    if (fireMissionsWithId.length == 0) {
      return "";
    }

    var fireMission = fireMissionsWithId[0]!;

    //add OT line
    var otLine = this.drawPolarLine(
      fireMission.GetFinalGridAfterCorrections(),
      fireMission.getLastOtLineMil(),
      "OT",
      "blue"
    );
    //var otLine = this.drawPolarLine(fireMission.targetInitialGridLocation,fireMission.otLineMil,"OT","blue");
    otLine.addTo(svgCanvas);

    // add last FDL GT line if not linear
    if (
      fireMission.linearTarget == null &&
      fireMission.fireDateLines.length > 0
    ) {
      var lastFireDataLine =
        fireMission.fireDateLines[fireMission.fireDateLines.length - 1]!;
      if (lastFireDataLine.mortarId) {
        var mortar = this.appFdc.mortars.find(
          (x) => x.id == lastFireDataLine.mortarId
        );
        var targetLoc = lastFireDataLine.GetGrid();
        var line = this.createCustomLineSvg(
          mortar!.mortarLocation,
          targetLoc,
          "red",
          this.boldLineWidth / 4
        );
        line.addTo(svgCanvas);
      }
    }

    // add initial
    var pointInitT = this.createLocationPointInSvg(
      fireMission.targetInitialGridLocation,
      "green",
      fireMission.name
    );
    pointInitT.addTo(svgCanvas);

    //add corrections
    fireMission.fireDateLines.forEach((fireDataLine, lineNo) => {
      var targetLoc = fireDataLine.GetGrid();
      var blastDiameter = fireDataLine.getBlastDiameter();

      var point =
        !this.showBlastDiameter ||
        Number.isNaN(blastDiameter) ||
        blastDiameter == 0
          ? this.createSmallLocationPointInSvg(
              targetLoc,
              "olive",
              lineNo.toString()
            )
          : this.createLocationPointExactSizeInSvg(
              targetLoc,
              "olive",
              lineNo.toString(),
              blastDiameter
            );
      point.addTo(svgCanvas);
    });

    //add illum corrections
    fireMission.fireDateLinesIllum.forEach((fireDataLineIllum, lineNo) => {
      var targetLoc = fireDataLineIllum.GetGrid();

      var point = this.createSmallLocationPointInSvg(
        targetLoc,
        "cyan",
        lineNo.toString()
      );
      point.addTo(svgCanvas);
    });

    //add linear
    if (fireMission.linearTarget) {
      var endpoints = fireMission.linearTarget.getEndingPoints();

      var linTargetLine = this.createCustomLineSvg(
        endpoints[0],
        endpoints[1],
        "olive",
        this.boldLineWidth * 4,
        0.5
      );
      linTargetLine.addTo(svgCanvas);

      var linLines = fireMission.linearTarget?.fireDateLines ?? [];
      linLines.forEach((fdl) => {
        var fdlGrid = fdl.GetGrid();
        var fdlMrtGrid = this.appFdc.mortars.find(
          (x) => x.id == fdl.mortarId
        )?.mortarLocation;

        if (fdlMrtGrid) {
          var gtLine = this.createCustomLineSvg(
            fdlMrtGrid,
            fdlGrid,
            "red",
            this.boldLineWidth / 4
          );
          gtLine.addTo(svgCanvas);
        }

        var blastDiameter =
          this.appFdc.mortars
            .find((x) => x.id == fdl.mortarId)
            ?.getBlastDiameter() ?? NaN;

        var point =
          !this.showBlastDiameter ||
          Number.isNaN(blastDiameter) ||
          blastDiameter == 0
            ? this.createSmallLocationPointInSvg(
                fdlGrid,
                "olive",
                fdl.subtargetNoLetter()
              )
            : this.createLocationPointExactSizeInSvg(
                fdlGrid,
                "olive",
                fdl.subtargetNoLetter(),
                blastDiameter
              );

        point.addTo(svgCanvas);
      });
    }

    //add Mortars
    var mortars: Mortar[] = fireMission.getAvailableMortars();
    fireMission.fireDateLines
      .filter((x) => x.mortarId)
      .forEach((fireDataLine) => {
        var mortar = this.appFdc.mortars.find(
          (x) => x.id == fireDataLine.mortarId
        );

        if (mortar && mortars.indexOf(mortar) == -1) {
          mortars.push(mortar);
        }
      });
    mortars.forEach((mrt) => {
      if (!isNaN(mrt.leftSafetyArc)) {
        var safetyMargin = this.drawPolarLine(
          mrt.mortarLocation,
          mrt.leftSafetyArc + 3200,
          "",
          "black"
        );
        safetyMargin.addTo(svgCanvas);
      }

      if (!isNaN(mrt.rightSafetyArc)) {
        var safetyMargin = this.drawPolarLine(
          mrt.mortarLocation,
          mrt.rightSafetyArc + 3200,
          "",
          "black"
        );
        safetyMargin.addTo(svgCanvas);
      }

      var point = this.createLocationPointInSvg(
        mrt.mortarLocation,
        "red",
        mrt.name
      );
      point.addTo(svgCanvas);
    });

    // Add FO
    if (fireMission.frontObserverGridLocation) {
      var point = this.createLocationPointInSvg(
        fireMission.frontObserverGridLocation,
        "blue",
        fireMission.name + "_FO"
      );
      point.addTo(svgCanvas);
    }

    //Add all other FireMissions
    var otherFireMissions = this.appFdc.fireMissions.filter(
      (frm) => frm.id != fireMission.id
    );
    otherFireMissions.forEach((frm) => {
      if (frm.linearTarget) {
        var endpoints = frm.linearTarget.getEndingPoints();

        var linTargetLine = this.createCustomLineSvg(
          endpoints[0],
          endpoints[1],
          "olive",
          this.boldLineWidth * 4,
          0.5,
          frm.name
        );
        linTargetLine.addTo(svgCanvas);
      } else {
        var pointFinalT = this.createSmallLocationPointInSvg(
          frm.GetFinalGridAfterCorrections(),
          "green",
          frm.name
        );
        pointFinalT.addTo(svgCanvas);
      }
    });

    return svgCanvas.svg();
  }

  creataMapForAll() {
    this.trackMapMarginsAndCalcConstants();

    var svgCanvas = SVG();

    var gridLines = this.drawGridLines();
    gridLines.addTo(svgCanvas);

    svgCanvas.viewbox(
      this.startingX,
      -1 * this.endingY,
      this.endingX - this.startingX,
      this.endingY - this.startingY
    );

    this.appFdc.fireMissions.forEach((fireMission) => {
      fireMission.fireDateLines
        .filter((x) => x.mortarId)
        .forEach((fireDataLine) => {
          var mortar = this.appFdc.mortars.find(
            (x) => x.id == fireDataLine.mortarId
          );
          var targetLoc = fireDataLine.GetGrid();
          var line = this.createCustomLineSvg(
            mortar!.mortarLocation,
            targetLoc,
            "red",
            this.boldLineWidth / 4
          );
          line.addTo(svgCanvas);
        });
    });

    this.appFdc.mortars.forEach((mortar) => {
      var point = this.createLocationPointInSvg(
        mortar.mortarLocation,
        "red",
        mortar.name
      );
      point.addTo(svgCanvas);
    });

    this.appFdc.fireMissions.forEach((fireMission) => {
      var point = this.createLocationPointInSvg(
        fireMission.targetInitialGridLocation,
        "olive",
        fireMission.name
      );
      point.addTo(svgCanvas);
    });

    this.appFdc.fireMissions.forEach((fireMission) => {
      var point = this.createLocationPointInSvg(
        fireMission.GetFinalGridAfterCorrections(),
        "green",
        fireMission.name
      );
      point.addTo(svgCanvas);
    });

    this.appFdc.fireMissions.forEach((fireMission) => {
      if (fireMission.frontObserverGridLocation) {
        var point = this.createLocationPointInSvg(
          fireMission.frontObserverGridLocation,
          "blue",
          fireMission.name + "_FO"
        );
        point.addTo(svgCanvas);
      }
    });

    return svgCanvas.svg();
  }

  private getAllLocations() {
    var mortarLocations = this.appFdc.mortars.map((mrt) => mrt.mortarLocation);
    var targetInitialLocations = this.appFdc.fireMissions.map(
      (frms) => frms.targetInitialGridLocation
    );
    var targetFinalLocations = this.appFdc.fireMissions.map((frms) =>
      frms.GetFinalGridAfterCorrections()
    );
    var foLocations = this.appFdc.fireMissions
      .filter((frms) => frms.frontObserverGridLocation != null)
      .map((frms) => frms.frontObserverGridLocation!);
    var allLocations = mortarLocations.concat(
      targetInitialLocations,
      targetFinalLocations,
      foLocations
    );

    return allLocations;
  }

  private trackMapMarginsAndCalcConstants() {
    // var mortarLocations = this.appFdc.mortars.map(mrt => mrt.mortarLocation);
    // var targetLocations = this.appFdc.fireMissions.map(frms => frms.targetInitialGridLocation);
    // var foLocations = this.appFdc.fireMissions.filter(frms => frms.frontObserverGridLocation != null).map(frms => frms.frontObserverGridLocation!);
    // var allLocations = mortarLocations.concat(targetLocations,foLocations);

    var allLocations = this.getAllLocations();

    var mapMargins = this.getMapMargins(allLocations);

    this.minX = mapMargins.x.min;
    this.maxX = mapMargins.x.max;
    this.minY = mapMargins.y.min;
    this.maxY = mapMargins.y.max;

    var xDiff = this.maxX - this.minX;
    var yDiff = this.maxY - this.minY;

    if (xDiff > yDiff) {
      this.maxY = this.minY + xDiff;
    } else {
      this.maxX = this.minX + yDiff;
    }

    //var maxD = Math.max(this.maxX-this.minX,this.maxY-this.minY);
    // if(maxD < 100){
    //   this.dstncBtwnGridLinesBold = 10;
    // }
    // else{
    //   this.dstncBtwnGridLinesBold = 1000;
    // }

    this.startingX =
      Math.floor(this.minX / this.dstncBtwnGridLinesBold) *
      this.dstncBtwnGridLinesBold;
    this.endingX =
      Math.ceil(this.maxX / this.dstncBtwnGridLinesBold) *
      this.dstncBtwnGridLinesBold;
    this.startingY =
      Math.floor(this.minY / this.dstncBtwnGridLinesBold) *
      this.dstncBtwnGridLinesBold;
    this.endingY =
      Math.ceil(this.maxY / this.dstncBtwnGridLinesBold) *
      this.dstncBtwnGridLinesBold;

    var mapLenght = Math.max(
      this.endingX - this.startingX,
      this.endingY - this.startingY
    );
    this.fontSize = Math.ceil(mapLenght / 50);
    this.locPointRadius = 0.1 * Math.ceil(mapLenght / 25);
    this.locPointBigRadius = this.locPointRadius * 4;
    this.boldLineWidth = this.locPointRadius / 4;
  }

  private getMapMargins(allLocations: tLocationPointGrid[]): tMapMargins {
    if (allLocations.length == 0) {
      return { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    }

    var margins: tMapMargins = {
      x: {
        min: allLocations[0]!.east,
        max: allLocations[0]!.east,
      },
      y: {
        min: allLocations[0]!.north,
        max: allLocations[0]!.north,
      },
    };

    for (var k = 1; k < allLocations.length; k++) {
      var location = allLocations[k]!;

      if (margins.x.min > location.east) {
        margins.x.min = location.east;
      }
      if (margins.x.max < location.east) {
        margins.x.max = location.east;
      }
      if (margins.y.min > location.north) {
        margins.y.min = location.north;
      }
      if (margins.y.max < location.north) {
        margins.y.max = location.north;
      }
    }

    return margins;
  }

  private areSameGridZone(allLocations: tLocationPointGrid[]) {
    var allGridZones = allLocations
      .map((loc) => loc.gridZoneId ?? "")
      .filter((gz) => gz != "");

    if (allGridZones.length < 2) {
      return true;
    }

    var comparisonGridZone = allGridZones.shift();

    return allGridZones.every((gz) => gz == comparisonGridZone);
  }

  private createLocationPointInSvg(
    location: tLocationPointGrid,
    color: string,
    displayName: string
  ) {
    var group = SVG().group();
    group
      .circle()
      .cx(location.east)
      .cy(-location.north)
      .radius(this.locPointRadius)
      .fill(color);
    group
      .circle()
      .cx(location.east)
      .cy(-location.north)
      .radius(this.locPointBigRadius)
      .fill(color)
      .opacity(0.4);
    if (displayName) {
      group
        .text(displayName)
        .x(location.east + this.locPointRadius)
        .y(-location.north - this.locPointRadius)
        .font({ size: this.fontSize });
    }

    return group;
  }

  private createSmallLocationPointInSvg(
    location: tLocationPointGrid,
    color: string,
    displayName: string
  ) {
    var smallRadius = (this.locPointRadius * 2) / 3;
    var group = SVG().group();
    group
      .circle()
      .cx(location.east)
      .cy(-location.north)
      .radius(smallRadius)
      .fill(color);
    if (displayName) {
      group
        .text(displayName)
        .x(location.east + smallRadius)
        .y(-location.north - smallRadius)
        .font({ size: this.fontSize / 2 });
    }

    return group;
  }

  private createLocationPointExactSizeInSvg(
    location: tLocationPointGrid,
    color: string,
    displayName: string,
    diameter: number
  ) {
    var radius = diameter / 2;
    var group = SVG().group();
    group
      .circle()
      .cx(location.east)
      .cy(-location.north)
      .radius(radius)
      .fill({ opacity: 0 })
      .stroke({ color: color, width: 2 });
    if (displayName) {
      group
        .text(displayName)
        .x(location.east + radius)
        .y(-location.north - radius)
        .font({ size: this.fontSize / 2 });
    }

    return group;
  }

  private drawGridLines() {
    var group = SVG().group();
    if (this.minX == 0 && this.maxX == 0 && this.minY == 0 && this.maxY == 0) {
      return group;
    }

    var deltaX: number = this.maxX - this.minX;
    var deltaY: number = this.maxY - this.minY;

    var gridStrokeWidth = this.boldLineWidth; //0.05;

    var boldLinesCountX = Math.ceil(deltaX / this.dstncBtwnGridLinesBold);
    var boldLinesCountY = Math.ceil(deltaY / this.dstncBtwnGridLinesBold);

    var maxLinesPerDrawing = 50;
    if (Math.max(boldLinesCountX, boldLinesCountY) > maxLinesPerDrawing) {
      return group;
    }

    var linePos: number = 0;

    for (
      linePos = this.startingX;
      linePos <= this.endingX;
      linePos += this.dstncBtwnGridLinesBold
    ) {
      var boldLine = this.drawSvgVerticalLine(linePos, gridStrokeWidth, true);
      boldLine.addTo(group);

      if (this.showDecimalsGrid) {
        var thinLines = this.drawThinLinesDecimal(
          linePos,
          false,
          gridStrokeWidth
        );
        thinLines.addTo(group);
      }

      if (this.showMilimeterPaperGrid) {
        var thinLines = this.drawThinLinesMilimeterPaper(
          linePos,
          false,
          gridStrokeWidth
        );
        thinLines.addTo(group);
      }
    }

    for (
      linePos = this.startingY;
      linePos <= this.endingY;
      linePos += this.dstncBtwnGridLinesBold
    ) {
      var boldLine = this.drawSvgHorizontalLine(linePos, gridStrokeWidth, true);
      boldLine.addTo(group);

      if (this.showDecimalsGrid) {
        var thinLines = this.drawThinLinesDecimal(
          linePos,
          true,
          gridStrokeWidth
        );
        thinLines.addTo(group);
      }

      if (this.showMilimeterPaperGrid) {
        var thinLines = this.drawThinLinesMilimeterPaper(
          linePos,
          true,
          gridStrokeWidth
        );
        thinLines.addTo(group);
      }
    }
    return group;
  }

  private drawThinLinesMilimeterPaper(
    startingPos: number,
    isHorizontal: boolean,
    gridStrokeWidth: number
  ) {
    var group = SVG().group();
    var dstncBtwnGridLinesThin = this.dstncBtwnGridLinesBold / 4;
    var dstncBtwnGridLinesXtrThin = dstncBtwnGridLinesThin / 10;

    for (
      var linePos = startingPos;
      linePos < startingPos + this.dstncBtwnGridLinesBold;
      linePos += dstncBtwnGridLinesThin
    ) {
      if (linePos > startingPos) {
        var line = isHorizontal
          ? this.drawSvgHorizontalLine(linePos, gridStrokeWidth / 2, false)
          : this.drawSvgVerticalLine(linePos, gridStrokeWidth / 2, false);
        line.addTo(group);
      }
      for (
        var eThinlinePos = linePos + dstncBtwnGridLinesXtrThin;
        eThinlinePos < linePos + dstncBtwnGridLinesThin;
        eThinlinePos += dstncBtwnGridLinesXtrThin
      ) {
        var line = isHorizontal
          ? this.drawSvgHorizontalLine(eThinlinePos, gridStrokeWidth / 4, false)
          : this.drawSvgVerticalLine(eThinlinePos, gridStrokeWidth / 4, false);
        line.addTo(group);
      }
    }
    return group;
  }

  private drawThinLinesDecimal(
    startingPos: number,
    isHorizontal: boolean,
    gridStrokeWidth: number
  ) {
    var group = SVG().group();
    var dstncBtwnGridLinesThin = this.dstncBtwnGridLinesBold / 10;

    for (
      var linePos = startingPos;
      linePos < startingPos + this.dstncBtwnGridLinesBold;
      linePos += dstncBtwnGridLinesThin
    ) {
      if (linePos > startingPos) {
        var line = isHorizontal
          ? this.drawSvgHorizontalLine(linePos, gridStrokeWidth / 2, false)
          : this.drawSvgVerticalLine(linePos, gridStrokeWidth / 2, false);
        line.addTo(group);
      }
    }
    return group;
  }

  private drawPolarLine(
    polarOriginPoint: tLocationPointGrid,
    lineDirectionMil: number,
    displayName: string,
    color: string
  ) {
    var smallAngleMil = lineDirectionMil % 1600;
    var quadrant = Math.floor(lineDirectionMil / 1600);
    quadrant = quadrant % 4;

    var lineEndingPoint: tLocationPointGrid | null = null;

    var topMarginNorth = this.maxY + this.dstncBtwnGridLinesBold;
    var botomMarginNorth = this.minY - this.dstncBtwnGridLinesBold;
    var leftMarginEast = this.minX - this.dstncBtwnGridLinesBold;
    var rightMarginEast = this.maxX + this.dstncBtwnGridLinesBold;

    if (quadrant == 0) {
      var adjacentNorth = polarOriginPoint.north - botomMarginNorth;
      var opositeEast = this.opositeFromAdjacent(adjacentNorth, smallAngleMil);

      lineEndingPoint = {
        east: polarOriginPoint.east - opositeEast,
        north: botomMarginNorth,
      };
    }

    if (quadrant == 1) {
      var adjacentEast = polarOriginPoint.east - leftMarginEast;
      var opositeNorth = this.opositeFromAdjacent(adjacentEast, smallAngleMil);

      lineEndingPoint = {
        east: leftMarginEast,
        north: polarOriginPoint.north + opositeNorth,
      };
    }

    if (quadrant == 2) {
      var adjacentNorth = topMarginNorth - polarOriginPoint.north;
      var opositeEast = this.opositeFromAdjacent(adjacentNorth, smallAngleMil);

      lineEndingPoint = {
        east: polarOriginPoint.east + opositeEast,
        north: topMarginNorth,
      };
    }

    if (quadrant == 3) {
      var adjacentEast = rightMarginEast - polarOriginPoint.east;
      var opositeNorth = this.opositeFromAdjacent(adjacentEast, smallAngleMil);

      lineEndingPoint = {
        east: rightMarginEast,
        north: polarOriginPoint.north - opositeNorth,
      };
    }

    var group = SVG().group();
    if (lineEndingPoint != null) {
      var line = this.createCustomLineSvg(
        polarOriginPoint,
        lineEndingPoint,
        color,
        this.boldLineWidth / 4,
        null,
        displayName
      );
      line.addTo(group);
    }
    return group;
  }

  private opositeFromAdjacent(adjacent: number, angleMil: number) {
    var angleRad = CoordTransformFunctions.mil2rad(angleMil);
    return adjacent * Math.tan(angleRad);
  }

  private drawSvgHorizontalLine(
    linePos: number,
    strokeWidth: number,
    showLineNum: boolean
  ) {
    var group = SVG().group();

    // varbūt labāk sataisīt šī slīnijas bezgala garas - tām nevajag minX, max X bet tika ļooooti milzīgu +/- skaitli
    var leftX = this.minX - this.dstncBtwnGridLinesBold;
    var rightX = this.maxX + this.dstncBtwnGridLinesBold;

    group
      .line(leftX, -linePos, rightX, -linePos)
      .stroke({ color: "rgb(0,255,0)", width: strokeWidth });

    if (showLineNum) {
      var nearStartX = Math.ceil(
        this.startingX + this.dstncBtwnGridLinesBold / 6
      );
      var displayLineNum = linePos < 1000 ? linePos : linePos / 1000;

      group
        .text(displayLineNum.toString())
        .x(nearStartX)
        .y(-linePos)
        .font({ size: this.fontSize });
    }

    return group;
  }

  private drawSvgVerticalLine(
    linePos: number,
    strokeWidth: number,
    showLineNum: boolean
  ) {
    var group = SVG().group();

    var topY = this.maxY + this.dstncBtwnGridLinesBold;
    var botomY = this.minY - this.dstncBtwnGridLinesBold;

    group
      .line(linePos, -topY, linePos, -botomY)
      .stroke({ color: "rgb(0,255,0)", width: strokeWidth });

    if (showLineNum) {
      var nearStartY = Math.floor(
        this.startingY + this.dstncBtwnGridLinesBold / 6
      );
      var displayLineNum = linePos < 1000 ? linePos : linePos / 1000;

      group
        .text(displayLineNum.toString())
        .x(linePos)
        .y(-nearStartY)
        .font({ size: this.fontSize });
    }
    return group;
  }

  private createCustomLineSvg(
    location1: tLocationPointGrid,
    location2: tLocationPointGrid,
    color: string,
    strokeWidth: number,
    opacity: number | null = null,
    displayName: string = ""
  ) {
    var group = SVG().group();
    var line = group
      .line(location1.east, -location1.north, location2.east, -location2.north)
      .stroke({ color: color, width: strokeWidth });
    if (opacity != null) {
      line.opacity(opacity);
    }

    var lineMidlePoint: tLocationPointGrid = {
      east: (location1.east + location2.east) / 2,
      north: (location1.north + location2.north) / 2,
    };

    if (displayName) {
      group
        .text(displayName)
        .x(lineMidlePoint.east + this.locPointRadius)
        .y(-lineMidlePoint.north - this.locPointRadius)
        .font({ size: this.fontSize });
    }

    return group;
  }
}

type tMinMax = { min: number; max: number };
type tMapMargins = { x: tMinMax; y: tMinMax };
