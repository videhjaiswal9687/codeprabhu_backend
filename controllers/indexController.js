import CustomerModal from "../modal/CustomerModal.js";
import path from "path";
import ExcelJS from "exceljs";
import fs from "fs";
import transporter from "../config/email.js";

class IndexController {
    static register = async (req, res) => {
        const { name, phone, email, course, msg } = req.body;
        try {
            const obj = new CustomerModal({ name, phone, email, course, msg })
            await obj.save()
            return res.status(201).json({
                success: true,
                message: "Customer registered successfully",
                customer: obj
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Registration failed",
                error: error.message
            });
        }
    }

    // static customerlist = async (req, res) => {
    //     try {
    //         const customers = await CustomerModal.find();
    //         return res.status(200).json({
    //             success: true,
    //             customers: customers
    //         });
    //     } catch (error) {
    //         return res.status(400).json({
    //             success: false,
    //             message: "Failed to fetch customers",
    //             error: error.message
    //         });
    //     }
    // }

    static customerlist = async (req, res) => {
        try {
            const customers = await CustomerModal.find().sort({ date: 1 });

            const result = customers.map((c, index) => ({
                S_No: index + 1,
                name: c.name,
                phone: c.phone,
                email: c.email,
                course: c.course,
                msg: c.msg,
                date: c.date
            }));

            res.status(200).json({
                success: true,
                customers: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    static exportCustomersExcel = async (req, res) => {
        try {
            const customers = await CustomerModal.find().sort({ date: 1 });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Customers");

            worksheet.columns = [
                { header: "S.No", key: "S_No", width: 8 },
                { header: "Name", key: "name", width: 20 },
                { header: "Phone", key: "phone", width: 15 },
                { header: "Email", key: "email", width: 25 },
                { header: "Course", key: "course", width: 15 },
                { header: "Message", key: "msg", width: 30 },
                { header: "Date", key: "date", width: 20 }
            ];

            customers.forEach((c, index) => {
                worksheet.addRow({
                    S_No: index + 1,
                    name: c.name,
                    phone: c.phone,
                    email: c.email,
                    course: c.course,
                    msg: c.msg,
                    date: c.date
                });
            });

            // ✅ ensure exports folder exists
            const exportDir = path.join(process.cwd(), "exports");
            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir);
            }

            // ✅ full file path
            const filePath = path.join(exportDir, "customers.xlsx");

            // ✅ write file to disk
            await workbook.xlsx.writeFile(filePath);

            // ✅ send file to browser
            return res.download(filePath);

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Excel export failed",
                error: error.message
            });
        }
    };

    static emailCustomersExcel = async (req, res) => {
        try {
            const customers = await CustomerModal.find().sort({ date: 1 });

            // Create workbook in memory
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Customers");

            worksheet.columns = [
                { header: "S.No", key: "S_No", width: 8 },
                { header: "Name", key: "name", width: 20 },
                { header: "Phone", key: "phone", width: 15 },
                { header: "Email", key: "email", width: 25 },
                { header: "Course", key: "course", width: 15 },
                { header: "Message", key: "msg", width: 30 },
                { header: "Date", key: "date", width: 20 }
            ];

            customers.forEach((c, index) => {
                worksheet.addRow({
                    S_No: index + 1,
                    name: c.name,
                    phone: c.phone,
                    email: c.email,
                    course: c.course,
                    msg: c.msg,
                    date: c.date
                });
            });

            // Convert Excel to buffer (IMPORTANT)
            const buffer = await workbook.xlsx.writeBuffer();

            // Send email
            await transporter.sendMail({
                from: `"CodePrabhu" <${process.env.EMAIL_USER}>`,
                to: "videhjaiswal@gmail.com", // change this
                subject: "Customer List Excel",
                text: "Please find attached customer list Excel file.",
                attachments: [
                    {
                        filename: "customers.xlsx",
                        content: buffer,
                        contentType:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                ]
            });

            res.status(200).json({
                success: true,
                message: "Excel file emailed successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Email sending failed",
                error: error.message
            });
        }
    };

    // static exportCustomersExcel = async (req, res) => {
    //     try {
    //         const customers = await CustomerModal.find().sort({ date: 1 });

    //         const workbook = new ExcelJS.Workbook();
    //         const worksheet = workbook.addWorksheet("Customers");

    //         worksheet.columns = [
    //             { header: "S.No", key: "S_No", width: 8 },
    //             { header: "Name", key: "name", width: 20 },
    //             { header: "Phone", key: "phone", width: 15 },
    //             { header: "Email", key: "email", width: 25 },
    //             { header: "Course", key: "course", width: 15 },
    //             { header: "Message", key: "msg", width: 30 },
    //             { header: "Date", key: "date", width: 15 }
    //         ];

    //         customers.forEach((c, index) => {
    //             worksheet.addRow({
    //                 S_No: index + 1,
    //                 name: c.name,
    //                 phone: c.phone,
    //                 email: c.email,
    //                 course: c.course,
    //                 msg: c.msg,
    //                 date: c.date
    //             });
    //         });

    //         res.setHeader(
    //             "Content-Type",
    //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //         );
    //         res.setHeader(
    //             "Content-Disposition",
    //             "attachment; filename=customers.xlsx"
    //         );

    //         await workbook.xlsx.write(res);
    //         res.end();
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             error: error.message
    //         });
    //     }
    // };

}

export default IndexController;