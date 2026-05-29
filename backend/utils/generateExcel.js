const ExcelJS = require("exceljs");
const mongoose = require("mongoose");

async function generateExcelFile() {
    const db = mongoose.connection.db;

    const workbook = new ExcelJS.Workbook();

    const collections = ["users", "orders", "admins", "services"];

    for (const collectionName of collections) {
        const data = await db.collection(collectionName).find({}).toArray();

        const sheet = workbook.addWorksheet(collectionName);

        if (data.length === 0) continue;

        const keys = [...new Set(data.flatMap(obj => Object.keys(obj)))];

        sheet.columns = keys.map(key => ({
            header: key,
            key,
            width: 25,
        }));

        data.forEach(item => sheet.addRow(item));
    }

    await workbook.xlsx.writeFile("./exports/crewholic_database.xlsx");

    console.log("✅ Excel Updated");
}

module.exports = generateExcelFile;