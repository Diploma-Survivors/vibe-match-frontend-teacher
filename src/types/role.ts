import { Permission } from './permission';

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  isSystemRole: boolean;
  priority: number;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  slug: string;
  description: string;
  priority: number;
}

export interface UpdateRoleRequest {
  name?: string;
  slug?: string;
  description?: string;
  priority?: number;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}

export interface RemovePermissionsRequest {
  permissionIds: number[];
}
