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

    static customerlist = async(req, res) => {
        res.send('Welcome to the Index Page');
    }
}

export default IndexController;