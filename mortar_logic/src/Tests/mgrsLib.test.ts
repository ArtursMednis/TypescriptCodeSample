import * as mgrs from "../mgrsLib";

/*
https://github.com/proj4js/mgrs/blob/master/test/test.js
*/

describe('First MGRS set', () => {
  const mgrsStr = '33UXP04';
  const point = mgrs.toPoint(mgrsStr);
  it('Longitude of point from MGRS correct.', () => {
    expect(point[0]).toBeCloseTo(16.41450, 0.000001);
  });
  it('Latitude of point from MGRS correct.', () => {
    expect(point[1]).toBeCloseTo(48.24949, 0.000001);
  });
  it('MGRS reference with highest accuracy correct.', () => {
    expect(mgrs.forward(point)).toBe('33UXP0500444997');
  });
  it('MGRS reference with 1-digit accuracy correct.', () => {
    expect(mgrs.forward(point,1)).toBe(mgrsStr);
  });
  it('MGRS reference with 0-digit accuracy correct.', () => {
    expect(mgrs.forward(point, 0)).toBe('33UXP');
  });
});

describe('Second MGRS set', () => {
  const mgrsStr = '24XWT783908'; // near UTM zone border, so there are two ways to reference this
  const point = mgrs.toPoint(mgrsStr);
  it('Longitude of point from MGRS correct.', () => {
    expect(point[0]).toBeCloseTo(-32.66433, 0.00001);
  });
  it('Latitude of point from MGRS correct.', () => {
    expect(point[1]).toBeCloseTo(83.62778, 0.00001);
  });
  it('MGRS reference with 3-digit accuracy correct.', () => {
    expect(mgrs.forward(point,3)).toBe('25XEN041865');
  });
  it('MGRS reference with 5-digit accuracy, northing all zeros', () => {
    expect(mgrs.forward([0,0],5)).toBe('31NAA6602100000');
  });
  it('MGRS reference with 5-digit accuracy, northing one digit', () => {
    expect(mgrs.forward([0,0.00001],5)).toBe('31NAA6602100001');
  });
  it('MGRS reference with 0-digit accuracy correct.', () => {
    expect(mgrs.forward(point, 0)).toBe('25XEN');
  });
});

describe ('third mgrs set', () => {
  const mgrsStr = '11SPA7234911844';
  const point: [number, number] = [-115.0820944, 36.2361322];
  it('MGRS reference with highest accuracy correct.', () => {
    expect(mgrs.forward(point)).toBe(mgrsStr);
  });
  it('MGRS reference with 0-digit accuracy correct.', () => {
    expect(mgrs.forward(point, 0)).toBe('11SPA');
  });
});

describe ('data validation', () => {
  describe('toPoint function', () => {
    it('toPoint throws an error when a blank string is passed in', () => {
      try {
        mgrs.toPoint('');
      } catch (error:any) {
        expect(error.message).toBe('toPoint received a blank string');
      }
    });
    it('toPoint should return the same result whether or not spaces are included in the MGRS String', () => {
      const [ lon1, lat1 ] = mgrs.toPoint('4QFJ 12345 67890');
      const [ lon2, lat2]  = mgrs.toPoint('4QFJ1234567890');
      expect(lat1).toBe(lat2);
      expect(lon1).toBe(lon2);
    });
  });
  describe('forward function', () => {
    it('forward throws an error when longitude is outside bounds', () => {
      try {
        mgrs.forward([90, 180]);
      } catch (error:any) {
        expect(error.message).toBe('forward received an invalid latitude of 180');
      }
    });
    it('forward throws an error when latitude is outside bounds', () => {
      try {
        mgrs.forward([90, 270]);
      } catch (error:any) {
        expect(error.message).toBe('forward received an invalid latitude of 270');
      }
    });
    it('forward throws an error when latitude is near the north pole', () => {
      try {
        mgrs.forward([45, 88]);
      } catch (error:any) {
        expect(error.message).toBe('forward received a latitude of 88, but this library does not support conversions of points in polar regions below 80°S and above 84°N');
      }
    });
    it('forward throws an error when latitude is near the south pole', () => {
      try {
        mgrs.forward([45, -88]);
      } catch (error:any) {
        expect(error.message).toBe('forward received a latitude of -88, but this library does not support conversions of points in polar regions below 80°S and above 84°N');
      }
    });
  });
  describe('getLetterDesignator', () => {
    it('should return Z when latitude band is outside latitude handled by library', () => {
      const latitude = -83.3026329741;
      const letter = mgrs.getLetterDesignator(latitude);
      expect(letter).toBe('Z');
    });
  });
});

