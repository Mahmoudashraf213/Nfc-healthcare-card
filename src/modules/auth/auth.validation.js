import joi from 'joi';
import { generalFields } from '../../middleware/vaildation.js';


// patient signup validation
export const signupPatientSchema = joi.object({
    firstName : generalFields.name.required(),
    lastName : generalFields.name.required(),
    nationalId : generalFields.nationalId.required(),
    gender: generalFields.gender.required(),
    dateOfBirth: generalFields.dateOfBirth.required(),
    bloodType: generalFields.bloodType.optional(),
    phoneNumber : generalFields.phoneNumber.required(),
    address : generalFields.address.required(),
    emergencyContact : generalFields.emergencyContact.required(),
    cardId : generalFields.cardId.optional(),
    surgerys : generalFields.surgerys.optional(),
    ChronicDiseases : generalFields.ChronicDiseases.optional(),
})

// patient login validation
export const loginPatientSchema = joi.object({
    nationalId : generalFields.nationalId.required(),
})

// doctor signup validation
export const signupDoctorSchema = joi.object({
    firstName : generalFields.name.required(),
    lastName : generalFields.name.required(),
    specialization : generalFields.specialization.required(),
    email : generalFields.email.required(),
    phoneNumber : generalFields.phoneNumber.required(),
    password : generalFields.password.required(),
    hospitalId : generalFields.objectId.optional(),
    role : generalFields.role.optional(),
})

// doctor login validation
export const loginDoctorSchema = joi.object({
    email : generalFields.email.required(),
    password : generalFields.password.required(),
})