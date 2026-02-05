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
  Unlock,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Archive,
  FolderTree,
  LayoutDashboard,
  Crown,
  UserCog,
  Briefcase,
  User as UserIcon
} from 'lucide-react';

// Định nghĩa các nhóm quyền chuẩn
const STANDARD_ROLE_GROUPS = {
  ADMIN: 'Admin',
  EXPERT: 'Nhóm chuyên gia',
  MANAGER: 'Nhóm quản lý',
  USER: 'Nhóm user'
};

// Định nghĩa chi tiết quyền cho từng màn hình
interface ScreenPermission {
  screenId: string;
  screenName: string;
  icon: any;
  description: string;
  actions: {
    id: string;
    name: string;
    description: string;
  }[];
}

const SCREEN_PERMISSIONS: ScreenPermission[] = [
  {
    screenId: 'dashboard',
    screenName: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Màn hình tổng quan',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem thống kê và biểu đồ' }
    ]
  },
  {
    screenId: 'rbac',
    screenName: 'Phân quyền',
    icon: Shield,
    description: 'Quản lý phân quyền và vai trò',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem danh sách vai trò' },
      { id: 'create', name: 'Tạo', description: 'Tạo vai trò mới' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa vai trò' },
      { id: 'delete', name: 'Xóa', description: 'Xóa vai trò' },
      { id: 'assign', name: 'Gán user', description: 'Gán người dùng vào vai trò' }
    ]
  },
  {
    screenId: 'categories',
    screenName: 'Danh mục tri thức',
    icon: FolderTree,
    description: 'Quản lý danh mục tài liệu',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem danh sách danh mục' },
      { id: 'create', name: 'Tạo', description: 'Tạo danh mục mới' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa danh mục' },
      { id: 'delete', name: 'Xóa', description: 'Xóa danh mục' },
      { id: 'manage_expert', name: 'Gán chuyên gia', description: 'Gán chuyên gia cho danh mục' }
    ]
  },
  {
    screenId: 'spaces',
    screenName: 'Không gian tri thức',
    icon: Briefcase,
    description: 'Quản lý không gian làm việc',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem danh sách không gian' },
      { id: 'create', name: 'Tạo', description: 'Tạo không gian mới' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa không gian' },
      { id: 'delete', name: 'Xóa', description: 'Xóa không gian' },
      { id: 'manage_members', name: 'Quản lý thành viên', description: 'Thêm/xóa thành viên không gian' }
    ]
  },
  {
    screenId: 'repository',
    screenName: 'Kho tài liệu',
    icon: FileText,
    description: 'Quản lý kho tài liệu',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem danh sách tài liệu' },
      { id: 'upload', name: 'Tải lên', description: 'Tải lên tài liệu mới' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa thông tin tài liệu' },
      { id: 'delete', name: 'Xóa', description: 'Xóa tài liệu' },
      { id: 'download', name: 'Tải xuống', description: 'Tải xuống tài liệu' },
      { id: 'share', name: 'Chia sẻ', description: 'Chia sẻ tài liệu' },
      { id: 'version', name: 'Quản lý phiên bản', description: 'Tạo và quản lý phiên bản tài liệu' }
    ]
  },
  {
    screenId: 'my_documents',
    screenName: 'Tài liệu của tôi',
    icon: UserIcon,
    description: 'Quản lý tài liệu cá nhân',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem tài liệu của mình' },
      { id: 'upload', name: 'Tải lên', description: 'Tải lên tài liệu mới' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa tài liệu của mình' },
      { id: 'delete', name: 'Xóa', description: 'Xóa tài liệu của mình' }
    ]
  },
  {
    screenId: 'knowledge_collection',
    screenName: 'Thu thập tri thức',
    icon: Archive,
    description: 'Thu thập tài liệu từ nhiều nguồn',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem danh sách nguồn thu thập' },
      { id: 'create', name: 'Tạo', description: 'Tạo nguồn thu thập mới' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa cấu hình thu thập' },
      { id: 'delete', name: 'Xóa', description: 'Xóa nguồn thu thập' },
      { id: 'execute', name: 'Thực thi', description: 'Chạy quá trình thu thập' }
    ]
  },
  {
    screenId: 'approvals',
    screenName: 'Phê duyệt tài liệu',
    icon: CheckSquare,
    description: 'Phê duyệt tài liệu chờ duyệt',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem danh sách chờ duyệt' },
      { id: 'approve', name: 'Phê duyệt', description: 'Phê duyệt tài liệu' },
      { id: 'reject', name: 'Từ chối', description: 'Từ chối tài liệu' },
      { id: 'comment', name: 'Nhận xét', description: 'Thêm nhận xét' }
    ]
  },
  {
    screenId: 'feedback',
    screenName: 'Cộng tác tri thức',
    icon: MessageSquare,
    description: 'Quản lý góp ý và thảo luận',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem góp ý' },
      { id: 'create', name: 'Tạo', description: 'Tạo góp ý mới' },
      { id: 'reply', name: 'Trả lời', description: 'Trả lời góp ý' },
      { id: 'resolve', name: 'Giải quyết', description: 'Đánh dấu đã giải quyết' }
    ]
  },
  {
    screenId: 'expired_docs',
    screenName: 'Tài liệu hết hạn',
    icon: AlertCircle,
    description: 'Quản lý tài liệu hết hạn',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem tài liệu hết hạn' },
      { id: 'extend', name: 'Gia hạn', description: 'Gia hạn tài liệu' },
      { id: 'archive', name: 'Lưu trữ', description: 'Lưu trữ tài liệu' },
      { id: 'delete', name: 'Xóa', description: 'Xóa tài liệu hết hạn' }
    ]
  },
  {
    screenId: 'reports',
    screenName: 'Báo cáo & Phân tích',
    icon: BarChart3,
    description: 'Xem báo cáo và thống kê',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem báo cáo' },
      { id: 'export', name: 'Xuất', description: 'Xuất báo cáo' },
      { id: 'create', name: 'Tạo', description: 'Tạo báo cáo tùy chỉnh' }
    ]
  },
  {
    screenId: 'system_admin',
    screenName: 'Quản trị hệ thống',
    icon: Settings,
    description: 'Cấu hình hệ thống',
    actions: [
      { id: 'view', name: 'Xem', description: 'Xem cấu hình' },
      { id: 'edit', name: 'Sửa', description: 'Chỉnh sửa cấu hình hệ thống' },
      { id: 'manage_users', name: 'Quản lý user', description: 'Quản lý người dùng hệ thống' }
    ]
  }
];

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  
  const [mainTab, setMainTab] = useState<'groups' | 'permissions'>('groups');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserAssignModal, setShowUserAssignModal] = useState(false);
  const [showPermissionDetailModal, setShowPermissionDetailModal] = useState(false);
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

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionDetailModal(true);
  };

  // Hàm lấy icon cho nhóm quyền
  const getRoleGroupIcon = (roleName: string) => {
    if (roleName.includes('Admin')) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (roleName.includes('chuyên gia')) return <UserCog className="w-5 h-5 text-purple-500" />;
    if (roleName.includes('quản lý')) return <Briefcase className="w-5 h-5 text-blue-500" />;
    return <UserIcon className="w-5 h-5 text-gray-500" />;
  };

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân quyền hệ thống (RBAC)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý nhóm tài khoản và phân quyền chi tiết cho từng màn hình trong hệ thống
          </p>
        </div>
        {mainTab === 'groups' && (
          <Button onClick={handleCreateRole} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tạo nhóm tài khoản mới
          </Button>
        )}
      </div>

      {/* Main Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setMainTab('groups')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                mainTab === 'groups'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                <span>Nhóm tài khoản</span>
                <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                  {roles.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setMainTab('permissions')}
              className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                mainTab === 'permissions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Phân quyền nhóm tài khoản</span>
              </div>
            </button>
          </nav>
        </div>
      </Card>

      {/* Tab: Nhóm tài khoản */}
      {mainTab === 'groups' && (
        <>
          {/* Search & Filter */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhóm tài khoản theo tên hoặc mô tả..."
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
                      Nhóm tài khoản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số user
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
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
                          {getRoleGroupIcon(role.name)}
                          <span className="text-sm font-medium text-gray-900 ml-2">{role.name}</span>
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
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Không hoạt động
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {role.createdAt}
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
                  <p>Không tìm thấy nhóm tài khoản nào</p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Tab: Phân quyền nhóm tài khoản */}
      {mainTab === 'permissions' && (
        <>
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chọn nhóm tài khoản để phân quyền</h3>
              <p className="text-sm text-gray-500 mb-4">Chọn một nhóm tài khoản để xem và cấu hình quyền chi tiết</p>
              <select
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedRole?.id || ''}
                onChange={(e) => {
                  const role = roles.find(r => r.id === e.target.value);
                  setSelectedRole(role || null);
                }}
              >
                <option value="">-- Chọn nhóm tài khoản --</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.userCount} người dùng)
                  </option>
                ))}
              </select>
            </div>

            {selectedRole ? (
              <div className="mt-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {getRoleGroupIcon(selectedRole.name)}
                        {selectedRole.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedRole.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-600">
                          <UsersIcon className="w-3 h-3 inline mr-1" />
                          {selectedRole.userCount} người dùng
                        </span>
                        <span className="text-xs text-gray-600">
                          <Shield className="w-3 h-3 inline mr-1" />
                          {selectedRole.systemPermissions?.length || 0} quyền
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleViewPermissions(selectedRole)}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>

                {/* Permission Matrix */}
                <PermissionMatrix role={selectedRole} onUpdate={loadData} />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Chưa chọn nhóm tài khoản</p>
                <p className="text-sm mt-2">Vui lòng chọn một nhóm tài khoản từ danh sách để cấu hình quyền</p>
              </div>
            )}
          </Card>
        </>
      )}
      
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

      {/* Permission Detail Modal */}
      {showPermissionDetailModal && selectedRole && (
        <PermissionDetailModal
          role={selectedRole}
          onClose={() => setShowPermissionDetailModal(false)}
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

  const [selectedScreenPermissions, setSelectedScreenPermissions] = useState<{
    [screenId: string]: string[];
  }>(() => {
    // Parse systemPermissions thành object dễ quản lý
    const parsed: { [screenId: string]: string[] } = {};
    if (role?.systemPermissions) {
      role.systemPermissions.forEach(perm => {
        const [screenId, actionId] = perm.split('.');
        if (screenId && actionId) {
          if (!parsed[screenId]) parsed[screenId] = [];
          parsed[screenId].push(actionId);
        }
      });
    }
    return parsed;
  });

  const [activeTab, setActiveTab] = useState<'screens' | 'categories' | 'spaces'>('screens');

  const handleToggleScreenAction = (screenId: string, actionId: string) => {
    setSelectedScreenPermissions(prev => {
      const screenPerms = prev[screenId] || [];
      const newPerms = screenPerms.includes(actionId)
        ? screenPerms.filter(a => a !== actionId)
        : [...screenPerms, actionId];
      
      return {
        ...prev,
        [screenId]: newPerms
      };
    });
  };

  const handleToggleAllScreenActions = (screenId: string, allActions: string[]) => {
    setSelectedScreenPermissions(prev => {
      const screenPerms = prev[screenId] || [];
      const allSelected = allActions.every(a => screenPerms.includes(a));
      
      return {
        ...prev,
        [screenId]: allSelected ? [] : allActions
      };
    });
  };

  const handleSubmit = () => {
    // Convert selectedScreenPermissions thành mảng systemPermissions
    const systemPermissions: string[] = [];
    Object.entries(selectedScreenPermissions).forEach(([screenId, actions]) => {
      actions.forEach(actionId => {
        systemPermissions.push(`${screenId}.${actionId}`);
      });
    });

    const roleData: Partial<Role> = {
      ...formData,
      systemPermissions
    };

    onSave(roleData);
  };

  const isFormValid = formData.name && formData.description;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {role ? 'Chỉnh sửa nhóm quyền' : 'Tạo nhóm quyền mới'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cấu hình chi tiết quyền truy cập cho từng màn hình và chức năng
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Thông tin cơ bản */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên nhóm quyền <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="role-suggestions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên nhóm quyền hoặc chọn từ danh sách..."
                />
                <datalist id="role-suggestions">
                  <option value={STANDARD_ROLE_GROUPS.ADMIN} />
                  <option value={STANDARD_ROLE_GROUPS.EXPERT} />
                  <option value={STANDARD_ROLE_GROUPS.MANAGER} />
                  <option value={STANDARD_ROLE_GROUPS.USER} />
                </datalist>
                <p className="text-xs text-gray-500 mt-1">Gợi ý: Admin, Nhóm chuyên gia, Nhóm quản lý, Nhóm user</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <span className="text-sm text-gray-700">Hoạt động</span>
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
                    <span className="text-sm text-gray-700">Không hoạt động</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về nhóm quyền này và phạm vi sử dụng..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú thêm (nếu có)..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex items-center gap-2"
            disabled={!isFormValid}
          >
            <Save className="w-4 h-4" />
            {role ? 'Cập nhật nhóm' : 'Tạo nhóm'}
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

// Permission Matrix Component - Ma trận phân quyền
interface PermissionMatrixProps {
  role: Role;
  onUpdate: () => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ role, onUpdate }) => {
  const [selectedScreenPermissions, setSelectedScreenPermissions] = useState<{
    [screenId: string]: string[];
  }>(() => {
    const parsed: { [screenId: string]: string[] } = {};
    if (role?.systemPermissions) {
      role.systemPermissions.forEach(perm => {
        const [screenId, actionId] = perm.split('.');
        if (screenId && actionId) {
          if (!parsed[screenId]) parsed[screenId] = [];
          parsed[screenId].push(actionId);
        }
      });
    }
    return parsed;
  });

  const handleToggleScreenAction = (screenId: string, actionId: string) => {
    setSelectedScreenPermissions(prev => {
      const screenPerms = prev[screenId] || [];
      const newPerms = screenPerms.includes(actionId)
        ? screenPerms.filter(a => a !== actionId)
        : [...screenPerms, actionId];
      
      return {
        ...prev,
        [screenId]: newPerms
      };
    });
  };

  const handleToggleAllScreenActions = (screenId: string, allActions: string[]) => {
    setSelectedScreenPermissions(prev => {
      const screenPerms = prev[screenId] || [];
      const allSelected = allActions.every(a => screenPerms.includes(a));
      
      return {
        ...prev,
        [screenId]: allSelected ? [] : allActions
      };
    });
  };

  const handleSavePermissions = async () => {
    // Convert selectedScreenPermissions thành systemPermissions
    const systemPermissions: string[] = [];
    Object.entries(selectedScreenPermissions).forEach(([screenId, actions]) => {
      actions.forEach(actionId => {
        systemPermissions.push(`${screenId}.${actionId}`);
      });
    });

    await KMSService.updateRole(role.id, {
      ...role,
      systemPermissions
    });
    onUpdate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Đã chọn: <span className="font-medium text-indigo-600">
            {Object.values(selectedScreenPermissions).flat().length}
          </span> quyền
        </p>
        <Button onClick={handleSavePermissions} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Lưu phân quyền
        </Button>
      </div>

      {/* Danh sách màn hình và quyền */}
      <div className="space-y-2">
        {SCREEN_PERMISSIONS.map(screen => {
          const selectedActions = selectedScreenPermissions[screen.screenId] || [];
          const allActions = screen.actions.map(a => a.id);
          const allSelected = allActions.length > 0 && allActions.every(a => selectedActions.includes(a));
          const someSelected = selectedActions.length > 0 && !allSelected;
          const Icon = screen.icon;

          return (
            <div 
              key={screen.screenId} 
              className={`border rounded-lg p-3 transition-all ${
                selectedActions.length > 0 
                  ? 'border-indigo-400 bg-indigo-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-64 shrink-0">
                  <div className={`p-1.5 rounded ${
                    selectedActions.length > 0 ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      selectedActions.length > 0 ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{screen.screenName}</h4>
                    <p className="text-xs text-gray-500 truncate">{screen.description}</p>
                  </div>
                </div>

                <div className="h-12 w-px bg-gray-200"></div>

                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 border border-gray-300">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={input => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={() => handleToggleAllScreenActions(screen.screenId, allActions)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-gray-700">Tất cả</span>
                  </label>

                  {screen.actions.map(action => {
                    const isSelected = selectedActions.includes(action.id);
                    return (
                      <label
                        key={action.id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-indigo-500 text-white border border-indigo-600' 
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        title={action.description}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleScreenAction(screen.screenId, action.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-xs font-medium ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}>
                          {action.name}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {selectedActions.length > 0 && (
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      {selectedActions.length}/{screen.actions.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Permission Detail Modal - Xem chi tiết quyền của role
interface PermissionDetailModalProps {
  role: Role;
  onClose: () => void;
}

const PermissionDetailModal: React.FC<PermissionDetailModalProps> = ({ role, onClose }) => {
  // Parse systemPermissions
  const permissionsByScreen: { [screenId: string]: string[] } = {};
  if (role.systemPermissions) {
    role.systemPermissions.forEach(perm => {
      const [screenId, actionId] = perm.split('.');
      if (screenId && actionId) {
        if (!permissionsByScreen[screenId]) permissionsByScreen[screenId] = [];
        permissionsByScreen[screenId].push(actionId);
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-500" />
              Chi tiết phân quyền
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Nhóm quyền: <span className="font-medium text-indigo-600">{role.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Tổng quan */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-gray-900 mb-2">{role.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">
                  {Object.keys(permissionsByScreen).length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Màn hình</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Object.values(permissionsByScreen).flat().length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Quyền</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{role.userCount}</p>
                <p className="text-xs text-gray-600 mt-1">Người dùng</p>
              </div>
            </div>
          </div>

          {/* Chi tiết quyền theo màn hình */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-indigo-500" />
              Danh sách quyền theo màn hình
            </h3>

            {Object.keys(permissionsByScreen).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nhóm quyền này chưa được cấp quyền nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {SCREEN_PERMISSIONS.filter(screen => 
                  permissionsByScreen[screen.screenId]
                ).map(screen => {
                  const actions = permissionsByScreen[screen.screenId] || [];
                  const Icon = screen.icon;

                  return (
                    <div key={screen.screenId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-indigo-500 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{screen.screenName}</h4>
                            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                              {actions.length} quyền
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{screen.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {screen.actions
                              .filter(action => actions.includes(action.id))
                              .map(action => (
                                <div
                                  key={action.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-sm font-medium text-indigo-700">{action.name}</span>
                                  <span className="text-xs text-gray-500">({action.description})</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};