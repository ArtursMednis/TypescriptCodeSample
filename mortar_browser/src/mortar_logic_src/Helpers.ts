import { tCorrection, tLocationPointGrid } from "./interfaces";

export class Helpers {
  static RandomId() {
    return Math.random().toString(36).slice(2);
  }

  static makeAngleNarrowMil(inputAngleMil: number): number {
    var angleMil = inputAngleMil % 6400;
    if (angleMil > 3200) angleMil = angleMil - 6400;

    if (inputAngleMil < -3200) angleMil = angleMil + 6400;

    return angleMil;
  }

  //wrtten by ChatGPT
  static formatDateToDTG(date?: Date|null) {
    if(!date){
      return "";
    }

    function padWithZero(num: number) {
      return num < 10 ? `0${num}` : `${num}`;
    }

    const day = padWithZero(date.getUTCDate());
    const hours = padWithZero(date.getUTCHours());
    const minutes = padWithZero(date.getUTCMinutes());
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const dtgString = `${day}${hours}${minutes}Z ${month} ${year}`;

    return dtgString;
  }

  static valueIfPositive(input: number | undefined | null) {
    if (input == undefined || input == null) {
      return 0;
    }

    return input > 0 ? input : 0;
  }

  static numericToRoundedString(num: number | undefined) {
    if (num == null || Number.isNaN(num)) {
      return " - ";
    }

    return Math.round(num).toString();
  }

  static numericTo1DecimalString(num: number | undefined) {
    if (num == null || Number.isNaN(num)) {
      return " - ";
    }

    return (Math.round(num * 10) / 10).toString();
  }

  static numericToMilString(num: number | undefined) {
    if (num == null || Number.isNaN(num)) {
      return " - ";
    }

    var roundedAsString = Math.round(num).toString();

    if (roundedAsString.length < 4) {
      const numZeros = 4 - roundedAsString.length;
      roundedAsString = "0".repeat(numZeros) + roundedAsString;
    }

    roundedAsString =
      roundedAsString.slice(0, roundedAsString.length - 2) +
      "-" +
      roundedAsString.slice(roundedAsString.length - 2);

    return roundedAsString;
  }

  static formatLocationGrid(location?: tLocationPointGrid|null) {
    if (!location) {
      return "";
    }

    if (
      location?.east == null ||
      Number.isNaN(location?.east) ||
      location?.north == null ||
      Number.isNaN(location?.north)
    ) {
      return "";
    }

    var eastRoundedStr = Math.round(location.east).toString();
    var nortRoundedStr = Math.round(location.north).toString();

    var east = this.formatValueToExpectedDigitCount(eastRoundedStr, 5);
    var north = this.formatValueToExpectedDigitCount(nortRoundedStr, 5);

    var locationFormated = (
      location?.gridZoneId +
      " " +
      east +
      " " +
      north
    ).trim();

    return locationFormated;
  }

  static formatValueToExpectedDigitCount(
    inputString?: string,
    expectedDigitsCount?: number
  ) {
    if (!inputString) {
      return "";
    }

    if (!expectedDigitsCount) {
      return inputString;
    }

    const [integerPart, decimalPart] = inputString.split(".");

    if ((integerPart?.length ?? 0) < expectedDigitsCount) {
      const numberOfZerosToAdd =
        expectedDigitsCount - (integerPart?.length ?? 0);
      const zeros = "0".repeat(numberOfZerosToAdd);
      const formattedIntegerPart = zeros + integerPart;
      const formattedResult =
        decimalPart !== undefined
          ? `${formattedIntegerPart}.${decimalPart}`
          : formattedIntegerPart;
      return formattedResult;
    } else {
      return inputString;
    }
  }

  static formatDate(inputDate?:Date|null){
    if(!inputDate){
      return "";
    }
    var dateFormated =
        ((inputDate.getDate() > 9) ? inputDate.getDate() : ('0' + inputDate.getDate()))
        + '.' +
        ((inputDate.getMonth() > 8) ? (inputDate.getMonth() + 1) : ('0' + (inputDate.getMonth() + 1)))
        + '.' +
        inputDate.getFullYear();

      return dateFormated;
  }

  static latLon2MGRS(Lat: number, Long: number): tLocationPointGrid {
    //if (Lat < -80) return 'Too far South' ; if (Lat > 84) return 'Too far North' ;
    if (Lat < -80 || Lat > 84) return { east: NaN, north: NaN };
    var c = 1 + Math.floor((Long + 180) / 6);
    var e = c * 6 - 183;
    var k = (Lat * Math.PI) / 180;
    var l = (Long * Math.PI) / 180;
    var m = (e * Math.PI) / 180;
    var n = Math.cos(k);
    var o = 0.006739496819936062 * Math.pow(n, 2);
    var p = 40680631590769 / (6356752.314 * Math.sqrt(1 + o));
    var q = Math.tan(k);
    var r = q * q;
    //var s = (r*r*r) - Math.pow (q,6);
    var t = l - m;
    var u = 1.0 - r + o;
    var v = 5.0 - r + 9 * o + 4.0 * (o * o);
    var w = 5.0 - 18.0 * r + r * r + 14.0 * o - 58.0 * r * o;
    var x = 61.0 - 58.0 * r + r * r + 270.0 * o - 330.0 * r * o;
    var y = 61.0 - 479.0 * r + 179.0 * (r * r) - r * r * r;
    var z = 1385.0 - 3111.0 * r + 543.0 * (r * r) - r * r * r;
    var aa =
      p * n * t +
      (p / 6.0) * Math.pow(n, 3) * u * Math.pow(t, 3) +
      (p / 120.0) * Math.pow(n, 5) * w * Math.pow(t, 5) +
      (p / 5040.0) * Math.pow(n, 7) * y * Math.pow(t, 7);
    var ab =
      6367449.14570093 *
        (k -
          0.00251882794504 * Math.sin(2 * k) +
          0.00000264354112 * Math.sin(4 * k) -
          0.00000000345262 * Math.sin(6 * k) +
          0.000000000004892 * Math.sin(8 * k)) +
      (q / 2.0) * p * Math.pow(n, 2) * Math.pow(t, 2) +
      (q / 24.0) * p * Math.pow(n, 4) * v * Math.pow(t, 4) +
      (q / 720.0) * p * Math.pow(n, 6) * x * Math.pow(t, 6) +
      (q / 40320.0) * p * Math.pow(n, 8) * z * Math.pow(t, 8);
    aa = aa * 0.9996 + 500000.0;
    ab = ab * 0.9996;
    if (ab < 0.0) ab += 10000000.0;
    var ad = "CDEFGHJKLMNPQRSTUVWXX".charAt(Math.floor(Lat / 8 + 10));
    var ae = Math.floor(aa / 100000);
    //console.log("aa:" + aa + " ae:" + ae);
    var af = ["ABCDEFGH", "JKLMNPQR", "STUVWXYZ"][(c - 1) % 3]!.charAt(ae - 1);
    var ag = Math.floor(ab / 100000) % 20;
    var ah = ["ABCDEFGHJKLMNPQRSTUV", "FGHJKLMNPQRSTUVABCDE"][
      (c - 1) % 2
    ]!.charAt(ag);

    //@ts-ignore
    function pad(val) {
      if (val < 10) {
        val = "0000" + val;
      } else if (val < 100) {
        val = "000" + val;
      } else if (val < 1000) {
        val = "00" + val;
      } else if (val < 10000) {
        val = "0" + val;
      }
      return val;
    }
    aa = Math.floor(aa % 100000);
    aa = pad(aa);
    ab = Math.floor(ab % 100000);
    ab = pad(ab);

    //>
    //var pretyString2 = c +"-"+ ad + ' - ' + af +"-"+ ah + ' --- ' + aa + ' ' + ab;
    //console.log(pretyString2);
    //<

    return {
      east: Number(aa),
      north: Number(ab),
      gridZoneId: c + ad + af + ah,
      latitude: Lat,
      longitude: Long,
    };

    //@ts-ignore
    //var pretyString = c + ad + ' ' + af + ah + ' ' + aa + ' ' + ab;
  }

  static displayCorrection(correction: tCorrection | null): string {
    if (correction == null) {
      return "";
    }

    var correctionOutputParts: string[] = [];

    if (correction.add > 0) {
      correctionOutputParts.push("ADD: " + correction.add.toString());
    }

    if (correction.add < 0) {
      correctionOutputParts.push("DROP: " + (-correction.add).toString());
    }

    if (correction.right > 0) {
      correctionOutputParts.push("RIGHT: " + correction.right.toString());
    }

    if (correction.right < 0) {
      correctionOutputParts.push("LEFT: " + (-correction.right).toString());
    }

    if ((correction.up ?? 0) > 0) {
      correctionOutputParts.push("UP: " + correction.up?.toString());
    }

    if ((correction.up ?? 0) < 0) {
      correctionOutputParts.push("DOWN: " + (-(correction.up ?? 0)).toString());
    }

    if (
      correction.changedOtLineMil != null &&
      !Number.isNaN(correction.changedOtLineMil)
    ) {
      correctionOutputParts.push(
        "Changed OT: " + correction.changedOtLineMil?.toString()
      );
    }

    return correctionOutputParts.join(" ");
  }

  // static calcDistanceBetweenMgrsSectors(sector1:string, sector2:string){
  //     //
  //     AbuSektoru_0_0_Kordinātu_Pārvērst_uz_Lat_Lon_un_pielietot_formulu_ko_es_jau_zinu();
  //     JaAttālumuNevarNoapaļotUz_100000_bez_zuduma_tad_informēt_par_kļūdu();
  // }
}
