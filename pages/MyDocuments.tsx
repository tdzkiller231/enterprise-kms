import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument, Category, Space, User, ViewHistory, DownloadHistory } from '../types';
import { Button, Modal } from '../components/UI';
import { 
  FileText, Heart, Eye, Download, Star, Bell, Clock, Share2,
  Edit, Trash2, Send, Search, Calendar
} from 'lucide-react';

type DocType = 'created' | 'shared' | 'favorite' | 'following';

export const MyDocuments: React.FC = () => {
  const [currentUser] = useState<User>({ 
    id: 'u1', 
    name: 'Nguyễn Văn A (Admin)', 
    role: 'Admin', 
    avatar: 'https://picsum.photos/32/32?random=1' 
  });

  // Filters (no tabs)
  const [docType, setDocType] = useState<DocType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpace, setFilterSpace] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Data - Documents
  const [myCreatedDocs, setMyCreatedDocs] = useState<KMSDocument[]>([]);
  const [sharedDocs, setSharedDocs] = useState<KMSDocument[]>([]);
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

  // Stats
  const [stats, setStats] = useState({
    created: 0,
    shared: 0,
    favorite: 0,
    following: 0,
    recentView: 0,
    downloads: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [created, shared, fav, following, views, dls, cats, sps, statistics] = await Promise.all([
      KMSService.getMyCreatedDocuments(currentUser.id),
      KMSService.getSharedWithMe(currentUser.id),
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

  // Combine all docs based on filter
  const getAllDocs = (): KMSDocument[] => {
    switch(docType) {
      case 'created': return myCreatedDocs;
      case 'shared': return sharedDocs;
      case 'favorite': return favoriteDocs;
      case 'following': return followingDocs;
      default: return [...myCreatedDocs, ...sharedDocs, ...favoriteDocs, ...followingDocs];
    }
  };

  const filteredDocs = getAllDocs().filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSpace = filterSpace ? doc.spaceId === filterSpace : true;
    const matchCategory = filterCategory ? doc.categoryId === filterCategory : true;
    return matchSearch && matchSpace && matchCategory;
  });

  const getStatusBadge = (status: string) => {
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
          Quản lý tài liệu đã tạo, chia sẻ, yêu thích và theo dõi
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-orange-50 border border-orange-200 rounded px-4 py-2">
          <p className="text-xs text-orange-600 font-medium">ĐÃ TẠO</p>
          <p className="text-2xl font-bold text-orange-800">{stats.created}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2">
          <p className="text-xs text-blue-600 font-medium">ĐƯỢC CHIA SẺ</p>
          <p className="text-2xl font-bold text-blue-800">{stats.shared}</p>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded px-4 py-2">
          <p className="text-xs text-pink-600 font-medium">YÊU THÍCH</p>
          <p className="text-2xl font-bold text-pink-800">{stats.favorite}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded px-4 py-2">
          <p className="text-xs text-purple-600 font-medium">THEO DÕI</p>
          <p className="text-2xl font-bold text-purple-800">{stats.following}</p>
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
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocType | '')}
        >
          <option value="">Tất cả loại</option>
          <option value="created">Đã tạo</option>
          <option value="shared">Được chia sẻ</option>
          <option value="favorite">Yêu thích</option>
          <option value="following">Theo dõi</option>
        </select>

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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
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
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
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
                  <td className="px-4 py-3">
                    {getStatusBadge(doc.lifecycleStatus || 'Active')}
                  </td>
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
                      {myCreatedDocs.some(d => d.id === doc.id) && (
                        <>
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
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* History Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Views */}
        <div className="border border-gray-200 rounded">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Xem gần đây ({stats.recentView})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentViews.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Chưa có lịch sử xem
              </div>
            ) : (
              recentViews.map((view, idx) => (
                <div key={idx} className="p-3 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{view.documentTitle}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(view.viewedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Downloads */}
        <div className="border border-gray-200 rounded">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
              <Download className="w-4 h-4" />
              Tải xuống ({stats.downloads})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {downloads.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Chưa có lịch sử tải
              </div>
            ) : (
              downloads.map((dl, idx) => (
                <div key={idx} className="p-3 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-2">
                    <Download className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{dl.documentTitle}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(dl.downloadedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
    </div>
  );
};
