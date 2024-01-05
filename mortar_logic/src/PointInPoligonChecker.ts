// This class is curently unused but it can be useful if needed to set some restricted area

// code adapted from    https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/

import { tLocationPointGrid } from "./interfaces";

class Point {
  x: number;
  y: number;
  //int x, y;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class line {
  p1: Point;
  p2: Point;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

function onLine(l1: line, p: Point) {
  // Check whether p is on the line or not
  if (
    p.x <= Math.max(l1.p1.x, l1.p2.x) &&
    p.x >= Math.min(l1.p1.x, l1.p2.x) &&
    p.y <= Math.max(l1.p1.y, l1.p2.y) &&
    p.y >= Math.min(l1.p1.y, l1.p2.y)
  )
    return true;

  return false;
}

function direction(a: Point, b: Point, c: Point) {
  let val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);

  if (val == 0)
    // Collinear
    return 0;
  else if (val < 0)
    // Anti-clockwise direction
    return 2;

  // Clockwise direction
  return 1;
}

function isIntersect(l1: line, l2: line) {
  // Four direction for two lines and points of other line
  let dir1 = direction(l1.p1, l1.p2, l2.p1);
  let dir2 = direction(l1.p1, l1.p2, l2.p2);
  let dir3 = direction(l2.p1, l2.p2, l1.p1);
  let dir4 = direction(l2.p1, l2.p2, l1.p2);

  // When intersecting
  if (dir1 != dir2 && dir3 != dir4) return true;

  // When p2 of line2 are on the line1
  if (dir1 == 0 && onLine(l1, l2.p1)) return true;

  // When p1 of line2 are on the line1
  if (dir2 == 0 && onLine(l1, l2.p2)) return true;

  // When p2 of line1 are on the line2
  if (dir3 == 0 && onLine(l2, l1.p1)) return true;

  // When p1 of line1 are on the line2
  if (dir4 == 0 && onLine(l2, l1.p2)) return true;

  return false;
}

function checkInside(poly: Point[], n: number, p: Point) {
  // When polygon has less than 3 edge, it is not polygon
  if (n < 3) return false;

  // Create a point at infinity, y is same as point p
  //let tmp=new Point(Number.POSITIVE_INFINITY, p.y);
  let tmp = new Point(999999999999, p.y);
  let exline = new line(p, tmp);
  let count = 0;
  let i = 0;
  do {
    // Forming a line from two consecutive points of
    // poly
    let side = new line(poly[i]!, poly[(i + 1) % n]!);
    if (isIntersect(side, exline)) {
      // If side is intersects exline
      if (direction(side.p1, p, side.p2) == 0) return onLine(side, p);
      count++;
    }
    i = (i + 1) % n;
  } while (i != 0);

  // When count is odd
  return count & 1;
}

//@ts-ignore
function example() {
  // Driver code
  let polygon = [
    new Point(0, 0),
    new Point(10, 0),
    new Point(10, 10),
    new Point(0, 10),
  ];
  let p = new Point(5, 3);
  let n = 4;

  // Function call
  if (checkInside(polygon, n, p)) console.log("Point is inside.");
  else console.log("Point is outside.");
}

export function checkIfLocationPointBelongsToQuadrilateral(
  locationGrid: tLocationPointGrid,
  area: [
    tLocationPointGrid,
    tLocationPointGrid,
    tLocationPointGrid,
    tLocationPointGrid
  ]
) {
  var locationAsPoint = new Point(locationGrid.east, locationGrid.north);

  var areaPoints: Point[] = area.map(
    (areaGridPoint) => new Point(areaGridPoint.east, areaGridPoint.north)
  );

  if (checkInside(areaPoints, 4, locationAsPoint)) {
    return true;
  } else {
    return false;
  }

  //
}
