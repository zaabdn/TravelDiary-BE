const {
    User
} = require("../models");

const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("@hapi/joi");
require("dotenv").config();

exports.register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            address,
            role
        } = req.body;

        const schema = joi.object({
            fullName: joi.string().min(1).required(),
            email: joi.string().email().min(8).required(),
            password: joi.string().min(8).required(),
            phone: joi.string().min(10).required(),
            address: joi.string().required(),
            role: joi.required()
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

        const checkEmail = await User.findOne({
            where: {
                email,
            },
        });

        if (checkEmail) {
            return res.status(400).send({
                error: {
                    message: "Email already has been existed",
                },
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bycript.hash(password, saltRounds);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            address,
            role,
        });

        const token = jwt.sign({
                id: user.id,
            },
            process.env.SECRET_KEY
        );

        res.status(200).send({
            message: "You have been registered",
            data: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                role: user.role,
                email: user.email,
                token,
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

exports.loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const schema = joi.object({
            email: joi.string().email().min(8).required(),
            password: joi.string().min(8).required(),
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

        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).send({
                error: {
                    message: "Email or password is invalid",
                },
            });
        }

        const validUser = await User.findOne({
            where: {
                email,
            },
        });

        if (!validUser) {
            return res.status(400).send({
                error: {
                    message: "Email or password is invalid",
                },
            });
        }

        const validPass = await bycript.compare(password, user.password);
        if (!validPass) {
            return res.status(400).send({
                error: {
                    message: "Email or password is invalid",
                },
            });
        }

        const token = jwt.sign({
                id: user.id,
            },
            process.env.SECRET_KEY
        );

        res.status(200).send({
            message: "Login success",
            data: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                address: user.address,
                role: user.role,
                email: user.email,
                token,
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

exports.readUser = async (req, res) => {
    try {
        const user = await User.findAll({
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });

        res.status(200).send({
            message: "Response Success",
            data: user,
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

exports.deleteUser = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const deleteUser = await User.destroy({
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