import { MortarShellChargeData } from "../../mortar_logic_src/Settings/MortarShellChargeData" // "../MortarShellChargeData";
import { MortarShellData } from "../../mortar_logic_src/Settings/MortarShellData";

var charge0 = new MortarShellChargeData();
charge0.name = "Charge 0";
charge0.id = "M48_120_HE_ch0";
charge0.chargeLookupTableLines = [
    {distance:  300 , elevation:  1467 , timeOfFlightSeconds:  22 }, 
    {distance:  400 , elevation:  1421 , timeOfFlightSeconds:  21.9 }, 
    {distance:  500 , elevation:  1373 , timeOfFlightSeconds:  21.7 }, 
    {distance:  600 , elevation:  1323 , timeOfFlightSeconds:  21.4 }, 
    {distance:  700 , elevation:  1269 , timeOfFlightSeconds:  21.1 }, 
    {distance:  800 , elevation:  1210 , timeOfFlightSeconds:  20.6 }, 
    {distance:  900 , elevation:  1144 , timeOfFlightSeconds:  20 }, 
    {distance:  1000 , elevation:  1065 , timeOfFlightSeconds:  19.2 }, 
    {distance:  1100 , elevation:  956 , timeOfFlightSeconds:  18 }
];


var charge2 = new MortarShellChargeData();
charge2.name = "Charge 2";
charge2.id = "M48_120_HE_ch2";
charge2.chargeLookupTableLines = [
    {distance:  500 , elevation:  1501 , timeOfFlightSeconds:  33.5 }, 
    {distance:  600 , elevation:  1481 , timeOfFlightSeconds:  33.4 }, 
    {distance:  700 , elevation:  1460 , timeOfFlightSeconds:  33.3 }, 
    {distance:  800 , elevation:  1439 , timeOfFlightSeconds:  33.2 }, 
    {distance:  900 , elevation:  1418 , timeOfFlightSeconds:  33.1 }, 
    {distance:  1000 , elevation:  1397 , timeOfFlightSeconds:  33 }, 
    {distance:  1100 , elevation:  1375 , timeOfFlightSeconds:  32.8 }, 
    {distance:  1200 , elevation:  1352 , timeOfFlightSeconds:  32.7 }, 
    {distance:  1300 , elevation:  1329 , timeOfFlightSeconds:  32.5 }, 
    {distance:  1400 , elevation:  1306 , timeOfFlightSeconds:  32.3 }, 
    {distance:  1500 , elevation:  1283 , timeOfFlightSeconds:  32.1 }, 
    {distance:  1600 , elevation:  1260 , timeOfFlightSeconds:  31.9 }, 
    {distance:  1700 , elevation:  1236 , timeOfFlightSeconds:  31.7 }, 
    {distance:  1800 , elevation:  1211 , timeOfFlightSeconds:  31.4 }, 
    {distance:  1900 , elevation:  1184 , timeOfFlightSeconds:  31.1 }, 
    {distance:  2000 , elevation:  1157 , timeOfFlightSeconds:  30.8 }, 
    {distance:  2100 , elevation:  1127 , timeOfFlightSeconds:  30.4 }, 
    {distance:  2200 , elevation:  1095 , timeOfFlightSeconds:  30 }, 
    {distance:  2300 , elevation:  1058 , timeOfFlightSeconds:  29.4 }, 
    {distance:  2400 , elevation:  1016 , timeOfFlightSeconds:  28.7 }, 
    {distance:  2500 , elevation:  963 , timeOfFlightSeconds:  27.7 }, 
    {distance:  2600 , elevation:  875 , timeOfFlightSeconds:  25.9 }
];

var charge4 = new MortarShellChargeData();
charge4.name = "Charge 4";
charge4.id = "M48_120_HE_ch4";
charge4.chargeLookupTableLines = [
    {distance:  800 , elevation:  1499 , timeOfFlightSeconds:  42.4 }, 
    {distance:  900 , elevation:  1486 , timeOfFlightSeconds:  42.3 }, 
    {distance:  1000 , elevation:  1474 , timeOfFlightSeconds:  42.2 }, 
    {distance:  1100 , elevation:  1460 , timeOfFlightSeconds:  42.2 }, 
    {distance:  1200 , elevation:  1447 , timeOfFlightSeconds:  42.1 }, 
    {distance:  1300 , elevation:  1434 , timeOfFlightSeconds:  42 }, 
    {distance:  1400 , elevation:  1420 , timeOfFlightSeconds:  41.9 }, 
    {distance:  1500 , elevation:  1407 , timeOfFlightSeconds:  41.8 }, 
    {distance:  1600 , elevation:  1393 , timeOfFlightSeconds:  417 }, 
    {distance:  1700 , elevation:  1379 , timeOfFlightSeconds:  41.6 }, 
    {distance:  1800 , elevation:  1365 , timeOfFlightSeconds:  41.4 }, 
    {distance:  1900 , elevation:  1350 , timeOfFlightSeconds:  41.3 }, 
    {distance:  2000 , elevation:  1336 , timeOfFlightSeconds:  41.1 }, 
    {distance:  2100 , elevation:  1321 , timeOfFlightSeconds:  41 }, 
    {distance:  2200 , elevation:  1306 , timeOfFlightSeconds:  40.8 }, 
    {distance:  2300 , elevation:  1290 , timeOfFlightSeconds:  40.6 }, 
    {distance:  2400 , elevation:  1273 , timeOfFlightSeconds:  40.4 }, 
    {distance:  2500 , elevation:  1256 , timeOfFlightSeconds:  40.1 }, 
    {distance:  2600 , elevation:  1238 , timeOfFlightSeconds:  39.8 }, 
    {distance:  2700 , elevation:  1220 , timeOfFlightSeconds:  39.6 }, 
    {distance:  2800 , elevation:  1201 , timeOfFlightSeconds:  39.3 }, 
    {distance:  2900 , elevation:  1182 , timeOfFlightSeconds:  38.9 }, 
    {distance:  3000 , elevation:  1162 , timeOfFlightSeconds:  38.6 }, 
    {distance:  3100 , elevation:  1141 , timeOfFlightSeconds:  38.2 }, 
    {distance:  3200 , elevation:  1119 , timeOfFlightSeconds:  37.8 }, 
    {distance:  3300 , elevation:  1095 , timeOfFlightSeconds:  37.4 }, 
    {distance:  3400 , elevation:  1071 , timeOfFlightSeconds:  36.9 }, 
    {distance:  3500 , elevation:  1045 , timeOfFlightSeconds:  36.4 }, 
    {distance:  3600 , elevation:  1017 , timeOfFlightSeconds:  35.8 }, 
    {distance:  3700 , elevation:  986 , timeOfFlightSeconds:  35.1 }, 
    {distance:  3800 , elevation:  952 , timeOfFlightSeconds:  34.3 }, 
    {distance:  3900 , elevation:  913 , timeOfFlightSeconds:  33.4 }, 
    {distance:  4000 , elevation:  864 , timeOfFlightSeconds:  32.2 }
];


var charge6 = new MortarShellChargeData();
charge6.name = "Charge 6";
charge6.id = "M48_120_HE_ch6";
charge6.chargeLookupTableLines = [
    {distance:  1000 , elevation:  1505 , timeOfFlightSeconds:  49.2 }, 
    {distance:  1100 , elevation:  1495 , timeOfFlightSeconds:  49.2 }, 
    {distance:  1200 , elevation:  1485 , timeOfFlightSeconds:  49.1 }, 
    {distance:  1300 , elevation:  1476 , timeOfFlightSeconds:  49.1 }, 
    {distance:  1400 , elevation:  1466 , timeOfFlightSeconds:  49 }, 
    {distance:  1500 , elevation:  1456 , timeOfFlightSeconds:  48.9 }, 
    {distance:  1600 , elevation:  1446 , timeOfFlightSeconds:  48.9 }, 
    {distance:  1700 , elevation:  1436 , timeOfFlightSeconds:  48.8 }, 
    {distance:  1800 , elevation:  1425 , timeOfFlightSeconds:  48.7 }, 
    {distance:  1900 , elevation:  1415 , timeOfFlightSeconds:  48.6 }, 
    {distance:  2000 , elevation:  1405 , timeOfFlightSeconds:  48.5 }, 
    {distance:  2100 , elevation:  1394 , timeOfFlightSeconds:  48.4 }, 
    {distance:  2200 , elevation:  1384 , timeOfFlightSeconds:  48.3 }, 
    {distance:  2300 , elevation:  1373 , timeOfFlightSeconds:  48.2 }, 
    {distance:  2400 , elevation:  1362 , timeOfFlightSeconds:  48.1 }, 
    {distance:  2500 , elevation:  1351 , timeOfFlightSeconds:  48 }, 
    {distance:  2600 , elevation:  1340 , timeOfFlightSeconds:  47.8 }, 
    {distance:  2700 , elevation:  1329 , timeOfFlightSeconds:  47.7 }, 
    {distance:  2800 , elevation:  1317 , timeOfFlightSeconds:  47.5 }, 
    {distance:  2900 , elevation:  1305 , timeOfFlightSeconds:  47.4 }, 
    {distance:  3000 , elevation:  1294 , timeOfFlightSeconds:  47.2 }, 
    {distance:  3100 , elevation:  1281 , timeOfFlightSeconds:  47 }, 
    {distance:  3200 , elevation:  1269 , timeOfFlightSeconds:  46.9 }, 
    {distance:  3300 , elevation:  1257 , timeOfFlightSeconds:  46.7 }, 
    {distance:  3400 , elevation:  1244 , timeOfFlightSeconds:  46.5 }, 
    {distance:  3500 , elevation:  1231 , timeOfFlightSeconds:  46.2 }, 
    {distance:  3600 , elevation:  1217 , timeOfFlightSeconds:  46 }, 
    {distance:  3700 , elevation:  1203 , timeOfFlightSeconds:  45.8 }, 
    {distance:  3800 , elevation:  1189 , timeOfFlightSeconds:  45.5 }, 
    {distance:  3900 , elevation:  1175 , timeOfFlightSeconds:  45.2 }, 
    {distance:  4000 , elevation:  1160 , timeOfFlightSeconds:  44.9 }, 
    {distance:  4100 , elevation:  1144 , timeOfFlightSeconds:  44.6 }, 
    {distance:  4200 , elevation:  1128 , timeOfFlightSeconds:  44.3 }, 
    {distance:  4300 , elevation:  1111 , timeOfFlightSeconds:  43.9 }, 
    {distance:  4400 , elevation:  1093 , timeOfFlightSeconds:  43.5 }, 
    {distance:  4500 , elevation:  1074 , timeOfFlightSeconds:  43.1 }, 
    {distance:  4600 , elevation:  1055 , timeOfFlightSeconds:  42.6 }, 
    {distance:  4700 , elevation:  1033 , timeOfFlightSeconds:  42.1 }, 
    {distance:  4800 , elevation:  1010 , timeOfFlightSeconds:  41.5 }, 
    {distance:  4900 , elevation:  985 , timeOfFlightSeconds:  40.9 }, 
    {distance:  5000 , elevation:  957 , timeOfFlightSeconds:  40.1 }, 
    {distance:  5100 , elevation:  923 , timeOfFlightSeconds:  39.2 }, 
    {distance:  5200 , elevation:  881 , timeOfFlightSeconds:  37.9 }, 
    {distance:  5300 , elevation:  808 , timeOfFlightSeconds:  35.7 }
];


var charge8 = new MortarShellChargeData();
charge8.name = "Charge 8";
charge8.id = "M48_120_HE_ch8";
charge8.chargeLookupTableLines = [
    {distance:  1200 , elevation:  1505 , timeOfFlightSeconds:  54.6 }, 
    {distance:  1300 , elevation:  1497 , timeOfFlightSeconds:  54.6 }, 
    {distance:  1400 , elevation:  1489 , timeOfFlightSeconds:  54.5 }, 
    {distance:  1500 , elevation:  1481 , timeOfFlightSeconds:  54.5 }, 
    {distance:  1600 , elevation:  1473 , timeOfFlightSeconds:  54.4 }, 
    {distance:  1700 , elevation:  1464 , timeOfFlightSeconds:  54.4 }, 
    {distance:  1800 , elevation:  1456 , timeOfFlightSeconds:  54.3 }, 
    {distance:  1900 , elevation:  1448 , timeOfFlightSeconds:  54.2 }, 
    {distance:  2000 , elevation:  1439 , timeOfFlightSeconds:  54.2 }, 
    {distance:  2100 , elevation:  1431 , timeOfFlightSeconds:  54.1 }, 
    {distance:  2200 , elevation:  1422 , timeOfFlightSeconds:  54 }, 
    {distance:  2300 , elevation:  1414 , timeOfFlightSeconds:  53.9 }, 
    {distance:  2400 , elevation:  1405 , timeOfFlightSeconds:  53.8 }, 
    {distance:  2500 , elevation:  1396 , timeOfFlightSeconds:  53.8 }, 
    {distance:  2600 , elevation:  1388 , timeOfFlightSeconds:  53.7 }, 
    {distance:  2700 , elevation:  1379 , timeOfFlightSeconds:  53.6 }, 
    {distance:  2800 , elevation:  1370 , timeOfFlightSeconds:  53.5 }, 
    {distance:  2900 , elevation:  1361 , timeOfFlightSeconds:  53.3 }, 
    {distance:  3000 , elevation:  1352 , timeOfFlightSeconds:  53.2 }, 
    {distance:  3100 , elevation:  1342 , timeOfFlightSeconds:  53.1 }, 
    {distance:  3200 , elevation:  1333 , timeOfFlightSeconds:  53 }, 
    {distance:  3300 , elevation:  1323 , timeOfFlightSeconds:  52.8 }, 
    {distance:  3400 , elevation:  1314 , timeOfFlightSeconds:  52.7 }, 
    {distance:  3500 , elevation:  1304 , timeOfFlightSeconds:  52.6 }, 
    {distance:  3600 , elevation:  1294 , timeOfFlightSeconds:  52.4 }, 
    {distance:  3700 , elevation:  1284 , timeOfFlightSeconds:  52.2 }, 
    {distance:  3800 , elevation:  1274 , timeOfFlightSeconds:  52.1 }, 
    {distance:  3900 , elevation:  1263 , timeOfFlightSeconds:  51.9 }, 
    {distance:  4000 , elevation:  1253 , timeOfFlightSeconds:  51.7 }, 
    {distance:  4100 , elevation:  1242 , timeOfFlightSeconds:  51.5 }, 
    {distance:  4200 , elevation:  1231 , timeOfFlightSeconds:  51.3 }, 
    {distance:  4300 , elevation:  1220 , timeOfFlightSeconds:  51.1 }, 
    {distance:  4400 , elevation:  1209 , timeOfFlightSeconds:  50.9 }, 
    {distance:  4500 , elevation:  1197 , timeOfFlightSeconds:  50.7 }, 
    {distance:  4600 , elevation:  1185 , timeOfFlightSeconds:  50.4 }, 
    {distance:  4700 , elevation:  1172 , timeOfFlightSeconds:  50.1 }, 
    {distance:  4800 , elevation:  1160 , timeOfFlightSeconds:  49.9 }, 
    {distance:  4900 , elevation:  1147 , timeOfFlightSeconds:  49.6 }, 
    {distance:  5000 , elevation:  1133 , timeOfFlightSeconds:  49.3 }, 
    {distance:  5100 , elevation:  1119 , timeOfFlightSeconds:  48.9 }, 
    {distance:  5200 , elevation:  1104 , timeOfFlightSeconds:  48.6 }, 
    {distance:  5300 , elevation:  1089 , timeOfFlightSeconds:  48.2 }, 
    {distance:  5400 , elevation:  1073 , timeOfFlightSeconds:  47.8 }, 
    {distance:  5500 , elevation:  1056 , timeOfFlightSeconds:  47.4 }, 
    {distance:  5600 , elevation:  1038 , timeOfFlightSeconds:  46.9 }, 
    {distance:  5700 , elevation:  1019 , timeOfFlightSeconds:  46.3 }, 
    {distance:  5800 , elevation:  998 , timeOfFlightSeconds:  45.7 }, 
    {distance:  5900 , elevation:  976 , timeOfFlightSeconds:  45.1 }, 
    {distance:  6000 , elevation:  950 , timeOfFlightSeconds:  44.3 }, 
    {distance:  6100 , elevation:  920 , timeOfFlightSeconds:  43.3 }, 
    {distance:  6200 , elevation:  882 , timeOfFlightSeconds:  42.1 }, 
    {distance:  6300 , elevation:  825 , timeOfFlightSeconds:  40.1 }
];


var charge9 = new MortarShellChargeData();
charge9.name = "Charge 9";
charge9.id = "M48_120_HE_ch9";
charge9.chargeLookupTableLines = [
    {distance:  1200 , elevation:  1509 , timeOfFlightSeconds:  56 }, 
    {distance:  1300 , elevation:  1502 , timeOfFlightSeconds:  56 }, 
    {distance:  1400 , elevation:  1494 , timeOfFlightSeconds:  56 }, 
    {distance:  1500 , elevation:  1486 , timeOfFlightSeconds:  55.9 }, 
    {distance:  1600 , elevation:  1478 , timeOfFlightSeconds:  55.9 }, 
    {distance:  1700 , elevation:  1470 , timeOfFlightSeconds:  55.8 }, 
    {distance:  1800 , elevation:  1463 , timeOfFlightSeconds:  55.8 }, 
    {distance:  1900 , elevation:  1455 , timeOfFlightSeconds:  55.7 }, 
    {distance:  2000 , elevation:  1447 , timeOfFlightSeconds:  55.6 }, 
    {distance:  2100 , elevation:  1439 , timeOfFlightSeconds:  55.6 }, 
    {distance:  2200 , elevation:  1430 , timeOfFlightSeconds:  55.5 }, 
    {distance:  2300 , elevation:  1422 , timeOfFlightSeconds:  55.4 }, 
    {distance:  2400 , elevation:  1414 , timeOfFlightSeconds:  55.3 }, 
    {distance:  2500 , elevation:  1406 , timeOfFlightSeconds:  55.3 }, 
    {distance:  2600 , elevation:  1397 , timeOfFlightSeconds:  55.2 }, 
    {distance:  2700 , elevation:  1389 , timeOfFlightSeconds:  55.1 }, 
    {distance:  2800 , elevation:  1381 , timeOfFlightSeconds:  55 }, 
    {distance:  2900 , elevation:  1372 , timeOfFlightSeconds:  54.9 }, 
    {distance:  3000 , elevation:  1363 , timeOfFlightSeconds:  54.8 }, 
    {distance:  3100 , elevation:  1355 , timeOfFlightSeconds:  54.7 }, 
    {distance:  3200 , elevation:  1346 , timeOfFlightSeconds:  54.5 }, 
    {distance:  3300 , elevation:  1337 , timeOfFlightSeconds:  54.4 }, 
    {distance:  3400 , elevation:  1328 , timeOfFlightSeconds:  54.3 }, 
    {distance:  3500 , elevation:  1319 , timeOfFlightSeconds:  54.2 }, 
    {distance:  3600 , elevation:  1309 , timeOfFlightSeconds:  54 }, 
    {distance:  3700 , elevation:  1300 , timeOfFlightSeconds:  53.9 }, 
    {distance:  3800 , elevation:  1291 , timeOfFlightSeconds:  53.7 }, 
    {distance:  3900 , elevation:  1281 , timeOfFlightSeconds:  53.6 }, 
    {distance:  4000 , elevation:  1272 , timeOfFlightSeconds:  53.5 }, 
    {distance:  4100 , elevation:  1262 , timeOfFlightSeconds:  53.3 }, 
    {distance:  4200 , elevation:  1252 , timeOfFlightSeconds:  53.1 }, 
    {distance:  4300 , elevation:  1243 , timeOfFlightSeconds:  53 }, 
    {distance:  4400 , elevation:  1232 , timeOfFlightSeconds:  52.8 }, 
    {distance:  4500 , elevation:  1222 , timeOfFlightSeconds:  52.6 }, 
    {distance:  4600 , elevation:  1212 , timeOfFlightSeconds:  52.4 }, 
    {distance:  4700 , elevation:  1201 , timeOfFlightSeconds:  52.2 }, 
    {distance:  4800 , elevation:  1190 , timeOfFlightSeconds:  52 }, 
    {distance:  4900 , elevation:  1179 , timeOfFlightSeconds:  51.8 }, 
    {distance:  5000 , elevation:  1167 , timeOfFlightSeconds:  51.5 }, 
    {distance:  5100 , elevation:  1155 , timeOfFlightSeconds:  51.3 }, 
    {distance:  5200 , elevation:  1143 , timeOfFlightSeconds:  51 }, 
    {distance:  5300 , elevation:  1130 , timeOfFlightSeconds:  50.7 }, 
    {distance:  5400 , elevation:  1117 , timeOfFlightSeconds:  50.4 }, 
    {distance:  5500 , elevation:  1103 , timeOfFlightSeconds:  50 }, 
    {distance:  5600 , elevation:  1089 , timeOfFlightSeconds:  49.7 }, 
    {distance:  5700 , elevation:  1074 , timeOfFlightSeconds:  49.3 }, 
    {distance:  5800 , elevation:  1058 , timeOfFlightSeconds:  48.8 }, 
    {distance:  5900 , elevation:  1041 , timeOfFlightSeconds:  48.4 }, 
    {distance:  6000 , elevation:  1023 , timeOfFlightSeconds:  47.9 }, 
    {distance:  6100 , elevation:  1003 , timeOfFlightSeconds:  47.3 }, 
    {distance:  6200 , elevation:  982 , timeOfFlightSeconds:  46.6 }, 
    {distance:  6300 , elevation:  957 , timeOfFlightSeconds:  45.8 }, 
    {distance:  6400 , elevation:  925 , timeOfFlightSeconds:  44.8 }, 
    {distance:  6500 , elevation:  883 , timeOfFlightSeconds:  43.3 }, 
    {distance:  6600 , elevation:  815 , timeOfFlightSeconds:  40.9 }
];



const M48_120_HE:MortarShellData = new MortarShellData();
M48_120_HE.name = "M48 120 HE";
M48_120_HE.id = "M48_120_HE";

M48_120_HE.description = `Firing Table for 
120mm HE Mortar Bomb M48
With fuze PD DM111S
120mm Mortar M12-1111 (GrW86)`;

M48_120_HE.mortarShellCharges = [
    charge0,
    charge2,
    charge4,
    charge6,
    charge8,
    charge9
];

export default M48_120_HE;






//
//M48 120 HE
//M48_120_HE