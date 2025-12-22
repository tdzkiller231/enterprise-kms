import React, { useState } from 'react';
import { Modal, Button } from './UI';
import { FeedbackSuggestion, KMSDocument, Category } from '../types';
import { KMSService } from '../services/kmsService';
import { 
  Upload, X, Plus, Tag as TagIcon, AlertCircle, CheckCircle,
  FileText, Edit, Save, Sparkles
} from 'lucide-react';

// ============ UPDATE DOCUMENT FROM FEEDBACK MODAL ============
interface UpdateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackSuggestion | null;
  document: KMSDocument | null;
  onSuccess: () => void;
}

export const UpdateDocumentModal: React.FC<UpdateDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  feedback,
  document,
  onSuccess 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: document?.title || '',
    summary: document?.summary || '',
    categoryIds: document?.categoryIds || [],
    tags: document?.tags || [],
    newFile: null as File | null,
    processingNote: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (document) {
        setForm({
          title: document.title,
          summary: document.summary,
          categoryIds: document.categoryIds || [],
          tags: document.tags,
          newFile: null,
          processingNote: ''
        });
      }
    }
  }, [isOpen, document]);

  const loadCategories = async () => {
    const cats = await KMSService.getCategories();
    setCategories(cats.filter(c => c.status === 'Active'));
  };

  const toggleCategory = (catId: string) => {
    if (form.categoryIds.includes(catId)) {
      setForm({ ...form, categoryIds: form.categoryIds.filter(id => id !== catId) });
    } else {
      setForm({ ...form, categoryIds: [...form.categoryIds, catId] });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm({ ...form, tags: [...form.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!form.summary.trim()) newErrors.summary = 'Tóm tắt là bắt buộc';
    if (form.categoryIds.length === 0) newErrors.categoryIds = 'Chọn ít nhất 1 danh mục';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !feedback || !document) return;

    setIsSaving(true);
    try {
      await KMSService.updateDocumentFromFeedback(document.id, feedback.id, {
        title: form.title,
        summary: form.summary,
        categoryIds: form.categoryIds,
        tags: form.tags,
        newFile: form.newFile,
        processingNote: form.processingNote
      });

      onSuccess();
      onClose();
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật tài liệu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Cập nhật Tài liệu từ Góp ý"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Lưu cập nhật
          </Button>
        </>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Feedback Context */}
        {feedback && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm font-medium text-blue-900 mb-1">Góp ý từ: {feedback.user.name}</p>
            <p className="text-sm text-blue-800 italic">"{feedback.content}"</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề tài liệu <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tóm tắt / Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea 
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.summary ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="Mô tả ngắn gọn về nội dung tài liệu..."
          />
          {errors.summary && <p className="text-xs text-red-500 mt-1">{errors.summary}</p>}
        </div>

        {/* Categories Multi-select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục tri thức <span className="text-red-500">*</span>
          </label>
          <div className={`border rounded-md p-2 max-h-32 overflow-y-auto ${errors.categoryIds ? 'border-red-500' : 'border-gray-300'}`}>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-1 rounded">
                <input 
                  type="checkbox"
                  checked={form.categoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
          {errors.categoryIds && <p className="text-xs text-red-500 mt-1">{errors.categoryIds}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ khóa (Tags)
          </label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Nhập tag và Enter"
            />
            <Button size="sm" variant="secondary" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
                <TagIcon className="w-3 h-3" />
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-indigo-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Upload New File (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload file mới (tùy chọn)
          </label>
          {form.newFile ? (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{form.newFile.name}</span>
              </div>
              <button onClick={() => setForm({ ...form, newFile: null })} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <input 
                type="file" 
                className="hidden" 
                id="update-file"
                onChange={(e) => e.target.files && setForm({ ...form, newFile: e.target.files[0] })}
              />
              <label htmlFor="update-file" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-indigo-400 transition">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-600">Click để chọn file</p>
                </div>
              </label>
            </>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Nếu không upload file mới, hệ thống sẽ giữ nguyên file hiện tại
          </p>
        </div>

        {/* Processing Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú xử lý (tùy chọn)
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={2}
            value={form.processingNote}
            onChange={(e) => setForm({ ...form, processingNote: e.target.value })}
            placeholder="Ghi chú về những thay đổi đã thực hiện..."
          />
        </div>

        {/* Info Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Sau khi lưu:</p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>Góp ý sẽ chuyển sang trạng thái "Đang xử lý"</li>
                <li>Bản chỉnh sửa được lưu tạm thời</li>
                <li>Bạn cần nhấn "Tạo phiên bản mới" để hoàn tất</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// ============ CREATE VERSION FROM FEEDBACK MODAL ============
interface CreateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackSuggestion | null;
  document: KMSDocument | null;
  onSuccess: () => void;
}

export const CreateVersionModal: React.FC<CreateVersionModalProps> = ({ 
  isOpen, 
  onClose, 
  feedback,
  document,
  onSuccess 
}) => {
  const [changeLog, setChangeLog] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  React.useEffect(() => {
    if (isOpen && feedback) {
      setChangeLog(`Cập nhật từ góp ý: ${feedback.content.substring(0, 100)}...`);
    }
  }, [isOpen, feedback]);

  const handleCreate = async () => {
    if (!feedback || !document || !changeLog.trim()) {
      alert('Vui lòng nhập ghi chú phiên bản');
      return;
    }

    setIsCreating(true);
    try {
      await KMSService.createVersionFromFeedback(document.id, feedback.id, changeLog);
      
      alert('Đã tạo phiên bản mới từ góp ý thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo phiên bản mới');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Tạo Phiên bản Mới"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button onClick={handleCreate} isLoading={isCreating}>
            <Sparkles className="w-4 h-4 mr-2" />
            Tạo phiên bản mới
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Info */}
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Sẵn sàng tạo phiên bản mới</p>
              <p className="mt-1">Bạn đã cập nhật metadata và/hoặc file tài liệu. Phiên bản mới sẽ được tạo với các thay đổi này.</p>
            </div>
          </div>
        </div>

        {/* Feedback Info */}
        {feedback && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ góp ý:</label>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-800">"{feedback.content}"</p>
              <p className="text-xs text-gray-500 mt-1">Bởi {feedback.user.name}</p>
            </div>
          </div>
        )}

        {/* Change Log */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú phiên bản <span className="text-red-500">*</span>
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={3}
            value={changeLog}
            onChange={(e) => setChangeLog(e.target.value)}
            placeholder="Mô tả những thay đổi trong phiên bản này..."
          />
        </div>

        {/* Result Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Sau khi tạo phiên bản:</p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>Phiên bản mới sẽ có trạng thái "Chờ phê duyệt"</li>
                <li>Sau khi được phê duyệt, phiên bản sẽ hiển thị trong Kho tài liệu</li>
                <li>Góp ý sẽ chuyển sang trạng thái "Đã xử lý"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
