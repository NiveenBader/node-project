const Joi = require("joi");
const mongoose = require("mongoose");
const { emailRegex, passwordRegex } = require("../regex/refgex");

const usersSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    middle: {
      type: String,
      maxlength: 256,
      default: "",
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
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
    unique: true,
    minlength: 5,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
    },
    alt: {
      type: String,
      maxlength: 256,
      default: "User Profile Image",
    },
  },
  address: {
    state: {
      type: String,
      maxlength: 256,
    },
    country: {
      type: String,
      minlength: 2,
      maxlength: 256,
      required: true,
    },
    city: {
      type: String,
      minlength: 2,
      maxlength: 256,
      required: true,
    },
    street: {
      type: String,
      minlength: 2,
      maxlength: 256,
      required: true,
    },
    houseNumber: {
      type: Number,
      min: 2,
      max: 256,
      required: true,
    },
    zip: {
      type: String,
      min: 2,
      max: 256,
      required: true,
    },
  },

  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
  isBusiness: {
    type: Boolean,
    required: true,
  },
});

const User = new mongoose.model("User", usersSchema, "users");

function validateUser(user) {
  const Schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().allow("").min(2).max(256),
      last: Joi.string().min(2).max(256).required(),
    }),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string()
      .pattern(emailRegex)
      .message("email must be a standard email")
      .min(5)
      .required(),
    password: Joi.string()
      .pattern(passwordRegex)
      .message(
        "password must be at least 7 characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-"
      )
      .min(7)
      .max(20)
      .required(),
    image: Joi.object({
      url: Joi.string().allow("").min(14),
      alt: Joi.string().allow("").min(2).max(256),
    }),
    address: Joi.object({
      state: Joi.string().allow("").min(2).max(256),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(2).max(256).required(),
      zip: Joi.string().min(2).max(256).required(),
    }),
    isBusiness: Joi.boolean().required(),
  });
  return Schema.validate(user);
}

function validateLogin(credentials) {
  const schema = Joi.object({
    email: Joi.string()
      .pattern(emailRegex)
      .message("email must be a standard email")
      .min(5)
      .required(),
    password: Joi.string()
      .pattern(passwordRegex)
      .message(
        "password must be at least nine characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-"
      )
      .min(7)
      .max(20)
      .required(),
  });
  return schema.validate(credentials);
}

function validatEdit(user) {
  const Schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256).required(),
      middle: Joi.string().allow("").min(2).max(256),
      last: Joi.string().min(2).max(256).required(),
    }),
    phone: Joi.string().min(9).max(11).required(),
    image: Joi.object({
      url: Joi.string().allow("").min(14),
      alt: Joi.string().allow("").min(2).max(256),
    }),
    address: Joi.object({
      state: Joi.string().allow("").min(2).max(256),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(2).max(256).required(),
      zip: Joi.string().min(2).max(256).required(),
    }),
  });
  return Schema.validate(user);
}

module.exports = { User, validateUser, validateLogin, validatEdit };
