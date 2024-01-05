export type tLocationPointGrid = {
  east: number;
  north: number;
  gridZoneId?: string;
  latitude?: number;
  longitude?: number;
};
export type tCorrection = {
  right: number;
  add: number;
  up?: number;
  changedOtLineMil?: number;
};
export type tPolarPointer = { radius: number; radians: number };
export type tGeodetic = {
  latitude: number;
  longitude: number;
  height?: number;
};

export type tFiringDataLineOutput = {
  distanceMeters: number;
  elevationMil: number;
  directionMil: number;
  grid: tLocationPointGrid;
  timeOfFlightSeconds: number;
  outsideSafetyArcs: boolean;
  fuzeSetting?: number;
  endVelocity?: number; //, searchAndTraverse:tSearchAndTraverseOutput
};

export type tSearchAndTraverseOutput = {
  downCount: number;
  upCount: number;
  traverseDirectionMil: number;
  traverseDirectionRotations: number;
  searchElevationMil: number;
  searchElevationRotations: number;
  directionFirst: number;
  directionLast: number;
  directionDif: number;
  elevationFirst: number;
  elevationLast: number;
  elevationDiff: number;
  message: string;
};

export type tLinearTargetProperties = {
  AttitudeMil: number;
  Length: number;
  SubTargetCount: number;
  searchAndTraverse?: boolean;
};

export enum TargetMethod {
  grid = "grid",
  polar = "polar",
  shift = "shift",
}

export interface iSelectableOption {
  id: string,
  name: string
}