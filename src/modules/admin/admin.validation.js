import joi from "joi";
import { generalFields } from "../../middleware/vaildation.js";

// signup super admin validation
export const signupSuperAdminSchema = joi.object({
    fullName : generalFields.name.required(),
    email : generalFields.email.required(),
    password : generalFields.password.required(),
    phoneNumber : generalFields.phoneNumber.optional(),
});

// login super admin validation
export const loginSuperAdminSchema = joi.object({
    email : generalFields.email.required(),
    password : generalFields.password.required(),
});

// create admin validation
export const createAdminSchema = joi.object({
    fullName : generalFields.name.required(),
    email : generalFields.email.required(),
    password : generalFields.password.required(),
    phoneNumber : generalFields.phoneNumber.required(),
});

// login admin validation
export const loginAdminSchema = joi.object({
    email : generalFields.email.required(),
    password : generalFields.password.required(),
});