import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import userRepository from '../repositories/user.repository';
import { RegisterDto, LoginDto, JwtPayload, UserRole } from '../types';
import logger from '../config/logger';

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  async register(userData: RegisterDto): Promise<{ user: Omit<any, 'password'>; token: string }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate manager_id if provided
    if (userData.manager_id) {
      const manager = await userRepository.findById(userData.manager_id);
      if (!manager) {
        throw new Error('Manager not found');
      }
      if (manager.role !== UserRole.MANAGER) {
        throw new Error('Specified user is not a manager');
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        manager_id: user.manager_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    };
  }

  async login(loginData: LoginDto): Promise<{ user: Omit<any, 'password'>; token: string }> {
    // Find user
    const user = await userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        manager_id: user.manager_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      token,
    };
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as SignOptions);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error) {
      logger.error('Token verification failed', { error });
      throw new Error('Invalid or expired token');
    }
  }
}

export default new AuthService();

