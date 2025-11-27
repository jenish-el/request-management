import prisma from '../config/database';
import { User, UserRole, RegisterDto } from '../types';
import logger from '../config/logger';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user as User | null;
    } catch (error) {
      logger.error('Error finding user by email', { error, email });
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          manager_id: true,
          created_at: true,
          updated_at: true,
        },
      });
      return user as User | null;
    } catch (error) {
      logger.error('Error finding user by id', { error, id });
      throw error;
    }
  }

  async create(userData: RegisterDto & { password: string }): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
          manager_id: userData.manager_id || null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          manager_id: true,
          created_at: true,
          updated_at: true,
        },
      });
      return user as User;
    } catch (error) {
      logger.error('Error creating user', { error, email: userData.email });
      throw error;
    }
  }

  async findManagerByEmployeeId(employeeId: number): Promise<User | null> {
    try {
      const employee = await prisma.user.findUnique({
        where: { id: employeeId },
        include: {
          manager: true,
        },
      });

      if (!employee || !employee.manager || employee.manager.role !== UserRole.MANAGER) {
        return null;
      }

      const manager = employee.manager;
      return {
        id: manager.id,
        email: manager.email,
        password: manager.password,
        name: manager.name,
        role: manager.role,
        manager_id: manager.manager_id,
        created_at: manager.created_at,
        updated_at: manager.updated_at,
      } as User;
    } catch (error) {
      logger.error('Error finding manager by employee id', { error, employeeId });
      throw error;
    }
  }

  async findEmployeesByManagerId(managerId: number): Promise<User[]> {
    try {
      const employees = await prisma.user.findMany({
        where: { manager_id: managerId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          manager_id: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
      });
      return employees as User[];
    } catch (error) {
      logger.error('Error finding employees by manager id', { error, managerId });
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          manager_id: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
      });
      return users as User[];
    } catch (error) {
      logger.error('Error finding all users', { error });
      throw error;
    }
  }
}

export default new UserRepository();
