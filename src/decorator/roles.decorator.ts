import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';

/**
 * A decorator that adds roles to a route. 
 * 
 * Checks if the user has the required roles to access the route. 
 * 
 * Can be applied to a controller or a method
 * @param roles 
 * @returns 
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);