import { prisma } from '../lib/prisma';
import { hash } from 'bcryptjs';

// Mock Prisma methods
jest.mock('../lib/prisma.ts', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }), 
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should hash the password before saving to the database', async () => {
    // Mock the hashed password
    const hashedPassword = await hash('password123', 10);

    // Mock Prisma user.create
    const mockCreate = jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(200);

    // Assert that create was called with correct data
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: expect.stringMatching(/^\$2[ayb]\$.{56}$/),
        role: 'user',
      }),
    });

    const data = await response.json();
    expect(data).toEqual({
      success: true,
      user: expect.objectContaining({
        id: 1,
        email: 'john.doe@example.com',
      }),
    });
  });
});