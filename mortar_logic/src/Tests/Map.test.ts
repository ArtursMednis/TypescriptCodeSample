import { AppFDC } from "../AppFDC";
import { MapSvgCreator } from "../MapSvgCreator";
import { MapTestsHelper } from "./MapTestsHelper";

describe("Mortar at 10100,10100 - target at 10200,10200", () => {
  
  it("Mortar and target included in svg ", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(10100, 10100);
    fireMission.SetInitialTargetGrid({ east: 10200, north: 10200 });
    fireMission.CreateNewFireDataLine({ mortarId: mortar.id });

    var mapSvgCreator: MapSvgCreator = new MapSvgCreator(appFDC);
    var mapSvg = mapSvgCreator.creataMapForFireMission(fireMission.id);

    var mapSvgContainsMortar = MapTestsHelper.checkIfElementExist(mapSvg, {
      type: "circle",
      x: 10100,
      y: -10100,
      color: "red",
    });
    expect(mapSvgContainsMortar).toBeTruthy();

    var mapSvgContainsTarget = MapTestsHelper.checkIfElementExist(mapSvg, {
      type: "circle",
      x: 10200,
      y: -10200,
      color: "green",
    });
    expect(mapSvgContainsTarget).toBeTruthy();
  });

  it("target illum corections included in svg ", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(10100, 10100);
    fireMission.SetInitialTargetGrid({ east: 10200, north: 10200 });

    var fireDataLine = fireMission.CreateNewFireDataLineForIllum({
      mortarId: mortar.id,
    });
    fireDataLine.correction = { right: 100, add: 100, up: 0 };

    var mapSvgCreator: MapSvgCreator = new MapSvgCreator(appFDC);
    var mapSvg = mapSvgCreator.creataMapForFireMission(fireMission.id);

    var mapSvgContainsIllumCorrection = MapTestsHelper.checkIfElementExist(
      mapSvg,
      { type: "circle", x: 10300, y: -10300, color: "cyan" }
    );
    expect(mapSvgContainsIllumCorrection).toBeTruthy();
  });
});
