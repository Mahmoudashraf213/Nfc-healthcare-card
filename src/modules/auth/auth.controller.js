import bcrypt from 'bcrypt';
import { AppError } from '../../utils/appError.js';
import { messages } from '../../utils/constant/messages.js';
import { generateToken, verifyToken } from '../../utils/token.js';
import { Doctor, Patient } from '../../../db/index.js';
import { roles } from '../../utils/constant/enum.js';
import { sendEmail } from '../../utils/sendEmail.js';



// patient signup
export const signupPatient = async (req, res, next) => {
  const {firstName, lastName, nationalId,gender,dateOfBirth,bloodType,phoneNumber,address,emergencyContact,cardId,surgerys,ChronicDiseases} = req.body;

  // check if patient already exists
  const patientExist = await Patient.findOne({
    $or: [{ nationalId }, { cardId }]
  });

  if (patientExist) {
    return next(new AppError(messages.patient.alreadyExist, 409));
  }

  // create new patient
  const patient = new Patient({
    firstName,
    lastName,
    nationalId,
    gender,
    dateOfBirth,
    bloodType,
    phoneNumber,
    address,
    emergencyContact,
    cardId,
    surgerys,
    ChronicDiseases
  });

  // save patient
  const createdPatient = await patient.save();
  if (!createdPatient) {
    return next(new AppError(messages.patient.failToCreate, 500));
  }

  // generate token ONLY with nationalId
  const token = generateToken({
    payload: {
      nationalId: createdPatient.nationalId,
    },
  });

  // send response
  return res.status(201).json({
    message: messages.patient.accountCreated,
    success: true,
    data: createdPatient,
  });
};

// patient login
export const loginPatient = async (req, res, next) => {
  // Get data from the request
  const { nationalId } = req.body;

  // Find patient by national ID
  const patient = await Patient.findOne({ nationalId });

  if (!patient) {
    return next(new AppError(messages.patient.notExist, 404));
  }

  // Generate token with _id (standard auth expects payload._id)
  const token = generateToken({
    payload: { _id: patient._id, nationalId: patient.nationalId }
  });

  // Send response
  return res.status(200).json({
    message: messages.patient.loginSuccessfully,
    success: true,
    token
  });
};

// doctor signup
export const signupDoctor = async (req, res, next) => {
  // Get data from request
  const {
    firstName,
    lastName,
    specialization,
    phoneNumber,
    email,
    password,
    hospitalId
  } = req.body;

  // Check if doctor already exists (email or phone)
  const doctorExists = await Doctor.findOne({
    $or: [{ email }, { phoneNumber }]
  });
  if (doctorExists) {
    return next(new AppError(messages.doctor.alreadyExist, 409));
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Create new doctor
  const doctor = new Doctor({
    firstName,
    lastName,
    specialization,
    phoneNumber,
    email,
    password: hashedPassword,
    role: roles.DOCTOR,
    hospitalId
  });

  // Save to database
  const createdDoctor = await doctor.save();
  if (!createdDoctor) {
    return next(new AppError(messages.doctor.failToCreate, 500));
  }

  // Generate verification token
  const token = generateToken({
    payload: { email: createdDoctor.email, _id: createdDoctor._id }
  });

  // Send verification email
  await sendEmail({
    to: email,
    subject: "Verify your Doctor Account",
    html: `<p>Click the link to verify your account: <a href="${req.protocol}://${req.headers.host}/auth/verify/${token}">Verify Account</a></p>`
  });

  // Send response
  return res.status(201).json({
    message: messages.doctor.accountCreated,
    success: true,
    data: createdDoctor
  });
};

// verify doctor account
export const verifyDoctorAccount = async (req, res, next) => {
  const { token } = req.params;

  // Verify token
  const payload = verifyToken(token);

  if (!payload || !payload.email) {
    return next(new AppError(messages.user.invalidToken, 400));
  }

  // Find doctor by email (normalize email to lowercase)
  const updatedDoctor = await Doctor.findOneAndUpdate(
    { email: payload.email.toLowerCase() },
    { isVerified: true },
    { new: true }
  );

  if (!updatedDoctor) {
    return next(new AppError(messages.user.notExist, 404));
  }

  return res.status(200).send(`
    <html>
      <head>
        <style>
          body { font-family: Arial; background-color: #f5f5f5; text-align: center; padding: 60px; color: #333; }
          h1 { color: #2e7d32; }
          p { font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>✅ Doctor Account Verified Successfully</h1>
        <p>Your account is now active. You can log in anytime.</p>
      </body>
    </html>
  `);
};

// doctor login
export const loginDoctor = async (req, res, next) => {
  const { email, password } = req.body;

  // Find doctor by email
  const doctor = await Doctor.findOne({ email: email.toLowerCase() });
  if (!doctor) {
    return next(new AppError(messages.user.notExist, 404));
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, doctor.password);
  if (!isPasswordValid) {
    return next(new AppError(messages.user.invalidCredentials, 400));
  }

  // Check if verified
  if (!doctor.isVerified) {
    return next(new AppError(messages.user.notVerified, 403));
  }

  // Generate token
  const token = generateToken({
    payload: { _id: doctor._id, email: doctor.email, role: roles.DOCTOR },
  });

  // Send response
  return res.status(200).json({
    message: messages.doctor.loginSuccessfully,
    success: true,
    token,
  });
};


// get profile patient
export const getPatientProfile = async (req, res, next) => {
  // get data from req
  const patient = req.authUser._id;
  // check existence
  const patientExist = await Patient.findById(patient)
  if (!patientExist) {
    return next(new AppError(messages.patient.notExist, 404))
  }
  // send res 
  return res.status(200).json({
    message: messages.patient.fetchedSuccessfully,
    success: true,
    data: patientExist
  })
}

// get profile doctor
export const getProfileDoctor = async (req, res, next) => {
  // get data from req
  const doctor = req.authUser._id;
  // check existence
  const doctorExist = await Doctor.findById(doctor)
  if (!doctorExist) {
    return next(new AppError(messages.doctor.notExist, 404))
  }
  // send res 
  return res.status(200).json({
    message: messages.doctor.fetchedSuccessfully,
    success: true,
    data: doctorExist
  })
}