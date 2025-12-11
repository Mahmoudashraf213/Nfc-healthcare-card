const generateMessage = (entity) => ({
    alreadyExist: `${entity} already exist`,
    notExist: `${entity} not found`,
    created: `${entity} created successfully`,
    failToCreate: `Failed to create ${entity}`,
    updated: `${entity} updated successfully`,
    failToUpdate: `Failed to update ${entity}`,
    deleted: `${entity} deleted successfully`,
    failToDelete: `Failed to delete ${entity}`,
    fetchedSuccessfully: `${entity} fetched successfully`,
    failToFetch: `${entity} failed to fetch`
});


export const messages = {
    patient :{
        ...generateMessage('Patient'),
        loginSuccessfully: 'Patient logged in successfully',
        accountCreated: 'Patient account created successfully',
    },
    doctor: {
        ...generateMessage('Doctor'),
        accountCreated: 'Doctor account created successfully',
        loginSuccessfully: 'Doctor logged in successfully',

    },
    user :{
        ...generateMessage('User'),
        invalidToken: 'Invalid token provided',
        notVerified: 'User account is not verified',
        invalidCredentials: 'Invalid credentials provided',
        loginSuccess: 'User logged in successfully',
        passwordInvalid: 'Invalid password provided',
    },
    admin :{
        ...generateMessage('Admin'),
    }

}