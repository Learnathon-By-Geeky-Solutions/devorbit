import mongoose, { Types } from 'mongoose';
import ErrorResponse from '../../utils/errorResponse';
import Organization from '../organization/organization.model';
import Permission, { PermissionScope } from '../permission/permission.model';
import UserRoleAssignment from '../role_assignment/userRoleAssignment.model';
import Role, { IRole } from './role.model';

interface RoleUpdateData {
  name?: string;
  permissions?: string[];
}

class RoleService {
  /**
   * Get all roles for an organization
   * @param organizationId - The ID of the organization
   * @returns Promise<IRole[]> - Array of roles
   */

  public async getRolesByOrganization(
    organizationId: string,
  ): Promise<IRole[]> {
    try {
      const orgObjectId = new mongoose.Types.ObjectId(organizationId);

      // Verify organization exists
      const organizationExists = await Organization.exists({
        _id: orgObjectId,
      });
      if (!organizationExists) {
        throw new ErrorResponse('Organization not found', 404);
      }

      // Find all role assignments for this organization
      const roleAssignments = await UserRoleAssignment.find({
        scope: PermissionScope.ORGANIZATION,
        scopeId: orgObjectId,
      }).distinct('roleId');

      // Get the actual roles with their permissions
      const roles = await Role.find({
        _id: { $in: roleAssignments },
      }).populate('permissions', 'name description');

      return roles;
    } catch (error: any) {
      console.error('Error fetching organization roles:', error);
      throw new ErrorResponse(
        error.message || 'Failed to fetch roles',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Update an organization role
   * @param organizationId - The ID of the organization
   * @param roleId - The ID of the role to update
   * @param updateData - The data to update the role with
   * @returns Promise<IRole> - Updated role
   */
  public async updateOrganizationRole(
    organizationId: string,
    roleId: string,
    updateData: RoleUpdateData,
  ): Promise<IRole> {
    try {
      const orgObjectId = new mongoose.Types.ObjectId(organizationId);
      const roleObjectId = new mongoose.Types.ObjectId(roleId);

      // Verify organization exists
      const organizationExists = await Organization.exists({
        _id: orgObjectId,
      });
      if (!organizationExists) {
        throw new ErrorResponse('Organization not found', 404);
      }

      // Verify role exists and is assigned to this organization
      const roleAssignment = await UserRoleAssignment.findOne({
        roleId: roleObjectId,
        scope: PermissionScope.ORGANIZATION,
        scopeId: orgObjectId,
      });

      if (!roleAssignment) {
        throw new ErrorResponse('Role not found in this organization', 404);
      }

      // If updating permissions, verify they exist and are valid for organization scope
      let permissionIds: Types.ObjectId[] | undefined;
      if (updateData.permissions?.length) {
        const permissions = await Permission.find({
          _id: { $in: updateData.permissions },
          scope: PermissionScope.ORGANIZATION,
        })
          .select('_id')
          .lean<{ _id: Types.ObjectId }[]>();

        if (permissions.length !== updateData.permissions.length) {
          throw new ErrorResponse(
            'One or more invalid permission IDs provided',
            400,
          );
        }

        permissionIds = permissions.map(p => p._id);
      }

      // Update the role
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        {
          $set: {
            ...(updateData.name && { name: updateData.name }),
            ...(permissionIds && { permissions: permissionIds }),
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate('permissions', 'name description');

      if (!updatedRole) {
        throw new ErrorResponse('Role not found', 404);
      }

      return updatedRole;
    } catch (error: any) {
      console.error('Error updating organization role:', error);
      throw new ErrorResponse(
        error.message || 'Failed to update role',
        error.statusCode || 500,
      );
    }
  }
}

export const roleService = new RoleService();
