import joi from 'joi';
import { generalFields } from '../../middleware/vaildation.js';

// receptionist creation validation
export const receptionistHospitalSchema = joi.object({
    fullName : generalFields.name.required(),
    email : generalFields.email.required(),
    phoneNumber : generalFields.phoneNumber.required(),
    password : generalFields.password.required(),
    hospitalId : generalFields.objectId.optional(),
})


// receptionist login validation
export const loginReceptionistSchema = joi.object({
    email : generalFields.email.required(),
    password : generalFields.password.required(),
})