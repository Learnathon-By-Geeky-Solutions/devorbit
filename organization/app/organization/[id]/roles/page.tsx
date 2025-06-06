'use client';

import CreateRoleModal from '@/components/roles/CreateRoleModal';
import RoleTable from '@/components/roles/RoleTable';
import api from '@/lib/axios';
import {
  createRole,
  deleteRole,
  getAllRole,
} from '@/service/roleService/roleService';
import { Permission, Role } from '@/types/role';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function RolesManagement() {
  const params = useParams();
  const orgId = params.id as string;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isDefault, setIsDefault] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Properly call getAllRole with the organization ID
        const rolesResponse = await getAllRole(orgId);

        // Fetch permissions
        const permissionsResponse = await api.get('/api/v1/permissions/local');

        setRoles(rolesResponse.data);
        setPermissions(permissionsResponse.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Simple error handling without handleAxiosError
        setError(err instanceof Error ? err.message : 'Error fetching data');
        toast.error(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  const handleCreateRole = async () => {
    try {
      if (!roleName) {
        toast.error('Role name is required');
        return;
      }

      if (selectedPermissions.length === 0) {
        toast.error('Please select at least one permission');
        return;
      }

      const roleData = {
        name: roleName.trim(),
        permissions: selectedPermissions,
        isDefault: isDefault ? 'true' : 'false',
      };

      // Pass orgId to createRole function
      const response = await createRole(orgId, roleData);

      // Add new role to state and show success message
      setRoles(prevRoles => [...prevRoles, response.data]);
      toast.success('Role created successfully!');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating role:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Error creating role';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      // Pass orgId to deleteRole function
      await deleteRole(orgId, id);
      setRoles(prevRoles => prevRoles.filter(role => role._id !== id));
      toast.success('Role deleted successfully');
    } catch (err) {
      console.error('Error deleting role:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete role');
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId],
    );
  };

  const resetForm = () => {
    setRoleName('');
    setSelectedPermissions([]);
    setIsDefault(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">UnAuthourized To Access This Route</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage roles and their permissions in your application.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Role
          </button>
        </div>
      </div>

      <RoleTable roles={roles} canDelete={true} onDelete={handleDeleteRole} />

      {isCreateModalOpen && (
        <CreateRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            resetForm();
            setIsCreateModalOpen(false);
          }}
          onSubmit={handleCreateRole}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          togglePermission={togglePermission}
          name={roleName}
          setName={setRoleName}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
        />
      )}
    </div>
  );
}
