import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KMSService } from '../services/kmsService';
import { Button, Card } from '../components/UI';
import { Tag, Database, Plus, X, Save } from 'lucide-react';

export const SearchConfig: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'tags';
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Mock Metadata Fields
  const [metaFields, setMetaFields] = useState([
     { id: 1, name: 'Loại tài liệu', type: 'Dropdown', required: true },
     { id: 2, name: 'Ngày hiệu lực', type: 'Date', required: true },
     { id: 3, name: 'Phòng ban ban hành', type: 'Text', required: false },
     { id: 4, name: 'Số hiệu văn bản', type: 'Text', required: true },
  ]);

  useEffect(() => {
    KMSService.getTags().then(setTags);
  }, []);

  const handleAddTag = async () => {
    if (newTag.trim()) {
       const updated = await KMSService.addTag(newTag.trim());
       setTags([...updated]);
       setNewTag('');
    }
  };

  const handleDeleteTag = async (tag: string) => {
     const updated = await KMSService.deleteTag(tag);
     setTags([...updated]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tìm kiếm & Cấu hình Tag</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tags')}
            className={`${activeTab === 'tags' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Tag className="w-4 h-4 mr-2" /> Cấu hình Tag / Từ khóa
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`${activeTab === 'metadata' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Database className="w-4 h-4 mr-2" /> Quản lý Metadata
          </button>
        </nav>
      </div>

      {activeTab === 'tags' && (
         <Card title="Danh sách Từ khóa hệ thống (System Tags)">
            <p className="text-sm text-gray-500 mb-4">Các thẻ này được sử dụng để gợi ý khi người dùng upload tài liệu.</p>
            
            <div className="flex gap-2 mb-6">
               <input 
                  type="text" 
                  className="border rounded-md px-3 py-2 text-sm w-64 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="Nhập tag mới..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
               />
               <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Plus className="w-4 h-4 mr-1" /> Thêm
               </Button>
            </div>

            <div className="flex flex-wrap gap-2">
               {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                     #{tag}
                     <button onClick={() => handleDeleteTag(tag)} className="ml-2 text-indigo-500 hover:text-indigo-900 focus:outline-none">
                        <X className="w-3 h-3" />
                     </button>
                  </span>
               ))}
            </div>
         </Card>
      )}

      {activeTab === 'metadata' && (
         <Card title="Trường thông tin tài liệu (Metadata Fields)">
            <div className="flex justify-end mb-4">
               <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Thêm trường mới</Button>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
               <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Tên trường</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Loại dữ liệu</th>
                        <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Bắt buộc</th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                     {metaFields.map((field) => (
                        <tr key={field.id}>
                           <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{field.name}</td>
                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{field.type}</td>
                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                              {field.required ? <span className="text-red-600 font-bold">Có</span> : 'Không'}
                           </td>
                           <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                              <button className="text-red-600 hover:text-red-900">Xóa</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="mt-4 flex justify-end">
               <Button variant="primary"><Save className="w-4 h-4 mr-2" /> Lưu cấu hình</Button>
            </div>
         </Card>
      )}
    </div>
  );
};