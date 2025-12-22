import React, { useState } from 'react';
import { Button } from '../components/UI';
import { KMSDocument, Category, Space } from '../types';
import { 
  Calendar, AlertCircle, FileUp, X, Tag as TagIcon, 
  Folder, Layers, Info, Archive 
} from 'lucide-react';

// ============================================
// MODAL 1: GIA HẠN TÀI LIỆU (FEATURE 4)
// ============================================
interface ExtendModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KMSDocument | null;
  onExtend: (docId: string, newExpiryDate: string, reason: string) => Promise<void>;
}

export const ExtendExpiryModal: React.FC<ExtendModalProps> = ({
  isOpen,
  onClose,
  document,
  onExtend
}) => {
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !document) return null;

  const handleSubmit = async () => {
    if (!newExpiryDate || !reason.trim()) {
      alert('Vui lòng nhập đầy đủ Ngày gia hạn và Lý do');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (newExpiryDate <= today) {
      alert('Ngày gia hạn phải lớn hơn ngày hiện tại');
      return;
    }

    setIsProcessing(true);
    try {
      await onExtend(document.id, newExpiryDate, reason);
      setNewExpiryDate('');
      setReason('');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[70]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[80] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Gia hạn Tài liệu
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Tài liệu:</strong> {document.title}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Ngày hết hạn hiện tại:</strong> {document.expiryDate || 'Chưa có'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày gia hạn mới <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // tomorrow
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do gia hạn <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Tài liệu vẫn còn giá trị, cần duy trì thêm 1 năm nữa..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  Sau khi gia hạn, trạng thái lifecycle sẽ tự động cập nhật về <strong>Active</strong> nếu ngày gia hạn còn xa.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isProcessing}>
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận Gia hạn'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// MODAL 2: TẠO PHIÊN BẢN MỚI (FEATURE 5)
// ============================================
interface NewVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KMSDocument | null;
  categories: Category[];
  spaces: Space[];
  onCreateVersion: (docId: string, data: {
    file?: File;
    newExpiryDate: string;
    changeLog: string;
    metadata?: any;
  }) => Promise<void>;
}

export const CreateNewVersionModal: React.FC<NewVersionModalProps> = ({
  isOpen,
  onClose,
  document,
  categories,
  onCreateVersion
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [changeLog, setChangeLog] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !document) return null;

  const handleSubmit = async () => {
    if (!changeLog.trim()) {
      alert('Vui lòng nhập Ghi chú cập nhật');
      return;
    }

    if (!newExpiryDate) {
      alert('Vui lòng chọn Ngày hết hạn cho phiên bản mới');
      return;
    }

    setIsProcessing(true);
    try {
      await onCreateVersion(document.id, {
        file: file || undefined,
        newExpiryDate,
        changeLog
      });
      setFile(null);
      setNewExpiryDate('');
      setChangeLog('');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[70]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[80] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-indigo-600" />
              Tạo Phiên bản Mới
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <p className="text-sm text-indigo-900">
                <strong>Tài liệu gốc:</strong> {document.title}
              </p>
              <p className="text-sm text-indigo-700 mt-1">
                <strong>Phiên bản hiện tại:</strong> v{document.versions[0]?.version || '1.0'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File mới (tuỳ chọn)
              </label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.docx,.xlsx,.pptx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nếu không upload, hệ thống sẽ sao chép file từ phiên bản cũ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày hết hạn mới <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú cập nhật <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                rows={3}
                value={changeLog}
                onChange={(e) => setChangeLog(e.target.value)}
                placeholder="VD: Cập nhật quy trình mới theo ISO 9001:2015, bổ sung phần 3.2..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Phiên bản cũ sẽ giữ nguyên trạng thái <strong>Expired</strong> (lịch sử)</p>
                  <p>• Phiên bản mới sẽ có trạng thái <strong>PendingLevel1</strong> và đi vào luồng phê duyệt</p>
                  <p>• Metadata (Danh mục, Không gian) sẽ được giữ nguyên từ phiên bản cũ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isProcessing}>
              {isProcessing ? 'Đang tạo...' : 'Tạo Phiên bản'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// MODAL 3: LƯU TRỮ TÀI LIỆU (FEATURE 6)
// ============================================
interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KMSDocument | null;
  onArchive: (docId: string) => Promise<void>;
}

export const ArchiveDocumentModal: React.FC<ArchiveModalProps> = ({
  isOpen,
  onClose,
  document,
  onArchive
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !document) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onArchive(document.id);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[70]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[80] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Archive className="w-5 h-5 text-gray-600" />
              Lưu trữ Tài liệu
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">{document.title}</p>
              <p className="text-xs text-gray-600 mt-1">Phiên bản: v{document.versions[0]?.version}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="text-sm text-red-900 space-y-2">
                  <p className="font-semibold">Tài liệu sẽ được chuyển sang trạng thái Lưu trữ.</p>
                  <ul className="list-disc list-inside space-y-1 text-red-800">
                    <li>Tài liệu không còn hiển thị trong Kho tài liệu chung</li>
                    <li>Không xuất hiện trong kết quả tìm kiếm thông thường</li>
                    <li>Chỉ người quản trị mới có thể xem lại trong khu Lưu trữ</li>
                    <li>Không cho phép chỉnh sửa hoặc tạo phiên bản mới</li>
                  </ul>
                  <p className="font-semibold mt-3">Anh có chắc chắn không?</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleConfirm} className="flex-1" disabled={isProcessing}>
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận Lưu trữ'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
