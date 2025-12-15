import bcrypt from "bcrypt";
import { User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { roles } from "../../utils/constant/enum.js";
import { messages } from "../../utils/constant/messages.js";
import { generateToken } from "../../utils/token.js";

// Create Receptionist (by ADMIN_HOSPITAL only)
export const createReceptionist = async (req, res, next) => {
  const { fullName, email, phoneNumber, password } = req.body;

  // admin hospital from auth middleware
  const adminHospital = req.authUser;

  // ensure creator is ADMIN_HOSPITAL
  if (adminHospital.role !== roles.ADMIN_HOSPITAL) {
    return next(new AppError(messages.user.unauthorized, 403));
  }

  // check duplicate email or phone
  const exist = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (exist) {
    return next(new AppError(messages.user.alreadyExist, 409));
  }

  // hash password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // create receptionist
  const receptionist = new User({
    fullName,
    email,
    phoneNumber,
    password: hashedPassword,
    role: roles.RECEPTIONIST,
    hospitalId: adminHospital.hospitalId, // same hospital
    isVerified: true,
  });

  const created = await receptionist.save();
  if (!created) {
    return next(new AppError(messages.user.failToCreate, 500));
  }

  // hide password
  created.password = undefined;

  return res.status(201).json({
    message: messages.user.created,
    success: true,
    data: created,
  });
};

// Receptionist login
export const loginReceptionist = async (req, res, next) => {
  const { email, password } = req.body;

  // Find user with role RECEPTIONIST
  const receptionist = await User.findOne({ email, role: roles.RECEPTIONIST, isVerified: true });
  if (!receptionist) {
    return next(new AppError(messages.user.notExist, 404));
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, receptionist.password);
  if (!isPasswordValid) {
    return next(new AppError(messages.user.passwordInvalid, 400));
  }

  // Generate JWT token
  const token = generateToken({ payload: { _id: receptionist._id, role: receptionist.role } });

  // Hide password in response
  receptionist.password = undefined;

  return res.status(200).json({
    message: messages.user.loginSuccess,
    success: true,
    token,
  });
};