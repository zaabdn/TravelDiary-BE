const {
    Journey,
    User,
    Bookmark
} = require("../models");
const joi = require("@hapi/joi");

exports.readBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.findAll({
            include: [{
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: Journey,
                    as: "journey",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    include: {
                        model: User,
                        as: "user",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                },
            ],
            attributes: {
                exclude: ["journeyId", "updatedAt", "createdAt", "userId"],
            },
        });

        res.status(200).send({
            message: "read bookmarks success",
            data: bookmarks,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};

exports.readOneBookmark = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        const detailBookmark = await Bookmark.findOne({
            where: {
                userId,
            },
            include: [{
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: Journey,
                    as: "journey",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    include: {
                        model: User,
                        as: "user",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                },
            ],
            attributes: {
                exclude: ["journeyId", "updatedAt", "createdAt", "userId"],
            },
        });

        if (!detailBookmark)
            return res.status(400).send({
                message: `User with id ${id} is not exist`,
            });

        res.status(200).send({
            message: "Response Success",
            data: detailBookmark,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};

exports.createBookmark = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const {
            journeyId,
            userId
        } = req.body;

        const schema = joi.object({
            journeyId: joi.required(),
            userId: joi.required(),
        });

        const {
            error
        } = schema.validate(req.body);

        if (error) {
            return res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });
        }

        const cekUser = await User.findOne({
            where: {
                id: req.body.userId,
            },
        });

        if (!cekUser) {
            return res.status(400).send({
                message: "User Not Found",
            });
        }

        const cekJourney = await Journey.findOne({
            where: {
                id: req.body.journeyId,
            },
        });

        if (!cekJourney) {
            return res.status(400).send({
                message: "Journey Not Found",
            });
        }

        const bookmark = await Bookmark.create(req.body);

        const bookmarkResult = await Bookmark.findOne({
            include: [{
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: Journey,
                    as: "journey",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    include: {
                        model: User,
                        as: "user",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                },
            ],
            attributes: {
                exclude: ["journeyId", "updatedAt", "createdAt", "userId"],
            },
        });

        res.status(200).send({
            message: "Bookmark has been created",

            data: bookmarkResult,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};

exports.updateBookmark = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            journeyId,
            userId
        } = req.body;

        const bookmark = await Bookmark.update({
            journeyId,
            userId,
            attributes: {
                exclude: ["createAt", "updateAt"],
            },
        }, {
            where: {
                id: id,
            },
        });
        res.status(200).send({
            message: "update bookmark success",
            data: bookmark,
        });
    } catch (err) {
        res.status(500).send({
            message: "update bookmark failed",
        });
    }
};

exports.deleteBookmark = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const deleteBookmark = await Bookmark.destroy({
            where: {
                id: id,
            },
        });

        res.status(200).send({
            message: "Response Success",
            data: {
                id,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};