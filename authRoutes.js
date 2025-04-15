const express = require("express");
const { signup, login, getUsers, addMember, deleteMember } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", authMiddleware, getUsers);
router.post("/add-member", authMiddleware, roleMiddleware("Admin"), addMember);
router.delete("/delete-member/:id", authMiddleware,roleMiddleware("Admin"), deleteMember);

module.exports = router;