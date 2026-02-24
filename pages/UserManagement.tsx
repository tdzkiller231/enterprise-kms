import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { User, Role } from '../types';
import { Button, Card } from '../components/UI';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X,
  CheckCircle2,
  XCircle,
  Key,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passwordResetResult, setPasswordResetResult] = useState<any>(null);
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    roleIds: [] as string[], // Keep as array for backend compatibility
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [searchTerm, filterRole, filterStatus, currentPage, sortBy, sortOrder]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await KMSService.getUsersForManagement({
        search: searchTerm,
        roleId: filterRole,
        status: filterStatus,
        page: currentPage,
        pageSize: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder
      });
      setUsers(result.users);
      setTotalUsers(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await KMSService.getRoles();
      setRoles(rolesData.filter(r => r.status === 'Active'));
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      roleIds: [],
      notes: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      username: user.username || '',
      password: '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || '',
      roleIds: user.roleIds || [],
      notes: user.notes || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setPasswordResetResult(null);
    setShowPasswordModal(true);
  };

  const confirmResetPassword = async () => {
    if (!selectedUser) return;
    const result = await KMSService.resetUserPassword(selectedUser.id);
    if (result.success) {
      setPasswordResetResult(result);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống';
    }
    
    if (!selectedUser && !formData.password) {
      errors.password = 'Mật khẩu không được để trống khi tạo mới';
    }
    
    if (formData.roleIds.length === 0) {
      errors.roleIds = 'Phải chọn ít nhất một nhóm tài khoản';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUser) {
        await KMSService.updateUser(selectedUser.id, formData);
      } else {
        await KMSService.createUser(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    await KMSService.deleteUser(selectedUser.id);
    setShowDeleteModal(false);
    loadData();
  };

  const toggleStatus = async (user: User) => {
    await KMSService.toggleUserStatus(user.id);
    loadData();
  };

  const handleRoleChange = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roleIds: roleId ? [roleId] : [] // Store as single-item array
    }));
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'Active') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Áp dụng</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Ngừng áp dụng</span>;
  };

  const getRoleBadge = (roleIds?: string[]) => {
    if (!roleIds || roleIds.length === 0) return <span className="text-gray-400 text-sm">Chưa gán</span>;
    
    const role = roles.find(r => r.id === roleIds[0]);
    return role ? (
      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
        {role.name}
      </span>
    ) : <span className="text-gray-400 text-sm">Chưa gán</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Quản lý User
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý người dùng, phân quyền và thiết lập tài khoản</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm User
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tất cả nhóm tài khoản</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Áp dụng</option>
              <option value="Inactive">Ngừng áp dụng</option>
            </select>
          </div>
        </div>
      </Card>

      {/* User Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhóm tài khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy user nào
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={user.avatar} 
                          alt={user.username || user.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username || user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.roleIds)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user)}
                        className={user.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        title={user.status === 'Active' ? 'Ngừng áp dụng' : 'Áp dụng'}
                      >
                        {user.status === 'Active' ? <XCircle className="w-4 h-4 inline" /> : <CheckCircle2 className="w-4 h-4 inline" />}
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Reset mật khẩu"
                      >
                        <Key className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalUsers)} trong tổng số {totalUsers} user
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-1 border rounded bg-indigo-50 text-indigo-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedUser ? 'Chỉnh sửa User' : 'Thêm User mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!!selectedUser}
                  />
                  {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                </div>

                {!selectedUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhóm tài khoản (RBAC) <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${formErrors.roleIds ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.roleIds[0] || ''}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="">-- Chọn nhóm tài khoản --</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
                {formErrors.roleIds && <p className="text-red-500 text-xs mt-1">{formErrors.roleIds}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button onClick={handleSave}>
                {selectedUser ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa user <strong>{selectedUser.name}</strong>?
              <br />Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
              <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Reset mật khẩu</h3>
            {!passwordResetResult ? (
              <>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn reset mật khẩu cho user <strong>{selectedUser.name}</strong>?
                  <br />Một mật khẩu tạm thời sẽ được tạo.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setShowPasswordModal(false)}>Hủy</Button>
                  <Button onClick={confirmResetPassword}>Reset</Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium mb-2">Reset mật khẩu thành công!</p>
                  <p className="text-sm text-gray-700 mb-2">Mật khẩu tạm thời:</p>
                  <div className="bg-white border border-gray-300 rounded px-3 py-2 font-mono text-lg text-center">
                    {passwordResetResult.tempPassword}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Vui lòng lưu mật khẩu này và gửi cho user. User cần đổi mật khẩu sau lần đăng nhập đầu tiên.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowPasswordModal(false)}>Đóng</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
