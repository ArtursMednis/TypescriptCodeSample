import {
  tLocationPointGrid,
  tCorrection,
  tPolarPointer,
  tGeodetic,
} from "./interfaces";
import * as mgrsLib from "./mgrsLib";

export class CoordTransformFunctions {
  static readonly milsInDeg = 160 / 9;

  static GetPoint1ToPoint2InPolar(
    point1: tLocationPointGrid,
    point2: tLocationPointGrid
  ): tPolarPointer {
    if (
      point2.gridZoneId &&
      point1.gridZoneId &&
      point2.gridZoneId != point1.gridZoneId
    ) {
      return this.GetPoint1ToPoint2InPolarDiferentGridZones(point1, point2);
    }

    var dEast = point2.east - point1.east;
    var dNorth = point2.north - point1.north;

    var distance = Math.sqrt(dEast * dEast + dNorth * dNorth);

    var radiansZtoE = Math.atan2(dEast, dNorth);

    return { radius: distance, radians: radiansZtoE };
  }

  static GetPoint1ToPoint2InPolarDiferentGridZones(
    point1: tLocationPointGrid,
    point2: tLocationPointGrid
  ): tPolarPointer {
    var mgrsStr1 =
      point1.gridZoneId +
      Math.round(point1.east).toString() +
      Math.round(point1.north).toString();
    try {
      var lonLat = mgrsLib.toPoint(mgrsStr1);
      point1.latitude = lonLat[1];
      point1.longitude = lonLat[0];
    } catch (ex) {
      console.log("Error converting MGRS " + mgrsStr1);
      return { radius: NaN, radians: NaN };
    }

    // console.log("point1: mgrs: " + mgrsStr1 + " lat: " + point1.latitude + " lon: " + point1.longitude);

    var mgrsStr2 =
      point2.gridZoneId +
      Math.round(point2.east).toString() +
      Math.round(point2.north).toString();
    try {
      var lonLat = mgrsLib.toPoint(mgrsStr2);
      point2.latitude = lonLat[1];
      point2.longitude = lonLat[0];
    } catch (ex) {
      console.log("Error converting MGRS " + mgrsStr2);
      return { radius: NaN, radians: NaN };
    }
    // console.log("point2: mgrs: " + mgrsStr2 + " lat: " + point2.latitude + " lon: " + point2.longitude);

    var distDir =
      GeoDistanceCalculator.getLocalDistanceAndDirectionBetweenPoints(
        { latitude: point1.latitude, longitude: point1.longitude },
        { latitude: point2.latitude, longitude: point2.longitude }
      );

    return { radius: distDir.distacne, radians: distDir.direction };
  }

  static ShiftPoint(
    startingPoint: tLocationPointGrid,
    shiftGrid: tCorrection,
    pointerAngleRadians: number
  ): tLocationPointGrid {
    var shiftAngle = Math.atan2(shiftGrid.right, shiftGrid.add);
    var shiftedAngle = pointerAngleRadians + shiftAngle;

    var shiftedDistance = Math.sqrt(
      shiftGrid.add * shiftGrid.add + shiftGrid.right * shiftGrid.right
    );

    var shiftedPoint = this.GetPointingLocationFromPoint1(startingPoint, {
      radius: shiftedDistance,
      radians: shiftedAngle,
    });
    return shiftedPoint;
  }

  static GetPointingLocationFromPoint1(
    point1: tLocationPointGrid,
    pointer: tPolarPointer
  ): tLocationPointGrid {
    var dEast = pointer.radius * Math.sin(pointer.radians);
    var dNorth = pointer.radius * Math.cos(pointer.radians);

    var pointingLocation: tLocationPointGrid = {
      east: dEast + point1.east,
      north: dNorth + point1.north,
      gridZoneId: point1.gridZoneId,
    };
    return pointingLocation;
  }

  static rad2mil(radians: number): number {
    var degrees = this.rad2deg(radians);
    var miljens = degrees * (this.milsInDeg + Number.EPSILON);
    return miljens;
  }

  static rad2deg(radians: number): number {
    var degrees = (radians * 180) / Math.PI;
    if (degrees < 0) {
      degrees = degrees + 360;
    }
    return degrees;
  }

  static deg2rad(degrees: number): number {
    var radians = (degrees * Math.PI) / 180;
    return radians;
  }

  static mil2rad(miljens: number): number {
    var degrees = miljens / (this.milsInDeg - Number.EPSILON);
    var radians = this.deg2rad(degrees);
    return radians;
  }

  static extractLatLong(
    locationPoint?: tLocationPointGrid,
    defaultGridZone?: string
  ): [number, number] | null {
    if (locationPoint == null) {
      return null;
    }

    var gridZone = locationPoint.gridZoneId ?? defaultGridZone;

    if (gridZone == null) {
      return null;
    }

    var mgrsStrReal =
      gridZone +
      Math.round(locationPoint.east).toString() +
      Math.round(locationPoint.north).toString();

    try {
      var lonLatReal = mgrsLib.toPoint(mgrsStrReal);
      return [lonLatReal[1], lonLatReal[0]];
    } catch (ex) {
      console.log("Error calculating LatLon from " + mgrsStrReal + " " + ex);
      return null;
    }
  }
}

export class GeoDistanceCalculator {
  static getLocalDistanceAndDirectionBetweenPoints(
    geodetic1: tGeodetic,
    geodetic2: tGeodetic
  ) {
    var ecef1 = this.geodeticToECEF(geodetic1);
    var ecef2 = this.geodeticToECEF(geodetic2);

    var difference12Ecef = [
      [ecef2.X - ecef1.X],
      [ecef2.Y - ecef1.Y],
      [ecef2.Z - ecef1.Z],
    ];
    var DCM_ef = this.getDCM(geodetic1);
    var localDiffNED = this.matrixMultiply(DCM_ef, difference12Ecef);
    var distance = Math.sqrt(
      localDiffNED[0][0] * localDiffNED[0][0] +
        localDiffNED[1][0] * localDiffNED[1][0]
    );
    var direction = Math.atan2(localDiffNED[1][0], localDiffNED[0][0]);
    var polarData = {
      distacne: distance,
      direction: direction,
      verticalDistance: -localDiffNED[2][0],
    };
    return polarData;
  }

  static geodeticToECEF(geodetic: tGeodetic) {
    var latRad = (geodetic.latitude * Math.PI) / 180;
    var lonRad = (geodetic.longitude * Math.PI) / 180;
    var cosLat = Math.cos(latRad);
    var sinLat = Math.sin(latRad);
    var cosLon = Math.cos(lonRad);
    var sinLon = Math.sin(lonRad);
    var a = 6378000; //equatorial radius (semi-major axis)
    var b = 6357000; //polar radius (semi-minor axis)
    var height = geodetic.height ? geodetic.height : 0;
    var N =
      (a * a) / Math.sqrt(a * a * cosLat * cosLat + b * b * sinLat * sinLat);
    var X = (N + height) * cosLat * cosLon;
    var Y = (N + height) * cosLat * sinLon;
    var Z = ((N * b * b) / (a * a) + height) * sinLat;
    //console.log(geodetic.latitude + ":" + geodetic.longitude+ " -> " + "N:" +N + " X:" +X + " Y:"+Y + " Z:" +Z);
    return { X: X, Y: Y, Z: Z };
  }

  static getDCM(geodetic: tGeodetic) {
    var latRad = (geodetic.latitude * Math.PI) / 180;
    var lonRad = (geodetic.longitude * Math.PI) / 180;
    var cosLat = Math.cos(latRad);
    var sinLat = Math.sin(latRad);
    var cosLon = Math.cos(lonRad);
    var sinLon = Math.sin(lonRad);
    var DCM = [
      [-sinLat * cosLon, -sinLat * sinLon, cosLon],
      [-sinLon, cosLon, 0],
      [-cosLat * cosLon, -cosLat * sinLon, -sinLat],
    ];
    return DCM;
  }

  static matrixMultiply(a: any[], b: any[]) {
    var aNumRows = a.length,
      aNumCols = a[0].length,
      bNumCols = b[0].length,
      m = new Array(aNumRows); // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0; // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }
}
