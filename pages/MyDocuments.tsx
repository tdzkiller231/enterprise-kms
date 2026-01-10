import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument, Category, Space, User, ViewHistory, DownloadHistory } from '../types';
import { Button, Modal } from '../components/UI';
import { 
  FileText, Heart, Eye, Download, Star, Bell, Clock, Share2,
  Edit, Trash2, Send, Search, Calendar
} from 'lucide-react';

type TabType = 'uploaded' | 'shared' | 'commented' | 'expired';

export const MyDocuments: React.FC = () => {
  const [currentUser] = useState<User>({ 
    id: 'u1', 
    name: 'Nguyễn Văn A (Admin)', 
    role: 'Admin', 
    avatar: 'https://picsum.photos/32/32?random=1' 
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('uploaded');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpace, setFilterSpace] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Data - Documents
  const [myCreatedDocs, setMyCreatedDocs] = useState<KMSDocument[]>([]);
  const [sharedDocs, setSharedDocs] = useState<KMSDocument[]>([]);
  const [commentedDocs, setCommentedDocs] = useState<KMSDocument[]>([]);
  const [myExpiredDocs, setMyExpiredDocs] = useState<KMSDocument[]>([]);
  const [favoriteDocs, setFavoriteDocs] = useState<KMSDocument[]>([]);
  const [followingDocs, setFollowingDocs] = useState<KMSDocument[]>([]);
  
  // Data - History (separate section)
  const [recentViews, setRecentViews] = useState<ViewHistory[]>([]);
  const [downloads, setDownloads] = useState<DownloadHistory[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  // Detail View
  const [selectedDoc, setSelectedDoc] = useState<KMSDocument | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // Update Expired Document
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateReason, setUpdateReason] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newFileVersion, setNewFileVersion] = useState('');

  // Stats
  const [stats, setStats] = useState({
    created: 0,
    shared: 0,
    commented: 0,
    expired: 0,
    favorite: 0,
    following: 0,
    recentView: 0,
    downloads: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [created, shared, commented, expired, fav, following, views, dls, cats, sps, statistics] = await Promise.all([
      KMSService.getMyCreatedDocuments(currentUser.id),
      KMSService.getSharedWithMe(currentUser.id),
      KMSService.getMyCommentedDocuments(currentUser.id),
      KMSService.getMyExpiredDocuments(currentUser.id),
      KMSService.getMyFavorites(currentUser.id),
      KMSService.getMyFollowing(currentUser.id),
      KMSService.getMyRecentViews(currentUser.id),
      KMSService.getMyDownloads(currentUser.id),
      KMSService.getCategories(),
      KMSService.getSpaces(),
      KMSService.getMyDocumentsStats(currentUser.id)
    ]);

    setMyCreatedDocs(created);
    setSharedDocs(shared);
    setCommentedDocs(commented);
    setMyExpiredDocs(expired);
    setFavoriteDocs(fav);
    setFollowingDocs(following);
    setRecentViews(views);
    setDownloads(dls);
    setCategories(cats);
    setSpaces(sps);
    setStats(statistics);
  };

  const handleToggleFavorite = async (docId: string) => {
    const isFav = favoriteDocs.some(d => d.id === docId);
    if (isFav) {
      await KMSService.unfavoriteDocument(docId, currentUser.id);
    } else {
      await KMSService.favoriteDocument(docId, currentUser.id);
    }
    loadData();
  };

  const handleToggleFollow = async (docId: string) => {
    const isFollow = followingDocs.some(d => d.id === docId);
    if (isFollow) {
      await KMSService.unfollowDocument(docId, currentUser.id);
    } else {
      await KMSService.followDocument(docId, currentUser.id);
    }
    loadData();
  };

  const handleDeleteDocument = async (docId: string) => {
    if (confirm('Bạn có chắc muốn xóa tài liệu này?')) {
      await KMSService.deleteDocument(docId);
      loadData();
    }
  };

  const getSpaceName = (id: string) => spaces.find(s => s.id === id)?.name || id;
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  const isExpiringSoon = (doc: KMSDocument): boolean => {
    if (!doc.expiryDate) return false;
    const expiryTime = new Date(doc.expiryDate).getTime();
    const now = new Date().getTime();
    const daysUntilExpiry = (expiryTime - now) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30; // Sắp hết hạn trong 30 ngày
  };

  const isExpired = (doc: KMSDocument): boolean => {
    if (!doc.expiryDate) return false;
    return new Date(doc.expiryDate).getTime() < new Date().getTime();
  };

  const getDaysUntilExpiry = (doc: KMSDocument): number => {
    if (!doc.expiryDate) return 999;
    const expiryTime = new Date(doc.expiryDate).getTime();
    const now = new Date().getTime();
    return Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
  };

  const handleUpdateExpiredDocument = async () => {
    if (!selectedDoc || !newExpiryDate || !updateReason.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    await KMSService.updateExpiredDocument(selectedDoc.id, {
      newExpiryDate,
      reason: updateReason,
      newVersion: newFileVersion || undefined
    });
    alert('Đã cập nhật tài liệu! Tài liệu sẽ đi vào quy trình phê duyệt lại từ đầu.');
    setUpdateModalOpen(false);
    setUpdateReason('');
    setNewExpiryDate('');
    setNewFileVersion('');
    loadData();
  };

  // Get docs based on active tab
  const getTabDocs = (): KMSDocument[] => {
    switch(activeTab) {
      case 'uploaded': return myCreatedDocs;
      case 'shared': return sharedDocs;
      case 'commented': return commentedDocs;
      case 'expired': return myExpiredDocs;
      default: return myCreatedDocs;
    }
  };

  const filteredDocs = getTabDocs().filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSpace = filterSpace ? doc.spaceId === filterSpace : true;
    const matchCategory = filterCategory ? doc.categoryId === filterCategory : true;
    return matchSearch && matchSpace && matchCategory;
  });

  const getStatusBadge = (doc: KMSDocument) => {
    if (isExpired(doc)) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">Hết hạn</span>;
    }
    if (isExpiringSoon(doc)) {
      const days = getDaysUntilExpiry(doc);
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded font-medium">Sắp hết hạn ({days} ngày)</span>;
    }
    const status = doc.lifecycleStatus || 'Active';
    switch(status) {
      case 'Active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Hoạt động</span>;
      case 'PendingLevel1':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Chờ duyệt C1</span>;
      case 'ApprovedLevel1':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Chờ duyệt C2</span>;
      case 'Expired':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Hết hạn</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{status}</span>;
    }
  };

  const isFavorite = (docId: string) => favoriteDocs.some(d => d.id === docId);
  const isFollowing = (docId: string) => followingDocs.some(d => d.id === docId);

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">TÀI LIỆU CỦA TÔI</h1>
        <p className="text-sm text-gray-500">
          Quản lý tài liệu đã tạo, chia sẻ, và tài liệu đã góp ý
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`px-6 py-3 font-medium text-sm border-b-4 transition-all ${
              activeTab === 'uploaded'
                ? 'border-orange-600 text-orange-600 bg-orange-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tài liệu đã upload
              {stats.created > 0 && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.created}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`px-6 py-3 font-medium text-sm border-b-4 transition-all ${
              activeTab === 'shared'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Được chia sẻ với tôi
              {stats.shared > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.shared}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('commented')}
            className={`px-6 py-3 font-medium text-sm border-b-4 transition-all ${
              activeTab === 'commented'
                ? 'border-green-600 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Tài liệu đã góp ý
              {stats.commented > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.commented}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`px-6 py-3 font-medium text-sm border-b-4 transition-all ${
              activeTab === 'expired'
                ? 'border-red-600 text-red-600 bg-red-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tài liệu hết hạn của tôi
              {stats.expired > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.expired}
                </span>
              )}
            </div>
          </button>
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

      {/* Documents Table */}
      <div className="border border-gray-200 rounded mb-6">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 uppercase">Tài liệu</h2>
        </div>
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
                Không gian
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Danh mục
              </th>
              {activeTab === 'expired' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'expired' ? 7 : 6} className="px-4 py-12 text-center text-gray-500">
                  Không có tài liệu nào
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
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getSpaceName(doc.spaceId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getCategoryName(doc.categoryId)}
                  </td>
                  {activeTab === 'expired' && (
                    <td className="px-4 py-3">
                      {getStatusBadge(doc)}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleFavorite(doc.id)}
                        className={`p-1 hover:bg-gray-100 rounded ${
                          isFavorite(doc.id) ? 'text-pink-600' : 'text-gray-400'
                        }`}
                        title="Yêu thích"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(doc.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleToggleFollow(doc.id)}
                        className={`p-1 hover:bg-gray-100 rounded ${
                          isFollowing(doc.id) ? 'text-purple-600' : 'text-gray-400'
                        }`}
                        title="Theo dõi"
                      >
                        <Bell className={`w-4 h-4 ${isFollowing(doc.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setDetailOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        title="Xem"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {activeTab === 'expired' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setUpdateModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-orange-600"
                            title="Cập nhật & Gửi duyệt lại"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        myCreatedDocs.some(d => d.id === doc.id) && (
                          <>
                            {(isExpiringSoon(doc) || isExpired(doc)) && (
                              <button
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setUpdateModalOpen(true);
                                }}
                                className="p-1 hover:bg-gray-100 rounded text-orange-600"
                                title="Cập nhật tài liệu"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-1 hover:bg-gray-100 rounded text-green-600"
                              title="Sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1 hover:bg-gray-100 rounded text-red-600"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )
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
                <label className="text-xs text-gray-500 uppercase font-medium">Không gian</label>
                <p className="text-sm text-gray-900 mt-1">{getSpaceName(selectedDoc.spaceId)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Danh mục</label>
                <p className="text-sm text-gray-900 mt-1">{getCategoryName(selectedDoc.categoryId)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Trạng thái</label>
                <div className="mt-1">{getStatusBadge(selectedDoc.lifecycleStatus || 'Active')}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Ngày tạo</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(selectedDoc.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Expired Document Modal */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setUpdateReason('');
          setNewExpiryDate('');
          setNewFileVersion('');
        }}
        title="Cập nhật tài liệu hết hạn"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setUpdateModalOpen(false)}>Hủy</Button>
            <Button onClick={handleUpdateExpiredDocument}>
              <Send className="w-4 h-4 mr-2" />
              Cập nhật & Gửi phê duyệt
            </Button>
          </div>
        }
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-medium text-red-900">{selectedDoc.title}</p>
              <p className="text-xs text-red-700 mt-1">
                Ngày hết hạn cũ: {selectedDoc.expiryDate ? new Date(selectedDoc.expiryDate).toLocaleDateString('vi-VN') : 'Không có'}
                {isExpired(selectedDoc) && ' ⚠️ Đã hết hạn'}
                {isExpiringSoon(selectedDoc) && ` ⚠️ Còn ${getDaysUntilExpiry(selectedDoc)} ngày`}
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-900">
                ℹ️ Tài liệu này sẽ được cập nhật và đi vào <strong>quy trình phê duyệt lại từ đầu</strong> (Cấp 1 → Cấp 2 → Cấp 3)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày hết hạn mới <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phiên bản mới (tùy chọn)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={newFileVersion}
                onChange={(e) => setNewFileVersion(e.target.value)}
                placeholder="VD: 2.0, 2024.1, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung cập nhật <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                rows={4}
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="Mô tả những thay đổi/cập nhật trong phiên bản mới này..."
              />
            </div>

            <div className="text-xs text-gray-500 border-t pt-3">
              <p><strong>Quy trình sau khi cập nhật:</strong></p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Tài liệu chuyển về trạng thái "Chờ duyệt Cấp 1"</li>
                <li>Đi qua quy trình phê duyệt 3 cấp</li>
                <li>Sau khi được phê duyệt đầy đủ, tài liệu sẽ có hiệu lực với ngày hết hạn mới</li>
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
