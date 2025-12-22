import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { Space, SpaceType, User } from '../types';
import { Button, Modal } from '../components/UI';
import { 
  Users, FileText, Eye, Edit, Trash2, Search, Plus, 
  Briefcase, Building, Globe, User as UserIcon, 
  Archive, Lock, Unlock, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SpacesList: React.FC = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<SpaceType | ''>('');
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Archived' | ''>('Active');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newSpace, setNewSpace] = useState<{
    name: string;
    type: SpaceType;
    description: string;
    privacy: 'Public' | 'Private';
  }>({
    name: '',
    type: 'Department',
    description: '',
    privacy: 'Private'
  });

  useEffect(() => {
    KMSService.getSpaces().then(setSpaces);
    KMSService.getAllUsers().then(setUsers);
  }, []);

  const handleCreate = async () => {
    if (!newSpace.name) {
      alert("Vui lòng nhập tên không gian tri thức.");
      return;
    }
    await KMSService.createSpace({
      ...newSpace,
      ownerId: selectedMembers[0] || 'u1', // First member as owner or default
      memberIds: selectedMembers
    });
    setIsModalOpen(false);
    setSelectedMembers([]);
    const updated = await KMSService.getSpaces();
    setSpaces(updated);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredSpaces = spaces.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter ? s.type === typeFilter : true;
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchSearch && matchType && matchStatus;
  });

  const getTypeLabel = (type: SpaceType) => {
    switch(type) {
      case 'Department': return 'Phòng ban';
      case 'Project': return 'Dự án';
      case 'Community': return 'Cộng đồng';
      case 'Personal': return 'Cá nhân';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Hoạt động</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Lưu trữ</span>;
  };

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">KHÔNG GIAN TRI THỨC</h1>
        <p className="text-sm text-gray-500">Quản lý các không gian làm việc cho phòng ban, dự án và nhóm cộng tác</p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm không gian..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as SpaceType | '')}
          >
            <option value="">Tất cả loại</option>
            <option value="Department">Phòng ban</option>
            <option value="Project">Dự án</option>
            <option value="Community">Cộng đồng</option>
            <option value="Personal">Cá nhân</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'Active' | 'Archived' | '')}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Archived">Lưu trữ</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên không gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Loại
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quyền riêng tư
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Người quản lý
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thành viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tài liệu
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSpaces.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                  Không tìm thấy không gian tri thức nào
                </td>
              </tr>
            ) : (
              filteredSpaces.map((space) => (
                <tr key={space.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        {space.type === 'Department' && <Building className="w-4 h-4 text-orange-600" />}
                        {space.type === 'Project' && <Briefcase className="w-4 h-4 text-orange-600" />}
                        {space.type === 'Community' && <Globe className="w-4 h-4 text-orange-600" />}
                        {space.type === 'Personal' && <UserIcon className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{space.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{space.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getTypeLabel(space.type)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      {space.privacy === 'Public' ? (
                        <>
                          <Unlock className="w-4 h-4 text-green-600" />
                          <span>Công khai</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-gray-600" />
                          <span>Riêng tư</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {space.ownerName || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Users className="w-4 h-4 text-gray-400" />
                      {space.memberCount}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {space.docCount}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(space.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/spaces/${space.id}`)}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded text-red-600"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tạo Không gian Tri thức mới"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleCreate}>Tạo mới</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên không gian tri thức <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={newSpace.name}
              onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
              placeholder="VD: Phòng Kỹ thuật, Dự án XYZ, Nhóm Marketing..."
            />
            <p className="mt-1 text-xs text-gray-500">Tên hiển thị của không gian (phòng ban, dự án, nhóm làm việc)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại không gian <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={newSpace.type}
              onChange={(e) => setNewSpace({ ...newSpace, type: e.target.value as SpaceType })}
            >
              <option value="Department">Phòng ban</option>
              <option value="Project">Dự án</option>
              <option value="Personal">Cá nhân</option>
              <option value="Community">Cộng đồng</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Loại của không gian: Phòng ban / Dự án / Cá nhân / Cộng đồng</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              rows={3}
              value={newSpace.description}
              onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
              placeholder="Mô tả ngắn về mục đích hoặc chức năng của không gian..."
            />
            <p className="mt-1 text-xs text-gray-500">Mô tả ngắn về mục đích hoặc chức năng của không gian</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quyền riêng tư <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={newSpace.privacy}
              onChange={(e) => setNewSpace({ ...newSpace, privacy: e.target.value as 'Public' | 'Private' })}
            >
              <option value="Public">Công khai</option>
              <option value="Private">Riêng tư</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Quyền truy cập vào không gian: Công khai / Riêng tư</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thành viên</label>
            <div className="border border-gray-300 rounded max-h-48 overflow-y-auto">
              {users.map(user => (
                <label
                  key={user.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{user.role}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">Chọn các thành viên tham gia vào không gian</p>
            {selectedMembers.length > 0 && (
              <p className="mt-1 text-xs text-orange-600">Đã chọn {selectedMembers.length} thành viên</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
