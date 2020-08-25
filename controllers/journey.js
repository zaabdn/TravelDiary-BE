const { Journey, User } = require("../models");
const joi = require("@hapi/joi");

exports.readJourneys = async (req, res) => {
  try {
    const journeys = await Journey.findAll({
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["userId"],
      },
    });

    res.status(200).send({
      message: "read journeys success",
      data: journeys,
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

exports.readOneJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const detailJourney = await Journey.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["userId"],
      },
    });

    if (!detailJourney)
      return res.status(400).send({
        message: `User with id ${id} is not exist`,
      });

    res.status(200).send({
      message: "Response Success",
      data: detailJourney,
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

exports.createJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, images, story, userId } = req.body;

    const schema = joi.object({
      title: joi.string().min(3).required(),
      images: joi.required(),
      story: joi.required(),
      userId: joi.required(),
    });

    const { error } = schema.validate(req.body);

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

    const journey = await Journey.create(req.body);

    const journeyResult = await Journey.findOne({
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["userId", "updatedAt", "createdAt"],
      },
    });

    res.status(200).send({
      message: "Journey has been created",

      data: journeyResult,
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

exports.updateJourney = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, images, story, userId } = req.body;

    const journey = await Journey.update(
      {
        title,
        images,
        story,
        userId,
        attributes: {
          exclude: ["createAt", "updateAt"],
        },
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send({
      message: "update journey success",
      data: journey,
    });
  } catch (err) {
    res.status(500).send({
      message: "update journey failed",
    });
  }
};

exports.deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteJourney = await Journey.destroy({
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
