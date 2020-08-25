const express = require("express");
const router = express.Router();
const {
    authenticated
} = require("../middleware/auth");

const {
    readUser,
    deleteUser,
    register,
    loginUser,
} = require("../controllers/user");

router.get("/user", readUser);
router.post("/register", register);
router.post("/login", loginUser);
router.delete("/user/:id", deleteUser);

const {
    readJourneys,
    readOneJourney,
    createJourney,
    updateJourney,
    deleteJourney,
} = require("../controllers/journey");

router.get("/journey", readJourneys);
router.get("/journey/:id", readOneJourney);
router.post("/journey", authenticated, createJourney);
router.post("/journey", updateJourney);
router.delete("/journey/:id", deleteJourney);

const {
    readBookmarks,
    readOneBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark,
} = require("../controllers/bookmark");

router.get("/bookmark", authenticated, readBookmarks);
router.get("/bookmark/:id", authenticated, readOneBookmark);
router.post("/bookmark", authenticated, createBookmark);
router.post("/bookmark", authenticated, updateBookmark);
router.delete("/bookmark/:id", authenticated, deleteBookmark);

module.exports = router;