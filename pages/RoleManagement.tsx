import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { Role, User, Category, Space, Permission } from '../types';
import { Button, Card } from '../components/UI';
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  Users as UsersIcon, 
  Search, 
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Upload,
  FileEdit,
  CheckSquare,
  GitBranch,
  Lock,
  Unlock
} from 'lucide-react';

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserAssignModal, setShowUserAssignModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rolesData, usersData, categoriesData, spacesData] = await Promise.all([
      KMSService.getRoles(),
      KMSService.getAllUsers(),
      KMSService.getCategories(),
      KMSService.getSpaces()
    ]);
    setRoles(rolesData);
    setUsers(usersData);
    setCategories(categoriesData);
    setSpaces(spacesData);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.userCount > 0) {
      alert('Không thể xóa Role đang có User gán vào. Vui lòng bỏ gán tất cả User trước.');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa Role "${role.name}"?`)) {
      await KMSService.deleteRole(role.id);
      loadData();
    }
  };

  const handleAssignUsers = (role: Role) => {
    setSelectedRole(role);
    setShowUserAssignModal(true);
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân quyền (RBAC)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý vai trò và phân quyền truy cập cho người dùng trong hệ thống
          </p>
        </div>
        <Button onClick={handleCreateRole} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo Role mới
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm Role theo tên hoặc mô tả..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Role List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng User
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người tạo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role, index) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-indigo-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                    {role.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {role.userCount} người
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {role.status === 'Active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAssignUsers(role)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Gán User"
                      >
                        <UsersIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        disabled={role.userCount > 0}
                      >
                        <Trash2 className={`w-4 h-4 ${role.userCount > 0 ? 'opacity-30 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRoles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy Role nào</p>
            </div>
          )}
        </div>
      </Card>

      {/* Role Create/Edit Modal */}
      {showRoleModal && (
        <RoleFormModal
          role={editingRole}
          categories={categories}
          spaces={spaces}
          onClose={() => setShowRoleModal(false)}
          onSave={async (roleData) => {
            if (editingRole) {
              await KMSService.updateRole(editingRole.id, roleData);
            } else {
              await KMSService.createRole(roleData);
            }
            setShowRoleModal(false);
            loadData();
          }}
        />
      )}

      {/* User Assignment Modal */}
      {showUserAssignModal && selectedRole && (
        <UserAssignmentModal
          role={selectedRole}
          users={users}
          onClose={() => setShowUserAssignModal(false)}
          onSave={async (userIds) => {
            await KMSService.assignUsersToRole(selectedRole.id, userIds);
            setShowUserAssignModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Role Form Modal Component
interface RoleFormModalProps {
  role: Role | null;
  categories: Category[];
  spaces: Space[];
  onClose: () => void;
  onSave: (role: Partial<Role>) => void;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({ role, categories, spaces, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: role?.name || '',
    description: role?.description || '',
    systemPermissions: role?.systemPermissions || [],
    categoryPermissions: role?.categoryPermissions || [],
    spacePermissions: role?.spacePermissions || [],
    approvalPermissions: role?.approvalPermissions || [],
    status: role?.status || 'Active',
    notes: role?.notes || ''
  });

  const systemPermissionsList = [
    { id: 'view_dashboard', label: 'Xem Dashboard' },
    { id: 'manage_categories', label: 'Quản lý Danh mục' },
    { id: 'manage_spaces', label: 'Quản lý Không gian' },
    { id: 'view_all_docs', label: 'Xem tất cả tài liệu' },
    { id: 'upload_docs', label: 'Tải lên tài liệu' },
    { id: 'edit_docs', label: 'Chỉnh sửa tài liệu' },
    { id: 'delete_docs', label: 'Xóa tài liệu' },
    { id: 'approve_docs', label: 'Phê duyệt tài liệu' },
    { id: 'manage_users', label: 'Quản lý người dùng' },
    { id: 'manage_roles', label: 'Quản lý phân quyền' },
    { id: 'view_reports', label: 'Xem báo cáo' },
    { id: 'manage_ingestion', label: 'Quản lý thu thập dữ liệu' }
  ];

  const categoryPermissionActions = [
    { id: 'view', label: 'Xem', icon: Eye },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'edit', label: 'Chỉnh sửa', icon: FileEdit },
    { id: 'approve', label: 'Phê duyệt', icon: CheckSquare },
    { id: 'version', label: 'Tạo phiên bản', icon: GitBranch }
  ];

  const spaceRoles = [
    { id: 'Viewer', label: 'Viewer (Chỉ xem)' },
    { id: 'Contributor', label: 'Contributor (Upload + thảo luận)' },
    { id: 'Moderator', label: 'Moderator (Quản lý tài liệu)' },
    { id: 'Owner', label: 'Owner (Toàn quyền)' }
  ];

  const toggleSystemPermission = (permId: string) => {
    const current = formData.systemPermissions || [];
    if (current.includes(permId)) {
      setFormData({ ...formData, systemPermissions: current.filter(p => p !== permId) });
    } else {
      setFormData({ ...formData, systemPermissions: [...current, permId] });
    }
  };

  const toggleCategoryPermission = (categoryId: string, action: string) => {
    const current = formData.categoryPermissions || [];
    const existing = current.find(cp => cp.categoryId === categoryId);
    
    if (existing) {
      const actions = existing.actions.includes(action)
        ? existing.actions.filter(a => a !== action)
        : [...existing.actions, action];
      
      setFormData({
        ...formData,
        categoryPermissions: current.map(cp =>
          cp.categoryId === categoryId ? { ...cp, actions } : cp
        )
      });
    } else {
      setFormData({
        ...formData,
        categoryPermissions: [...current, { categoryId, actions: [action] }]
      });
    }
  };

  const setSpacePermission = (spaceId: string, spaceRole: string) => {
    const current = formData.spacePermissions || [];
    const existing = current.find(sp => sp.spaceId === spaceId);
    
    if (existing) {
      setFormData({
        ...formData,
        spacePermissions: current.map(sp =>
          sp.spaceId === spaceId ? { ...sp, role: spaceRole } : sp
        )
      });
    } else {
      setFormData({
        ...formData,
        spacePermissions: [...current, { spaceId, role: spaceRole }]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert('Vui lòng nhập đầy đủ tên và mô tả Role');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {role ? 'Chỉnh sửa Role' : 'Tạo Role mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Content Manager, Document Reviewer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Diễn giải mục đích và phạm vi của Role này..."
              />
            </div>
          </div>

          {/* System Permissions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-500" />
              Quyền hệ thống
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
              {systemPermissionsList.map((perm) => (
                <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.systemPermissions?.includes(perm.id)}
                    onChange={() => toggleSystemPermission(perm.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Permissions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quyền theo Danh mục tri thức
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Danh mục</th>
                    {categoryPermissionActions.map(action => (
                      <th key={action.id} className="px-4 py-3 text-center font-medium text-gray-700">
                        <div className="flex flex-col items-center">
                          <action.icon className="w-4 h-4 mb-1" />
                          {action.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((cat) => {
                    const catPerm = formData.categoryPermissions?.find(cp => cp.categoryId === cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                        {categoryPermissionActions.map(action => (
                          <td key={action.id} className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={catPerm?.actions.includes(action.id) || false}
                              onChange={() => toggleCategoryPermission(cat.id, action.id)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Space Permissions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quyền theo Không gian tri thức
            </h3>
            <div className="space-y-3">
              {spaces.filter(s => s.status === 'Active').map((space) => {
                const spacePerm = formData.spacePermissions?.find(sp => sp.spaceId === space.id);
                return (
                  <div key={space.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{space.name}</div>
                      <div className="text-sm text-gray-500">{space.type}</div>
                    </div>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={spacePerm?.role || ''}
                      onChange={(e) => setSpacePermission(space.id, e.target.value)}
                    >
                      <option value="">Không có quyền</option>
                      {spaceRoles.map(sr => (
                        <option key={sr.id} value={sr.id}>{sr.label}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Permissions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quyền phê duyệt (Workflow)
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phê duyệt danh mục
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Không</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phê duyệt không gian
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">Không</option>
                    {spaces.filter(s => s.status === 'Active').map(space => (
                      <option key={space.id} value={space.id}>{space.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp duyệt
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Không phê duyệt</option>
                  <option value="level1">Cấp 1 (Reviewer đầu tiên)</option>
                  <option value="level2">Cấp 2 (Phê duyệt cuối)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú thêm về role này..."
            />
          </div>

          {/* Status */}
          {role && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'Active'}
                    onChange={() => setFormData({ ...formData, status: 'Active' })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <Unlock className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'Inactive'}
                    onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          )}
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {role ? 'Cập nhật' : 'Tạo Role'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// User Assignment Modal Component
interface UserAssignmentModalProps {
  role: Role;
  users: User[];
  onClose: () => void;
  onSave: (userIds: string[]) => void;
}

const UserAssignmentModal: React.FC<UserAssignmentModalProps> = ({ role, users, onClose, onSave }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(role.assignedUserIds || []);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSave = () => {
    onSave(selectedUserIds);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gán User vào Role</h2>
            <p className="text-sm text-gray-500 mt-1">
              Role: <span className="font-medium">{role.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng theo tên, email, phòng ban..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Đã chọn: <span className="font-medium text-indigo-600">{selectedUserIds.length}</span> người dùng
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleUser(user.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.email} • {user.department}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {user.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Gán {selectedUserIds.length} người dùng
          </Button>
        </div>
      </div>
    </div>
  );
};
