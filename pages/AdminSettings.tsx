import React, { useEffect, useState } from 'react';
import { KMSService } from '../services/kmsService';
import { Category, Space, User } from '../types';
import { Card, Button, Modal } from '../components/UI';
import { Folder, Layers, Plus, MoreHorizontal, Shield, Users, Edit2, Trash2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'spaces'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Modal States
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  
  const [currentCat, setCurrentCat] = useState<Category | null>(null);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);

  useEffect(() => {
    KMSService.getCategories().then(setCategories);
    KMSService.getSpaces().then(setSpaces);
    KMSService.getAllUsers().then(setUsers);
  }, []);

  // Handlers for Categories
  const openCatModal = (cat?: Category) => {
    setCurrentCat(cat || null);
    setIsCatModalOpen(true);
  };
  
  const openCatPerms = (cat: Category) => {
    setCurrentCat(cat);
    setIsPermModalOpen(true);
  };

  // Handlers for Spaces
  const openSpaceModal = (space?: Space) => {
    setCurrentSpace(space || null);
    setIsSpaceModalOpen(true);
  };

  const openSpaceMembers = (space: Space) => {
    setCurrentSpace(space);
    setIsMemberModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Quản trị Hệ thống</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`${activeTab === 'categories' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Folder className="w-4 h-4 mr-2" /> Danh mục Tri thức
          </button>
          <button
            onClick={() => setActiveTab('spaces')}
            className={`${activeTab === 'spaces' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Layers className="w-4 h-4 mr-2" /> Không gian Tri thức
          </button>
        </nav>
      </div>

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openCatModal()}><Plus className="w-4 h-4 mr-1" /> Thêm danh mục</Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${cat.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{cat.status}</span>
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  <Button variant="ghost" size="sm" onClick={() => openCatPerms(cat)} title="Phân quyền"><Shield className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => openCatModal(cat)} title="Chỉnh sửa"><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500" title="Xóa"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPACES TAB */}
      {activeTab === 'spaces' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => openSpaceModal()}><Plus className="w-4 h-4 mr-1" /> Thêm không gian</Button>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {spaces.map(space => (
                <li key={space.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                     <div className="flex items-center">
                       <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xl">
                         {space.name.substring(0,1).toUpperCase()}
                       </div>
                       <div className="ml-4">
                         <h3 className="text-lg leading-6 font-medium text-gray-900">{space.name}</h3>
                         <div className="flex items-center mt-1">
                           <Users className="w-4 h-4 text-gray-400 mr-1" />
                           <span className="text-sm text-gray-500 mr-4">{space.memberCount} thành viên</span>
                           <Folder className="w-4 h-4 text-gray-400 mr-1" />
                           <span className="text-sm text-gray-500">{space.docCount} tài liệu</span>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <Button variant="secondary" size="sm" onClick={() => openSpaceMembers(space)}>Thành viên</Button>
                       <Button variant="ghost" size="sm" onClick={() => openSpaceModal(space)}><Edit2 className="w-4 h-4" /></Button>
                       <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                     </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Category Modal (Add/Edit) */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={currentCat ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
        footer={<Button onClick={() => setIsCatModalOpen(false)}>Lưu</Button>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" defaultValue={currentCat?.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea className="mt-1 block w-full border rounded-md p-2" rows={3} defaultValue={currentCat?.description}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
            <select className="mt-1 block w-full border rounded-md p-2" defaultValue={currentCat?.status}>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Permissions Modal (RBAC) */}
      <Modal
        isOpen={isPermModalOpen}
        onClose={() => setIsPermModalOpen(false)}
        title={`Phân quyền danh mục: ${currentCat?.name}`}
        footer={<Button onClick={() => setIsPermModalOpen(false)}>Lưu cấu hình</Button>}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Thiết lập quyền truy cập cho các vai trò (Role-Based Access Control).</p>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="text-left font-medium">Vai trò</th>
                <th className="text-center font-medium">Xem</th>
                <th className="text-center font-medium">Tạo</th>
                <th className="text-center font-medium">Sửa</th>
                <th className="text-center font-medium">Duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {['Admin', 'Manager', 'User'].map(role => (
                <tr key={role}>
                  <td className="py-2">{role}</td>
                  <td className="text-center"><input type="checkbox" defaultChecked /></td>
                  <td className="text-center"><input type="checkbox" defaultChecked={role !== 'User'} /></td>
                  <td className="text-center"><input type="checkbox" defaultChecked={role !== 'User'} /></td>
                  <td className="text-center"><input type="checkbox" defaultChecked={role === 'Admin'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Member Management Modal */}
      <Modal
         isOpen={isMemberModalOpen}
         onClose={() => setIsMemberModalOpen(false)}
         title={`Thành viên không gian: ${currentSpace?.name}`}
         footer={<Button onClick={() => setIsMemberModalOpen(false)}>Đóng</Button>}
      >
         <div className="space-y-4">
           <div className="flex gap-2">
              <input type="text" placeholder="Tìm thành viên để thêm..." className="flex-1 border rounded-md p-2" />
              <Button>Thêm</Button>
           </div>
           <div className="max-h-60 overflow-y-auto">
             <ul className="divide-y divide-gray-200">
                {currentSpace?.members?.map(m => (
                  <li key={m.id} className="py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <img src={m.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
                      <span className="text-sm">{m.name}</span>
                    </div>
                    <button className="text-red-500 text-xs hover:underline">Xóa</button>
                  </li>
                ))}
             </ul>
           </div>
         </div>
      </Modal>

    </div>
  );
};