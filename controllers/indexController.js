import CustomerModal from "../modal/CustomerModal.js";

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
        const customers = await CustomerModal.aggregate([
            { $sort: { id: 1 } },   // keep stable order
            {
                $setWindowFields: {
                    output: {
                        displayId: { $documentNumber: {} }
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            total: customers.length,
            customers: customers
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch customers",
            error: error.message
        });
    }
};

}

export default IndexController;