const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Import your Mongoose model
const { UserInfoSchema } = require("../models/userModel");

const { getUser, createNewUser, updateUser } = require("../controller/usersController");

const { VerifyJsonRequest, generateNewObjectId, VerifyUserPassword, ValidateUserPassword, HashFunction } = require("../utils");

const DbUser = require("../access/DbUser");
const userServices = require("../services/userServices");
const utils = require("../utils");


let mongoServer;

const id = new mongoose.Types.ObjectId();

// mock data
let mockUserData = [
  {
    _id: id,
    username: "xychew",
    password: "Password123!",
    email: "xyzchew@outlook.com",
    dob: "1999-01-02",
    firstname: "xy",
    lastname: "chew",
    address: "1 Serangoon Ave",
    postal: "512345",
    country: "Singapore",
    phone: "91234567",
    roles: ["user"],
    active: true,
    emailVerified: false,
  },
  {
    _id: "65281647e86a5bde7c168a0e",
    username: "xychew1",
    password: "Password123!",
    email: "xyzchew1@outlook.com",
    dob: "1999-01-02",
    firstname: "xy1",
    lastname: "chew1",
    address: "11 Serangoon Ave",
    postal: "512345",
    country: "Singapore",
    phone: "91234567",
    roles: ["user"],
    active: true,
    emailVerified: false,
  },
];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Mongo Test Server connected");
  mockUserData[0].password = await HashFunction(mockUserData[0].password);
  mockUserData[1].password = await HashFunction(mockUserData[1].password);
  await UserInfoSchema.create(mockUserData);
});

afterAll(async () => {
  // Clear the database and disconnect after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("getUser", () => {
  it("should return a user when filter by id succeeds", async () => {
    const getUserByFilterSpy = jest.spyOn(DbUser, "GetUserByFilter");
    const req = { id: id };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();
    await getUser(req, mockRes, next, getUserByFilterSpy);
    expect(getUserByFilterSpy).toHaveBeenCalled();
    expect(getUserByFilterSpy).toHaveBeenCalledWith( { _id: req.id} );

    // Define the expected data
    const expectedData = {
      result: {
        ...mockUserData[0],
        // __v, createdAt and updatedAt are generated by MongoDB
        __v: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      status: 200,
    };
    expect(mockRes.json).toHaveBeenCalledWith(expectedData);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("should handle errors when id is non existent", async () => {
    const getUserByFilterSpy = jest.spyOn(DbUser, "GetUserByFilter");
    const req = { id: "65281647e86a5bde7c168a02" };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();
    const userResponse = await getUser(req, mockRes, next, getUserByFilterSpy);
    console.log(userResponse);

    expect(getUserByFilterSpy).toHaveBeenCalled();
    expect(getUserByFilterSpy).toHaveBeenCalledWith( { _id: req.id } );

    // Define the expected data
    const expectedData = {
      result: "No users found",
      status: 500,
    };
    expect(mockRes.json).toHaveBeenCalledWith(expectedData);
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});

describe("createNewUser", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  it("should create a new user and return a user object", async () => {
    const VerifyJsonRequestSpy = jest.spyOn(utils, "VerifyJsonRequest");
    const checkUserExistenceSpy = jest.spyOn(userServices, "checkUserExistence");
    const createUserAccountHelperSpy = jest.spyOn(userServices, "createUserAccountHelper");
    const validateUserInfoSpy = jest.spyOn(userServices, "validateUserInfo");
    const generateNewObjectIdSpy = jest.spyOn(utils, "generateNewObjectId");
    const sendVerificationEmailSpy = jest.fn();
    sendVerificationEmailSpy.mockImplementation(() => {});
    const req = {
      body:{
        _id: new mongoose.Types.ObjectId(),
        username: "xychew1",
        password: "Password123!",
        email: "xyzchew11@outlook.com",
        dob: "1999-01-02",
        firstname: "xy1",
        lastname: "chew1",
        address: "11 Serangoon Ave",
        postal: "512345",
        country: "Singapore",
        phone: "91234567",
        roles: ["user"],
      },
    };
    console.log(req);
    const requiredFields = [
      "username",
      "password",
      "email",
      "dob",
      "firstname",
      "lastname",
      "address",
      "postal",
      "country",
      "phone",
      "roles",
    ];
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const newUserResponse = await createNewUser(
      req,
      res,
      VerifyJsonRequestSpy,
      checkUserExistenceSpy,
      createUserAccountHelperSpy,
      validateUserInfoSpy,
      sendVerificationEmailSpy,
      generateNewObjectIdSpy
    );

    expect(VerifyJsonRequestSpy).toHaveBeenCalled();
    expect(VerifyJsonRequestSpy).toHaveBeenCalledWith( req, requiredFields );
    expect(validateUserInfoSpy).toHaveBeenCalled();
    expect(validateUserInfoSpy).toHaveBeenCalledWith( req.body );
    expect(checkUserExistenceSpy).toHaveBeenCalled();
    expect(checkUserExistenceSpy).toHaveBeenCalledWith( {email: req.body.email} );
    expect(generateNewObjectIdSpy).toHaveBeenCalled();
    expect(generateNewObjectIdSpy).toHaveBeenCalledWith( );
    expect(createUserAccountHelperSpy).toHaveBeenCalled();
    expect(createUserAccountHelperSpy).toHaveBeenCalledWith( req.body );
    expect(sendVerificationEmailSpy).toHaveBeenCalled();
  });

  //Test Fail: No Credentials Inserted
  it("should handle invalid headers and return a 400 status and error response", async () => {
    const VerifyJsonRequestSpy = jest.spyOn(utils, "VerifyJsonRequest");
    const checkUserExistenceSpy = jest.spyOn(userServices, "checkUserExistence");
    const createUserAccountHelperSpy = jest.spyOn(userServices, "createUserAccountHelper");
    const validateUserInfoSpy = jest.spyOn(userServices, "validateUserInfo");
    const generateNewObjectIdSpy = jest.spyOn(utils, "generateNewObjectId");
    const sendVerificationEmailSpy = jest.spyOn(userServices, "sendVerificationEmail");
    const mockReq = {
      body: {
        // Provide valid user data here
      },
    };
    // const mockrequiredFields = [
      
    // ];
    const mockrequiredFields = [
      "username",
      "password",
      "email",
      "dob",
      "firstname",
      "lastname",
      "address",
      "postal",
      "country",
      "phone",
      "roles",
      // "active",
      // "emailVerified",
    ];
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const newUserResponse = await createNewUser(
      mockReq,
      mockRes,
      VerifyJsonRequestSpy,
      checkUserExistenceSpy,
      createUserAccountHelperSpy,
      validateUserInfoSpy,
      sendVerificationEmailSpy,
      generateNewObjectIdSpy
    );

    expect(VerifyJsonRequestSpy).toHaveBeenCalled();
    expect(VerifyJsonRequestSpy).toHaveBeenCalledWith( mockReq, mockrequiredFields);

    expect(mockRes.json).toHaveBeenCalledWith("Missing fields in request body." );
    expect(mockRes.status).toHaveBeenCalledWith(400);

  });

  it("should handle errors when user already exists", async () => {
    const VerifyJsonRequestSpy = jest.spyOn(utils, "VerifyJsonRequest");
    const checkUserExistenceSpy = jest.spyOn(userServices, "checkUserExistence");
    const createUserAccountHelperSpy = jest.spyOn(userServices, "createUserAccountHelper");
    const validateUserInfoSpy = jest.spyOn(userServices, "validateUserInfo");
    const generateNewObjectIdSpy = jest.spyOn(utils, "generateNewObjectId");
    const sendVerificationEmailSpy = jest.spyOn(userServices, "sendVerificationEmail");
    // Create a mock request object with user data that already exists
    const mReq = {
      body: {
        _id: "65281647e86a5bde7c168a0e",
        username: "xychew1",
        password: "Password123!",
        email: "xyzchew1@outlook.com",
        dob: "1999-01-02",
        firstname: "xy1",
        lastname: "chew1",
        address: "11 Serangoon Ave",
        postal: "512345",
        country: "Singapore",
        phone: "91234567",
        roles: ["user"],
      },
    };

    const mRequiredFields = [
      "username",
      "password",
      "email",
      "dob",
      "firstname",
      "lastname",
      "address",
      "postal",
      "country",
      "phone",
      "roles",
    ];

    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mUserResponse = await createNewUser(
      mReq,
      mRes,
      VerifyJsonRequestSpy,
      checkUserExistenceSpy,
      createUserAccountHelperSpy,
      validateUserInfoSpy,
      sendVerificationEmailSpy,
      generateNewObjectIdSpy
    );

    expect(VerifyJsonRequestSpy).toHaveBeenCalled();
    expect(VerifyJsonRequestSpy).toHaveBeenCalledWith( mReq, mRequiredFields );
    expect(validateUserInfoSpy).toHaveBeenCalled();
    expect(validateUserInfoSpy).toHaveBeenCalledWith( mReq.body );
    expect(checkUserExistenceSpy).toHaveBeenCalled();
    expect(checkUserExistenceSpy).toHaveBeenCalledWith( {email: mReq.body.email} );

    // Define the expected data
    const mExpectedData = {
      result: "Email already exists",
      status: 400,
    };
    expect(mRes.json).toHaveBeenCalledWith(mExpectedData);
    expect(mRes.status).toHaveBeenCalledWith(400);
  });
});

describe("UpdateExistingUser", () => {
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  //Test Pass: User Profile Updated Successfully
  it("should update user and return a user object", async () => {
    const checkUserExistenceSpy = jest.spyOn(userServices, "checkUserExistence");
    const ValidateUserPasswordSpy = jest.spyOn(utils, "ValidateUserPassword");
    const VerifyUserPasswordSpy = jest.spyOn(utils, "VerifyUserPassword");
    const HashFunctionSpy = jest.spyOn(utils, "HashFunction");
    const UpdateUserAccountSpy = jest.spyOn(DbUser, "UpdateUserAccount");
    const req = {
      id:"65281647e86a5bde7c168a0e",
      body: {
        _id: "65281647e86a5bde7c168a0e",
        username: "xychew1",
        password: "Password1234!",
        
      },
    };
    const oldPassword = req.body.password;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    console.log("request body before", req.body);
    await updateUser(
      req,
      res,
      checkUserExistenceSpy,
      ValidateUserPasswordSpy,
      VerifyUserPasswordSpy,
      HashFunctionSpy,
      UpdateUserAccountSpy
    );

    // checkUserExistenceSpy.mockResolvedValue({ status: 200, result: {...mockUserData[1],__v: expect.any(Number),
    //   createdAt: expect.any(Date),
    //   updatedAt: expect.any(Date),}});
    expect(checkUserExistenceSpy).toHaveBeenCalled();
    expect(checkUserExistenceSpy).toHaveBeenCalledWith( {_id: req.id} );
    expect(ValidateUserPasswordSpy).toHaveBeenCalled();
    expect(ValidateUserPasswordSpy).toHaveBeenCalledWith( oldPassword );
    expect(VerifyUserPasswordSpy).toHaveBeenCalled();
    expect(VerifyUserPasswordSpy).toHaveBeenCalledWith( oldPassword, mockUserData[1].password );
    expect(UpdateUserAccountSpy).toHaveBeenCalled();

  });
  //Test Fail: Unable to update user profile
  it("should be unable to update user", async () => {
    const checkUserExistenceSpy = jest.spyOn(userServices, "checkUserExistence");
    const ValidateUserPasswordSpy = jest.spyOn(utils, "ValidateUserPassword");
    const VerifyUserPasswordSpy = jest.spyOn(utils, "VerifyUserPassword");
    const HashFunctionSpy = jest.spyOn(utils, "HashFunction");
    const UpdateUserAccountSpy = jest.spyOn(DbUser, "UpdateUserAccount");
    const req2 = {
      id:"65281647e86a5bde7c168a0e",
      body: {
        _id: "65281647e86a5bde7c168a0e",
        username: "xychew1",
        password: "Passwor",
        
      },
    };
    const password2 = req2.body.password;
    const res2 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    //checkUserExistence.mockResolvedValue({ status: 200 }); // Mock user found
    //ValidateUserPassword.mockReturnValue({ status: 400, result: "error" }); // Mock successful password validation

    console.log("req2.body", req2.body);
    //checkUserExistenceSpy.mockResolvedValue({...mockUserData[1]});
    await updateUser(
      req2,
      res2,
      checkUserExistenceSpy,
      ValidateUserPasswordSpy,
      VerifyUserPasswordSpy,
      HashFunctionSpy,
      UpdateUserAccountSpy
    );

    expect(checkUserExistenceSpy).toHaveBeenCalled();
    expect(checkUserExistenceSpy).toHaveBeenCalledWith( {_id: req2.id} );
    expect(ValidateUserPasswordSpy).toHaveBeenCalled();
    expect(ValidateUserPasswordSpy).toHaveBeenCalledWith( password2 );

    expect(res2.json).toHaveBeenCalledWith("Password must be a complex password consisting of 8-64 characters");
    expect(res2.status).toHaveBeenCalledWith(400);
  });
});



