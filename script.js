/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "MIS_REPORT_DATA_V1";



/* =========================================================
   INPUT FUNCTION
========================================================= */

function createInput(
    value = "",
    type = "text",
    className = ""
) {

    return `
        <input
            type="${type}"
            class="${className}"
            value="${escapeHTML(value)}"
        >
    `;

}



/* =========================================================
   ESCAPE VALUE
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/"/g, "&quot;");

}



/* =========================================================
   ADD ROW
========================================================= */

function addRow(values = []) {


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    const row =
        document.createElement("tr");


    const data = [...values];


    while (data.length < 18) {

        data.push("");

    }



    row.innerHTML = `


        <!-- DATE -->

        <td>

            ${createInput(
                data[0],
                "date",
                "raw date"
            )}

        </td>



        <!-- TIME -->

        <td>

            ${createInput(
                data[1],
                "time",
                "raw"
            )}

        </td>



        <!-- =================
             MAIN METER
        ================= -->


        <!-- C -->

        <td>

            ${createInput(
                data[2],
                "number",
                "raw main-kwh"
            )}

        </td>



        <!-- D -->

        <td>

            ${createInput(
                data[3],
                "number",
                "raw main-kvah"
            )}

        </td>



        <!-- E -->

        <td class="calc">

            ${createInput(
                data[4],
                "number",
                "calc main-akwh"
            )}

        </td>



        <!-- F -->

        <td class="calc">

            ${createInput(
                data[5],
                "number",
                "calc main-akvah"
            )}

        </td>



        <!-- G -->

        <td>

            ${createInput(
                data[6],
                "number",
                "raw main-md"
            )}

        </td>



        <!-- H -->

        <td class="calc">

            ${createInput(
                data[7],
                "number",
                "calc main-amd"
            )}

        </td>



        <!-- I -->

        <td>

            ${createInput(
                data[8],
                "number",
                "raw main-pf-display"
            )}

        </td>



        <!-- J -->

        <td class="calc">

            ${createInput(
                data[9],
                "number",
                "calc main-pf"
            )}

        </td>



        <!-- =================
             CHECK METER
        ================= -->


        <!-- K -->

        <td>

            ${createInput(
                data[10],
                "number",
                "raw check-kwh"
            )}

        </td>



        <!-- L -->

        <td>

            ${createInput(
                data[11],
                "number",
                "raw check-kvah"
            )}

        </td>



        <!-- M -->

        <td class="calc">

            ${createInput(
                data[12],
                "number",
                "calc check-akwh"
            )}

        </td>



        <!-- N -->

        <td class="calc">

            ${createInput(
                data[13],
                "number",
                "calc check-akvah"
            )}

        </td>



        <!-- O -->

        <td>

            ${createInput(
                data[14],
                "number",
                "raw check-md"
            )}

        </td>



        <!-- P -->

        <td class="calc">

            ${createInput(
                data[15],
                "number",
                "calc check-amd"
            )}

        </td>



        <!-- Q -->

        <td>

            ${createInput(
                data[16],
                "number",
                "raw check-pf-display"
            )}

        </td>



        <!-- R -->

        <td class="calc">

            ${createInput(
                data[17],
                "number",
                "calc check-pf"
            )}

        </td>



        <!-- DELETE -->

        <td>

            <button
                class="delete-btn"
                onclick="
                    this.closest('tr').remove();
                    calculateAll();
                "
            >

                Delete

            </button>

        </td>

    `;



    tableBody.appendChild(row);



    /* =========================
       AUTO CALCULATION
    ========================= */

    row
        .querySelectorAll(".raw")
        .forEach(input => {

            input.addEventListener(
                "input",
                calculateAll
            );

        });



    calculateAll();

}



/* =========================================================
   GET NUMBER
========================================================= */

function getNumber(row, selector) {

    const input =
        row.querySelector(selector);


    if (!input) {

        return null;

    }


    const value =
        parseFloat(input.value);


    if (
        Number.isFinite(value)
    ) {

        return value;

    }


    return null;

}



/* =========================================================
   SET CALCULATED VALUE
========================================================= */

function setCalculated(
    row,
    selector,
    value
) {

    const input =
        row.querySelector(selector);


    if (!input) {

        return;

    }


    if (value === "") {

        input.value = "";

        return;

    }


    if (
        Number.isFinite(value)
    ) {

        input.value =
            Number(value).toFixed(3);

    }

}



/* =========================================================
   MAIN CALCULATION
========================================================= */

function calculateAll() {


    const rows = [

        ...document.querySelectorAll(
            "#tableBody tr"
        )

    ];



    rows.forEach(
        (row, index) => {


            /* =========================
               CURRENT ROW
            ========================= */


            const mainKWH =
                getNumber(
                    row,
                    ".main-kwh"
                );


            const mainKVAH =
                getNumber(
                    row,
                    ".main-kvah"
                );


            const mainMD =
                getNumber(
                    row,
                    ".main-md"
                );



            const checkKWH =
                getNumber(
                    row,
                    ".check-kwh"
                );


            const checkKVAH =
                getNumber(
                    row,
                    ".check-kvah"
                );


            const checkMD =
                getNumber(
                    row,
                    ".check-md"
                );



            /* =========================
               NEXT ROW
            ========================= */

            const nextRow =
                rows[index + 1];



            let actualMainKWH = "";

            let actualMainKVAH = "";

            let actualCheckKWH = "";

            let actualCheckKVAH = "";



            if (nextRow) {


                const nextMainKWH =
                    getNumber(
                        nextRow,
                        ".main-kwh"
                    );


                const nextMainKVAH =
                    getNumber(
                        nextRow,
                        ".main-kvah"
                    );


                const nextCheckKWH =
                    getNumber(
                        nextRow,
                        ".check-kwh"
                    );


                const nextCheckKVAH =
                    getNumber(
                        nextRow,
                        ".check-kvah"
                    );



                /* =========================
                   MAIN KWH
                ========================= */

                if (
                    mainKWH !== null &&
                    nextMainKWH !== null
                ) {

                    actualMainKWH =
                        (
                            nextMainKWH -
                            mainKWH
                        ) * 120;

                }



                /* =========================
                   MAIN KVAH
                ========================= */

                if (
                    mainKVAH !== null &&
                    nextMainKVAH !== null
                ) {

                    actualMainKVAH =
                        (
                            nextMainKVAH -
                            mainKVAH
                        ) * 120;

                }



                /* =========================
                   CHECK KWH
                ========================= */

                if (
                    checkKWH !== null &&
                    nextCheckKWH !== null
                ) {

                    actualCheckKWH =
                        (
                            nextCheckKWH -
                            checkKWH
                        ) * 120;

                }



                /* =========================
                   CHECK KVAH
                ========================= */

                if (
                    checkKVAH !== null &&
                    nextCheckKVAH !== null
                ) {

                    actualCheckKVAH =
                        (
                            nextCheckKVAH -
                            checkKVAH
                        ) * 120;

                }

            }



            /* =========================
               MAIN ACTUAL KWH
            ========================= */

            setCalculated(
                row,
                ".main-akwh",
                actualMainKWH
            );



            /* =========================
               MAIN ACTUAL KVAH
            ========================= */

            setCalculated(
                row,
                ".main-akvah",
                actualMainKVAH
            );



            /* =========================
               MAIN ACTUAL KVA MD

               G × 120
            ========================= */

            setCalculated(

                row,

                ".main-amd",

                mainMD === null
                    ? ""
                    : mainMD * 120

            );



            /* =========================
               MAIN PF

               E / F
            ========================= */

            let mainPF = "";


            if (
                actualMainKWH !== "" &&
                actualMainKVAH !== "" &&
                actualMainKVAH !== 0
            ) {

                mainPF =
                    actualMainKWH /
                    actualMainKVAH;

            }


            setCalculated(
                row,
                ".main-pf",
                mainPF
            );



            /* =========================
               CHECK ACTUAL KWH
            ========================= */

            setCalculated(
                row,
                ".check-akwh",
                actualCheckKWH
            );



            /* =========================
               CHECK ACTUAL KVAH
            ========================= */

            setCalculated(
                row,
                ".check-akvah",
                actualCheckKVAH
            );



            /* =========================
               CHECK ACTUAL KVA MD
            ========================= */

            setCalculated(

                row,

                ".check-amd",

                checkMD === null
                    ? ""
                    : checkMD * 120

            );



            /* =========================
               CHECK PF
            ========================= */

            let checkPF = "";


            if (
                actualCheckKWH !== "" &&
                actualCheckKVAH !== "" &&
                actualCheckKVAH !== 0
            ) {

                checkPF =
                    actualCheckKWH /
                    actualCheckKVAH;

            }


            setCalculated(
                row,
                ".check-pf",
                checkPF
            );


        }
    );



    calculateTotals();

}



/* =========================================================
   TOTALS
========================================================= */

function calculateTotals() {


    let mainKWH = 0;

    let mainKVAH = 0;

    let checkKWH = 0;

    let checkKVAH = 0;



    document
        .querySelectorAll(
            ".main-akwh"
        )
        .forEach(input => {

            mainKWH +=
                parseFloat(
                    input.value
                ) || 0;

        });



    document
        .querySelectorAll(
            ".main-akvah"
        )
        .forEach(input => {

            mainKVAH +=
                parseFloat(
                    input.value
                ) || 0;

        });



    document
        .querySelectorAll(
            ".check-akwh"
        )
        .forEach(input => {

            checkKWH +=
                parseFloat(
                    input.value
                ) || 0;

        });



    document
        .querySelectorAll(
            ".check-akvah"
        )
        .forEach(input => {

            checkKVAH +=
                parseFloat(
                    input.value
                ) || 0;

        });



    document.getElementById(
        "totalMainKwh"
    ).textContent =
        mainKWH.toFixed(3);



    document.getElementById(
        "totalMainKvah"
    ).textContent =
        mainKVAH.toFixed(3);



    document.getElementById(
        "totalCheckKwh"
    ).textContent =
        checkKWH.toFixed(3);



    document.getElementById(
        "totalCheckKvah"
    ).textContent =
        checkKVAH.toFixed(3);

}



/* =========================================================
   AUTOMATIC MONTH GENERATION
========================================================= */

function makeMonthRows() {


    const month =
        parseInt(
            document.getElementById(
                "monthSelect"
            ).value
        );


    const year =
        parseInt(
            document.getElementById(
                "yearSelect"
            ).value
        );



    /* =========================
       NUMBER OF DAYS
       
       Example:
       
       January  = 31
       February = 28
       Leap Feb = 29
       June     = 30
       
    ========================= */

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();



    const tableBody =
        document.getElementById(
            "tableBody"
        );


    tableBody.innerHTML = "";



    /* =========================
       CREATE DAILY ROWS
    ========================= */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {


        const date =
            new Date(
                year,
                month,
                day
            );


        const formattedDate =

            date.getFullYear() +

            "-" +

            String(
                date.getMonth() + 1
            ).padStart(2, "0") +

            "-" +

            String(
                date.getDate()
            ).padStart(2, "0");



        addRow([

            formattedDate,

            "07:00",

            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",

            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""

        ]);

    }



    /* =========================
       SHOW DAYS
    ========================= */

    const monthName =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        ).format(
            new Date(
                year,
                month,
                1
            )
        );



    document.getElementById(
        "dayInfo"
    ).textContent =

        `${daysInMonth} days generated for ${monthName}`;

}



/* =========================================================
   YEAR DROPDOWN
========================================================= */

function createYearList() {


    const yearSelect =
        document.getElementById(
            "yearSelect"
        );


    const currentYear =
        new Date().getFullYear();



    for (
        let year = currentYear - 5;
        year <= currentYear + 5;
        year++
    ) {


        const option =
            document.createElement(
                "option"
            );


        option.value = year;

        option.textContent = year;



        if (
            year === currentYear
        ) {

            option.selected = true;

        }



        yearSelect.appendChild(
            option
        );

    }

}



/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {


    calculateAll();



    const rows = [

        ...document.querySelectorAll(
            "#tableBody tr"
        )

    ].map(row => {


        return [

            ...row.querySelectorAll(
                "input"
            )

        ].map(
            input => input.value
        );

    });



    const data = {

        month:
            document.getElementById(
                "monthSelect"
            ).value,

        year:
            document.getElementById(
                "yearSelect"
            ).value,

        rows: rows

    };



    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );



    alert(
        "MIS data successfully saved."
    );

}



/* =========================================================
   LOAD SAVED DATA
========================================================= */

function loadData() {


    const savedData =
        localStorage.getItem(
            STORAGE_KEY
        );



    if (!savedData) {

        alert(
            "Saved data not found."
        );

        return;

    }



    const data =
        JSON.parse(
            savedData
        );



    document.getElementById(
        "monthSelect"
    ).value =
        data.month;



    document.getElementById(
        "yearSelect"
    ).value =
        data.year;



    const tableBody =
        document.getElementById(
            "tableBody"
        );


    tableBody.innerHTML = "";



    data.rows.forEach(
        row => {

            addRow(row);

        }
    );



    calculateAll();



    document.getElementById(
        "dayInfo"
    ).textContent =

        `${data.rows.length} saved days loaded.`;

}



/* =========================================================
   CLEAR DATA
========================================================= */

function clearData() {


    const confirmDelete =
        confirm(
            "Do you want to delete the saved missed data?"
        );


    if (!confirmDelete) {

        return;

    }



    localStorage.removeItem(
        STORAGE_KEY
    );


    location.reload();

}



/* =========================================================
   EXPORT CSV
========================================================= */

function exportCSV() {


    calculateAll();



    const headers = [

        "Date",

        "TIME",

        "Main KWH",

        "Main KVAH",

        "Actual KWH Consump.",

        "Actual KVAH Consump.",

        "KVA (MD)",

        "Actual KVA (MD)",

        "PF Display",

        "PF = KWH/KVAH",

        "Check KWH",

        "Check KVAH",

        "Check Actual KWH Consump.",

        "Check Actual KVAH Consump.",

        "Check KVA (MD)",

        "Check Actual KVA MD",

        "Check PF Display",

        "Check PF = KWH/KVAH"

    ];



    const csvRows = [

        headers

    ];



    document
        .querySelectorAll(
            "#tableBody tr"
        )
        .forEach(row => {


            const values = [

                ...row.querySelectorAll(
                    "input"
                )

            ].map(
                input => input.value
            );


            csvRows.push(
                values
            );

        });



    const csvContent =

        csvRows
            .map(row =>

                row
                    .map(value =>

                        `"${String(value)
                            .replace(
                                /"/g,
                                '""'
                            )}"`

                    )
                    .join(",")

            )
            .join("\n");



    const blob =
        new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );



    const url =
        URL.createObjectURL(
            blob
        );



    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "MIS_Report.csv";


    link.click();



    URL.revokeObjectURL(
        url
    );

}



/* =========================================================
   START APPLICATION
========================================================= */


/* Create year dropdown */

createYearList();



/* Automatically select current month */

document.getElementById(
    "monthSelect"
).value =
    new Date().getMonth();



/* Automatically generate current month */

makeMonthRows();
