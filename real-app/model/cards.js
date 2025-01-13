const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const { emailRegex } = require("../regex/refgex");

const cardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },

  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  web: {
    type: String,
    minlength: 14,
  },

  image: {
    url: {
      type: String,
      minlength: 14,
      default:
        "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
    },
    alt: {
      type: String,
      minlength: 2,
      maxlength: 256,
      default: "business card image",
    },
  },
  address: {
    state: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: Number,
      min: 1,
      required: true,
    },
    zip: {
      type: String,
    },
  },
  bizNumber: {
    type: Number,
    required: true,
    min: 1000000,
    max: 9999999,
    unique: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Card = new mongoose.model("Card", cardsSchema, "cards");

function validateCard(card) {
  const Schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string()
      .pattern(emailRegex)
      .message("email must be a standard email")
      .min(5)
      .required(),
    web: Joi.string().min(14),
    image: Joi.object({
      url: Joi.string().min(14),
      alt: Joi.string().min(2).max(256),
    }),
    address: Joi.object({
      state: Joi.string(),
      country: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      houseNumber: Joi.number().min(1).required(),
      zip: Joi.string(),
    }),
  });
  return Schema.validate(card);
}

async function generateBizNum() {
  while (true) {
    const random = _.random(1000000, 9999999);
    const card = await Card.findOne({ bizNumber: random });
    if (!card) {
      return random;
    }
  }
}

module.exports = { Card, validateCard, generateBizNum };
