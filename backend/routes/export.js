const express = require("express");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/all", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const users = await db.collection("users").find({}).toArray();
        const orders = await db.collection("orders").find({}).toArray();
        const admins = await db.collection("admins").find({}).toArray();
        const services = await db.collection("services").find({}).toArray();

        const workbook = new ExcelJS.Workbook();

        function addSheet(sheetName, data) {
            const worksheet = workbook.addWorksheet(sheetName);

            if (!data || data.length === 0) {
                worksheet.addRow(["No data found"]);
                return;
            }

            const allKeys = [
                ...new Set(
                    data.flatMap((item) =>
                        Object.keys(item).filter((key) => key !== "__v")
                    )
                ),
            ];

            worksheet.columns = allKeys.map((key) => ({
                header: key,
                key: key,
                width: 25,
            }));

            data.forEach((item) => {
                const row = {};

                allKeys.forEach((key) => {
                    let value = item[key];

                    if (value && typeof value === "object") {
                        if (value instanceof Date) {
                            value = value.toLocaleString();
                        } else if (value._bsontype === "ObjectId") {
                            value = value.toString();
                        } else {
                            value = JSON.stringify(value);
                        }
                    }

                    row[key] = value;
                });

                worksheet.addRow(row);
            });

            worksheet.getRow(1).font = { bold: true };
        }

        addSheet("Users", users);
        addSheet("Orders", orders);
        addSheet("Admins", admins);
        addSheet("Services", services);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=crewholic_database.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Export all error:", error);
        res.status(500).json({
            message: "Failed to export database",
            error: error.message,
        });
    }
});

module.exports = router;