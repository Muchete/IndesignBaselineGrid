
//  © Michael Schoenenberger, June 2017 (Vinz is not allowed to copy©)

//standard Values
var portrait = false,
    pHeight = 297,
    pWidth = 210, 
    orientation,
    rasterAnfang = 15,
    rasterLinks = 10,
    rasterRechts = 10,
    zeilen = 6,
    spalten = 4,
    anzSpaltenProSpaltenAbstand = 1,
    zeilenAbstand = 5,
    fontSize = 9,
    rasterHoehe = fontSize*1.2,
    letterMsize = 2.286;

var spaltenAbstand,
    _height = 0,
    x = -1,
    zeilenHoehe,
    xDef,
    rasterEnde,
    baseStart;

var rasterEndeChoices = ["1","2","3","4","5"],
    defNumber,
    gutterWidthDifferent,
    customSize,
    format;

var aFormats = [841, 594, 420, 297, 210, 148, 105, 74, 52, 37, 26],
    bFormats = [1000, 707, 500, 353, 250, 176, 125, 88, 62, 44, 31],
    cFormats = [917, 648, 458, 324, 229, 162, 114, 81, 57, 40, 28],
    allFormats = [];

for (var i = 0; i < 11; i++) {
    allFormats.push(aFormats[i]);
    allFormats.push(bFormats[i]);
    allFormats.push(cFormats[i]);
}

//configure dialogs
var startDialog = app.dialogs.add({
    name: "Create A Baseline Grid, Rows and Columns",
    canCancel: true
});

var endDialog = app.dialogs.add({
    name: "Create A Baseline Grid, Rows and Columns",
    canCancel: true
});

var min_width_left = 200;
var min_width_right = 160;

function defineStartDialog(){
    with(startDialog) {
            //Add a dialog column.
            with(dialogColumns.add()) {
                //Create a border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Page Size:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Page Orientation", minWidth: min_width_left });
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            format = dropdowns.add({                    stringList: ["A0", "B0", "C0", "A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3", "A4", "B4", "C4", "A5", "B5", "C5", "A6", "B6", "C6", "A7", "B7", "C7", "A8", "B8", "C8", "A9", "B9", "C9", "A10", "B10", "C10"],
                                                                        selectedIndex: 12, 
                                                                        minWidth: min_width_right });

                            orientation = dropdowns.add({               stringList: ["Portrait", "Landscape"], 
                                                                        selectedIndex: 0, 
                                                                        minWidth: min_width_right });
                        }
                    }
                customSize = enablingGroups.add({staticLabel: "Custom Page Size", checkedState: false});
                with (customSize) {
                        with (dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Page Height:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Page Width:", minWidth: min_width_left });
                        }
                        with (dialogColumns.add()) {
                            pHeight     = measurementEditboxes.add({    editValue: pHeight * 2.83465, 
                                                                        editUnits:MeasurementUnits.millimeters, 
                                                                        minWidth: min_width_right});

                            pWidth      = measurementEditboxes.add({    editValue: pWidth * 2.83465, 
                                                                        editUnits:MeasurementUnits.millimeters, 
                                                                        minWidth: min_width_right});
                        }
                    }
                    //Create another border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Upper Margin:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Left Margin:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Right Margin:", minWidth: min_width_left});
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            rasterAnfang    = measurementEditboxes.add({    editValue: rasterAnfang * 2.83465, 
                                                                            editUnits:MeasurementUnits.millimeters, 
                                                                            minWidth: min_width_right});

                            rasterLinks     = measurementEditboxes.add({    editValue: rasterLinks * 2.83465, 
                                                                            editUnits:MeasurementUnits.millimeters, 
                                                                            minWidth: min_width_right});

                            rasterRechts    = measurementEditboxes.add({    editValue: rasterRechts * 2.83465, 
                                                                            editUnits:MeasurementUnits.millimeters, 
                                                                            minWidth: min_width_right});
                        }
                    }
                    //Create another border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Rows:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Columns:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Textlines in the column gutter:", minWidth: min_width_left });
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            zeilen                          = integerEditboxes.add({    editValue: zeilen, 
                                                                                        largeNudge: 50, 
                                                                                        smallNudge: zeilen, 
                                                                                        minimumValue: 0, 
                                                                                        maximumValue: 200,
                                                                                        minWidth: min_width_right});

                            spalten                         = integerEditboxes.add({    editValue: spalten,
                                                                                        largeNudge: 50, 
                                                                                        smallNudge: spalten, 
                                                                                        minimumValue: 0, 
                                                                                        maximumValue: 200,
                                                                                        minWidth: min_width_right});

                            anzSpaltenProSpaltenAbstand     = integerEditboxes.add({    editValue: anzSpaltenProSpaltenAbstand,
                                                                                        largeNudge: 50, 
                                                                                        smallNudge: anzSpaltenProSpaltenAbstand, 
                                                                                        minimumValue: 0, 
                                                                                        maximumValue: 100,
                                                                                        minWidth: min_width_right});
                        }
                    }
                gutterWidthDifferent = enablingGroups.add({staticLabel: "Different Gutter Width", checkedState: false});
                with (gutterWidthDifferent) {
                        with (dialogColumns.add()) {
                            staticTexts.add( {staticLabel: "Row Gutter Width:", minWidth: min_width_left} );
                        }
                        with (dialogColumns.add()) {
                            zeilenAbstand = measurementEditboxes.add({  editValue: zeilenAbstand * 2.83465, 
                                                                        editUnits:MeasurementUnits.millimeters, 
                                                                        minWidth: min_width_right});
                        }
                    }
                    //Create another border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Font Size:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Leading:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Height of the letter M:", minWidth: min_width_left});
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            fontSize    = measurementEditboxes.add({    editValue: fontSize, 
                                                                        editUnits:MeasurementUnits.points, 
                                                                        minWidth: min_width_right});
                            rasterHoehe = measurementEditboxes.add({    editValue: rasterHoehe, 
                                                                        editUnits:MeasurementUnits.points, 
                                                                        minWidth: min_width_right});
                            letterMsize = measurementEditboxes.add({    editValue: letterMsize * 2.83465, 
                                                                        editUnits:MeasurementUnits.millimeters, 
                                                                        minWidth: min_width_right});
                        }
                    }
            }
        }
}

function defineEndDialog(){
    with(endDialog) {
        //Add a dialog column.
            with(dialogColumns.add()) {
                //Create a border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Select Bottom Margin", minWidth: min_width_left });
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            defNumber = radiobuttonGroups.add();
                            with(defNumber) {
                                
                                radiobuttonControls.add({staticLabel: rasterEndeChoices[0].toFixed(2) + " mm", checkedState: true, minWidth: min_width_right});

                                for (var i = 1; i < rasterEndeChoices.length; i++) {
                                    radiobuttonControls.add({staticLabel: rasterEndeChoices[i].toFixed(2) + " mm", checkedState: false, minWidth: min_width_right});
                                }
                            }
                        }
                    }
                }
    }   
}

function redefineVars(){

    customSize = customSize.checkedState;

    if (customSize){

        pHeight = pHeight.editValue * 0.352778;
        pWidth = pWidth.editValue * 0.352778;

    } else {

        pWidth = allFormats[format.selectedIndex];
        pHeight = Math.round(Math.sqrt(2) * pWidth);

        if (orientation.selectedIndex == 0)  {
            portrait = true;
        }

        if (portrait) {
            if (pHeight < pWidth) {
                var a = pHeight;
                pHeight = pWidth;
                pWidth = a;
            }
        } else {
            if (pHeight > pWidth) {
                var a = pHeight;
                pHeight = pWidth;
                pWidth = a;
            }
        }
    }

    pHeight = Math.floor(pHeight);
    pWidth = Math.floor(pWidth);

    rasterAnfang = rasterAnfang.editValue * 0.352778;
    rasterLinks = rasterLinks.editValue * 0.352778;
    rasterRechts = rasterRechts.editValue * 0.352778;

    zeilen = zeilen.editValue;
    spalten = spalten.editValue;
    anzSpaltenProSpaltenAbstand = anzSpaltenProSpaltenAbstand.editValue;

    gutterWidthDifferent = gutterWidthDifferent.checkedState;
    zeilenAbstand = zeilenAbstand.editValue * 0.352778;

    fontSize = fontSize.editValue;
    rasterHoehe = rasterHoehe.editValue * 0.352778;
    letterMsize = letterMsize.editValue * 0.352778;
}


function calcStuff(){
    spaltenAbstand = (rasterHoehe - letterMsize) + (anzSpaltenProSpaltenAbstand * rasterHoehe);
    if (!gutterWidthDifferent) {
        zeilenAbstand = spaltenAbstand;
    }

    //find maximal rows:

    while ((pHeight - rasterAnfang) > _height) {
        x += 1;
        zeilenHoehe = letterMsize + (x * rasterHoehe);
        _height = (zeilen * zeilenHoehe) + ((zeilen - 1) * spaltenAbstand);
    }

    xDef = x - 1;

    zeilenHoehe = (letterMsize + (xDef * rasterHoehe));
    _height = (zeilen * zeilenHoehe) + ((zeilen - 1) * spaltenAbstand);

    rasterEnde = ((pHeight - _height) - rasterAnfang);
    baseStart = (rasterAnfang - (rasterHoehe - letterMsize));

    rasterEndeChoices[0] = rasterEnde;
}

function calcAlternatives(i){
    x = xDef - i;
    zeilenHoehe = (letterMsize + (x * rasterHoehe));
    _height = (zeilen * zeilenHoehe) + ((zeilen - 1) * spaltenAbstand);
    rasterEnde = ((pHeight - _height) - rasterAnfang);
    baseStart = (rasterAnfang - (rasterHoehe - letterMsize));
    return rasterEnde;
}

function setValues(i){
    xDef -= i;
    zeilenHoehe = (letterMsize + (xDef * rasterHoehe));
    _height = (zeilen * zeilenHoehe) + ((zeilen - 1) * spaltenAbstand);
    rasterEnde = ((pHeight - _height) - rasterAnfang);
    baseStart = (rasterAnfang - (rasterHoehe - letterMsize));
}

function createPage(){
    //Create PAGE
    //Create a new document.
    var myDocument = app.documents.add();
    with(myDocument.documentPreferences) {
        pageHeight = pHeight + "mm";
        pageWidth = pWidth + "mm";
        if (portrait) {
            pageOrientation = PageOrientation.portrait;
        } else {
            pageOrientation = PageOrientation.landscape;
        }
        pagesPerDocument = 4;
    }

    //Get a reference to the first master spread.
    var myMasterSpread = myDocument.masterSpreads.item(0);

    with(myMasterSpread.pages.item(0).marginPreferences) {
        columnCount = 1;
        //columnGutter can be a number or a measurement string.
        //columnGutter = "1p";
        bottom = rasterEnde + "mm"
        left = rasterLinks + "mm"
        right = rasterRechts + "mm"
        top = rasterAnfang + "mm"
    }

    with(myMasterSpread.pages.item(1).marginPreferences) {
        columnCount = 1;
        //columnGutter can be a number or a measurement string.
        //columnGutter = "1p";
        bottom = rasterEnde + "mm"
        left = rasterLinks + "mm"
        right = rasterRechts + "mm"
        top = rasterAnfang + "mm"
    }

    with(myMasterSpread) {
        //Parameters (all optional): row count, column count, row gutter,
        //column gutter,guide color, fit margins, remove existing, layer.
        //Note that the createGuides method does not take an RGB array
        //for the guide color parameter.
        createGuides(zeilen, spalten, spaltenAbstand + "mm", zeilenAbstand + "mm", UIColors.pink, true, true, myDocument.layers.item(0));
    }

    //add baseline grid:
    var myGridPreferences = myDocument.gridPreferences;
    myGridPreferences.baselineDivision = rasterHoehe + "mm";
    myGridPreferences.baselineStart = baseStart + "mm";
    myGridPreferences.baselineGridShown = true;

    with(myDocument.textDefaults) {
        alignToBaseline = true;
        pointSize = fontSize;
        leading = rasterHoehe;
    }
}

defineStartDialog();
    //Display the dialog box.
if (startDialog.show() == true) {

    redefineVars();
    calcStuff();

    for (var i = 0; i < rasterEndeChoices.length; i++) {
        rasterEndeChoices[i] = calcAlternatives(i);
    }

    defineEndDialog();

    if (endDialog.show() == true) {

        setValues(defNumber.selectedButton);

        endDialog.destroy();
        startDialog.destroy();
    
        createPage();
    } else {
        endDialog.destroy();
        startDialog.destroy();
    }

} else {
    startDialog.destroy()
}
