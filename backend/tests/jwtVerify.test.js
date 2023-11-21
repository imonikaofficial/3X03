
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // This loads the environment variables from the .env file.

const verifyJWT = require('../middleware/verifyJWT');  
const valid_secret_key = process.env.ACCESS_TOKEN_SECRET;

describe('verifyJWT middleware', () => {
  it('should return 401 Unauthorized when no Bearer token is provided', () => {
    const req = {
      headers: {},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    verifyJWT(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 403 Forbidden when the token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    verifyJWT(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
  });

  it('should return 403 Forbidden when user is unverified', () => {
    const validToken = jwt.sign(
        {
          UserInfo: {
            verified: false,
          },
        },
        valid_secret_key,
        { expiresIn: "15 min" }
      );
  
    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    verifyJWT(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 403,
      result: 'Unverified. Please verify your email first',
    });
  });

  it('should set req.id and req.roles when the token is valid and user is verified', () => {
    const validToken = jwt.sign({ UserInfo: { verified: true, id: 123, roles: ['user'] }}, valid_secret_key);

    const req = {
      headers: {
        authorization: `Bearer ${validToken}`,
      },
    };
    const res = {};
    const next = jest.fn();

    verifyJWT(req, res, next);

    expect(req.id).toBe(123);
    expect(req.roles).toEqual(['user']);
    expect(next).toHaveBeenCalled();
  });
});

