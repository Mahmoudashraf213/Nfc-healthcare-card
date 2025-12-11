import { Router } from "express";
import { isValid } from "../../middleware/vaildation.js";
import {  loginDoctorSchema, loginPatientSchema, signupDoctorSchema, signupPatientSchema } from "./auth.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { getPatientProfile, getProfileDoctor, loginDoctor, loginPatient, signupDoctor, signupPatient, verifyDoctorAccount } from "./auth.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enum.js";



const authRouter = Router();

// patient signup route
authRouter.post('/signup/patient', isValid(signupPatientSchema) , asyncHandler(signupPatient));

// patient login route
authRouter.post('/login/patient', isValid(loginPatientSchema) , asyncHandler(loginPatient));


// doctor signup route
authRouter.post('/signup/doctor', isValid(signupDoctorSchema), asyncHandler(signupDoctor))

// verify doctor route
authRouter.get('/verify/:token', asyncHandler(verifyDoctorAccount))

// doctor login route
authRouter.post('/login/doctor', isValid(loginDoctorSchema) , asyncHandler(loginDoctor));

// get patient profile route
authRouter.get('/patient/profile',
    isAuthenticated(),
    isAuthorized([roles.PATIENT, roles.ADMIN, roles.SUPER_ADMIN]),
    asyncHandler(getPatientProfile)
);

// get doctor profile route
authRouter.get("/doctor/profile", 
    isAuthenticated(),
    isAuthorized([roles.DOCTOR, roles.ADMIN, roles.SUPER_ADMIN]),
    asyncHandler(getProfileDoctor)
);

export default authRouter;