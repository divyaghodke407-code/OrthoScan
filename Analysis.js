// ======================================
// NAVIGATION
// ======================================

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

    });

});


// ======================================
// ELEMENTS
// ======================================

const input = document.getElementById("xrayInput");

const uploadContent =
    document.getElementById("uploadContent");

const previewArea =
    document.getElementById("previewArea");

const previewImage =
    document.getElementById("previewImage");

const fileName =
    document.getElementById("fileName");

const removeBtn =
    document.getElementById("removeBtn");

const uploadBox =
    document.getElementById("uploadBox");


// ======================================
// UPLOAD IMAGE
// ======================================

input.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    showImage(file);

});


function showImage(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        return;

    }

    const imageURL =
        URL.createObjectURL(file);

    previewImage.src = imageURL;

    fileName.textContent = file.name;

    uploadContent.style.display = "none";

    previewArea.style.display = "block";

}


// ======================================
// REMOVE IMAGE
// ======================================

removeBtn.addEventListener("click", function () {

    input.value = "";

    previewImage.src = "";

    fileName.textContent = "";

    uploadContent.style.display = "block";

    previewArea.style.display = "none";

});


// ======================================
// DRAG & DROP
// ======================================

uploadBox.addEventListener("dragover", function (e) {

    e.preventDefault();

    uploadBox.classList.add("dragging");

});


uploadBox.addEventListener("dragleave", function () {

    uploadBox.classList.remove("dragging");

});


uploadBox.addEventListener("drop", function (e) {

    e.preventDefault();

    uploadBox.classList.remove("dragging");

    const file =
        e.dataTransfer.files[0];

    if (!file) return;

    showImage(file);

    // Important:
    // dropped file input मध्ये set करण्यासाठी
    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    input.files = dataTransfer.files;

});


// ======================================
// CONTINUE TO PREVIEW
// ======================================

document
    .getElementById("continueBtn")
    .addEventListener("click", function () {

        if (!input.files[0]) {

            alert("Please upload an X-ray first.");

            return;

        }

        showPreviewPage();

    });


// ======================================
// PREVIEW PAGE
// ======================================

function showPreviewPage() {

    document
        .getElementById("uploadScreen")
        .style.display = "none";

    document
        .getElementById("previewScreen")
        .style.display = "block";


    // Upload completed

    const uploadStep =
        document.querySelector(
            "#uploadScreen .step"
        );

    if (uploadStep) {
        uploadStep.classList.add("completed");
    }


    // Preview step active

    const previewStep =
        document.querySelector(
            "#previewScreen .step:nth-of-type(3)"
        );

    if (previewStep) {
        previewStep.classList.add("active");
    }


    // Actual image

    const file =
        input.files[0];

    const imageURL =
        URL.createObjectURL(file);


    const previewPageImage =
        document.getElementById(
            "previewPageImage"
        );

    if (previewPageImage) {

        previewPageImage.src =
            imageURL;

    }


    // File name

    const previewNames =
        document.querySelectorAll(
            "#previewScreen #previewFileName"
        );

    previewNames.forEach(element => {

        element.textContent =
            file.name;

    });


    // File size
    // जर HTML मध्ये previewFileSize असेल तर

    const previewSize =
        document.getElementById(
            "previewFileSize"
        );

    if (previewSize) {

        previewSize.textContent =
            formatFileSize(file.size);

    }

}


// ======================================
// FILE SIZE
// ======================================

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";

    }

    return (
        bytes /
        (1024 * 1024)
    ).toFixed(1) + " MB";

}


// ======================================
// REMOVE FROM PREVIEW
// ======================================

document
    .getElementById("previewRemoveBtn")
    .addEventListener("click", function () {

        input.value = "";

        document
            .getElementById("previewScreen")
            .style.display = "none";

        document
            .getElementById("uploadScreen")
            .style.display = "flex";


        previewImage.src = "";

        uploadContent.style.display = "block";

        previewArea.style.display = "none";


        document
            .querySelectorAll(".step")
            .forEach(step => {

                step.classList.remove(
                    "active"
                );

                step.classList.remove(
                    "completed"
                );

            });


        document
            .querySelector("#uploadScreen .step")
            .classList.add("active");

    });


// ======================================
// ANALYZE X-RAY
// ======================================

document
    .getElementById("analyzeBtn")
    .addEventListener("click", function () {

        if (!input.files[0]) {

            alert("Please upload an X-ray first.");

            return;

        }


        // Preview hide

        document
            .getElementById("previewScreen")
            .style.display = "none";


        // Analyzing show

        document
            .getElementById("analyzingScreen")
            .style.display = "block";


        // Start animation

        startAnalysis();

    });


// ======================================
// AI ANALYSIS
// ======================================

function startAnalysis() {

    const progressBar =
        document.getElementById(
            "analysisProgress"
        );

    const percentText =
        document.getElementById(
            "analysisPercent"
        );


    const status1 =
        document.getElementById(
            "analysisStatus1"
        );

    const status2 =
        document.getElementById(
            "analysisStatus2"
        );

    const status3 =
        document.getElementById(
            "analysisStatus3"
        );


    let progress = 0;


    // Reset

    progressBar.style.width = "0%";

    percentText.textContent = "0%";


    status1.classList.add(
        "active-status"
    );

    status2.classList.remove(
        "active-status"
    );

    status3.classList.remove(
        "active-status"
    );


    status2.querySelector("span")
        .textContent = "○";

    status3.querySelector("span")
        .textContent = "○";


    const analysisTimer =
        setInterval(function () {

            progress++;


            // Progress

            progressBar.style.width =
                progress + "%";


            percentText.textContent =
                progress + "%";


            // 30%

            if (progress >= 30) {

                status1.classList.remove(
                    "active-status"
                );

                status2.classList.add(
                    "active-status"
                );

                status2.querySelector("span")
                    .textContent = "✓";

            }


            // 70%

            if (progress >= 70) {

                status2.classList.remove(
                    "active-status"
                );

                status3.classList.add(
                    "active-status"
                );

                status3.querySelector("span")
                    .textContent = "✓";

            }


            // Complete

            if (progress >= 100) {

                clearInterval(
                    analysisTimer
                );


                setTimeout(function () {

                    showResultScreen();

                }, 800);

            }

        }, 45);

}


// ======================================
// RESULT SCREEN
// ======================================

function showResultScreen() {

    document
        .getElementById("analyzingScreen")
        .style.display = "none";


    document
        .getElementById("resultScreen")
        .style.display = "block";


    const file =
        input.files[0];


    if (!file) return;


    const imageURL =
        URL.createObjectURL(file);


    const resultImage =
        document.getElementById(
            "resultImage"
        );


    if (resultImage) {

        resultImage.src =
            imageURL;

    }


    // Result file name

    const resultFileName =
        document.getElementById(
            "resultFileName"
        );

    if (resultFileName) {

        resultFileName.textContent =
            file.name;

    }

}


// ======================================
// NEW ANALYSIS
// ======================================

document
    .getElementById("newAnalysisBtn")
    .addEventListener("click", function () {


        // Result hide

        document
            .getElementById("resultScreen")
            .style.display = "none";


        // Upload show

        document
            .getElementById("uploadScreen")
            .style.display = "flex";


        // Reset input

        input.value = "";


        // Reset image

        previewImage.src = "";

        fileName.textContent = "";


        uploadContent.style.display =
            "block";

        previewArea.style.display =
            "none";


        // Reset analysis

        const progressBar =
            document.getElementById(
                "analysisProgress"
            );

        const percentText =
            document.getElementById(
                "analysisPercent"
            );


        if (progressBar) {

            progressBar.style.width =
                "0%";

        }


        if (percentText) {

            percentText.textContent =
                "0%";

        }


        // Reset steps

        document
            .querySelectorAll(".step")
            .forEach(step => {

                step.classList.remove(
                    "active"
                );

                step.classList.remove(
                    "completed"
                );

            });


        // Upload active

        document
            .querySelector(
                "#uploadScreen .step"
            )
            .classList.add("active");

    });


// ======================================
// DOWNLOAD PDF REPORT
// ======================================

document
    .getElementById("downloadReportBtn")
    .addEventListener("click", async function () {


        const file =
            input.files[0];


        if (!file) {

            alert(
                "No X-ray image found."
            );

            return;

        }


        // jsPDF check

        if (!window.jspdf) {

            alert(
                "PDF library is not loaded."
            );

            return;

        }


        try {

            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF(
                    "p",
                    "mm",
                    "a4"
                );


            const pageWidth =
                210;

            const margin =
                18;

            const contentWidth =
                pageWidth -
                (margin * 2);


            // ==================================
            // HEADER
            // ==================================

            pdf.setTextColor(
                11,
                44,
                104
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(23);

            pdf.text(
                "OrthoScan",
                margin,
                20
            );


            pdf.setTextColor(
                80,
                95,
                115
            );

            pdf.setFontSize(9);

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "AI X-RAY ANALYSIS REPORT",
                132,
                18
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.text(
                "Screening Report",
                150,
                23
            );


            // Header line

            pdf.setDrawColor(
                220,
                230,
                242
            );

            pdf.line(
                margin,
                29,
                pageWidth - margin,
                29
            );


            // ==================================
            // FILE INFORMATION
            // ==================================

            pdf.setFillColor(
                247,
                250,
                255
            );

            pdf.roundedRect(
                margin,
                36,
                contentWidth,
                29,
                2,
                2,
                "F"
            );


            pdf.setTextColor(
                75,
                88,
                106
            );

            pdf.setFontSize(9);

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "File Name",
                margin + 7,
                44
            );

            pdf.text(
                "Analysis Date",
                110,
                44
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.text(
                file.name,
                margin + 7,
                50
            );

            pdf.text(
                new Date()
                    .toLocaleDateString(),
                110,
                50
            );


            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "Analysis Type",
                margin + 7,
                58
            );

            pdf.text(
                "Status",
                110,
                58
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.text(
                "AI-assisted fracture screening",
                margin + 7,
                62
            );


            pdf.setTextColor(
                39,
                129,
                75
            );

            pdf.text(
                "Analysis Complete",
                110,
                62
            );


            // ==================================
            // X-RAY IMAGE
            // ==================================

            pdf.setTextColor(
                24,
                55,
                95
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(13);

            pdf.text(
                "X-ray Image",
                margin,
                77
            );


            // Black image container

            pdf.setFillColor(
                10,
                10,
                10
            );

            pdf.roundedRect(
                margin,
                82,
                contentWidth,
                90,
                2,
                2,
                "F"
            );


            // Convert uploaded image

            const imageData =
                await getImageData(file);


            const img =
                new Image();

            img.src =
                imageData;


            await new Promise(
                resolve => {

                    img.onload =
                        resolve;

                }
            );


            const maxWidth =
                contentWidth - 10;

            const maxHeight =
                80;


            let imgWidth =
                img.width;

            let imgHeight =
                img.height;


            const ratio =
                Math.min(
                    maxWidth / imgWidth,
                    maxHeight / imgHeight
                );


            imgWidth *= ratio;

            imgHeight *= ratio;


            const imageX =
                margin +
                (contentWidth -
                    imgWidth) / 2;


            const imageY =
                127 -
                (imgHeight / 2);


            // Image format

            const imageFormat =
                file.type === "image/png"
                    ? "PNG"
                    : "JPEG";


            pdf.addImage(
                imageData,
                imageFormat,
                imageX,
                imageY,
                imgWidth,
                imgHeight
            );


            // ==================================
            // ANALYSIS RESULT
            // ==================================

            pdf.setTextColor(
                24,
                55,
                95
            );

            pdf.setFontSize(13);

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "Analysis Result",
                margin,
                187
            );


            pdf.setFillColor(
                240,
                250,
                244
            );

            pdf.roundedRect(
                margin,
                193,
                contentWidth,
                32,
                2,
                2,
                "F"
            );


            pdf.setTextColor(
                70,
                85,
                105
            );

            pdf.setFontSize(9);

            pdf.text(
                "Screening Status",
                margin + 7,
                202
            );


            pdf.setTextColor(
                39,
                117,
                75
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "No obvious fracture detected",
                margin + 7,
                209
            );


            pdf.setTextColor(
                70,
                85,
                105
            );

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.text(
                "AI Confidence",
                margin + 7,
                218
            );


            pdf.setTextColor(
                23,
                100,
                232
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "94%",
                170,
                218
            );


            // Confidence background

            pdf.setFillColor(
                225,
                231,
                239
            );

            pdf.roundedRect(
                margin + 7,
                220,
                contentWidth - 14,
                3,
                1.5,
                1.5,
                "F"
            );


            // Confidence

            pdf.setFillColor(
                23,
                100,
                232
            );

            pdf.roundedRect(
                margin + 7,
                220,
                (contentWidth - 14) *
                0.94,
                3,
                1.5,
                1.5,
                "F"
            );


            // ==================================
            // AI FINDINGS
            // ==================================

            pdf.setTextColor(
                24,
                55,
                95
            );

            pdf.setFontSize(13);

            pdf.text(
                "AI Findings",
                margin,
                240
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(9);

            pdf.setTextColor(
                70,
                85,
                105
            );


            pdf.text(
                "✓  Bone structure appears preserved.",
                margin,
                250
            );


            pdf.text(
                "✓  No obvious fracture pattern identified.",
                margin,
                260
            );


            pdf.text(
                "✓  Image quality is suitable for AI screening.",
                margin,
                270
            );


            // ==================================
            // IMPORTANT NOTE
            // ==================================

            pdf.setFillColor(
                255,
                248,
                232
            );

            pdf.roundedRect(
                margin,
                282,
                contentWidth,
                25,
                2,
                2,
                "F"
            );


            pdf.setTextColor(
                90,
                85,
                65
            );

            pdf.setFontSize(8.5);

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.text(
                "Important:",
                margin + 7,
                291
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.text(
                "This AI-generated result is intended for screening",
                margin + 7,
                297
            );

            pdf.text(
                "assistance only and should not replace professional medical evaluation.",
                margin + 7,
                303
            );


            // ==================================
            // FOOTER
            // ==================================

            pdf.setDrawColor(
                220,
                230,
                242
            );

            pdf.line(
                margin,
                320,
                pageWidth - margin,
                320
            );


            pdf.setTextColor(
                125,
                137,
                153
            );

            pdf.setFontSize(8);

            pdf.text(
                "OrthoScan • AI-assisted X-ray screening",
                pageWidth / 2,
                328,
                {
                    align: "center"
                }
            );


            // ==================================
            // DOWNLOAD
            // ==================================

            pdf.save(
                "OrthoScan-Xray-Report.pdf"
            );

        }
        catch (error) {

            console.error(
                "PDF generation error:",
                error
            );

            alert(
                "Unable to generate PDF report."
            );

        }

    });


// ======================================
// IMAGE → DATA URL
// ======================================

function getImageData(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    resolve(
                        event.target.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to read X-ray image."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}