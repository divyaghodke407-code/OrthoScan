const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        // आधीच्या active link मधून class काढा
        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        // ज्या link वर click केलं त्याला active करा
        this.classList.add("active");
    });
});
const reports = [

    {
        id: 1,
        file: "images/hand.jpg",
        image: "images/hand.jpg",
        size: "245 KB",
        date: "30 Sep 2026",
        time: "10:45 AM",
        type: "Hand",
        icon: "✋",
        result: "No fracture detected",
        confidence: 94
    },

    {
        id: 2,
        file: "knee_xray_02.jpg",
        image: "images/knee.jpg",
        size: "312 KB",
        date: "29 Sep 2026",
        time: "04:20 PM",
        type: "Knee",
        icon: "🦵",
        result: "No fracture detected",
        confidence: 92
    },

    {
        id: 3,
        file: "leg_xray_03.jpg",
        image: "images/leag.jpg",
        size: "198 KB",
        date: "28 Sep 2026",
        time: "11:15 AM",
        type: "Leg",
        icon: "🦴",
        result: "No fracture detected",
        confidence: 96
    },

    {
        id: 4,
        file: "spine_xray_04.jpg",
        image: "images/spine.jpg",
        size: "420 KB",
        date: "27 Sep 2026",
        time: "02:30 PM",
        type: "Spine",
        icon: "🦴",
        result: "No fracture detected",
        confidence: 90
    },

    {
        id: 5,
        file: "hand_xray_05.jpg",
        image: "images/hand2.jpg",
        size: "267 KB",
        date: "25 Sep 2026",
        time: "09:10 AM",
        type: "Hand",
        icon: "✋",
        result: "Possible fracture",
        confidence: 78
    }

];


let selectedType = "All";

const reportBody = document.getElementById("reportBody");
const searchInput = document.getElementById("searchInput");


/* DISPLAY REPORTS */

function displayReports() {

    const search = searchInput.value.toLowerCase();

    const filteredReports = reports.filter(report => {

        const searchMatch =
            report.file.toLowerCase().includes(search);

        const typeMatch =
            selectedType === "All" ||
            report.type === selectedType;

        return searchMatch && typeMatch;

    });


    if (filteredReports.length === 0) {

        reportBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:40px;">
                    No reports found.
                </td>
            </tr>
        `;

        return;
    }


    reportBody.innerHTML = filteredReports.map(report => {

        const warning =
            report.result === "Possible fracture";

        return `

        <tr>

            <td>
                ${report.id}
            </td>


            <td>

                <img
                    class="xray"
                    src="${report.image}"
                    alt="${report.file}"
                    onerror="this.style.opacity='.15'"
                >

            </td>


            <td>

                <span class="file-name">
                    ${report.file}
                </span>

                <span class="file-size">
                    ${report.size}
                </span>

            </td>


            <td>

                <span class="date">
                    ${report.date}
                </span>

                <span class="time">
                    ${report.time}
                </span>

            </td>


            <td>

                <div class="type">

                    <span class="type-icon">
                        ${report.icon}
                    </span>

                    <div>

                        <span class="type-name">
                            ${report.type}
                        </span>

                        <span class="type-sub">
                            AI Fracture Screening
                        </span>

                    </div>

                </div>

            </td>


            <td>

                <span class="result ${warning ? "warning" : ""}">

                    ${warning ? "!" : "✓"}

                    ${report.result}

                </span>

            </td>


            <td>

                <div
                    class="confidence"
                    style="--confidence:${report.confidence}"
                >

                    <span>
                        ${report.confidence}%
                    </span>

                </div>

            </td>


            <td>

                <div class="actions">

                    <button
                        class="view-btn"
                        onclick="viewReport(${report.id})"
                    >
                        ◉ View
                    </button>


                    <button
                        class="download-btn"
                        onclick="downloadReport(${report.id}, this)"
                    >
                        ⇩ Download
                    </button>


                    <button class="more-btn">
                        ⋮
                    </button>

                </div>

            </td>

        </tr>

        `;

    }).join("");

}


/* FILTER */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedType = button.dataset.type;

        displayReports();

    });

});


/* SEARCH */

searchInput.addEventListener(
    "input",
    displayReports
);


/* VIEW */

function viewReport(id) {

    const report =
        reports.find(item => item.id === id);

    if (!report) return;


    alert(
        "Report Details\n\n" +

        "File: " + report.file + "\n" +

        "Type: " + report.type + "\n" +

        "Date: " +
        report.date +
        " " +
        report.time +
        "\n\n" +

        "Result: " +
        report.result +
        "\n\n" +

        "AI Confidence: " +
        report.confidence +
        "%"
    );

}


/* IMAGE → DATA URL */

async function imageToDataURL(url) {

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error("Image not found");
    }

    const blob =
        await response.blob();


    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();

        reader.onloadend =
            () => resolve(reader.result);

        reader.onerror =
            reject;

        reader.readAsDataURL(blob);

    });

}


/* DOWNLOAD PDF */

async function downloadReport(id, button) {

    const report =
        reports.find(item => item.id === id);

    if (!report) return;


    /* Check jsPDF */

    if (!window.jspdf) {

        alert(
            "PDF library load झाली नाही."
        );

        return;
    }


    const oldText =
        button.innerHTML;

    button.disabled = true;

    button.innerHTML =
        "Generating...";


    try {

        const { jsPDF } =
            window.jspdf;


        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );


        /* COLORS */

        const darkBlue =
            [18, 52, 105];

        const blue =
            [20, 111, 230];

        const green =
            [25, 128, 94];


        /* HEADER */

        pdf.setFillColor(
            16,
            46,
            93
        );

        pdf.rect(
            0,
            0,
            210,
            30,
            "F"
        );


        pdf.setTextColor(
            255,
            255,
            255
        );

        pdf.setFontSize(21);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            "OrthoScan",
            15,
            14
        );


        pdf.setFontSize(9);

        pdf.setFont(
            undefined,
            "normal"
        );

        pdf.text(
            "AI-Powered X-ray Analysis",
            15,
            21
        );


        pdf.setFontSize(10);

        pdf.text(
            "X-RAY ANALYSIS REPORT",
            142,
            17
        );


        /* TITLE */

        pdf.setTextColor(
            ...darkBlue
        );

        pdf.setFontSize(17);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            "Report Details",
            15,
            43
        );


        /* DETAILS */

        pdf.setFontSize(10);

        pdf.setFont(
            undefined,
            "normal"
        );

        pdf.text(
            "File Name: " + report.file,
            15,
            52
        );

        pdf.text(
            "Analysis Date: " +
            report.date +
            " " +
            report.time,
            15,
            59
        );

        pdf.text(
            "Analysis Type: AI Fracture Screening",
            15,
            66
        );


        /* X-RAY BOX */

        pdf.setFillColor(
            247,
            250,
            255
        );

        pdf.roundedRect(
            15,
            73,
            180,
            78,
            4,
            4,
            "F"
        );


        pdf.setTextColor(
            ...darkBlue
        );

        pdf.setFontSize(12);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            "X-ray Image",
            20,
            82
        );


        /* ACTUAL IMAGE */

        try {

            const imageData =
                await imageToDataURL(
                    report.image
                );


            const properties =
                pdf.getImageProperties(
                    imageData
                );


            const maxWidth = 105;
            const maxHeight = 60;


            const ratio =
                Math.min(
                    maxWidth /
                        properties.width,

                    maxHeight /
                        properties.height
                );


            const width =
                properties.width *
                ratio;

            const height =
                properties.height *
                ratio;


            const x =
                105 -
                width / 2;

            const y =
                86 +
                (60 - height) / 2;


            const format =
                imageData.includes(
                    "image/png"
                )
                    ? "PNG"
                    : "JPEG";


            pdf.addImage(
                imageData,
                format,
                x,
                y,
                width,
                height
            );

        } catch (error) {

            pdf.setTextColor(
                120,
                140,
                170
            );

            pdf.setFontSize(10);

            pdf.text(
                "X-ray image unavailable",
                20,
                105
            );

        }


        /* RESULT */

        pdf.setTextColor(
            ...darkBlue
        );

        pdf.setFontSize(16);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            "Screening Result",
            15,
            164
        );


        const warning =
            report.result ===
            "Possible fracture";


        pdf.setFillColor(
            warning ? 255 : 232,
            warning ? 244 : 248,
            warning ? 214 : 240
        );


        pdf.roundedRect(
            15,
            171,
            180,
            30,
            4,
            4,
            "F"
        );


        pdf.setTextColor(
            ...(warning
                ? [160, 100, 0]
                : green)
        );


        pdf.setFontSize(13);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            report.result,
            22,
            183
        );


        pdf.setTextColor(
            ...darkBlue
        );

        pdf.setFontSize(10);

        pdf.setFont(
            undefined,
            "normal"
        );

        pdf.text(
            "AI Confidence: " +
            report.confidence +
            "%",
            22,
            193
        );


        /* FINDINGS */

        pdf.setFontSize(16);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            "AI Findings",
            15,
            216
        );


        pdf.setFontSize(10);

        pdf.setFont(
            undefined,
            "normal"
        );


        const findings =
            warning

                ? [
                    "Possible fracture pattern identified.",
                    "Further professional evaluation is recommended.",
                    "AI screening result should be clinically confirmed."
                ]

                : [
                    "Bone alignment appears preserved.",
                    "No obvious fracture pattern identified.",
                    "Image quality is suitable for AI screening."
                ];


        findings.forEach(
            (finding, index) => {

                const y =
                    228 +
                    index * 12;


                pdf.setTextColor(
                    ...green
                );

                pdf.text(
                    "-",
                    20,
                    y
                );


                pdf.setTextColor(
                    ...darkBlue
                );

                pdf.text(
                    finding,
                    27,
                    y
                );

            }
        );


        /* IMPORTANT NOTE */

        pdf.setFillColor(
            255,
            247,
            228
        );

        pdf.roundedRect(
            15,
            266,
            180,
            29,
            4,
            4,
            "F"
        );


        pdf.setTextColor(
            155,
            101,
            10
        );

        pdf.setFontSize(10);

        pdf.setFont(
            undefined,
            "bold"
        );

        pdf.text(
            "Important Note",
            21,
            276
        );


        pdf.setFont(
            undefined,
            "normal"
        );

        pdf.setFontSize(8.5);

        pdf.text(
            "This AI-generated result is intended for screening assistance only",
            21,
            284
        );

        pdf.text(
            "and should not replace professional medical evaluation.",
            21,
            290
        );


        /* SAVE */

        const cleanName =
            report.file
                .replace(/\.[^/.]+$/, "");


        pdf.save(
            `OrthoScan-${cleanName}-Report.pdf`
        );


    } catch (error) {

        console.error(error);

        alert(
            "PDF report generate करताना error आला."
        );

    }


    button.disabled = false;

    button.innerHTML =
        oldText;

}


/* INITIAL */

displayReports();