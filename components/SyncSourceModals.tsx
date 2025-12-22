import React, { useState, useEffect } from 'react';
import { Modal, Button } from './UI';
import { SyncSource, SyncSourceType, SyncFrequency, SyncMode, ApprovalMode, SyncHistory } from '../types';
import { KMSService } from '../services/kmsService';
import { 
  Upload, X, Plus, AlertCircle, CheckCircle, Eye, EyeOff,
  Database, Cloud, FolderOpen, Code, Clock, RefreshCw,
  Calendar, Shield, Zap, History
} from 'lucide-react';

// ============ SYNC SOURCE MODAL (Add/Edit) ============
interface SyncSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  source?: SyncSource | null;
}

export const SyncSourceModal: React.FC<SyncSourceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  source 
}) => {
  const [form, setForm] = useState({
    type: 'SharePoint' as SyncSourceType,
    name: '',
    endpoint: '',
    username: '',
    token: '',
    frequency: 'Daily' as SyncFrequency,
    approvalMode: 'Manual' as ApprovalMode,
    syncMode: 'Incremental' as SyncMode,
  });
  
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (source) {
        setForm({
          type: source.type,
          name: source.name,
          endpoint: source.endpoint,
          username: source.username || '',
          token: source.token || '',
          frequency: source.frequency,
          approvalMode: source.approvalMode,
          syncMode: source.syncMode,
        });
      } else {
        resetForm();
      }
      setTestResult(null);
    }
  }, [isOpen, source]);

  const resetForm = () => {
    setForm({
      type: 'SharePoint',
      name: '',
      endpoint: '',
      username: '',
      token: '',
      frequency: 'Daily',
      approvalMode: 'Manual',
      syncMode: 'Incremental',
    });
    setErrors({});
    setTestResult(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) newErrors.name = 'Tên nguồn là bắt buộc';
    if (!form.endpoint.trim()) newErrors.endpoint = 'Endpoint/Path là bắt buộc';
    if (!form.username.trim()) newErrors.username = 'Username là bắt buộc';
    if (!form.token.trim()) newErrors.token = 'Token/Password là bắt buộc';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validate()) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await KMSService.testSyncConnection({
        type: form.type,
        endpoint: form.endpoint,
        username: form.username,
        token: form.token
      });
      
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: 'Không thể kết nối đến nguồn dữ liệu' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const sourceData: Partial<SyncSource> = {
      type: form.type,
      name: form.name,
      endpoint: form.endpoint,
      username: form.username,
      token: form.token,
      frequency: form.frequency,
      approvalMode: form.approvalMode,
      syncMode: form.syncMode,
    };

    if (source) {
      await KMSService.updateSyncSource(source.id, sourceData);
    } else {
      await KMSService.createSyncSource(sourceData);
    }

    onSuccess();
    onClose();
  };

  const sourceTypeIcons: Record<SyncSourceType, any> = {
    'SharePoint': Cloud,
    'Google Drive': Cloud,
    'OneDrive': Cloud,
    'Confluence': Database,
    'Local Folder': FolderOpen,
    'API': Code
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={source ? 'Chỉnh sửa nguồn thu thập' : 'Thêm nguồn thu thập mới'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button 
            variant="secondary" 
            onClick={handleTestConnection}
            isLoading={isTesting}
          >
            <Zap className="w-4 h-4 mr-2" />
            Kiểm tra kết nối
          </Button>
          <Button onClick={handleSubmit}>
            {source ? 'Lưu thay đổi' : 'Thêm nguồn'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Source Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại nguồn <span className="text-red-500">*</span>
          </label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as SyncSourceType })}
            disabled={!!source}
          >
            <option value="SharePoint">SharePoint</option>
            <option value="Google Drive">Google Drive</option>
            <option value="OneDrive">OneDrive</option>
            <option value="Confluence">Confluence</option>
            <option value="Local Folder">Local Folder</option>
            <option value="API">API</option>
          </select>
          {source && (
            <p className="text-xs text-gray-500 mt-1">Không thể thay đổi loại nguồn sau khi tạo</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên nguồn <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="VD: SharePoint Phòng Marketing"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Endpoint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint / Path <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.endpoint ? 'border-red-500' : 'border-gray-300'}`}
            value={form.endpoint}
            onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
            placeholder="https://company.sharepoint.com/sites/..."
          />
          {errors.endpoint && <p className="text-xs text-red-500 mt-1">{errors.endpoint}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username / Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            className={`w-full border rounded-md px-3 py-2 text-sm ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="admin@company.com"
          />
          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
        </div>

        {/* Token/Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token / Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input 
              type={showToken ? "text" : "password"}
              className={`w-full border rounded-md px-3 py-2 pr-10 text-sm ${errors.token ? 'border-red-500' : 'border-gray-300'}`}
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              placeholder="••••••••••••••••"
            />
            <button 
              type="button"
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.token && <p className="text-xs text-red-500 mt-1">{errors.token}</p>}
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chu kỳ đồng bộ
          </label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value as SyncFrequency })}
          >
            <option value="Manual">Thủ công</option>
            <option value="Hourly">Mỗi giờ</option>
            <option value="Daily">Hàng ngày</option>
            <option value="Weekly">Hàng tuần</option>
            <option value="Monthly">Hàng tháng</option>
          </select>
        </div>

        {/* Approval Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phương thức duyệt tài liệu
          </label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={form.approvalMode}
            onChange={(e) => setForm({ ...form, approvalMode: e.target.value as ApprovalMode })}
          >
            <option value="Manual">Duyệt thủ công</option>
            <option value="Auto">Tự động phê duyệt</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {form.approvalMode === 'Auto' 
              ? 'Tài liệu sẽ được tự động phê duyệt sau khi thu thập' 
              : 'Tài liệu cần được duyệt thủ công trước khi hiển thị'}
          </p>
        </div>

        {/* Sync Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kiểu đồng bộ
          </label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={form.syncMode}
            onChange={(e) => setForm({ ...form, syncMode: e.target.value as SyncMode })}
          >
            <option value="Full">Đồng bộ toàn bộ</option>
            <option value="Incremental">Đồng bộ thay đổi</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {form.syncMode === 'Full' 
              ? 'Thu thập lại toàn bộ tài liệu mỗi lần đồng bộ' 
              : 'Chỉ thu thập tài liệu mới và đã thay đổi'}
          </p>
        </div>

        {/* Test Connection Result */}
        {testResult && (
          <div className={`p-3 rounded-md border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ============ SYNC HISTORY MODAL ============
interface SyncHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceId: string;
  sourceName: string;
}

export const SyncHistoryModal: React.FC<SyncHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  sourceId,
  sourceName
}) => {
  const [history, setHistory] = useState<SyncHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && sourceId) {
      loadHistory();
    }
  }, [isOpen, sourceId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await KMSService.getSyncHistory(sourceId);
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: 'Running' | 'Success' | 'Error') => {
    const colors = {
      'Running': 'bg-blue-100 text-blue-800',
      'Success': 'bg-green-100 text-green-800',
      'Error': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'Running': 'Đang chạy',
      'Success': 'Thành công',
      'Error': 'Lỗi'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Lịch sử đồng bộ: ${sourceName}`}
      footer={
        <Button variant="ghost" onClick={onClose}>Đóng</Button>
      }
    >
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p>Đang tải lịch sử...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Chưa có lịch sử đồng bộ</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{item.syncTime}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.triggeredBy === 'Auto' ? 'Tự động' : `Thủ công bởi ${item.triggeredByUser?.name}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Tài liệu thu</p>
                  <p className="text-sm font-semibold text-gray-900">{item.docsCollected}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Thành công</p>
                  <p className="text-sm font-semibold text-green-600">{item.docsSuccess}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lỗi</p>
                  <p className="text-sm font-semibold text-red-600">{item.docsError}</p>
                </div>
              </div>

              {item.errorMessage && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
                  <p className="text-xs text-red-800">{item.errorMessage}</p>
                </div>
              )}

              {item.details && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600">{item.details}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
