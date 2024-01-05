import { AppFDC } from "../AppFDC";
import { MortarShellData } from "../Settings/MortarShellData";
import { MortarType } from "../Settings/MortarType";

describe("FireDataLines mortar selected by default", () => {
  
  it("If mortar is set as defaut mortar it is assign to new fire data lines", () => {
    var appFDC: AppFDC = new AppFDC();

    appFDC.CreateMortar();
    appFDC.CreateMortar();
    var mortarSelected = appFDC.CreateMortar();
    appFDC.CreateMortar();

    appFDC.defaultSelectedMortarId = mortarSelected.id;

    var fireDataLine = appFDC.CreateFireMission().CreateNewFireDataLine();

    expect(fireDataLine.mortarId).toBe(mortarSelected.id);
  });

  it("If defaut mortar isn't selected then first is the default", () => {
    var appFDC: AppFDC = new AppFDC();

    var firstCreatedMortar = appFDC.CreateMortar();
    appFDC.CreateMortar();
    appFDC.CreateMortar();
    appFDC.CreateMortar();

    var fireDataLine = appFDC.CreateFireMission().CreateNewFireDataLine();

    expect(fireDataLine.mortarId).toBe(firstCreatedMortar.id);
  });

  it("If defaut mortar is removed then first available is next default", () => {
    var appFDC: AppFDC = new AppFDC();

    var firstCreatedMortar = appFDC.CreateMortar();
    appFDC.CreateMortar();
    var mortarSelectedBuRemoved = appFDC.CreateMortar();
    appFDC.CreateMortar();

    appFDC.defaultSelectedMortarId = mortarSelectedBuRemoved.id;
    appFDC.removeMortar(mortarSelectedBuRemoved);

    var fireDataLine = appFDC.CreateFireMission().CreateNewFireDataLine();

    expect(fireDataLine.mortarId).toBe(firstCreatedMortar.id);
  });

  it("If mortar is set as defaut mortar it is assign to new linear fire data lines", () => {
    var appFDC: AppFDC = new AppFDC();

    appFDC.CreateMortar();
    appFDC.CreateMortar();
    var mortarSelected = appFDC.CreateMortar();
    appFDC.CreateMortar();

    appFDC.defaultSelectedMortarId = mortarSelected.id;

    var linTarget = appFDC.CreateFireMission().CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 1600,
      Length: 3,
      SubTargetCount: 3,
    });

    var subtargetLines = linTarget.fireDateLines;

    expect(subtargetLines.length).toBeCloseTo(3);

    var subtargetLine0 = subtargetLines[0];
    expect(subtargetLine0?.mortarId).toBe(mortarSelected.id);

    var subtargetLine1 = subtargetLines[1];
    expect(subtargetLine1?.mortarId).toBe(mortarSelected.id);

    var subtargetLine2 = subtargetLines[2];
    expect(subtargetLine2?.mortarId).toBe(mortarSelected.id);
  });
});

describe("FireDataLines shell selected by default", () => {
  //    });

  it("If shell is set as defaut it is assign to new fire data lines", () => {
    var appFDC: AppFDC = new AppFDC();

    var selectedMortarShellData = new MortarShellData();

    appFDC.settings.mortarShellData.push(new MortarShellData());
    appFDC.settings.mortarShellData.push(new MortarShellData());
    appFDC.settings.mortarShellData.push(selectedMortarShellData);
    appFDC.settings.mortarShellData.push(new MortarShellData());

    appFDC.settings.defaultSelectedShellId = selectedMortarShellData.id;

    var fireDataLine = appFDC.CreateFireMission().CreateNewFireDataLine();

    expect(fireDataLine.shellId).toBe(selectedMortarShellData.id);
  });

  it("If shell is set as defaut it is assign to new linear fire data lines", () => {
    var appFDC: AppFDC = new AppFDC();

    var selectedMortarShellData = new MortarShellData();

    appFDC.settings.mortarShellData.push(new MortarShellData());
    appFDC.settings.mortarShellData.push(new MortarShellData());
    appFDC.settings.mortarShellData.push(selectedMortarShellData);
    appFDC.settings.mortarShellData.push(new MortarShellData());

    appFDC.settings.defaultSelectedShellId = selectedMortarShellData.id;

    var linTarget = appFDC.CreateFireMission().CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 1600,
      Length: 3,
      SubTargetCount: 3,
    });

    expect(linTarget.shellId).toBe(selectedMortarShellData.id);
  });
});

describe("mortar types selected by default", () => {
  //    });

  it("If mortar type is set as defaut it is assign to new mortar", () => {
    var appFDC: AppFDC = new AppFDC();

    var selectedMortarType = new MortarType();

    appFDC.settings.mortarTypes.push(new MortarType());
    appFDC.settings.mortarTypes.push(new MortarType());
    appFDC.settings.mortarTypes.push(selectedMortarType);
    appFDC.settings.mortarTypes.push(new MortarType());

    appFDC.settings.defaultMrtType = selectedMortarType.id;

    var mortar = appFDC.CreateMortar();

    expect(mortar.mortarTypeId).toBe(selectedMortarType.id);
  });
});
