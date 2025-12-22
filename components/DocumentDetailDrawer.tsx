import React, { useState, useEffect } from 'react';
import { KMSDocument, FeedbackSuggestion, Category, User, DocumentVersion, LifecycleStatus } from '../types';
import { KMSService } from '../services/kmsService';
import { Button, StatusBadge } from './UI';
import { 
  X, Download, Star, Share2, Edit, Eye, FileText, Calendar, 
  User as UserIcon, Tag as TagIcon, Database, Clock, MessageSquare,
  History, Upload, AlertCircle, CheckCircle, RotateCcw, ChevronRight
} from 'lucide-react';

interface DocumentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
  onEdit: (doc: KMSDocument) => void;
  onRate: (doc: KMSDocument) => void;
  onFeedback: (doc: KMSDocument) => void;
  onShare: (doc: KMSDocument) => void;
  onRefresh: () => void;
}

export const DocumentDetailDrawer: React.FC<DocumentDetailDrawerProps> = ({
  isOpen,
  onClose,
  documentId,
  onEdit,
  onRate,
  onFeedback,
  onShare,
  onRefresh
}) => {
  const [document, setDocument] = useState<KMSDocument | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'info' | 'versions'>('content');
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [versionChangeLog, setVersionChangeLog] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      loadData();
    }
  }, [isOpen, documentId]);

  const loadData = async () => {
    if (!documentId) return;

    const [doc, cats] = await Promise.all([
      KMSService.getDocumentById(documentId),
      KMSService.getCategories()
    ]);

    if (doc) {
      setDocument(doc);
      setCategories(cats);
    }
  };

  const handleDownload = () => {
    if (document) {
      // Simulate download
      alert(`Đang tải xuống: ${document.title}`);
      KMSService.incrementDownloadCount(document.id);
      loadData();
    }
  };

  const handleUploadNewVersion = async () => {
    if (!document || !newVersionFile || !versionChangeLog.trim()) {
      alert('Vui lòng chọn file và nhập ghi chú phiên bản');
      return;
    }

    setIsUploading(true);
    try {
      await KMSService.updateDocumentVersion(document.id, newVersionFile, versionChangeLog);
      alert('Phiên bản mới đã được tạo và gửi duyệt');
      setNewVersionFile(null);
      setVersionChangeLog('');
      loadData();
      onRefresh();
    } catch (error) {
      alert('Có lỗi xảy ra khi tải lên phiên bản mới');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRestoreVersion = async (version: DocumentVersion) => {
    if (!document) return;
    
    const confirm = window.confirm(`Khôi phục về phiên bản ${version.version}? Phiên bản mới sẽ được tạo và cần phê duyệt.`);
    if (confirm) {
      await KMSService.restoreDocumentVersion(document.id, version.version);
      alert('Đã tạo phiên bản khôi phục, chờ phê duyệt');
      loadData();
      onRefresh();
    }
  };

  const getLifecycleStatusBadge = (status: LifecycleStatus) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Expired': 'bg-red-100 text-red-800',
      'Hidden': 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      'Active': 'Đang hiệu lực',
      'Expired': 'Hết hạn',
      'Hidden': 'Bị ẩn'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const canEdit = () => {
    // In real app, check user permissions
    return true;
  };

  if (!isOpen || !document) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              {document.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={document.status} />
              {getLifecycleStatusBadge(document.lifecycleStatus)}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b bg-white overflow-x-auto">
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />Tải xuống
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onRate(document)}>
            <Star className="w-4 h-4 mr-1" />Đánh giá
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onFeedback(document)}>
            <MessageSquare className="w-4 h-4 mr-1" />Góp ý
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onShare(document)}>
            <Share2 className="w-4 h-4 mr-1" />Chia sẻ
          </Button>
          {canEdit() && (
            <Button size="sm" onClick={() => onEdit(document)}>
              <Edit className="w-4 h-4 mr-1" />Sửa metadata
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'content' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Nội dung
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'info' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1" />
            Thông tin
          </button>
          <button 
            onClick={() => setActiveTab('versions')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'versions' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <History className="w-4 h-4 inline mr-1" />
            Lịch sử ({document.versions.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* CONTENT TAB - Document Viewer */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Đang xem: <strong>{document.title}</strong> (v{document.versions[0].version})
                </p>
              </div>

              {/* Document Preview based on file type */}
              {document.fileType === 'pdf' && (
                <div className="border rounded-lg overflow-hidden bg-gray-100" style={{ height: '70vh' }}>
                  <iframe 
                    src={`${document.filePath}#toolbar=1`}
                    className="w-full h-full"
                    title={document.title}
                  />
                </div>
              )}

              {(document.fileType === 'docx' || document.fileType === 'doc') && (
                <div className="border rounded-lg overflow-hidden bg-white p-8" style={{ height: '70vh', overflowY: 'auto' }}>
                  <div className="prose max-w-none">
                    <h1 className="text-2xl font-bold mb-4">{document.title}</h1>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="mb-4">{document.summary}</p>
                      <p className="mb-4">
                        Đây là bản xem trước nội dung tài liệu Word. Trong ứng dụng thực tế, 
                        nội dung sẽ được render từ file .docx gốc bằng các thư viện như 
                        mammoth.js hoặc docx-preview.
                      </p>
                      <p className="mb-4">
                        <strong>Thông tin tài liệu:</strong>
                      </p>
                      <ul className="list-disc pl-6 mb-4">
                        <li>Tiêu đề: {document.title}</li>
                        <li>Người tạo: {document.createdBy.name}</li>
                        <li>Ngày tạo: {document.createdAt}</li>
                        <li>Phiên bản: {document.versions[0].version}</li>
                      </ul>
                      <p className="text-sm text-gray-500 italic">
                        Để xem đầy đủ nội dung và định dạng, vui lòng tải xuống file gốc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(document.fileType === 'xlsx' || document.fileType === 'xls') && (
                <div className="border rounded-lg overflow-hidden bg-white p-4" style={{ height: '70vh', overflowY: 'auto' }}>
                  <div className="mb-4 text-center">
                    <FileText className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                    <p className="text-sm text-gray-500">File Excel</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-700 mb-3">
                      Đây là file Excel. Trong ứng dụng thực tế, nội dung sẽ được hiển thị 
                      dưới dạng bảng tương tác bằng các thư viện như SheetJS (xlsx) hoặc 
                      Handsontable.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Cột A</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Cột B</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Cột C</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-sm">Dữ liệu mẫu</td>
                            <td className="px-4 py-2 text-sm">Giá trị</td>
                            <td className="px-4 py-2 text-sm">123</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 italic mt-3">
                      Để xem đầy đủ dữ liệu và sử dụng các tính năng Excel, vui lòng tải xuống file gốc.
                    </p>
                  </div>
                </div>
              )}

              {(document.fileType === 'pptx' || document.fileType === 'ppt') && (
                <div className="border rounded-lg overflow-hidden bg-gray-900 p-8" style={{ height: '70vh' }}>
                  <div className="bg-white rounded-lg shadow-xl h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <FileText className="w-20 h-20 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{document.title}</h3>
                      <p className="text-gray-600 mb-4">Bản trình bày PowerPoint</p>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Trong ứng dụng thực tế, slides sẽ được hiển thị bằng Office Online Viewer 
                        hoặc chuyển đổi thành ảnh/PDF để xem trước.
                      </p>
                      <Button className="mt-6" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Tải xuống để xem
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {document.fileType === 'txt' && (
                <div className="border rounded-lg overflow-hidden bg-white p-6" style={{ height: '70vh', overflowY: 'auto' }}>
                  <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
{`Tên tài liệu: ${document.title}

${document.summary}

---

Đây là bản xem trước file văn bản (.txt). 
Trong ứng dụng thực tế, nội dung file text sẽ được load và hiển thị ở đây.

Thông tin:
- Người tạo: ${document.createdBy.name}
- Ngày tạo: ${document.createdAt}
- Phiên bản: ${document.versions[0].version}

Để xem nội dung đầy đủ, vui lòng tải xuống file gốc.
`}
                  </pre>
                </div>
              )}

              {/* Download prompt for other file types */}
              {!['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'txt'].includes(document.fileType) && (
                <div className="border-2 border-dashed rounded-lg p-12 text-center" style={{ height: '70vh' }}>
                  <FileText className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Không thể xem trước định dạng .{document.fileType}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                    File này không hỗ trợ xem trước trực tiếp. Vui lòng tải xuống để mở bằng ứng dụng phù hợp.
                  </p>
                  <Button onClick={handleDownload}>
                    <Download className="w-5 h-5 mr-2" />
                    Tải xuống {document.title}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tóm tắt nội dung</h3>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {document.summary}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Danh mục tri thức</p>
                  <div className="space-y-1">
                    {document.categoryIds?.map(catId => {
                      const cat = categories.find(c => c.id === catId);
                      return cat ? (
                        <span key={catId} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs mr-1">
                          {cat.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Từ khóa</p>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Nguồn dữ liệu</p>
                  <p className="text-sm text-gray-900">{document.source}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Loại file</p>
                  <p className="text-sm text-gray-900 uppercase">{document.fileType}</p>
                </div>

                {document.effectiveDate && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Ngày hiệu lực</p>
                    <p className="text-sm text-gray-900">{document.effectiveDate}</p>
                  </div>
                )}

                {document.expiryDate && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Ngày hết hạn</p>
                    <p className="text-sm text-gray-900">{document.expiryDate}</p>
                  </div>
                )}
              </div>

              {/* Read-only Info */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin bổ sung</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Người tạo</p>
                    <div className="flex items-center gap-2">
                      <img src={document.createdBy.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <p className="text-sm text-gray-900">{document.createdBy.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Ngày tạo</p>
                    <p className="text-sm text-gray-900">{document.createdAt}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Lượt xem</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {document.viewCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Lượt tải</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Download className="w-4 h-4 text-gray-400" />
                      {document.downloadCount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Đánh giá</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {document.avgRating.toFixed(1)} ({document.ratingCount} lượt)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Phiên bản hiện tại</p>
                    <p className="text-sm text-gray-900">v{document.versions[0].version}</p>
                  </div>

                  {document.approvalDate && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Ngày phê duyệt</p>
                      <p className="text-sm text-gray-900">{document.approvalDate}</p>
                    </div>
                  )}

                  {document.approverName && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Người phê duyệt</p>
                      <p className="text-sm text-gray-900">{document.approverName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Origin Space (if applicable) */}
              {document.originSpace && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Được duyệt từ Không gian: <strong>{document.originSpace}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VERSIONS TAB */}
          {activeTab === 'versions' && (
            <div className="space-y-6">
              {/* Upload New Version */}
              {canEdit() && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Cập nhật phiên bản mới
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        File mới
                      </label>
                      {newVersionFile ? (
                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                          <span className="text-sm">{newVersionFile.name}</span>
                          <button 
                            onClick={() => setNewVersionFile(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input 
                            type="file" 
                            className="hidden" 
                            id="new-version-file"
                            onChange={(e) => e.target.files && setNewVersionFile(e.target.files[0])}
                          />
                          <label htmlFor="new-version-file" className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center hover:border-indigo-400 transition bg-white">
                              <Upload className="mx-auto h-6 w-6 text-gray-400" />
                              <p className="mt-1 text-xs text-gray-600">Click để chọn file</p>
                            </div>
                          </label>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ghi chú phiên bản
                      </label>
                      <textarea 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        rows={2}
                        value={versionChangeLog}
                        onChange={(e) => setVersionChangeLog(e.target.value)}
                        placeholder="Mô tả những thay đổi trong phiên bản này..."
                      />
                    </div>

                    <Button 
                      size="sm" 
                      onClick={handleUploadNewVersion}
                      disabled={isUploading || !newVersionFile || !versionChangeLog.trim()}
                      className="w-full"
                    >
                      {isUploading ? 'Đang tải lên...' : 'Tải lên phiên bản mới'}
                    </Button>

                    <p className="text-xs text-gray-600">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Phiên bản mới sẽ được gửi phê duyệt và chỉ hiển thị sau khi được duyệt.
                    </p>
                  </div>
                </div>
              )}

              {/* Version History */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Lịch sử phiên bản</h3>
                <div className="space-y-3">
                  {document.versions.map((version, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-indigo-600">v{version.version}</span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Hiện tại
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{version.changeLog}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              {version.updatedBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {version.updatedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" title="Xem">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {index !== 0 && canEdit() && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              title="Khôi phục"
                              onClick={() => handleRestoreVersion(version)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
