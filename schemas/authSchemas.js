import Joi from "joi";
import {emailRegexp} from "../constants/constants.js";

export const authSignupSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().required().min(6),
})

export const authSigninSchema = Joi.object({
    email: Joi.string().required().pattern(emailRegexp),
    password: Joi.string().required().min(6),
  })

  export const tokenRequestSchema = Joi.object({
    email: Joi.string().required().pattern(emailRegexp),
  })
