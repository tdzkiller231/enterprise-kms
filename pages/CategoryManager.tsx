import React, { useEffect, useState } from 'react';
import { KMSService } from '../services/kmsService';
import { Category, User } from '../types';
import { Button, Modal } from '../components/UI';
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Settings,
  HelpCircle,
  Copy,
  FileEdit,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentId: '',
    expertId: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categoriesData, usersData] = await Promise.all([
      KMSService.getCategories(),
      KMSService.getAllUsers()
    ]);
    setCategories(categoriesData);
    setUsers(usersData);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCategories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCategories.map(c => c.id)));
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      code: '',
      parentId: '',
      expertId: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      code: category.code,
      parentId: category.parentId || '',
      expertId: category.expertId || '',
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (category: Category) => {
    const hasChildren = categories.some(c => c.parentId === category.id);
    if (hasChildren) {
      alert('Không thể xóa danh mục do đang có danh mục con.');
      return;
    }

    if (category.docCount && category.docCount > 0) {
      alert('Không thể xóa danh mục do đang chứa tài liệu.');
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      await KMSService.deleteCategory(category.id);
      loadData();
    }
  };

  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    
    if (newStatus === 'Inactive' && category.pendingDocCount && category.pendingDocCount > 0) {
      alert('Không thể ngừng áp dụng danh mục do đang có tài liệu chờ phê duyệt.');
      return;
    }

    await KMSService.updateCategoryStatus(category.id, newStatus);
    loadData();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      alert('Vui lòng nhập đầy đủ Tên và Mã danh mục');
      return;
    }

    if (editingCategory) {
      await KMSService.updateCategory(editingCategory.id, formData);
    } else {
      await KMSService.createCategory(formData);
    }

    setShowModal(false);
    loadData();
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    return categories.find(c => c.id === parentId)?.name || '-';
  };

  const filteredCategories = categories.filter(cat => {
    const matchSearch = searchTerm
      ? cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.expertName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchTab = activeTab === 'all' 
      ? true 
      : activeTab === 'active' 
        ? cat.status === 'Active' 
        : cat.status === 'Inactive';
    
    return matchSearch && matchTab;
  });

  const topLevelCategories = filteredCategories.filter(c => !c.parentId);
  const allCount = categories.length;
  const activeCount = categories.filter(c => c.status === 'Active').length;
  const inactiveCount = categories.filter(c => c.status === 'Inactive').length;

  const renderCategoryRow = (category: Category, level: number = 0): React.ReactElement[] => {
    const hasChildren = categories.some(c => c.parentId === category.id);
    const isExpanded = expandedIds.has(category.id);
    const isSelected = selectedIds.has(category.id);
    const children = categories.filter(c => c.parentId === category.id);

    const rows: React.ReactElement[] = [
      <tr key={category.id} className="hover:bg-gray-50 transition">
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(category.id)}
            className="rounded border-gray-300"
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-5" />}
            <span className={`px-2 py-1 rounded text-xs ${
              category.status === 'Active' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {category.status === 'Active' ? 'Áp dụng' : 'Ngừng áp dụng'}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm font-medium text-gray-900">{category.code}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-900">{category.name}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-600">{getParentName(category.parentId)}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-gray-600">{category.expertName || '-'}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <button
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleEdit(category)}
              className="p-1 hover:bg-gray-100 rounded text-blue-600"
              title="Sửa"
            >
              <FileEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleStatus(category)}
              className="p-1 hover:bg-gray-100 rounded text-gray-600"
              title={category.status === 'Active' ? 'Ngừng áp dụng' : 'Áp dụng'}
            >
              {category.status === 'Active' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => handleDelete(category)}
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
    ];

    if (isExpanded && hasChildren) {
      children.forEach(child => {
        rows.push(...renderCategoryRow(child, level + 1));
      });
    }

    return rows;
  };

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">DANH MỤC TRI THỨC</h1>
        <p className="text-sm text-gray-500">
          Quản lý hệ thống phân loại tri thức theo cấu trúc cây đa cấp
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex -mb-px gap-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === 'all'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tất cả ({allCount})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === 'active'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Áp dụng ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
              activeTab === 'inactive'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ngừng áp dụng ({inactiveCount})
          </button>
        </nav>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Cài đặt">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Trợ giúp">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Sao chép">
            <Copy className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Sửa">
            <FileEdit className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Chọn">
            <CheckCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Gạch ngang">
            <XCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Xóa">
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Thêm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredCategories.length && filteredCategories.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã CD
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên tiếng Việt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Danh mục cha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Chuyên gia phụ trách
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                <Search className="w-4 h-4 mx-auto" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                <MoreVertical className="w-4 h-4 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  Không tìm thấy danh mục nào
                </td>
              </tr>
            ) : (
              topLevelCategories.flatMap(cat => renderCategoryRow(cat, 0))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Hiển thị</span>
          <select className="px-2 py-1 border border-gray-300 rounded text-sm">
            <option>50</option>
            <option>100</option>
            <option>200</option>
          </select>
          <span className="text-sm text-gray-700">/{allCount} kết quả</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            ‹
          </button>
          <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            ›
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: DV01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tiếng Việt <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Đảng viên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            >
              <option value="">-- Không có --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chuyên gia phụ trách
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={formData.expertId}
              onChange={(e) => setFormData({ ...formData, expertId: e.target.value })}
            >
              <option value="">-- Chọn chuyên gia --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn gọn về danh mục..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
