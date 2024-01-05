import { AppFDC } from "../AppFDC";
import { MortarShellChargeData } from "../Settings/MortarShellChargeData";
import { MortarShellData } from "../Settings/MortarShellData";
import { MortarType } from "../Settings/MortarType";
import { TargetMethod } from "../interfaces";

describe("GRID target Calculations. Mortar at [0,0] and target at [1,0], OT 4800 ", () => {

  /*
      -                                                  
    -/ \-   N                                            
    /  |  \                                               
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                                  
      |                                        --       E
      +-+       +-+                               \-      
      |-|-------|-|-------------------------------  --    
      +-+       +-+                              --/      
    M(0,0)      T(1,0)                           -/         
                                
  */

  it("Correct distance&direction calculation", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);
    fireMission.SetInitialTargetGrid({ east: 1, north: 0 });
    expect(fireMission.targetMethod).toBe(TargetMethod.grid);

    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(1);
    expect(fireDataOutput.directionMil).toBeCloseTo(1600);
  });

  /*
                                                                        
                  -/ \-   N                                            
                  /  |  \                                               
                    |                                  OT              
                    |                             /-                   
                    |                            ----------            
                    |                             \-                   
                    +-+                                                 
                    |||                                                 
                /|\-+-+                                                 
      RIGHT 2    |   |                                                  
                |   |                                                  
                |   |       ADD 1                                      
                |   |  /                                               
                |   | ---------                                        
                    |  \                                    --        E
                    +-+       +-+                               \-      
                    |-|-------|-|-------------------------------  --    
                    +-+       +-+                              --/      
                M(0,0)      T(1,0)                           -/         
                                                                        
  */

  it("Correct distance&direction calculation after correction: Right 2 Add 1 - So that after correction target coordinates are [0,2]", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);

    fireMission.SetInitialTargetGrid({ east: 1, north: 0 }, 4800);

    var rightCorrection = 2;
    var addCorrection = 1;

    var fireDataLine = fireMission.CreateNewFireDataLine();
    fireDataLine.correction = { right: rightCorrection, add: addCorrection };
    fireDataLine.mortarId = mortar.id;
    var fireDataOutput = fireDataLine.CalcOutput();

    var distance = fireDataOutput.distanceMeters;
    var firingAngleMil = fireDataOutput.directionMil;

    expect(distance).toBeCloseTo(2);

    var correctAngle =
      approximatelyEqual(firingAngleMil, 6400) ||
      approximatelyEqual(firingAngleMil, 0);
    expect(correctAngle).toBeTruthy();
  });

  it("Correct distance&direction calculation after double correction  Correction: Add 1, then change OT 3200 and Drop 2 - So that after correction target coordinates are [0,2]", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(0, 0);

    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 1, north: 0 }, 4800);

    var fireDataLine1 = fireMission.CreateNewFireDataLine();
    fireDataLine1.correction = { right: 0, add: 1 };

    var fireDataLine2 = fireMission.CreateNewFireDataLine();
    fireDataLine2.correction = { right: 0, add: 0, changedOtLineMil: 3200 };

    var fireDataLine3 = fireMission.CreateNewFireDataLine();
    fireDataLine3.correction = { right: 0, add: -2 };

    fireDataLine3.mortarId = mortar.id;
    var fireDataOutput = fireDataLine3.CalcOutput();

    var distance = fireDataOutput.distanceMeters;
    var firingAngleMil = fireDataOutput.directionMil;

    expect(distance).toBeCloseTo(2);

    var correctAngle =
      approximatelyEqual(firingAngleMil, 6400) ||
      approximatelyEqual(firingAngleMil, 0);
    expect(correctAngle).toBeTruthy();
  });

});


describe("POLAR target calculation. Mortar at [0,0], FO at [8,0], OT 4800, distance 3", () => {

  /*
            -   N                                                 
          -/ \-                                                   
          /  |  \                                                  
            |                                                     
            |                                                     
            |                                      OT             
            |                                  /-                 
            |                                /-                   
            |                               ------------          
            |                                 \-                  
            |                                   \-                
            |                                                     
            |                                                     
            |                                                     
            |                                        --    E      
            +-+                  +-+        +-+         \-         
            |-|------------------|-|--------|-|---------  --       
            +-+                  +-+        +-+        --/         
        M(0,0)                T(5,0)        FO(8,0)  -/            
                                                                  
  */
  it("Correct distance&direction calculation", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);

    fireMission.SetInitialTargetPolar({ east: 8, north: 0 }, 4800, 3);
    expect(fireMission.targetMethod).toBe(TargetMethod.polar);

    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(5);
    expect(fireDataOutput.directionMil).toBeCloseTo(1600);
  });

});


describe("SHIFT target calculation. Mortar at [0,0], previous target at [1,0], OT 4800. New Target With shift : Right 2 Add 1 - So that new target coordinates are 0,2", () => {


  /*
                                                                        
                  -/ \-   N                                            
                  /  |  \                                               
                    |                                  OT              
                    |                             /-                   
                    |                            ----------            
                    |                             \-                   
                    +-+                                                 
                    ||| T1(0,2)                                         
                /|\-+-+                                                 
      RIGHT 2    |   |                                                  
                |   |                                                  
                |   |       ADD 1                                      
                |   |  /                                               
                |   | ---------                                        
                    |  \                                    --        E
                    +-+       +-+                               \-      
                    |-|-------|-|-------------------------------  --    
                    +-+       +-+                              --/      
                M(0,0)      T0(1,0)                          -/         
                                                                        
  */

  it("Correct distance&direction calculation", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var previousFireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);

    previousFireMission.SetInitialTargetGrid({ east: 1, north: 0 });

    var prevTagetGrid = previousFireMission.GetFinalGridAfterCorrections();

    var shiftCorrection = {right: 2, add: 1};

    var actualFireMission = appFDC.CreateFireMission();
    actualFireMission.SetInitialTargetShift(prevTagetGrid, 4800, shiftCorrection);

    expect(actualFireMission.targetMethod).toBe(TargetMethod.shift);

    var fireDataLine = actualFireMission.CreateNewFireDataLine({
      mortarId: mortar.id,
    });
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeCloseTo(2);

    var correctAngle =
      approximatelyEqual(fireDataOutput.directionMil, 6400) ||
      approximatelyEqual(fireDataOutput.directionMil, 0);
    expect(correctAngle).toBeTruthy();
  });

});


describe("Aim elevation and timeOfFlight interpolation from shell data. Example range is 5 but shell data are for 4 and 6", () => {

  it("Correct elevation and timeOfFlight intrpolation when data available at appFDC.settings.mortarShellCharges (deprecated)", () => {
    var appFDC: AppFDC = new AppFDC();
    
    var shellChargeData = new MortarShellChargeData();
    shellChargeData.chargeLookupTableLines.push({
      distance: 4,
      elevation: 40,
      timeOfFlightSeconds: 30,
    });
    shellChargeData.chargeLookupTableLines.push({
      distance: 6,
      elevation: 60,
      timeOfFlightSeconds: 40,
    });
    appFDC.settings.mortarShellCharges.push(shellChargeData);


    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);
    fireMission.SetInitialTargetGrid({ east: 5, north: 0 });

    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    
    fireDataLine.shellChargeId = shellChargeData.id;

    var fireDataOutput2 = fireDataLine.CalcOutput();
    expect(fireDataOutput2.elevationMil).toBeCloseTo(50);
    expect(fireDataOutput2.timeOfFlightSeconds).toBeCloseTo(35);
  });

  it("Correct elevation and timeOfFlight intrpolation when data available at appFDC.settings.mortarShellData", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortarShellData = new MortarShellData();
    appFDC.settings.mortarShellData.push(mortarShellData);

    var shellChargeData = new MortarShellChargeData();
    shellChargeData.chargeLookupTableLines.push({
      distance: 4,
      elevation: 40,
      timeOfFlightSeconds: 30,
    });
    shellChargeData.chargeLookupTableLines.push({
      distance: 6,
      elevation: 60,
      timeOfFlightSeconds: 40,
    });
    mortarShellData.mortarShellCharges.push(shellChargeData);

    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);
    fireMission.SetInitialTargetGrid({ east: 5, north: 0 });

    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    
    fireDataLine.shellId = mortarShellData.id;
    fireDataLine.shellChargeId = shellChargeData.id;

    var fireDataOutput = fireDataLine.CalcOutput();
    expect(fireDataOutput.elevationMil).toBeCloseTo(50);
    expect(fireDataOutput.timeOfFlightSeconds).toBeCloseTo(35);
  });

  it("Elevation and timeOfFlight is NaN if Charge data not available", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);
    fireMission.SetInitialTargetGrid({ east: 5, north: 0 });

    var fireDataLine = fireMission.CreateNewFireDataLine({ mortarId: mortar.id });
    var fireDataOutput = fireDataLine.CalcOutput();
    expect(fireDataOutput.elevationMil).toBeNaN();
    expect(fireDataOutput.timeOfFlightSeconds).toBeNaN();
  });

});


describe("AngleT calculation. Mortar at [0,0] and target at [0,1]", () => {
  it("OT 2800 -> AngleT false", () => {
    var appFDC: AppFDC = new AppFDC();
    
    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(0, 0);
    
    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 0, north: 1 }, 2800);

    expect(fireMission.IsAngleTInEffect(mortar.id)).toBeFalsy();
  });

  it("OT 1600 -> AngleT true", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(0, 0);
    
    var fireMission = appFDC.CreateFireMission();
    
    fireMission.SetInitialTargetGrid({ east: 0, north: 1 }, 1600);
    expect(fireMission.IsAngleTInEffect(mortar.id)).toBeTruthy();
  });

  it("OT 6300 -> AngleT false", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(0, 0);

    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 0, north: 1 }, 6300);
    expect(fireMission.IsAngleTInEffect(mortar.id)).toBeFalsy();
  });

  it("OT 4800 -> AngleT true", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(0, 0);

    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 0, north: 1 }, 4800);
    expect(fireMission.IsAngleTInEffect(mortar.id)).toBeTruthy();
  });
});


describe("Safety arcs", () => {

  /*
                                                  
      N                                                  
  /-\         \                        /                
  - | -         \            T_2(12,11)/                 
    |            \  T_1(11,11)        /                  
    |             \         +-+    +-+    +-+            
    |              \        | |    |/|    | |  T_0(13,11)
    |               \       +-+    +-+    +-+            
    |                \            /                      
    |                 \          /                       
    |                +-+    +-+ /                        
    |                | |    | |                          
    |                +-+    +-+                          
    |           M(10,10)    M(11,10)                     
    |                                                    
    |                                 --                 
    -----------------------------------/--              
                                      --   E             

  */

  it("Safety warning true if outside safety arcs ", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar1 = appFDC.CreateMortar();
    mortar1.SetLocationGrid(10, 10);

    var mortar2 = appFDC.CreateMortar();
    mortar2.SetLocationGrid(11, 10);

    mortar1.leftSafetyArc = 5600;
    mortar2.rightSafetyArc = 800;

    var safeFireMission = appFDC.CreateFireMission();
    safeFireMission.SetInitialTargetGrid({ east: 11, north: 11 });
    var safeFireDataOutput1 = safeFireMission
      .CreateNewFireDataLine({ mortarId: mortar1.id })
      .CalcOutput();
    var safeFireDataOutput2 = safeFireMission
      .CreateNewFireDataLine({ mortarId: mortar2.id })
      .CalcOutput();
    expect(safeFireDataOutput1.outsideSafetyArcs).toBeFalsy();
    expect(safeFireDataOutput2.outsideSafetyArcs).toBeFalsy();

    var fireMissionAtBorder = appFDC.CreateFireMission();
    fireMissionAtBorder.SetInitialTargetGrid({ east: 12, north: 11 });
    var fireDataOutputBorder1 = fireMissionAtBorder
      .CreateNewFireDataLine({ mortarId: mortar1.id })
      .CalcOutput();
    var fireDataOutputBorder2 = fireMissionAtBorder
      .CreateNewFireDataLine({ mortarId: mortar2.id })
      .CalcOutput();
    expect(fireDataOutputBorder1.outsideSafetyArcs).toBeTruthy();
    expect(fireDataOutputBorder2.outsideSafetyArcs).toBeTruthy();

    var dangerFireMission = appFDC.CreateFireMission();
    dangerFireMission.SetInitialTargetGrid({ east: 13, north: 11 });
    var dangerFireDataOutput1 = dangerFireMission
      .CreateNewFireDataLine({ mortarId: mortar1.id })
      .CalcOutput();
    var dangerFireDataOutput2 = dangerFireMission
      .CreateNewFireDataLine({ mortarId: mortar2.id })
      .CalcOutput();
    expect(dangerFireDataOutput1.outsideSafetyArcs).toBeTruthy();
    expect(dangerFireDataOutput2.outsideSafetyArcs).toBeTruthy();
  });

});


describe("Linear target at [10,11], Mortar at [10,10]", () => {
  
  /*

                                                  
        N                                          
     /-\                                           
    - | -                                          
      |                    T_1(10,11)              
      |                +-+    +-+    +-+           
      |                | |    | |    | | T_2(11,11)
      |                +-+    +-+    +-+           
      |          T_0(9,11)                         
      |                       +-+                  
      |                       | |                  
      |                       +-+                  
      |                       M(10,10)             
      |                                            
      |                                            
      |                                 --         
      -----------------------------------/--      
                                        --   E     

*/

  it("correct fireDateLines", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    //var mortar = new Mortar();
    mortar.SetLocationGrid(10, 10);

    //var fireMission = new FireMission({mortars:[mortar]});
    fireMission.SetInitialTargetGrid({ east: 10, north: 11 });

    var linTarget = fireMission.CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 1600,
      Length: 3,
      SubTargetCount: 3,
    });

    var subtargetLines = linTarget.fireDateLines;
    expect(subtargetLines.length).toBeCloseTo(3);

    var subtargetLine0 = subtargetLines[0];
    var subtargetGrid0 = subtargetLine0?.GetGrid();
    expect(subtargetGrid0!.east).toBeCloseTo(9);
    expect(subtargetGrid0!.north).toBeCloseTo(11);

    var subtargetLine1 = subtargetLines[1];
    var subtargetGrid1 = subtargetLine1?.GetGrid();
    expect(subtargetGrid1!.east).toBeCloseTo(10);
    expect(subtargetGrid1!.north).toBeCloseTo(11);

    var subtargetLine2 = subtargetLines[2];
    var subtargetGrid2 = subtargetLine2?.GetGrid();
    expect(subtargetGrid2!.east).toBeCloseTo(11);
    expect(subtargetGrid2!.north).toBeCloseTo(11);

    subtargetLine0!.mortarId = mortar.id;
    var firingData0 = subtargetLine0!.CalcOutput();
    expect(firingData0?.distanceMeters).toBeCloseTo(1.4142135623731);
    expect(firingData0?.directionMil).toBeCloseTo(5600);

    subtargetLine1!.mortarId = mortar.id;
    var firingData1 = subtargetLine1!.CalcOutput();
    expect(firingData1?.distanceMeters).toBeCloseTo(1);
    var correctFiringData2Direction =
      approximatelyEqual(firingData1!.directionMil, 6400) ||
      approximatelyEqual(firingData1!.directionMil, 0);
    expect(correctFiringData2Direction).toBeTruthy();

    subtargetLine2!.mortarId = mortar.id;
    var firingData2 = subtargetLine2!.CalcOutput();
    expect(firingData2?.distanceMeters).toBeCloseTo(1.4142135623731);
    expect(firingData2?.directionMil).toBeCloseTo(800);
  });

  it("correct fireDateLines for searchAndTraverse:search", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    //var mortar = new Mortar();
    mortar.SetLocationGrid(10, 10);
    mortar.directionMilPerRotation = 5;
    mortar.elevationMilPerRotation = 5;

    //var fireMission = new FireMission({mortars:[mortar]});
    fireMission.SetInitialTargetGrid({ east: 10, north: 11 });

    var linTarget = fireMission.CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 1600,
      Length: 3,
      SubTargetCount: 3,
    });

    var subtargetLines = linTarget.fireDateLines;
    expect(subtargetLines.length).toBeCloseTo(3);

    var subtargetLine0 = subtargetLines[0];

    subtargetLine0!.mortarId = mortar.id;
    var searchAndTraverseOutput0 = subtargetLine0?.calcSearchAndTraverse();
    expect(searchAndTraverseOutput0?.traverseDirectionMil).toBeCloseTo(800);
    //Kad būs firing data tabula, tad varēs arī precīzi pateikt stTraverseMil pacēlumu miljēmās
    expect(searchAndTraverseOutput0?.upCount).toBeCloseTo(2);
    expect(searchAndTraverseOutput0?.downCount).toBeCloseTo(0);

    //console.log("ST Message: "+searchAndTraverseOutput0?.message);

    expect(searchAndTraverseOutput0?.message.includes("left")).toBeFalsy();
    expect(searchAndTraverseOutput0?.message.includes("right")).toBeTruthy();
    expect(searchAndTraverseOutput0?.message.includes("up")).toBeFalsy();
    expect(searchAndTraverseOutput0?.message.includes("down")).toBeFalsy();

    var subtargetLine1 = subtargetLines[1];
    subtargetLine1!.mortarId = mortar.id;
    var searchAndTraverseOutput1 = subtargetLine1?.calcSearchAndTraverse();
    expect(searchAndTraverseOutput1?.traverseDirectionMil).toBeCloseTo(800);
    //Kad būs firing data tabula, tad varēs arī precīzi pateikt stTraverseMil pacēlumu miljēmās
    expect(searchAndTraverseOutput1?.upCount).toBeCloseTo(1);
    expect(searchAndTraverseOutput1?.downCount).toBeCloseTo(1);
    expect(searchAndTraverseOutput1?.message.includes("left")).toBeTruthy();
    expect(searchAndTraverseOutput1?.message.includes("right")).toBeTruthy();
    expect(searchAndTraverseOutput1?.message.includes("up")).toBeFalsy();
    expect(searchAndTraverseOutput1?.message.includes("down")).toBeFalsy();
    //console.log("ST Message: "+searchAndTraverseOutput1?.message);

    var subtargetLine2 = subtargetLines[2];
    subtargetLine2!.mortarId = mortar.id;
    var searchAndTraverseOutput2 = subtargetLine2?.calcSearchAndTraverse();
    expect(searchAndTraverseOutput2?.traverseDirectionMil).toBeCloseTo(800);
    //Kad būs firing data tabula, tad varēs arī precīzi pateikt stTraverseMil pacēlumu miljēmās
    expect(searchAndTraverseOutput2?.upCount).toBeCloseTo(0);
    expect(searchAndTraverseOutput2?.downCount).toBeCloseTo(2);
    expect(searchAndTraverseOutput2?.message.includes("left")).toBeTruthy();
    expect(searchAndTraverseOutput2?.message.includes("right")).toBeFalsy();
    expect(searchAndTraverseOutput2?.message.includes("up")).toBeFalsy();
    expect(searchAndTraverseOutput2?.message.includes("down")).toBeFalsy();
  });

  /*                                                  
        N                                          
     /-\                                           
    - | -                                          
      |                                            
      |                       +-+                  
      |                       | |  T_3(10,13)      
      |                       +-+                  
      |                                            
      |                       +-+                  
      |                       | |  T_1(10,12)      
      |                       +-+                  
      |                                            
      |                       +-+                  
      |                       | |  T_0(10,11)      
      |                       +-+                  
      |                                            
      |                       +-+                  
      |                       | |                  
      |                       +-+                  
      |                       M(10,10)             
      |                                            
      |                                            
      |                                 --         
      -----------------------------------/--      
                                        --   E     
*/

  it("linear target at 10,12; correct fireDateLines for searchAndTraverse:traverse", () => {
    var appFDC: AppFDC = new AppFDC();

    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(10, 10);

    mortar.mortarTypeId = "";
    mortar.directionMilPerRotation = 5;
    mortar.elevationMilPerRotation = 5;

    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 10, north: 12 });

    var mortarShellData = new MortarShellData();
    appFDC.settings.mortarShellData.push(mortarShellData);

    var shellChargeData = new MortarShellChargeData();
    shellChargeData.chargeLookupTableLines.push({
      distance: 1,
      elevation: 40,
      timeOfFlightSeconds: 30,
    });
    shellChargeData.chargeLookupTableLines.push({
      distance: 3,
      elevation: 60,
      timeOfFlightSeconds: 50,
    });
    mortarShellData.mortarShellCharges.push(shellChargeData);

    var linTarget = fireMission.CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 0,
      Length: 3,
      SubTargetCount: 3,
    });
    linTarget.shellId = mortarShellData.id;
    linTarget.shellChargeId = shellChargeData.id;

    var subtargetLines = linTarget.fireDateLines;
    expect(subtargetLines.length).toBeCloseTo(3);

    var subtargetLine0 = subtargetLines[0];

    subtargetLine0!.mortarId = mortar.id;
    var searchAndTraverseOutput0 = subtargetLine0?.calcSearchAndTraverse();
    expect(searchAndTraverseOutput0?.traverseDirectionMil).toBeCloseTo(0);
    expect(searchAndTraverseOutput0?.searchElevationMil).toBeCloseTo(10);
    expect(searchAndTraverseOutput0?.traverseDirectionRotations).toBeCloseTo(0);
    expect(searchAndTraverseOutput0?.searchElevationRotations).toBeCloseTo(2);
    expect(searchAndTraverseOutput0?.upCount).toBeCloseTo(2);
    expect(searchAndTraverseOutput0?.downCount).toBeCloseTo(0);

    //  console.log("ST Message: "+searchAndTraverseOutput0?.message);
    expect(searchAndTraverseOutput0?.message.includes("left")).toBeFalsy();
    expect(searchAndTraverseOutput0?.message.includes("right")).toBeFalsy();
    expect(searchAndTraverseOutput0?.message.includes("up")).toBeTruthy();
    expect(searchAndTraverseOutput0?.message.includes("down")).toBeFalsy();

    var subtargetLine2 = subtargetLines[2];
    subtargetLine2!.mortarId = mortar.id;
    var searchAndTraverseOutput2 = subtargetLine2?.calcSearchAndTraverse();
    //console.log("ST Message: "+searchAndTraverseOutput2?.message);
    expect(searchAndTraverseOutput2?.message.includes("up")).toBeFalsy();
    expect(searchAndTraverseOutput2?.message.includes("down")).toBeTruthy();
  });

  it("linear target at 10,12; correct fireDateLines for searchAndTraverse:traverse - coeficients from settings", () => {
    var appFDC: AppFDC = new AppFDC();

    var mrtType: MortarType = new MortarType();
    mrtType.directionMilPerRotation = 5;
    mrtType.elevationMilPerRotation = 5;
    appFDC.settings.mortarTypes.push(mrtType);

    var mortar = appFDC.CreateMortar();
    mortar.SetLocationGrid(10, 10);
    mortar.mortarTypeId = mrtType.id;

    var fireMission = appFDC.CreateFireMission();
    fireMission.SetInitialTargetGrid({ east: 10, north: 12 });

    var mortarShellData = new MortarShellData();
    appFDC.settings.mortarShellData.push(mortarShellData);

    var shellChargeData = new MortarShellChargeData();
    shellChargeData.chargeLookupTableLines.push({
      distance: 1,
      elevation: 40,
      timeOfFlightSeconds: 30,
    });
    shellChargeData.chargeLookupTableLines.push({
      distance: 3,
      elevation: 60,
      timeOfFlightSeconds: 50,
    });
    mortarShellData.mortarShellCharges.push(shellChargeData);

    var linTarget = fireMission.CreateLinearTarget();
    linTarget.SetLinearTargetProperties({
      AttitudeMil: 0,
      Length: 3,
      SubTargetCount: 3,
    });
    linTarget.shellId = mortarShellData.id;
    linTarget.shellChargeId = shellChargeData.id;

    var subtargetLines = linTarget.fireDateLines;
    expect(subtargetLines.length).toBeCloseTo(3);

    var subtargetLine0 = subtargetLines[0];

    subtargetLine0!.mortarId = mortar.id;
    var searchAndTraverseOutput0 = subtargetLine0?.calcSearchAndTraverse();
    expect(searchAndTraverseOutput0?.traverseDirectionMil).toBeCloseTo(0);
    expect(searchAndTraverseOutput0?.searchElevationMil).toBeCloseTo(10);
    expect(searchAndTraverseOutput0?.traverseDirectionRotations).toBeCloseTo(0);
    expect(searchAndTraverseOutput0?.searchElevationRotations).toBeCloseTo(2);
    expect(searchAndTraverseOutput0?.upCount).toBeCloseTo(2);
    expect(searchAndTraverseOutput0?.downCount).toBeCloseTo(0);
  });

  it("correct subtarget count from settings", () => {
    var appFDC: AppFDC = new AppFDC();

    var mrtType: MortarType = new MortarType();
    mrtType.blastDiameter = 25;
    appFDC.settings.mortarTypes.push(mrtType);



    var mortar = appFDC.CreateMortar();
    mortar.mortarTypeId = mrtType.id;
    mortar.SetLocationGrid(10, 10);

    appFDC.defaultSelectedMortarId = mortar.id;

    var fireMission = appFDC.CreateFireMission();

    fireMission.SetInitialTargetGrid({ east: 10, north: 11 });

    var linTarget = fireMission.CreateLinearTarget();

    var linTargetLength = 220;

    var optimalSubtargetCount = linTarget.calcOptimalSubtargetCount(linTargetLength);


    expect(optimalSubtargetCount).toBeCloseTo(9); //    220/25 = 8.8 -> (9)

    
  });

});


describe("Coordinated Illum", () => {

/*
                                                                      
                 -/ \-   N                                            
                /  |  \                                               
                   |                                  OT              
                   |                             /-                   
                   |                            ----------            
                   |                             \-                   
                  +-+                                                 
                  |||                                                 
              /|\-+-+                                                 
    RIGHT 2    |   |                                                  
               |   |                                                  
               |   |       ADD 1                                      
               |   |  /                                               
               |   | ---------                                        
                   |  \                                    --        E
                  +-+       +-+                               \-      
                  |-|-------|-|-------------------------------  --    
                  +-+       +-+                              --/      
              M(0,0)      T(1,0)                           -/         
                                                                      
*/

  it("Mortar at 0,0 - target at 1,0 - OT 4800 - Illum Correction: Right 2 Add 1 - So that after correction illum target coordinates are [0,2] ", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);

    fireMission.SetInitialTargetGrid({ east: 1, north: 0 }, 4800);

    var fireDataLine = fireMission.CreateNewFireDataLineForIllum();
    fireDataLine.correction = { right: 2, add: 1, up: 0 };
    fireDataLine.mortarId = mortar.id;
    var fireDataOutput = fireDataLine.CalcOutput();

    var distance = fireDataOutput.distanceMeters;
    var firingAngleMil = fireDataOutput.directionMil;

    expect(distance).toBeCloseTo(2);

    var correctAngle =
      approximatelyEqual(firingAngleMil, 6400) ||
      approximatelyEqual(firingAngleMil, 0);
    expect(correctAngle).toBeTruthy();

    var fuzeSetting = fireDataOutput.fuzeSetting;
    expect(fuzeSetting).toBeNaN();
  });

  it("Range is 5, but ArtilleryShellData are for range 4 and 6", () => {
    var appFDC: AppFDC = new AppFDC();
    var mortar = appFDC.CreateMortar();
    var fireMission = appFDC.CreateFireMission();

    mortar.SetLocationGrid(0, 0);
    fireMission.SetInitialTargetGrid({ east: 5, north: 0 });

    var fireDataLine = fireMission.CreateNewFireDataLineForIllum({
      mortarId: mortar.id,
    });

    var mortarShellData = new MortarShellData();
    appFDC.settings.mortarShellData.push(mortarShellData);

    var shellChargeData = new MortarShellChargeData();
    shellChargeData.chargeLookupTableLines.push({
      distance: 4,
      elevation: 40,
      timeOfFlightSeconds: 50,
      endVelocity: 5,
    });
    shellChargeData.chargeLookupTableLines.push({
      distance: 6,
      elevation: 60,
      timeOfFlightSeconds: 150,
      endVelocity: 15,
    });
    mortarShellData.mortarShellCharges.push(shellChargeData);

    fireDataLine.shellId = mortarShellData.id;
    fireDataLine.shellChargeId = shellChargeData.id;

    var fireDataOutput = fireDataLine.CalcOutput();
    expect(fireDataOutput.timeOfFlightSeconds).toBeCloseTo(100);
    expect(fireDataOutput.endVelocity).toBeCloseTo(10);
    expect(fireDataOutput.fuzeSetting).toBeCloseTo(100);

    fireDataLine.correction = { right: 0, add: 0, up: 100 };
    var fireDataOutput2 = fireDataLine.CalcOutput();
    expect(fireDataOutput2.timeOfFlightSeconds).toBeCloseTo(100);
    expect(fireDataOutput2.endVelocity).toBeCloseTo(10);

    //verticalUpCorr = 100
    //endVelocity = 10
    //timeOfFlightSeconds = 100
    //fuzeSetting = timeOfFlightSeconds - verticalUpCorr/endVelocity = 100 - 100/10 = 90

    expect(fireDataOutput2.fuzeSetting).toBeCloseTo(90);
  });
});

describe("Special cases", () => {
  
  it("FiringDataLineOutput distance and direction is NaN if mortar is not available", () => {
    var appFDC: AppFDC = new AppFDC();
    var fireMission = appFDC.CreateFireMission();

    fireMission.SetInitialTargetGrid({ east: 1, north: 0 });

    var fireDataLine = fireMission.CreateNewFireDataLine();
    var fireDataOutput = fireDataLine.CalcOutput();

    expect(fireDataOutput.distanceMeters).toBeNaN();
    expect(fireDataOutput.directionMil).toBeNaN();
  });

});


function approximatelyEqual(num1: number, num2: number) {
  var epsilon = 0.001;

  return Math.abs(num1 - num2) < epsilon;
}

/*
ascii zīmētājs
https://textik.com/#10ae0d21e7bd67f8
*/
