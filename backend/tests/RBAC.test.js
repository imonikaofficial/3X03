const RBAC = require('../middleware/RBAC'); // Import the RBAC middleware

describe('RBAC Middleware', () => {
  const mockRequest = (roles) => {
    return { roles };
  };
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should allow access for the "admin" role', () => {
    const req = mockRequest(['admin']);
    const res = mockResponse();
    const roles = ['admin', 'staff', 'user'];
    const middleware = RBAC(roles);
  
    middleware(req, res, () => {}); // Next function
  
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  
  it('should allow access for the "user" role', () => {
    const req = mockRequest(['user']);
    const res = mockResponse();
    const roles = ['admin', 'staff', 'user'];
    const middleware = RBAC(roles);
  
    middleware(req, res, () => {}); // Next function
  
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  
  it('should allow access for the "staff" role', () => {
    const req = mockRequest(['staff']);
    const res = mockResponse();
    const roles = ['admin', 'staff', 'user'];
    const middleware = RBAC(roles);
  
    middleware(req, res, () => {}); // Next function
  
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  

  it('should reject access for invalid roles', () => {
    const req = mockRequest(['user']);
    const res = mockResponse();
    const roles = ['admin'];
    const middleware = RBAC(roles);

    middleware(req, res, () => {}); // Next function

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ status: 403, message: 'Unauthorized1' });
  });

  it('should reject access if roles are not provided in the request', () => {
    const req = mockRequest(undefined);
    const res = mockResponse();
    const roles = ['admin'];
    const middleware = RBAC(roles);

    middleware(req, res, () => {}); // Next function

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ status: 403, message: 'Unauthorized0' });
  });
});
