import { MortarType } from "../../mortar_logic_src/Settings/MortarType";

const Mrt120mm:MortarType = new MortarType();
Mrt120mm.name = "120mm";
Mrt120mm.id = "Mrt120mm";
Mrt120mm.directionMilPerRotation = 8;
Mrt120mm.elevationMilPerRotation = 4;
Mrt120mm.blastDiameter = 50;

export default Mrt120mm;