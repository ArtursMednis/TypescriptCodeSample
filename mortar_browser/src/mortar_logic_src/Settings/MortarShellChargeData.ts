import { Helpers } from "../Helpers";
import { iSelectableOption } from "../interfaces";

export class MortarShellChargeData implements iSelectableOption {
  id = Helpers.RandomId();
  name: string = "";
  chargeLookupTableLines: ChargeLookupTableLine[] = [];

  //Created by chatGpt
  getElevationForDistance(distance: number): number {
    var lookupTable = this.chargeLookupTableLines;
    // Find the two closest entries in the lookup table
    let lowerBound = null;
    let upperBound = null;

    for (var entry of lookupTable) {
      if (entry.distance <= distance) {
        lowerBound = entry;
      }
      if (entry.distance >= distance) {
        upperBound = entry;
        break;
      }
    }

    if (upperBound == null || lowerBound == null) {
      return NaN;
    }

    if (upperBound.distance == lowerBound.distance) {
      return upperBound.elevation;
    }

    // Perform linear interpolation
    const distanceDiff = upperBound.distance - lowerBound!.distance;
    const elevationDiff = upperBound.elevation - lowerBound!.elevation;
    const interpolationRatio = (distance - lowerBound!.distance) / distanceDiff;
    const interpolatedElevation =
      lowerBound!.elevation + interpolationRatio * elevationDiff;

    return interpolatedElevation;
  }

  getTimeOfFlightForDistance(distance: number): number {
    var lookupTable = this.chargeLookupTableLines;

    let lowerBound = null;
    let upperBound = null;

    for (var entry of lookupTable) {
      if (entry.distance <= distance) {
        lowerBound = entry;
      }
      if (entry.distance >= distance) {
        upperBound = entry;
        break;
      }
    }

    if (upperBound == null || lowerBound == null) {
      return NaN;
    }

    if (
      upperBound?.timeOfFlightSeconds == null ||
      lowerBound?.timeOfFlightSeconds == null
    ) {
      return NaN;
    }

    if (upperBound.distance == lowerBound.distance) {
      return upperBound?.timeOfFlightSeconds;
    }

    const distanceDiff = upperBound.distance - lowerBound.distance;
    const timeOfFlightSecondsDiff =
      upperBound?.timeOfFlightSeconds - lowerBound?.timeOfFlightSeconds;
    const interpolationRatio = (distance - lowerBound.distance) / distanceDiff;
    const interpolatedTimeOfFlight =
      lowerBound?.timeOfFlightSeconds +
      interpolationRatio * timeOfFlightSecondsDiff;

    return interpolatedTimeOfFlight;
  }

  getEndVelocityForDistance(distance: number): number {
    var lookupTable = this.chargeLookupTableLines;

    let lowerBound = null;
    let upperBound = null;

    for (var entry of lookupTable) {
      if (entry.distance <= distance) {
        lowerBound = entry;
      }
      if (entry.distance >= distance) {
        upperBound = entry;
        break;
      }
    }

    if (upperBound == null || lowerBound == null) {
      return NaN;
    }

    if (upperBound?.endVelocity == null || lowerBound?.endVelocity == null) {
      return NaN;
    }

    if (upperBound.distance == lowerBound.distance) {
      return upperBound?.endVelocity;
    }

    const distanceDiff = upperBound.distance - lowerBound.distance;
    const endVelocityDiff = upperBound?.endVelocity - lowerBound?.endVelocity;
    const interpolationRatio = (distance - lowerBound.distance) / distanceDiff;
    const interpolatedEndVelocity =
      lowerBound?.endVelocity + interpolationRatio * endVelocityDiff;

    return interpolatedEndVelocity;
  }
}

export class ChargeLookupTableLine {
  distance: number = 0;
  elevation: number = 0;
  timeOfFlightSeconds?: number = NaN;
  maximumOrdinate?: number = NaN;
  endVelocity?: number = NaN;
}
