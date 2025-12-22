import React, { useState, useEffect } from 'react';
import { Modal, Button } from './UI';
import { KMSDocument, Category, User, DocumentVersion, LifecycleStatus } from '../types';
import { KMSService } from '../services/kmsService';
import { 
  Upload, X, Plus, Star, MessageSquare, Share2, Download, 
  Edit, Clock, FileText, Tag as TagIcon, Calendar, AlertCircle,
  History, Send, Paperclip, Copy, Check, Users
} from 'lucide-react';

// ============ DOCUMENT FORM MODAL (Add/Edit) ============
interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document?: KMSDocument | null;
}

export const DocumentFormModal: React.FC<DocumentFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  document 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const [form, setForm] = useState({
    title: '',
    summary: '',
    categoryIds: [] as string[],
    tags: [] as string[],
    source: 'Nội bộ',
    effectiveDate: '',
    expiryDate: '',
    file: null as File | null,
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (document) {
        setForm({
          title: document.title,
          summary: document.summary,
          categoryIds: document.categoryIds || (document.categoryId ? [document.categoryId] : []),
          tags: document.tags,
          source: document.source,
          effectiveDate: document.effectiveDate || '',
          expiryDate: document.expiryDate || '',
          file: null
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, document]);

  const loadData = async () => {
    const [cats, tags] = await Promise.all([
      KMSService.getCategories(),
      KMSService.getTags()
    ]);
    setCategories(cats.filter(c => c.status === 'Active'));
    setAllTags(tags);
  };

  const resetForm = () => {
    setForm({
      title: '',
      summary: '',
      categoryIds: [],
      tags: [],
      source: 'Nội bộ',
      effectiveDate: '',
      expiryDate: '',
      file: null
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!form.summary.trim()) newErrors.summary = 'Tóm tắt là bắt buộc';
    if (form.categoryIds.length === 0) newErrors.categoryIds = 'Chọn ít nhất 1 danh mục';
    if (!document && !form.file) newErrors.file = 'Vui lòng chọn file đính kèm';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const docData: Partial<KMSDocument> = {
      title: form.title,
      summary: form.summary,
      description: form.summary, // Use summary as description
      categoryIds: form.categoryIds,
      tags: form.tags,
      source: form.source,
      effectiveDate: form.effectiveDate || undefined,
      expiryDate: form.expiryDate || undefined,
    };

    if (document) {
      await KMSService.updateDocument(document.id, docData);
    } else {
      await KMSService.createDocument(docData);
    }

    onSuccess();
    onClose();
    resetForm();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm({ ...form, tags: [...form.tags, newTag.trim()] });
      if (!allTags.includes(newTag.trim())) {
        KMSService.addTag(newTag.trim());
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const toggleCategory = (catId: string) => {
    if (form.categoryIds.includes(catId)) {
      setForm({ ...form, categoryIds: form.categoryIds.filter(id => id !== catId) });
    } else {
      setForm({ ...form, categoryIds: [...form.categoryIds, catId] });
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={document ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit}>
            {document ? 'Cập nhật' : 'Lưu & Gửi duyệt'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* File Upload */}
        {!document && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File đính kèm <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.file ? 'border-red-300' : 'border-gray-300'}`}>
              {form.file ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">{form.file.name}</span>
                  </div>
                  <button onClick={() => setForm({ ...form, file: null })} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Kéo thả file hoặc click để chọn</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload"
                    onChange={(e) => e.target.files && setForm({ ...form, file: e.target.files[0] })}
                  />
                  <label htmlFor="file-upload" className="mt-2 inline-block cursor-pointer">
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md text-sm hover:bg-indigo-100">
                      Chọn file
                    </span>
                  </label>
                </>
              )}
            </div>
            {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề tài liệu <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Nhập tiêu đề..."
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tóm tắt nội dung <span className="text-red-500">*</span>
          </label>
          <textarea 
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.summary ? 'border-red-300' : 'border-gray-300'}`}
            rows={3}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="Mô tả ngắn gọn nội dung tài liệu (tối ưu cho tìm kiếm)..."
          />
          {errors.summary && <p className="text-sm text-red-500 mt-1">{errors.summary}</p>}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục tri thức <span className="text-red-500">*</span>
          </label>
          <div className={`border rounded-md p-3 max-h-40 overflow-y-auto ${errors.categoryIds ? 'border-red-300' : 'border-gray-300'}`}>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded">
                <input 
                  type="checkbox"
                  checked={form.categoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
          {errors.categoryIds && <p className="text-sm text-red-500 mt-1">{errors.categoryIds}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Từ khóa / Tag</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Nhập tag và Enter..."
            />
            <Button size="sm" onClick={handleAddTag}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                <TagIcon className="w-3 h-3" />
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn dữ liệu</label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          >
            <option value="Nội bộ">Nội bộ</option>
            <option value="Bên ngoài">Bên ngoài</option>
            <option value="Email">Email</option>
            <option value="OneDrive">OneDrive</option>
            <option value="SharePoint">SharePoint</option>
            <option value="Hệ thống khác">Hệ thống khác</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hiệu lực</label>
            <input 
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={form.effectiveDate}
              onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
            <input 
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>
        </div>

        {!document && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Tài liệu sẽ được gửi đi phê duyệt và chỉ hiển thị trong Kho sau khi được duyệt.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ============ RATING MODAL ============
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KMSDocument | null;
  onSuccess: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  isOpen, 
  onClose, 
  document, 
  onSuccess 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (document) {
      await KMSService.rateDocument(document.id, rating, comment);
      onSuccess();
      onClose();
      setRating(5);
      setComment('');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Đánh giá tài liệu"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Gửi đánh giá</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Tài liệu:</p>
          <p className="text-sm text-gray-900">{document?.title}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn:</p>
          <div className="flex gap-2 justify-center py-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {rating === 5 && 'Xuất sắc'}
            {rating === 4 && 'Tốt'}
            {rating === 3 && 'Trung bình'}
            {rating === 2 && 'Cần cải thiện'}
            {rating === 1 && 'Không hài lòng'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhận xét (không bắt buộc):
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về tài liệu này..."
          />
        </div>
      </div>
    </Modal>
  );
};

// ============ FEEDBACK MODAL ============
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KMSDocument | null;
  onSuccess: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  document, 
  onSuccess 
}) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung góp ý');
      return;
    }

    if (document) {
      await KMSService.createFeedback({
        docId: document.id,
        docTitle: document.title,
        content,
        // file would be uploaded in real implementation
      });
      onSuccess();
      onClose();
      setContent('');
      setFile(null);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Góp ý về tài liệu"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit}><Send className="w-4 h-4 mr-2" />Gửi góp ý</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Tài liệu:</p>
          <p className="text-sm text-gray-900">{document?.title}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung góp ý <span className="text-red-500">*</span>
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề, đề xuất cải thiện, hoặc thông tin cần bổ sung..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đính kèm file minh chứng (không bắt buộc):
          </label>
          {file ? (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                className="hidden" 
                id="feedback-file"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
              <label htmlFor="feedback-file" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-indigo-400 transition">
                  <Paperclip className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">Click để chọn file</p>
                </div>
              </label>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ============ SHARE MODAL ============
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KMSDocument | null;
  onSuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  document, 
  onSuccess 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareMode, setShareMode] = useState<'link' | 'users'>('link');

  useEffect(() => {
    if (isOpen && document) {
      loadUsers();
      setShareLink(`${window.location.origin}/#/documents/${document.id}`);
    }
  }, [isOpen, document]);

  const loadUsers = async () => {
    const allUsers = await KMSService.getAllUsers();
    setUsers(allUsers);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToUsers = async () => {
    if (selectedUsers.length === 0) {
      alert('Vui lòng chọn ít nhất 1 người dùng');
      return;
    }
    
    if (document) {
      await KMSService.shareDocument(document.id, selectedUsers);
      onSuccess();
      onClose();
      setSelectedUsers([]);
    }
  };

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Chia sẻ tài liệu"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Đóng</Button>
          {shareMode === 'users' && (
            <Button onClick={handleShareToUsers}>
              <Send className="w-4 h-4 mr-2" />Gửi thông báo
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Tài liệu:</p>
          <p className="text-sm text-gray-900">{document?.title}</p>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 border-b">
          <button 
            onClick={() => setShareMode('link')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              shareMode === 'link' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Copy className="w-4 h-4 inline mr-1" />
            Tạo link
          </button>
          <button 
            onClick={() => setShareMode('users')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              shareMode === 'users' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            Chọn người dùng
          </button>
        </div>

        {shareMode === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link chia sẻ:
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                value={shareLink}
                readOnly
              />
              <Button size="sm" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && <p className="text-sm text-green-600 mt-1">✓ Đã sao chép link</p>}
          </div>
        )}

        {shareMode === 'users' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn người nhận thông báo:
            </label>
            <div className="border rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Đã chọn: {selectedUsers.length} người
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
