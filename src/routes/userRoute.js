import express from "express";

const router = express.Router();

// Mock data updated to match the Sequelize Model in User.js
const mockUsers = [
    { 
        id: 1, 
        firstName: "Mustapha", 
        lastName: "Dev", 
        email: "mustapha@example.com",
        role: "admin"
    },
    { 
        id: 2, 
        firstName: "John", 
        lastName: "Doe", 
        email: "john@example.com",
        role: "user"
    }
];

// GET /api/users
router.get("/", (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: mockUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

export default router;