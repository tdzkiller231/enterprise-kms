import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument, DocStatus, Category, Space } from '../types';
import { Button, StatusBadge, Modal, Card } from '../components/UI';
import { Plus, Search, Filter, FileText, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<KMSDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', categoryId: '', spaceId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [d, c, s] = await Promise.all([
      KMSService.getDocuments(),
      KMSService.getCategories(),
      KMSService.getSpaces()
    ]);
    setDocs(d);
    setCategories(c);
    setSpaces(s);
  };

  const handleUpload = async () => {
    await KMSService.createDocument(uploadForm);
    setIsUploadOpen(false);
    loadData(); // Refresh
  };

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? d.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Kho Tri thức</h1>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tải lên tài liệu
        </Button>
      </div>

      {/* Filters */}
      <Card className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.values(DocStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài liệu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục / Không gian</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cập nhật</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Thao tác</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/documents/${doc.id}`)}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded flex items-center justify-center text-indigo-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-500">ver {doc.versions[0].version} • bởi {doc.createdBy.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{categories.find(c => c.id === doc.categoryId)?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{spaces.find(s => s.id === doc.spaceId)?.name || 'General'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.versions[0].updatedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4" title="Tải xuống"><Download className="h-4 w-4" /></button>
                  <button className="text-gray-600 hover:text-gray-900" title="Chia sẻ"><Share2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      <Modal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        title="Tải lên tài liệu mới"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>Hủy</Button>
            <Button onClick={handleUpload}>Gửi phê duyệt</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiêu đề tài liệu</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
              value={uploadForm.title}
              onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
              rows={3}
              value={uploadForm.description}
              onChange={e => setUploadForm({...uploadForm, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Danh mục</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={uploadForm.categoryId}
                onChange={e => setUploadForm({...uploadForm, categoryId: e.target.value})}
              >
                <option value="">Chọn...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Không gian</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={uploadForm.spaceId}
                onChange={e => setUploadForm({...uploadForm, spaceId: e.target.value})}
              >
                 <option value="">Chọn...</option>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center items-center">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">Kéo thả file vào đây, hoặc nhấp để chọn</p>
              <input type="file" className="hidden" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};