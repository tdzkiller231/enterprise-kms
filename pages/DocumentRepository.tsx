import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KMSService } from '../services/kmsService';
import { KMSDocument, Category, LifecycleStatus } from '../types';
import { Button, StatusBadge } from '../components/UI';
import { DocumentFormModal, RatingModal, FeedbackModal, ShareModal } from '../components/DocumentModals';
import { DocumentDetailDrawer } from '../components/DocumentDetailDrawer';
import { 
  Plus, Search, Filter, Database, Download, Star, MessageSquare, 
  Share2, Eye, FileText, Calendar, Tag as TagIcon, TrendingUp
} from 'lucide-react';

export const DocumentRepository: React.FC = () => {
  const navigate = useNavigate();
  
  const [docs, setDocs] = useState<KMSDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus | ''>('');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState<KMSDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<KMSDocument | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Only load APPROVED documents in repository
    const [allDocs, cats] = await Promise.all([
      KMSService.getDocuments({ status: ['Đã phê duyệt'] }),
      KMSService.getCategories()
    ]);
    setDocs(allDocs);
    setCategories(cats.filter(c => c.status === 'Active'));
  };

  const handleViewDetail = (doc: KMSDocument) => {
    setSelectedDoc(doc);
    setDetailDrawerOpen(true);
    KMSService.incrementViewCount(doc.id);
  };

  const handleEdit = (doc: KMSDocument) => {
    setEditingDoc(doc);
    setFormModalOpen(true);
  };

  const handleRate = (doc: KMSDocument) => {
    setSelectedDoc(doc);
    setRatingModalOpen(true);
  };

  const handleFeedback = (doc: KMSDocument) => {
    setSelectedDoc(doc);
    setFeedbackModalOpen(true);
  };

  const handleShare = (doc: KMSDocument) => {
    setSelectedDoc(doc);
    setShareModalOpen(true);
  };

  const handleDownload = (doc: KMSDocument) => {
    alert(`Đang tải xuống: ${doc.title}`);
    KMSService.incrementDownloadCount(doc.id);
    loadData();
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  // Filter documents
  const filteredDocs = docs.filter(d => {
    const matchSearch = 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategory = selectedCategories.length === 0 || 
      d.categoryIds?.some(catId => selectedCategories.includes(catId));
    
    const matchDate = 
      (!dateFrom || d.createdAt >= dateFrom) &&
      (!dateTo || d.createdAt <= dateTo);
    
    const matchRating = d.avgRating >= minRating;
    
    const matchLifecycle = !lifecycleFilter || d.lifecycleStatus === lifecycleFilter;

    return matchSearch && matchCategory && matchDate && matchRating && matchLifecycle;
  });

  const getLifecycleStatusBadge = (status: LifecycleStatus) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Expired': 'bg-red-100 text-red-800 border-red-200',
      'Hidden': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const labels = {
      'Active': 'Đang hiệu lực',
      'Expired': 'Hết hạn',
      'Hidden': 'Bị ẩn'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <Database className="text-indigo-600" /> Kho Tài liệu
           </h1>
           <p className="text-sm text-gray-500 mt-1">
             Tìm kiếm và truy xuất toàn bộ tài liệu đã được phê duyệt trong hệ thống.
           </p>
        </div>
        <Button onClick={() => { setEditingDoc(null); setFormModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Thêm tài liệu mới
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
           <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
           <input 
              type="text" 
              placeholder="Tìm kiếm theo tiêu đề, tóm tắt, tag, nguồn..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Categories Multi-select */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Danh mục tri thức</label>
            <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto bg-white">
              <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                <input 
                  type="checkbox"
                  checked={selectedCategories.length === 0}
                  onChange={() => setSelectedCategories([])}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm">Tất cả</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ngày tạo</label>
            <div className="space-y-2">
              <input 
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Từ ngày"
              />
              <input 
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Điểm đánh giá</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value="0">Tất cả</option>
              <option value="4">≥ 4 sao</option>
              <option value="3">≥ 3 sao</option>
              <option value="2">≥ 2 sao</option>
            </select>
          </div>

          {/* Lifecycle Status */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái lifecycle</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              value={lifecycleFilter}
              onChange={(e) => setLifecycleFilter(e.target.value as LifecycleStatus | '')}
            >
              <option value="">Tất cả</option>
              <option value="Active">Đang hiệu lực</option>
              <option value="Expired">Hết hạn</option>
              <option value="Hidden">Bị ẩn</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Tìm thấy: <strong>{filteredDocs.length}</strong> tài liệu</span>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategories([]);
              setDateFrom('');
              setDateTo('');
              setMinRating(0);
              setLifecycleFilter('');
            }}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Tiêu đề & Tóm tắt
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Danh mục
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Nguồn
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Người tạo
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Ngày tạo
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Thống kê
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Đánh giá
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Trạng thái
               </th>
               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Tác vụ
               </th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200 bg-white">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition">
                   {/* Title & Summary */}
                   <td className="px-6 py-4">
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-indigo-50 p-2 rounded">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <button 
                              onClick={() => handleViewDetail(doc)}
                              className="font-medium text-indigo-600 hover:text-indigo-800 text-left"
                           >
                              {doc.title}
                           </button>
                           <p className="text-xs text-gray-500 mt-1 line-clamp-2">{doc.summary}</p>
                           <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.slice(0, 3).map(tag => (
                                 <span key={tag} className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    <TagIcon className="w-2.5 h-2.5 mr-0.5" />
                                    {tag}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>
                   </td>

                   {/* Categories */}
                   <td className="px-6 py-4">
                      <div className="space-y-1">
                         {doc.categoryIds?.slice(0, 2).map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            return cat ? (
                               <div key={catId} className="text-xs text-gray-700 bg-blue-50 px-2 py-0.5 rounded">
                                  {cat.name}
                               </div>
                            ) : null;
                         })}
                         {(doc.categoryIds?.length || 0) > 2 && (
                            <span className="text-xs text-gray-500">+{(doc.categoryIds?.length || 0) - 2} khác</span>
                         )}
                      </div>
                   </td>

                   {/* Source */}
                   <td className="px-6 py-4 text-sm text-gray-700">
                      {doc.source}
                   </td>

                   {/* Creator */}
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <img src={doc.createdBy.avatar} alt="" className="w-6 h-6 rounded-full" />
                         <span className="text-sm text-gray-900">{doc.createdBy.name}</span>
                      </div>
                   </td>

                   {/* Created Date */}
                   <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                         <Calendar className="w-3.5 h-3.5 text-gray-400" />
                         {doc.createdAt}
                      </div>
                   </td>

                   {/* Stats */}
                   <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                         <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-3 h-3" />
                            {doc.viewCount}
                         </div>
                         <div className="flex items-center gap-1 text-gray-600">
                            <Download className="w-3 h-3" />
                            {doc.downloadCount}
                         </div>
                      </div>
                   </td>

                   {/* Rating */}
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                         <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                         <span className="text-sm font-medium text-gray-900">{doc.avgRating.toFixed(1)}</span>
                         <span className="text-xs text-gray-500">({doc.ratingCount})</span>
                      </div>
                   </td>

                   {/* Status */}
                   <td className="px-6 py-4">
                      <div className="space-y-1">
                         <StatusBadge status={doc.status} />
                         {getLifecycleStatusBadge(doc.lifecycleStatus)}
                      </div>
                   </td>

                   {/* Actions */}
                   <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                          <button 
                              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" 
                              title="Xem chi tiết"
                              onClick={() => handleViewDetail(doc)}
                          >
                              <Eye className="w-4 h-4" />
                          </button>
                          <button 
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition" 
                              title="Tải xuống"
                              onClick={() => handleDownload(doc)}
                          >
                              <Download className="w-4 h-4" />
                          </button>
                          <button 
                              className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition" 
                              title="Đánh giá"
                              onClick={() => handleRate(doc)}
                          >
                              <Star className="w-4 h-4" />
                          </button>
                          <button 
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" 
                              title="Góp ý"
                              onClick={() => handleFeedback(doc)}
                          >
                              <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition" 
                              title="Chia sẻ"
                              onClick={() => handleShare(doc)}
                          >
                              <Share2 className="w-4 h-4" />
                          </button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>

        {filteredDocs.length === 0 && (
           <div className="text-center py-12 text-gray-500">
              <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Không tìm thấy tài liệu phù hợp</p>
              <p className="text-sm mt-1">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
           </div>
        )}
      </div>

      {/* Modals */}
      <DocumentFormModal 
        isOpen={formModalOpen}
        onClose={() => { setFormModalOpen(false); setEditingDoc(null); }}
        onSuccess={loadData}
        document={editingDoc}
      />

      <RatingModal 
        isOpen={ratingModalOpen}
        onClose={() => { setRatingModalOpen(false); setSelectedDoc(null); }}
        document={selectedDoc}
        onSuccess={loadData}
      />

      <FeedbackModal 
        isOpen={feedbackModalOpen}
        onClose={() => { setFeedbackModalOpen(false); setSelectedDoc(null); }}
        document={selectedDoc}
        onSuccess={() => {}}
      />

      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => { setShareModalOpen(false); setSelectedDoc(null); }}
        document={selectedDoc}
        onSuccess={() => {}}
      />

      {selectedDoc && (
        <DocumentDetailDrawer 
          isOpen={detailDrawerOpen}
          onClose={() => { setDetailDrawerOpen(false); setSelectedDoc(null); }}
          documentId={selectedDoc.id}
          onEdit={handleEdit}
          onRate={handleRate}
          onFeedback={handleFeedback}
          onShare={handleShare}
          onRefresh={loadData}
        />
      )}
    </div>
  );
};
