const { ValidateUserPassword } = require('../utils'); // Replace with the actual module path

describe('ValidateUserPassword', () => {
  it('should return 200 for a valid complex password', async () => {
    const validPassword = 'Abcd1234$'; // A valid complex password
    const result = await ValidateUserPassword(validPassword);
    expect(result.status).toBe(200);
  });

  it('should return 400 for an empty password', async () => {
    const emptyPassword = null;
    const result = await ValidateUserPassword(emptyPassword);
    expect(result.status).toBe(400);
    expect(result.result).toBe('Password is empty');
  });

  it('should return 400 for a password that does not meet length criteria', async () => {
    const invalidPassword = 'short'; // Less than 8 characters
    const result = await ValidateUserPassword(invalidPassword);
    expect(result.status).toBe(400);
    expect(result.result).toBe(
      'Password must be a complex password consisting of 8-64 characters'
    );
  });
  it('should return 400 for a password that lacks complexity', async () => {
    const weakPassword = 'abc123abc'; // Meets length but lacks complexity
    const result = await ValidateUserPassword(weakPassword);
    expect(result.status).toBe(400);
    expect(result.result).toBe(
      'Password must be a complex password consisting of 8-64 characters'
    );
  });
});
