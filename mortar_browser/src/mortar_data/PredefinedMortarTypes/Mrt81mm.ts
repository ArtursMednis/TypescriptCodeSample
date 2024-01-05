import { MortarType } from "../../mortar_logic_src/Settings/MortarType";

const Mrt81mm:MortarType = new MortarType();
Mrt81mm.name = "81mm";
Mrt81mm.id="Mrt81mm";
Mrt81mm.directionMilPerRotation = 7;
Mrt81mm.elevationMilPerRotation = 7;
Mrt81mm.blastDiameter = 25;

export default Mrt81mm;