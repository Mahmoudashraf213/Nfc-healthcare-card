import { Router } from "express";
import { isValid } from "../../middleware/vaildation.js";
import { loginDoctorSchema, loginPatientSchema, signupDoctorSchema, signupPatientSchema } from "./auth.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { loginDoctor, loginPatient, signupDoctor, signupPatient, verifyDoctorAccount } from "./auth.controller.js";



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

export default authRouter;