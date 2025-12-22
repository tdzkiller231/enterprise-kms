import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument, Category, Space, LifecycleStatus } from '../types';
import { Button, Modal } from '../components/UI';
import { 
  AlertTriangle, Clock, Archive as ArchiveIcon, FileText, Calendar,
  RefreshCw, FileUp, Eye, Search
} from 'lucide-react';
import { 
  ExtendExpiryModal, 
  CreateNewVersionModal, 
  ArchiveDocumentModal 
} from './ExpiredDocsModals';

type ExpiredDoc = KMSDocument & { lifecycleStatusDisplay?: LifecycleStatus };

export const ExpiredDocs: React.FC = () => {
  // Filters (no tabs)
  const [statusFilter, setStatusFilter] = useState<'NearExpired' | 'Expired' | 'Archived' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSpace, setFilterSpace] = useState('');
  
  // Data
  const [allDocs, setAllDocs] = useState<ExpiredDoc[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  // Detail Panel
  const [selectedDoc, setSelectedDoc] = useState<ExpiredDoc | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Modals
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    nearExpired: 0,
    expired: 0,
    archived: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [near, exp, arch, cats, sps, statistics] = await Promise.all([
      KMSService.getNearExpiredDocuments(),
      KMSService.getExpiredDocuments(),
      KMSService.getArchivedDocuments(),
      KMSService.getCategories(),
      KMSService.getSpaces(),
      KMSService.getExpiryStatistics()
    ]);

    const combined: ExpiredDoc[] = [
      ...near.map(d => ({ ...d, lifecycleStatusDisplay: 'NearExpired' as const })),
      ...exp.map(d => ({ ...d, lifecycleStatusDisplay: 'Expired' as const })),
      ...arch.map(d => ({ ...d, lifecycleStatusDisplay: 'Archived' as const }))
    ];

    setAllDocs(combined);
    setCategories(cats);
    setSpaces(sps);
    setStats(statistics);
  };

  const handleExtend = async (docId: string, newExpiryDate: string, reason: string) => {
    await KMSService.extendDocumentExpiry(docId, newExpiryDate, reason);
    alert('Đã gia hạn tài liệu thành công!\nTrạng thái lifecycle đã được cập nhật.');
    loadData();
  };

  const handleCreateVersion = async (docId: string, data: any) => {
    await KMSService.createNewVersionFromExpired(docId, {
      newExpiryDate: data.newExpiryDate,
      changeLog: data.changeLog,
      metadata: data.metadata
    });
    alert('Đã tạo phiên bản mới thành công!\nPhiên bản cũ sẽ được lưu trữ.');
    loadData();
  };

  const handleArchive = async (docId: string, reason: string) => {
    await KMSService.archiveDocument(docId);
    alert('Đã lưu trữ tài liệu.\nTài liệu không còn hiển thị trong danh sách tìm kiếm chính.');
    loadData();
  };

  const getSpaceName = (id: string) => spaces.find(s => s.id === id)?.name || id;
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  const filteredDocs = allDocs.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter ? doc.lifecycleStatusDisplay === statusFilter : true;
    const matchCategory = filterCategory ? doc.categoryId === filterCategory : true;
    const matchSpace = filterSpace ? doc.spaceId === filterSpace : true;
    return matchSearch && matchStatus && matchCategory && matchSpace;
  });

  const getStatusBadge = (status?: LifecycleStatus) => {
    switch(status) {
      case 'NearExpired':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Sắp hết hạn</span>;
      case 'Expired':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Hết hạn</span>;
      case 'Archived':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Lưu trữ</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">-</span>;
    }
  };

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">XỬ LÝ TÀI LIỆU HẾT HẠN</h1>
        <p className="text-sm text-gray-500">
          Quản lý vòng đời tài liệu: gia hạn, tạo phiên bản mới hoặc lưu trữ
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 flex gap-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded px-4 py-2">
          <p className="text-xs text-yellow-600 font-medium">SẮP HẾT HẠN</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.nearExpired}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded px-4 py-2">
          <p className="text-xs text-red-600 font-medium">ĐÃ HẾT HẠN</p>
          <p className="text-2xl font-bold text-red-800">{stats.expired}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded px-4 py-2">
          <p className="text-xs text-gray-600 font-medium">LƯU TRỮ</p>
          <p className="text-2xl font-bold text-gray-800">{stats.archived}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tài liệu..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="NearExpired">Sắp hết hạn</option>
          <option value="Expired">Đã hết hạn</option>
          <option value="Archived">Lưu trữ</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={filterSpace}
          onChange={(e) => setFilterSpace(e.target.value)}
        >
          <option value="">Tất cả không gian</option>
          {spaces.map(sp => (
            <option key={sp.id} value={sp.id}>{sp.name}</option>
          ))}
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
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
                Tên tài liệu
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Không gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Danh mục
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày hết hạn
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  Không có tài liệu
                </td>
              </tr>
            ) : (
              filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{doc.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{doc.summary}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(doc.lifecycleStatusDisplay)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getSpaceName(doc.spaceId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getCategoryName(doc.categoryId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {doc.expiryDate || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setDetailOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {doc.lifecycleStatusDisplay !== 'Archived' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setExtendModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-green-600"
                            title="Gia hạn"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setVersionModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-purple-600"
                            title="Tạo phiên bản mới"
                          >
                            <FileUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setArchiveModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                            title="Lưu trữ"
                          >
                            <ArchiveIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Chi tiết tài liệu"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDetailOpen(false)}>Đóng</Button>
          </div>
        }
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase font-medium">Tên tài liệu</label>
              <p className="text-sm font-medium text-gray-900 mt-1">{selectedDoc.title}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-medium">Tóm tắt</label>
              <p className="text-sm text-gray-700 mt-1">{selectedDoc.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Trạng thái</label>
                <div className="mt-1">{getStatusBadge(selectedDoc.lifecycleStatusDisplay)}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Ngày hết hạn</label>
                <p className="text-sm text-gray-900 mt-1">{selectedDoc.expiryDate || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Không gian</label>
                <p className="text-sm text-gray-900 mt-1">{getSpaceName(selectedDoc.spaceId)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Danh mục</label>
                <p className="text-sm text-gray-900 mt-1">{getCategoryName(selectedDoc.categoryId)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Extend Modal */}
      <ExtendExpiryModal
        isOpen={extendModalOpen}
        onClose={() => setExtendModalOpen(false)}
        document={selectedDoc}
        onExtend={handleExtend}
      />

      {/* Version Modal */}
      <CreateNewVersionModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        document={selectedDoc}
        categories={categories}
        spaces={spaces}
        onCreateVersion={handleCreateVersion}
      />

      {/* Archive Modal */}
      <ArchiveDocumentModal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        document={selectedDoc}
        onArchive={handleArchive}
      />
    </div>
  );
};
