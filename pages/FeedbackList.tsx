import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { FeedbackSuggestion, DocumentRating, KMSDocument, FeedbackStatus } from '../types';
import { Button } from '../components/UI';
import { UpdateDocumentModal, CreateVersionModal } from '../components/FeedbackModals';
import { 
  MessageSquare, Star, Filter, Search, Eye, Edit, Sparkles,
  User as UserIcon, Clock, FileText, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FeedbackList: React.FC = () => {
  const navigate = useNavigate();
  
  // Data
  const [suggestions, setSuggestions] = useState<FeedbackSuggestion[]>([]);
  const [ratings, setRatings] = useState<DocumentRating[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | ''>('');
  const [userFilter, setUserFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackSuggestion | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<KMSDocument | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sugs, rats, cats] = await Promise.all([
      KMSService.getSuggestions(),
      KMSService.getRatings(),
      KMSService.getCategories()
    ]);
    setSuggestions(sugs);
    setRatings(rats);
    setCategories(cats);
  };

  const handleViewDetail = async (feedback: FeedbackSuggestion) => {
    setSelectedFeedback(feedback);
    
    // Load document details
    const doc = await KMSService.getDocumentById(feedback.docId);
    setSelectedDocument(doc);
    setDetailPanelOpen(true);
  };

  const handleUpdateDocument = () => {
    setUpdateModalOpen(true);
    setDetailPanelOpen(false);
  };

  const handleCreateVersion = () => {
    setVersionModalOpen(true);
    setDetailPanelOpen(false);
  };

  const handleReject = async (feedback: FeedbackSuggestion) => {
    const reason = prompt('Nhập lý do từ chối (tùy chọn):');
    if (reason !== null) { // User didn't cancel
      await KMSService.updateSuggestionStatus(feedback.id, 'Resolved'); // Could add 'Rejected' status
      loadData();
    }
  };

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(s => {
    const matchSearch = 
      s.docTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = !statusFilter || s.status === statusFilter;
    const matchUser = !userFilter || s.user.name.toLowerCase().includes(userFilter.toLowerCase());
    const matchCategory = !categoryFilter || s.categoryId === categoryFilter;

    return matchSearch && matchStatus && matchUser && matchCategory;
  });

  const getStatusBadge = (status: FeedbackStatus) => {
    const configs = {
      'New': { 
        bg: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Chưa xử lý',
        icon: AlertCircle
      },
      'Processing': { 
        bg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Đang xử lý',
        icon: Clock
      },
      'Resolved': { 
        bg: 'bg-green-100 text-green-800 border-green-200',
        label: 'Đã xử lý',
        icon: CheckCircle
      },
      'ConvertedToVersion': { 
        bg: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Đã tạo version',
        icon: Sparkles
      }
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const canUpdateDocument = (feedback: FeedbackSuggestion) => {
    return feedback.status === 'New' || feedback.status === 'Processing';
  };

  const canCreateVersion = (feedback: FeedbackSuggestion) => {
    return feedback.status === 'Processing';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" /> Cộng tác Tri thức
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý góp ý và đánh giá từ người dùng để cải thiện chất lượng tài liệu.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tài liệu, nội dung, người góp ý..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | '')}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="New">Chưa xử lý</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Resolved">Đã xử lý</option>
              <option value="ConvertedToVersion">Đã tạo version</option>
            </select>
          </div>

          {/* User Filter */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Lọc theo người góp ý..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
          <span>Tìm thấy: <strong>{filteredSuggestions.length}</strong> góp ý</span>
          {(searchTerm || statusFilter || userFilter || categoryFilter) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setUserFilter('');
                setCategoryFilter('');
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên tài liệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người góp ý
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung góp ý
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredSuggestions.map(feedback => (
              <tr key={feedback.id} className="hover:bg-gray-50 transition">
                {/* Document Title */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    {feedback.docTitle}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Click "Xem chi tiết" để xem thông tin đầy đủ</p>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {categories.find(c => c.id === feedback.categoryId)?.name || feedback.categoryId}
                  </span>
                </td>

                {/* User */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img src={feedback.user.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span className="text-sm text-gray-900">{feedback.user.name}</span>
                  </div>
                </td>

                {/* Content */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                    {feedback.content}
                  </p>
                </td>

                {/* Time */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {feedback.createdAt}
                  </div>
                  {feedback.handler && (
                    <p className="text-xs text-gray-500 mt-1">
                      Xử lý: {feedback.handler.name}
                    </p>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {getStatusBadge(feedback.status)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" 
                      title="Xem chi tiết"
                      onClick={() => handleViewDetail(feedback)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {canUpdateDocument(feedback) && (
                      <button 
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" 
                        title="Cập nhật tài liệu"
                        onClick={async () => {
                          const doc = await KMSService.getDocumentById(feedback.docId);
                          setSelectedFeedback(feedback);
                          setSelectedDocument(doc);
                          setUpdateModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canCreateVersion(feedback) && (
                      <button 
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition" 
                        title="Tạo phiên bản mới"
                        onClick={async () => {
                          const doc = await KMSService.getDocumentById(feedback.docId);
                          setSelectedFeedback(feedback);
                          setSelectedDocument(doc);
                          setVersionModalOpen(true);
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    )}
                    {feedback.status === 'New' && (
                      <button 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" 
                        title="Từ chối"
                        onClick={() => handleReject(feedback)}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Không tìm thấy góp ý nào</p>
            <p className="text-sm mt-1">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Detail Panel - SLIDE FROM RIGHT */}
      {detailPanelOpen && selectedFeedback && selectedDocument && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setDetailPanelOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Chi tiết Góp ý</h2>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedFeedback.status)}
                    <span className="text-xs text-gray-500">ID: {selectedFeedback.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDetailPanelOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Document Info */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-indigo-600 uppercase mb-1">Tài liệu liên quan</h3>
                    <p className="text-sm font-medium text-indigo-900">{selectedDocument.title}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setDetailPanelOpen(false);
                      navigate(`/documents/${selectedDocument.id}`);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded flex items-center gap-1 transition"
                  >
                    <Eye className="w-3 h-3" />
                    Xem tài liệu gốc
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-indigo-600">Phiên bản:</span>
                    <span className="ml-1 text-indigo-900 font-medium">v{selectedDocument.versions[0].version}</span>
                  </div>
                  <div>
                    <span className="text-indigo-600">Danh mục:</span>
                    <span className="ml-1 text-indigo-900 font-medium">{selectedDocument.categoryId}</span>
                  </div>
                  <div>
                    <span className="text-indigo-600">Người tạo:</span>
                    <span className="ml-1 text-indigo-900 font-medium">{selectedDocument.createdBy.name}</span>
                  </div>
                  <div>
                    <span className="text-indigo-600">Ngày tạo:</span>
                    <span className="ml-1 text-indigo-900 font-medium">{selectedDocument.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Feedback Content */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Nội dung góp ý</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <img src={selectedFeedback.user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="font-medium">{selectedFeedback.user.name}</span>
                  <span className="text-gray-400">•</span>
                  <Clock className="w-3 h-3" />
                  <span>{selectedFeedback.createdAt}</span>
                </div>
                
                {selectedFeedback.priority && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Độ ưu tiên: {selectedFeedback.priority}
                  </div>
                )}
              </div>

              {/* History */}
              {selectedFeedback.history && selectedFeedback.history.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Lịch sử xử lý</h3>
                  <div className="space-y-3">
                    {selectedFeedback.history.map((h, idx) => (
                      <div key={idx} className="flex gap-3 relative">
                        {idx < selectedFeedback.history!.length - 1 && (
                          <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        <div className="w-4 h-4 rounded-full bg-indigo-600 mt-0.5 flex-shrink-0 z-10" />
                        <div className="flex-1 pb-3">
                          <p className="text-sm font-medium text-gray-900">{h.action}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {h.user} • {h.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No History Message */}
              {(!selectedFeedback.history || selectedFeedback.history.length === 0) && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-500">Chưa có lịch sử xử lý</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {canUpdateDocument(selectedFeedback) && (
                  <Button onClick={handleUpdateDocument}>
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật tài liệu
                  </Button>
                )}
                {canCreateVersion(selectedFeedback) && (
                  <Button onClick={handleCreateVersion}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Tạo phiên bản mới
                  </Button>
                )}
                {selectedFeedback.status === 'New' && (
                  <Button variant="danger" onClick={() => handleReject(selectedFeedback)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <UpdateDocumentModal 
        isOpen={updateModalOpen}
        onClose={() => { setUpdateModalOpen(false); setSelectedFeedback(null); setSelectedDocument(null); }}
        feedback={selectedFeedback}
        document={selectedDocument}
        onSuccess={loadData}
      />

      <CreateVersionModal 
        isOpen={versionModalOpen}
        onClose={() => { setVersionModalOpen(false); setSelectedFeedback(null); setSelectedDocument(null); }}
        feedback={selectedFeedback}
        document={selectedDocument}
        onSuccess={loadData}
      />
    </div>
  );
};
