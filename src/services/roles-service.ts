import { Role, CreateRoleRequest, UpdateRoleRequest, AssignPermissionsRequest, RemovePermissionsRequest } from '@/types/role';
import { Permission } from '@/types/permission';
import axiosInstance from '@/lib/apis/axios-client';



export const RolesService = {
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get('/roles');
    return response.data.data;
  },

  getRoleById: async (id: number): Promise<Role> => {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.post('/roles', data);
    return response.data.data;
  },

  updateRole: async (id: number, data: UpdateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.patch(`/roles/${id}`, data);
    return response.data.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },

  assignPermissions: async (id: number, data: AssignPermissionsRequest): Promise<void> => {
    await axiosInstance.post(`/roles/${id}/permissions`, data);
  },

  removePermissions: async (id: number, data: RemovePermissionsRequest): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}/permissions`, { data });
  },
};
