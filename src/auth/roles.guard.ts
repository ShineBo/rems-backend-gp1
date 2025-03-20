import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Fetch required roles from metadata
    const requiredRoles = this.reflector.get<string[]>(
      'roles', // ✅ This must match 'roles' from @Role()
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('No token provided');
    }

    console.log('🔍 Authorization Header:', request.headers.authorization);
    const token = authHeader.split(' ')[1];

    console.log('🔑 Extracted Token:', token);

    try {
      // Verify JWT token and decode the payload
      const payload = this.jwtService.verify(token);

      console.log('✅ Decoded Payload:', payload);
      console.log('User Role:', payload.role);
      console.log('Required Roles:', requiredRoles);

      // Check if the user's role is in the required roles
      if (!requiredRoles.includes(payload.role)) {
        throw new ForbiddenException(
          `Only ${requiredRoles.join(' or ')} can access this route`,
        );
      }

      return true;
    } catch (error) {
      console.error('❌ JWT Verification Error:', error);
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}