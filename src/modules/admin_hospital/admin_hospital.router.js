import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/autheraization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/vaildation.js";
import {  loginReceptionistSchema, receptionistHospitalSchema } from "./admin_hospital.validation.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { createReceptionist, loginReceptionist } from "./admin_hospital.controller.js";


const adminHospitalRouter = Router();

// create receptionist route
adminHospitalRouter.post('/create-receptionist',
    isAuthenticated(),
    isAuthorized([roles.ADMIN_HOSPITAL , roles.ADMIN , roles.SUPER_ADMIN]),
    isValid(receptionistHospitalSchema),
    asyncHandler(createReceptionist)
 );


 // logon receptionist route
 adminHospitalRouter.post('/login/receptionist',
     isValid(loginReceptionistSchema),
     asyncHandler(loginReceptionist)
 );

export default adminHospitalRouter;