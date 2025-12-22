import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { SyncSource, SyncSourceType } from '../types';
import { Button } from '../components/UI';
import { SyncSourceModal, SyncHistoryModal } from '../components/SyncSourceModals';
import { 
  Plus, Search, Radio, Edit, Trash2, RefreshCw, History,
  Cloud, Database, FolderOpen, Code, CheckCircle, XCircle,
  AlertCircle, Clock, Zap
} from 'lucide-react';

export const KnowledgeIngestion: React.FC = () => {
  const [sources, setSources] = useState<SyncSource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<SyncSourceType | ''>('');
  
  // Modals
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<SyncSource | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [selectedSourceName, setSelectedSourceName] = useState('');
  
  // Sync status
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    const data = await KMSService.getSyncSources();
    setSources(data);
  };

  const handleAddSource = () => {
    setEditingSource(null);
    setSourceModalOpen(true);
  };

  const handleEditSource = (source: SyncSource) => {
    setEditingSource(source);
    setSourceModalOpen(true);
  };

  const handleDeleteSource = async (source: SyncSource) => {
    const confirmed = window.confirm(
      `Xóa nguồn thu thập "${source.name}"?\n\n` +
      'Xóa nguồn này sẽ không ảnh hưởng tới tài liệu đã thu thập. Bạn có chắc chắn?'
    );
    
    if (confirmed) {
      await KMSService.deleteSyncSource(source.id);
      loadSources();
    }
  };

  const handleManualSync = async (source: SyncSource) => {
    setSyncingIds(prev => new Set(prev).add(source.id));
    
    try {
      const result = await KMSService.manualSync(source.id);
      
      if (result.success) {
        alert(`Đồng bộ thành công!\nThu thập: ${result.docsCollected} tài liệu\nThành công: ${result.docsSuccess}\nLỗi: ${result.docsError}`);
      } else {
        alert(`Đồng bộ thất bại: ${result.message}`);
      }
      
      loadSources();
    } finally {
      setSyncingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(source.id);
        return newSet;
      });
    }
  };

  const handleViewHistory = (source: SyncSource) => {
    setSelectedSourceId(source.id);
    setSelectedSourceName(source.name);
    setHistoryModalOpen(true);
  };

  // Filter sources
  const filteredSources = sources.filter(s => {
    const matchSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = !typeFilter || s.type === typeFilter;

    return matchSearch && matchType;
  });

  const getSourceIcon = (type: SyncSourceType) => {
    const icons = {
      'SharePoint': Cloud,
      'Google Drive': Cloud,
      'OneDrive': Cloud,
      'Confluence': Database,
      'Local Folder': FolderOpen,
      'API': Code
    };
    
    const Icon = icons[type];
    return <Icon className="w-5 h-5" />;
  };

  const getConnectionStatusBadge = (status: SyncSource['connectionStatus']) => {
    const colors = {
      'Connected': 'bg-green-100 text-green-800 border-green-200',
      'Disconnected': 'bg-gray-100 text-gray-800 border-gray-200',
      'Error': 'bg-red-100 text-red-800 border-red-200',
      'Testing': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    const labels = {
      'Connected': 'Đã kết nối',
      'Disconnected': 'Chưa kết nối',
      'Error': 'Lỗi',
      'Testing': 'Đang kiểm tra'
    };

    const icons = {
      'Connected': CheckCircle,
      'Disconnected': XCircle,
      'Error': AlertCircle,
      'Testing': RefreshCw
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
        <Icon className={`w-3 h-3 ${status === 'Testing' ? 'animate-spin' : ''}`} />
        {labels[status]}
      </span>
    );
  };

  const getFrequencyLabel = (frequency: SyncSource['frequency']) => {
    const labels = {
      'Manual': 'Thủ công',
      'Hourly': 'Mỗi giờ',
      'Daily': 'Hàng ngày',
      'Weekly': 'Hàng tuần',
      'Monthly': 'Hàng tháng'
    };
    return labels[frequency];
  };

  const getSyncModeLabel = (mode: SyncSource['syncMode']) => {
    return mode === 'Full' ? 'Toàn bộ' : 'Thay đổi';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Radio className="text-indigo-600" /> Thu thập & Đồng bộ Tri thức
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý nguồn dữ liệu và lịch đồng bộ tự động từ các hệ thống bên ngoài.
          </p>
        </div>
        <Button onClick={handleAddSource}>
          <Plus className="w-4 h-4 mr-2" /> Thêm nguồn mới
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, endpoint..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as SyncSourceType | '')}
            >
              <option value="">Tất cả loại nguồn</option>
              <option value="SharePoint">SharePoint</option>
              <option value="Google Drive">Google Drive</option>
              <option value="OneDrive">OneDrive</option>
              <option value="Confluence">Confluence</option>
              <option value="Local Folder">Local Folder</option>
              <option value="API">API</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
          <span>Tìm thấy: <strong>{filteredSources.length}</strong> nguồn</span>
          {(searchTerm || typeFilter) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại & Tên nguồn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chu kỳ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kiểu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lần cuối
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredSources.map(source => (
              <tr key={source.id} className="hover:bg-gray-50 transition">
                {/* Type & Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-indigo-50 p-2 rounded">
                      {getSourceIcon(source.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.type}</p>
                    </div>
                  </div>
                </td>

                {/* Endpoint */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 truncate max-w-xs" title={source.endpoint}>
                    {source.endpoint}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {source.approvalMode === 'Auto' ? '🟢 Tự động duyệt' : '🟡 Duyệt thủ công'}
                  </p>
                </td>

                {/* Frequency */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {getFrequencyLabel(source.frequency)}
                  </div>
                </td>

                {/* Sync Mode */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {getSyncModeLabel(source.syncMode)}
                  </span>
                </td>

                {/* Connection Status */}
                <td className="px-6 py-4">
                  {getConnectionStatusBadge(source.connectionStatus)}
                </td>

                {/* Last Sync */}
                <td className="px-6 py-4">
                  {source.lastSync ? (
                    <div>
                      <p className="text-sm text-gray-700">{source.lastSync}</p>
                      {source.lastSyncStatus && (
                        <span className={`text-xs ${
                          source.lastSyncStatus === 'Success' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {source.lastSyncStatus === 'Success' ? '✓ Thành công' : '✗ Lỗi'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Chưa đồng bộ</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" 
                      title="Sửa"
                      onClick={() => handleEditSource(source)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" 
                      title="Xóa"
                      onClick={() => handleDeleteSource(source)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      className={`p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition ${
                        syncingIds.has(source.id) ? 'animate-spin' : ''
                      }`}
                      title="Đồng bộ thủ công"
                      onClick={() => handleManualSync(source)}
                      disabled={syncingIds.has(source.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition" 
                      title="Lịch sử"
                      onClick={() => handleViewHistory(source)}
                    >
                      <History className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSources.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Radio className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Chưa có nguồn thu thập nào</p>
            <p className="text-sm mt-1">Thêm nguồn mới để bắt đầu đồng bộ dữ liệu</p>
            <Button className="mt-4" onClick={handleAddSource}>
              <Plus className="w-4 h-4 mr-2" /> Thêm nguồn đầu tiên
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <SyncSourceModal 
        isOpen={sourceModalOpen}
        onClose={() => { setSourceModalOpen(false); setEditingSource(null); }}
        onSuccess={loadSources}
        source={editingSource}
      />

      <SyncHistoryModal 
        isOpen={historyModalOpen}
        onClose={() => { setHistoryModalOpen(false); setSelectedSourceId(''); }}
        sourceId={selectedSourceId}
        sourceName={selectedSourceName}
      />
    </div>
  );
};
