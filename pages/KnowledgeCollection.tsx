import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { CollectedDocument, CollectionStatus, CollectionSource, Category, Space, User } from '../types';
import { Card, Button } from '../components/UI';
import { Upload, FileText, Filter, CheckSquare, Trash2, Edit, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const KnowledgeCollection: React.FC = () => {
  const [documents, setDocuments] = useState<CollectedDocument[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'uncategorized' | 'categorized' | 'submitted'>('uncategorized');
  const [filterSource, setFilterSource] = useState<CollectionSource | 'All'>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isClassifyModalOpen, setIsClassifyModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [docs, cats, sps, user] = await Promise.all([
      KMSService.getCollectedDocuments(),
      KMSService.getCategories(),
      KMSService.getSpaces(),
      KMSService.getCurrentUser()
    ]);
    setDocuments(docs);
    setCategories(cats);
    setSpaces(sps);
    setCurrentUser(user);
  };

  const filteredDocuments = documents.filter(doc => {
    // Filter by active tab
    if (activeTab === 'uncategorized' && doc.status !== 'Collected') return false;
    if (activeTab === 'categorized' && doc.status !== 'Classified') return false;
    if (activeTab === 'submitted' && !['InApproval', 'Approved', 'Rejected'].includes(doc.status)) return false;
    
    // Filter by source
    if (filterSource !== 'All' && doc.source !== filterSource) return false;
    return true;
  });

  const toggleSelectDoc = (id: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedDocs.size === filteredDocuments.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(filteredDocuments.map(d => d.id)));
    }
  };

  const handleClassify = () => {
    if (selectedDocs.size === 0) {
      alert('Vui lòng chọn ít nhất 1 tài liệu để phân loại');
      return;
    }
    setIsClassifyModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedDocs.size === 0) return;
    if (!confirm(`Xác nhận loại bỏ ${selectedDocs.size} tài liệu?`)) return;
    
    await KMSService.deleteCollectedDocuments(Array.from(selectedDocs));
    setSelectedDocs(new Set());
    loadData();
  };

  const handleSendToApproval = async () => {
    if (selectedDocs.size === 0) {
      alert('Vui lòng chọn ít nhất 1 tài liệu để gửi duyệt');
      return;
    }
    
    try {
      await KMSService.sendToApproval(Array.from(selectedDocs));
      alert(`Đã gửi ${selectedDocs.size} tài liệu vào quy trình phê duyệt!`);
      setSelectedDocs(new Set());
      loadData();
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    }
  };

  const getStatusBadge = (status: CollectionStatus) => {
    const config = {
      Collected: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Chưa phân loại' },
      Classified: { color: 'bg-blue-100 text-blue-800', icon: Edit, label: 'Đã phân loại' },
      InApproval: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Đang duyệt' },
      Approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Đã duyệt' },
      Rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Bị từ chối' },
      Discarded: { color: 'bg-gray-100 text-gray-600', icon: Trash2, label: 'Đã loại bỏ' }
    };
    const { color, icon: Icon, label } = config[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  const getSourceIcon = (source: CollectionSource) => {
    const icons = {
      Email: '📧',
      SharePoint: '📊',
      OneDrive: '☁️',
      GoogleDrive: '📁',
      Local: '💻',
      Other: '🔗'
    };
    return icons[source];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thu thập Tri thức</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload tài liệu từ nguồn ngoài và phân loại để đưa vào hệ thống
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Tải lên tài liệu
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-lg shadow-sm">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('uncategorized')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'uncategorized'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Chưa phân loại
            <span className="ml-2 bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs font-semibold">
              {documents.filter(d => d.status === 'Collected').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('categorized')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'categorized'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckSquare className="w-4 h-4 inline mr-2" />
            Đã phân loại
            <span className="ml-2 bg-blue-100 text-blue-900 py-1 px-2 rounded-full text-xs font-semibold">
              {documents.filter(d => d.status === 'Classified').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'submitted'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Send className="w-4 h-4 inline mr-2" />
            Đã gửi duyệt
            <span className="ml-2 bg-purple-100 text-purple-900 py-1 px-2 rounded-full text-xs font-semibold">
              {documents.filter(d => ['InApproval', 'Approved', 'Rejected'].includes(d.status)).length}
            </span>
          </button>
        </nav>
      </div>

      {/* Filters and Actions */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Filter className="w-3 h-3 inline mr-1" />
                Nguồn
              </label>
              <select
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as any)}
              >
                <option value="All">Tất cả nguồn</option>
                <option value="Email">📧 Email</option>
                <option value="SharePoint">📊 SharePoint</option>
                <option value="OneDrive">☁️ OneDrive</option>
                <option value="GoogleDrive">📁 Google Drive</option>
                <option value="Local">💻 Local</option>
                <option value="Other">🔗 Khác</option>
              </select>
            </div>
          </div>

          {selectedDocs.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Đã chọn: <strong>{selectedDocs.size}</strong> tài liệu
              </span>
              {activeTab === 'uncategorized' && (
                <Button variant="primary" size="sm" onClick={handleClassify}>
                  <Edit className="w-4 h-4 mr-1" />
                  Phân loại
                </Button>
              )}
              {activeTab === 'categorized' && (
                <Button variant="primary" size="sm" onClick={handleSendToApproval}>
                  <Send className="w-4 h-4 mr-1" />
                  Gửi duyệt
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-1" />
                Loại bỏ
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Documents List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocs.size === filteredDocuments.length && filteredDocuments.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tên tài liệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nguồn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Người tải lên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày tải
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Chưa có tài liệu nào</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="mt-4"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Tải lên tài liệu đầu tiên
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDocs.has(doc.id)}
                        onChange={() => toggleSelectDoc(doc.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.fileName}</div>
                          <div className="text-xs text-gray-500">
                            {(doc.fileSize / 1024).toFixed(1)} KB • {doc.fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {getSourceIcon(doc.source)} {doc.source}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {doc.sourceDetail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={doc.collectedBy.avatar}
                          alt=""
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-900">{doc.collectedBy.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.collectedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {doc.status === 'Collected' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocs(new Set([doc.id]));
                            setIsClassifyModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Phân loại
                        </Button>
                      )}
                      {doc.status === 'Classified' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await KMSService.sendToApproval([doc.id]);
                              alert('Đã gửi tài liệu vào quy trình phê duyệt!');
                              loadData();
                            } catch (error: any) {
                              alert('Lỗi: ' + error.message);
                            }
                          }}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Gửi duyệt
                        </Button>
                      )}
                      {['InApproval', 'Approved', 'Rejected'].includes(doc.status) && (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            setIsUploadModalOpen(false);
            loadData();
          }}
          currentUser={currentUser}
        />
      )}

      {/* Classify Modal */}
      {isClassifyModalOpen && (
        <ClassifyModal
          documentIds={Array.from(selectedDocs)}
          documents={documents.filter(d => selectedDocs.has(d.id))}
          categories={categories}
          spaces={spaces}
          onClose={() => {
            setIsClassifyModalOpen(false);
            setSelectedDocs(new Set());
          }}
          onSuccess={() => {
            setIsClassifyModalOpen(false);
            setSelectedDocs(new Set());
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Upload Modal Component
interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentUser: User | null;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess, currentUser }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<CollectionSource>('Email');
  const [sourceDetail, setSourceDetail] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Vui lòng chọn file');
      return;
    }
    if (!sourceDetail.trim()) {
      alert('Vui lòng nhập chi tiết nguồn');
      return;
    }

    setIsUploading(true);
    try {
      await KMSService.uploadCollectedDocuments({
        files,
        source,
        sourceDetail,
        contributorName,
        collectedBy: currentUser!
      });
      alert(`Đã tải lên ${files.length} tài liệu thành công!`);
      onSuccess();
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tải lên tài liệu từ nguồn ngoài</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file hoặc thư mục <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                📄 Chọn File
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('folder-upload')?.click()}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                📁 Chọn Thư mục
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition">
              <input
                type="file"
                multiple
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.jpg,.png"
              />
              <input
                type="file"
                id="folder-upload"
                className="hidden"
                onChange={handleFileSelect}
                {...({ webkitdirectory: '', directory: '' } as any)}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                Click nút bên trên hoặc kéo thả file/folder vào đây
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Hỗ trợ: PDF, DOCX, XLSX, PPTX, DWG, JPG, PNG (Không giới hạn)
              </p>
            </div>
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 font-medium">Đã chọn {files.length} file:</p>
                <ul className="mt-1 text-xs text-gray-600 max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                  {files.map((f, i) => (
                    <li key={i} className="py-1">• {f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nguồn <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={source}
              onChange={(e) => setSource(e.target.value as CollectionSource)}
            >
              <option value="Email">📧 Email</option>
              <option value="SharePoint">📊 SharePoint</option>
              <option value="OneDrive">☁️ OneDrive</option>
              <option value="GoogleDrive">📁 Google Drive</option>
              <option value="Local">💻 Local (Máy tính cá nhân)</option>
              <option value="Other">🔗 Khác</option>
            </select>
          </div>

          {/* Source Detail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chi tiết nguồn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={
                source === 'Email' ? 'VD: Tiêu đề email, người gửi' :
                source === 'SharePoint' ? 'VD: /sites/HR/Documents' :
                source === 'OneDrive' ? 'VD: /Personal/Work/Documents' :
                'Mô tả chi tiết nguồn tài liệu...'
              }
              value={sourceDetail}
              onChange={(e) => setSourceDetail(e.target.value)}
            />
          </div>

          {/* Contributor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tác giả gốc (tùy chọn)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="VD: Nguyễn Văn A (nếu khác người tải lên)"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ℹ️ <strong>Lưu ý:</strong> Sau khi tải lên, bạn cần phân loại tài liệu 
              (chọn danh mục, không gian...) trước khi gửi phê duyệt.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isUploading}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
            {isUploading ? 'Đang tải lên...' : `Tải lên ${files.length} tài liệu`}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Classify Modal Component
interface ClassifyModalProps {
  documentIds: string[];
  documents: CollectedDocument[];
  categories: Category[];
  spaces: Space[];
  onClose: () => void;
  onSuccess: () => void;
}

const ClassifyModal: React.FC<ClassifyModalProps> = ({
  documentIds,
  documents,
  categories,
  spaces,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    categoryIds: [] as string[],
    tags: '',
    effectiveDate: '',
    expiryDate: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (formData.categoryIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 danh mục');
      return;
    }

    setIsSaving(true);
    try {
      await KMSService.classifyCollectedDocuments({
        documentIds,
        categoryIds: formData.categoryIds,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        effectiveDate: formData.effectiveDate,
        expiryDate: formData.expiryDate,
        notes: formData.notes
      });
      alert('Đã phân loại thành công!');
      onSuccess();
    } catch (error: any) {
      alert('Lỗi: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Phân loại tài liệu ({documents.length} file)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Điền đầy đủ thông tin để đưa vào quy trình phê duyệt
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Documents List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Các tài liệu được chọn:</p>
            <ul className="space-y-1 max-h-32 overflow-y-auto">
              {documents.map(doc => (
                <li key={doc.id} className="text-sm text-gray-600 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                  {doc.fileName}
                </li>
              ))}
            </ul>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.categoryIds}
              onChange={(e) => setFormData({
                ...formData,
                categoryIds: Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value)
              })}
              size={5}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Giữ Ctrl/Cmd để chọn nhiều danh mục</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="VD: training, 2024, important"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hiệu lực
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hết hạn
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú phân loại
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Ghi chú về quá trình phân loại..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Lưu ý:</strong> Sau khi phân loại, tài liệu sẽ chuyển sang 
              trạng thái "Đã phân loại". Bạn cần vào module <strong>Phê duyệt tài liệu</strong> để gửi duyệt.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu phân loại'}
          </Button>
        </div>
      </div>
    </div>
  );
};
