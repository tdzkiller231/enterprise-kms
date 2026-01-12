import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument, Space, Category, User } from '../types';
import { Button, Modal } from '../components/UI';
import { 
  Check, X, Eye, FileText, Search, AlertCircle, Database, ChevronRight
} from 'lucide-react';

type ApprovalLevel = 1 | 2 | 3;
type SubTabType = 'pending' | 'approved' | 'rejected';
type DocumentType = 'Tài liệu đào tạo' | 'Tài liệu công ty';

export const Approvals: React.FC = () => {
  const [currentUser] = useState<User>({ 
    id: 'u1', 
    name: 'Nguyễn Văn A (Admin)', 
    role: 'Admin', 
    avatar: 'https://picsum.photos/32/32?random=1' 
  });

  // Tab state
  const [documentType, setDocumentType] = useState<DocumentType>('Tài liệu đào tạo');
  const [activeLevel, setActiveLevel] = useState<ApprovalLevel>(1);
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('pending');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Data
  const [level1PendingDocs, setLevel1PendingDocs] = useState<KMSDocument[]>([]);
  const [level1ApprovedDocs, setLevel1ApprovedDocs] = useState<KMSDocument[]>([]);
  const [level1RejectedDocs, setLevel1RejectedDocs] = useState<KMSDocument[]>([]);
  
  const [level2PendingDocs, setLevel2PendingDocs] = useState<KMSDocument[]>([]);
  const [level2ApprovedDocs, setLevel2ApprovedDocs] = useState<KMSDocument[]>([]);
  const [level2RejectedDocs, setLevel2RejectedDocs] = useState<KMSDocument[]>([]);
  
  const [level3PendingDocs, setLevel3PendingDocs] = useState<KMSDocument[]>([]);
  const [level3ApprovedDocs, setLevel3ApprovedDocs] = useState<KMSDocument[]>([]);
  const [level3RejectedDocs, setLevel3RejectedDocs] = useState<KMSDocument[]>([]);
  
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Detail Panel
  const [selectedDoc, setSelectedDoc] = useState<KMSDocument | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectAttachments, setRejectAttachments] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats
  const [stats, setStats] = useState({ 
    level1Pending: 0, 
    level1Approved: 0,
    level1Rejected: 0,
    level2Pending: 0, 
    level2Approved: 0,
    level2Rejected: 0,
    level3Pending: 0,
    level3Approved: 0,
    level3Rejected: 0
  });

  useEffect(() => {
    loadData();
  }, [documentType]);

  const loadData = async () => {
    const [allDocs, sps, cats] = await Promise.all([
      KMSService.getDocuments({}),
      KMSService.getSpaces(),
      KMSService.getCategories()
    ]);
    
    // Filter by document type
    const filteredByType = allDocs.filter(d => {
      const docType = (d as any).documentType || 'Tài liệu đào tạo';
      return docType === documentType;
    });
    
    // Level 1 - Chuyên gia danh mục
    const l1Pending = filteredByType.filter(d => d.lifecycleStatus === 'PendingLevel1');
    const l1Approved = filteredByType.filter(d => d.lifecycleStatus === 'ApprovedLevel1' || d.lifecycleStatus === 'PendingLevel2');
    const l1Rejected = filteredByType.filter(d => d.lifecycleStatus === 'RejectedLevel1');
    
    // Level 2 - Quản lý phòng ban  
    const l2Pending = filteredByType.filter(d => d.lifecycleStatus === 'PendingLevel2');
    const l2Approved = filteredByType.filter(d => d.lifecycleStatus === 'ApprovedLevel2' || d.lifecycleStatus === 'PendingLevel3');
    const l2Rejected = filteredByType.filter(d => d.lifecycleStatus === 'RejectedLevel2');
    
    // Level 3 - Giám đốc/Admin
    const l3Pending = filteredByType.filter(d => d.lifecycleStatus === 'PendingLevel3');
    const l3Approved = filteredByType.filter(d => d.lifecycleStatus === 'ApprovedLevel3' || d.lifecycleStatus === 'Active');
    const l3Rejected = filteredByType.filter(d => d.lifecycleStatus === 'RejectedLevel3');
    
    setLevel1PendingDocs(l1Pending);
    setLevel1ApprovedDocs(l1Approved);
    setLevel1RejectedDocs(l1Rejected);
    
    setLevel2PendingDocs(l2Pending);
    setLevel2ApprovedDocs(l2Approved);
    setLevel2RejectedDocs(l2Rejected);
    
    setLevel3PendingDocs(l3Pending);
    setLevel3ApprovedDocs(l3Approved);
    setLevel3RejectedDocs(l3Rejected);
    
    setSpaces(sps);
    setCategories(cats);
    setStats({ 
      level1Pending: l1Pending.length,
      level1Approved: l1Approved.length,
      level1Rejected: l1Rejected.length,
      level2Pending: l2Pending.length,
      level2Approved: l2Approved.length,
      level2Rejected: l2Rejected.length,
      level3Pending: l3Pending.length,
      level3Approved: l3Approved.length,
      level3Rejected: l3Rejected.length
    });
  };

  // Approve handlers
  const handleApproveLevel1 = async () => {
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
      const docType = (selectedDoc as any).documentType || 'Tài liệu đào tạo';
      await KMSService.approveLevel1(selectedDoc.id);
      if (docType === 'Tài liệu công ty') {
        alert('Đã phê duyệt cấp 1!\nTài liệu công ty chuyển thẳng sang chờ phê duyệt Giám đốc (cấp 2).');
      } else {
        alert('Đã phê duyệt cấp 1!\nTài liệu chuyển sang chờ phê duyệt Chuyên gia (cấp 2).');
      }
      setDetailOpen(false);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveLevel2 = async () => {
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
      const docType = (selectedDoc as any).documentType || 'Tài liệu đào tạo';
      await KMSService.approveLevel2(selectedDoc.id);
      if (docType === 'Tài liệu công ty') {
        alert('Đã phê duyệt cấp 2 (Giám đốc)!\nTài liệu đã được đưa vào Kho Tri Thức chính thức.');
      } else {
        alert('Đã phê duyệt cấp 2 (Chuyên gia)!\nTài liệu chuyển sang chờ phê duyệt Giám đốc (cấp 3).');
      }
      setDetailOpen(false);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveLevel3 = async () => {
    if (!selectedDoc) return;
    setIsProcessing(true);
    try {
      await KMSService.approveLevel3(selectedDoc.id);
      alert('Đã phê duyệt cấp 3!\nTài liệu đã được đưa vào Kho Tri Thức chính thức.');
      setDetailOpen(false);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject handlers
  const handleRejectLevel1 = async () => {
    if (!selectedDoc || !rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    setIsProcessing(true);
    try {
      await KMSService.rejectLevel1(selectedDoc.id, rejectReason, rejectAttachments);
      alert('Đã từ chối tài liệu ở cấp 1. Người gửi sẽ nhận được thông báo.');
      setRejectModalOpen(false);
      setDetailOpen(false);
      setRejectReason('');
      setRejectAttachments([]);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLevel2 = async () => {
    if (!selectedDoc || !rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    setIsProcessing(true);
    try {
      await KMSService.rejectLevel2(selectedDoc.id, rejectReason, rejectAttachments);
      alert('Đã từ chối tài liệu ở cấp 2. Tài liệu quay lại cấp 1.');
      setRejectModalOpen(false);
      setDetailOpen(false);
      setRejectReason('');
      setRejectAttachments([]);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLevel3 = async () => {
    if (!selectedDoc || !rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    setIsProcessing(true);
    try {
      await KMSService.rejectLevel3(selectedDoc.id, rejectReason, rejectAttachments);
      alert('Đã từ chối tài liệu ở cấp 3. Tài liệu quay lại cấp 2.');
      setRejectModalOpen(false);
      setDetailOpen(false);
      setRejectReason('');
      setRejectAttachments([]);
      loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  // Get current documents based on active level and sub-tab
  const getCurrentDocs = () => {
    if (activeLevel === 1) {
      return activeSubTab === 'pending' ? level1PendingDocs 
           : activeSubTab === 'approved' ? level1ApprovedDocs 
           : level1RejectedDocs;
    } else if (activeLevel === 2) {
      return activeSubTab === 'pending' ? level2PendingDocs 
           : activeSubTab === 'approved' ? level2ApprovedDocs 
           : level2RejectedDocs;
    } else {
      return activeSubTab === 'pending' ? level3PendingDocs 
           : activeSubTab === 'approved' ? level3ApprovedDocs 
           : level3RejectedDocs;
    }
  };
  
  const currentDocs = getCurrentDocs();
  
  const filteredDocs = currentDocs.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory ? doc.categoryIds?.includes(filterCategory) : true;
    return matchSearch && matchCategory;
  });

  const getLevelColor = (level: ApprovalLevel) => {
    if (level === 1) return 'blue';
    if (level === 2) return 'purple';
    return 'orange';
  };

  const getLevelInfo = (level: ApprovalLevel) => {
    if (documentType === 'Tài liệu công ty') {
      // Tài liệu công ty: 2 cấp (Quản lý -> Giám đốc)
      if (level === 1) return { title: 'Cấp 1: Quản lý Phòng ban', role: 'Quản lý phòng ban' };
      if (level === 2) return { title: 'Cấp 2: Giám đốc/Admin', role: 'Giám đốc/Admin' };
      return { title: 'Cấp 3: Không áp dụng', role: 'N/A' };
    } else {
      // Tài liệu đào tạo: 3 cấp (Quản lý -> Chuyên gia -> Giám đốc)
      if (level === 1) return { title: 'Cấp 1: Quản lý Phòng ban', role: 'Quản lý phòng ban' };
      if (level === 2) return { title: 'Cấp 2: Chuyên gia Danh mục', role: 'Chuyên gia danh mục' };
      return { title: 'Cấp 3: Giám đốc/Admin', role: 'Giám đốc/Admin' };
    }
  };

  const color = getLevelColor(activeLevel);
  const levelInfo = getLevelInfo(activeLevel);

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">PHÊ DUYỆT TÀI LIỆU KHO TRI THỨC</h1>
        <p className="text-sm text-gray-500">
          {documentType === 'Tài liệu đào tạo' 
            ? 'Quy trình phê duyệt 3 cấp: Quản lý Phòng ban → Chuyên gia Danh mục → Giám đốc/Admin'
            : 'Quy trình phê duyệt 2 cấp: Quản lý Phòng ban → Giám đốc/Admin'}
        </p>
      </div>

      {/* Document Type Tabs */}
      <div className="mb-6 border-b-2 border-gray-200">
        <div className="flex gap-1">
          <button
            onClick={() => { setDocumentType('Tài liệu đào tạo'); setActiveLevel(1); setActiveSubTab('pending'); }}
            className={`px-6 py-3 font-medium text-sm border-b-4 transition-all ${
              documentType === 'Tài liệu đào tạo'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            📚 Phê duyệt tài liệu đào tạo
          </button>
          <button
            onClick={() => { setDocumentType('Tài liệu công ty'); setActiveLevel(1); setActiveSubTab('pending'); }}
            className={`px-6 py-3 font-medium text-sm border-b-4 transition-all ${
              documentType === 'Tài liệu công ty'
                ? 'border-green-600 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏢 Phê duyệt tài liệu công ty
          </button>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => { setActiveLevel(1); setActiveSubTab('pending'); }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeLevel === 1
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              1
            </div>
            Cấp 1: Quản lý
            {(stats.level1Pending + stats.level1Approved) > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {stats.level1Pending + stats.level1Approved}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveLevel(2); setActiveSubTab('pending'); }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeLevel === 2
                ? (documentType === 'Tài liệu công ty' ? 'border-orange-500 text-orange-600' : 'border-purple-500 text-purple-600')
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className={`w-6 h-6 rounded-full ${
              documentType === 'Tài liệu công ty' 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-purple-100 text-purple-700'
            } flex items-center justify-center text-xs font-bold`}>
              2
            </div>
            {documentType === 'Tài liệu công ty' ? 'Cấp 2: Giám đốc' : 'Cấp 2: Chuyên gia'}
            {(stats.level2Pending + stats.level2Approved) > 0 && (
              <span className={`${
                documentType === 'Tài liệu công ty' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-purple-100 text-purple-800'
              } text-xs px-2 py-0.5 rounded-full`}>
                {stats.level2Pending + stats.level2Approved}
              </span>
            )}
          </button>
          {documentType === 'Tài liệu đào tạo' && (
            <button
              onClick={() => { setActiveLevel(3); setActiveSubTab('pending'); }}
              className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeLevel === 3
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                3
              </div>
              Cấp 3: Giám đốc
              {(stats.level3Pending + stats.level3Approved) > 0 && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                  {stats.level3Pending + stats.level3Approved}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="mb-4 flex gap-3 bg-gray-50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveSubTab('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSubTab === 'pending'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Chờ duyệt
          {activeLevel === 1 && stats.level1Pending > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level1Pending}
            </span>
          )}
          {activeLevel === 2 && stats.level2Pending > 0 && (
            <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level2Pending}
            </span>
          )}
          {activeLevel === 3 && stats.level3Pending > 0 && (
            <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level3Pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('approved')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSubTab === 'approved'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Đã duyệt
          {activeLevel === 1 && stats.level1Approved > 0 && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level1Approved}
            </span>
          )}
          {activeLevel === 2 && stats.level2Approved > 0 && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level2Approved}
            </span>
          )}
          {activeLevel === 3 && stats.level3Approved > 0 && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level3Approved}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('rejected')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSubTab === 'rejected'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bị từ chối
          {activeLevel === 1 && stats.level1Rejected > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level1Rejected}
            </span>
          )}
          {activeLevel === 2 && stats.level2Rejected > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level2Rejected}
            </span>
          )}
          {activeLevel === 3 && stats.level3Rejected > 0 && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
              {stats.level3Rejected}
            </span>
          )}
        </button>
      </div>

      {/* Info Banner */}
      <div className={`mb-4 p-4 rounded border bg-${color}-50 border-${color}-200`}>
        <div className="flex gap-3">
          <AlertCircle className={`w-5 h-5 flex-shrink-0 text-${color}-600`} />
          <div className={`text-sm text-${color}-900`}>
            {activeSubTab === 'pending' ? (
              <>
                <p className="font-medium mb-1">{levelInfo.title}</p>
                <p className="text-xs">
                  • <strong>Vai trò:</strong> {levelInfo.role} phê duyệt tài liệu<br />
                  • <strong>Sau khi duyệt:</strong> Tài liệu chuyển sang cấp phê duyệt tiếp theo<br />
                  {documentType === 'Tài liệu đào tạo' && activeLevel === 3 && '• Đây là cấp phê duyệt cuối cùng trước khi tài liệu vào kho tri thức chính thức'}
                  {documentType === 'Tài liệu công ty' && activeLevel === 2 && '• Đây là cấp phê duyệt cuối cùng trước khi tài liệu vào kho tri thức chính thức'}
                </p>
              </>
            ) : activeSubTab === 'approved' ? (
              <>
                <p className="font-medium mb-1">Tài liệu đã phê duyệt {levelInfo.title}</p>
                <p className="text-xs">
                  • Danh sách các tài liệu đã được phê duyệt ở cấp {activeLevel}<br />
                  {documentType === 'Tài liệu đào tạo' && activeLevel < 3 && '• Tài liệu sẽ chuyển sang cấp phê duyệt tiếp theo'}
                  {documentType === 'Tài liệu công ty' && activeLevel < 2 && '• Tài liệu sẽ chuyển sang cấp phê duyệt tiếp theo'}
                  {((documentType === 'Tài liệu đào tạo' && activeLevel === 3) || (documentType === 'Tài liệu công ty' && activeLevel === 2)) && '• Tài liệu đã vào kho tri thức chính thức, toàn tổ chức có thể truy cập'}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">Tài liệu bị từ chối ở {levelInfo.title}</p>
                <p className="text-xs">
                  • Tài liệu không đạt yêu cầu phê duyệt ở cấp {activeLevel}<br />
                  • Người gửi cần chỉnh sửa và gửi lại để xem xét
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Process Flow Indicator */}
      <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-xs font-medium text-gray-600 mb-3">
          {documentType === 'Tài liệu đào tạo' ? 'QUY TRÌNH PHÊ DUYỆT 3 CẤP' : 'QUY TRÌNH PHÊ DUYỆT 2 CẤP'}
        </p>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded ${
            activeLevel === 1 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-300'
          }`}>
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <span className="text-xs font-medium">Quản lý</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {documentType === 'Tài liệu đào tạo' ? (
            <>
              <div className={`flex items-center gap-2 px-3 py-2 rounded ${
                activeLevel === 2 ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white border border-gray-300'
              }`}>
                <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-xs font-medium">Chuyên gia</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className={`flex items-center gap-2 px-3 py-2 rounded ${
                activeLevel === 3 ? 'bg-orange-100 border-2 border-orange-500' : 'bg-white border border-gray-300'
              }`}>
                <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-xs font-medium">Giám đốc</span>
              </div>
            </>
          ) : (
            <div className={`flex items-center gap-2 px-3 py-2 rounded ${
              activeLevel === 2 ? 'bg-orange-100 border-2 border-orange-500' : 'bg-white border border-gray-300'
            }`}>
              <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-xs font-medium">Giám đốc</span>
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-green-50 border border-green-300">
            <Database className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Kho Tri Thức</span>
          </div>
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
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                TÊN TÀI LIỆU
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NGƯỜI GỬI
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NGÀY GỬI
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                TRẠNG THÁI
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  {activeSubTab === 'pending' 
                    ? `Không có tài liệu chờ phê duyệt cấp ${activeLevel}`
                    : activeSubTab === 'approved'
                    ? `Chưa có tài liệu nào được phê duyệt ở cấp ${activeLevel}`
                    : `Chưa có tài liệu nào bị từ chối ở cấp ${activeLevel}`
                  }
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={doc.createdBy.avatar} 
                        alt="" 
                        className="w-6 h-6 rounded-full" 
                      />
                      <span className="text-sm text-gray-700">{doc.createdBy.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getCategoryName(doc.categoryIds?.[0] || '')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    {activeSubTab === 'pending' && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
                        Chờ cấp {activeLevel}
                      </span>
                    )}
                    {activeSubTab === 'approved' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã duyệt
                      </span>
                    )}
                    {activeSubTab === 'rejected' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Bị từ chối
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {activeSubTab === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setDetailOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-blue-600"
                            title="Xem chi tiết & Phê duyệt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDoc(doc);
                              setRejectModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                            title="Từ chối"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setDetailOpen(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded text-blue-600"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
          activeSubTab === 'pending' ? (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>Đóng</Button>
              <Button 
                variant="danger" 
                onClick={() => { setDetailOpen(false); setRejectModalOpen(true); }}
              >
                <X className="w-4 h-4 mr-2" />
                Từ chối
              </Button>
              <Button 
                onClick={
                  activeLevel === 1 ? handleApproveLevel1 
                  : activeLevel === 2 ? handleApproveLevel2 
                  : handleApproveLevel3
                }
                disabled={isProcessing}
              >
                <Check className="w-4 h-4 mr-2" />
                Phê duyệt Cấp {activeLevel}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>Đóng</Button>
            </div>
          )
        }
      >
        {selectedDoc && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase font-medium">Tên tài liệu</label>
              <p className="text-sm font-medium text-gray-900 mt-1">{selectedDoc.title}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-medium">Loại tài liệu</label>
              <p className="text-sm text-gray-900 mt-1">
                {((selectedDoc as any).documentType || 'Tài liệu đào tạo') === 'Tài liệu đào tạo' ? '📚 Tài liệu đào tạo' : '🏢 Tài liệu công ty'}
                {((selectedDoc as any).documentType || 'Tài liệu đào tạo') === 'Tài liệu công ty' && (
                  <span className="ml-2 text-xs text-orange-600 font-medium">(Phê duyệt 2 cấp)</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase font-medium">Tóm tắt</label>
              <p className="text-sm text-gray-700 mt-1">{selectedDoc.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Danh mục</label>
                <p className="text-sm text-gray-900 mt-1">{getCategoryName(selectedDoc.categoryIds?.[0] || '')}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Loại file</label>
                <p className="text-sm text-gray-900 mt-1 uppercase">{selectedDoc.fileType}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Người gửi</label>
                <p className="text-sm text-gray-900 mt-1">{selectedDoc.createdBy.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium">Ngày gửi</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(selectedDoc.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Approval History */}
            <div className="border-t pt-4">
              <label className="text-xs text-gray-500 uppercase font-medium mb-3 block">Lịch sử phê duyệt</label>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">
                      Cấp 1: Quản lý Phòng ban - {selectedDoc.approverLevel1Name || 'Chưa duyệt'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedDoc.approverLevel1Date ? new Date(selectedDoc.approverLevel1Date).toLocaleString('vi-VN') : 'Chờ phê duyệt'}
                    </p>
                  </div>
                  {selectedDoc.approverLevel1Date && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
                
                {((selectedDoc as any).documentType || 'Tài liệu đào tạo') === 'Tài liệu đào tạo' ? (
                  <>
                    <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">
                          Cấp 2: Chuyên gia Danh mục - {selectedDoc.approverLevel2Name || 'Chưa duyệt'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {selectedDoc.approverLevel2Date ? new Date(selectedDoc.approverLevel2Date).toLocaleString('vi-VN') : 'Chờ phê duyệt'}
                        </p>
                      </div>
                      {selectedDoc.approverLevel2Date && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">
                          Cấp 3: Giám đốc/Admin - {selectedDoc.approverLevel3Name || 'Chưa duyệt'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {selectedDoc.approverLevel3Date ? new Date(selectedDoc.approverLevel3Date).toLocaleString('vi-VN') : 'Chờ phê duyệt'}
                        </p>
                      </div>
                      {selectedDoc.approverLevel3Date && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">
                        Cấp 2: Giám đốc/Admin - {selectedDoc.approverLevel2Name || 'Chưa duyệt'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedDoc.approverLevel2Date ? new Date(selectedDoc.approverLevel2Date).toLocaleString('vi-VN') : 'Chờ phê duyệt'}
                      </p>
                    </div>
                    {selectedDoc.approverLevel2Date && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {activeSubTab === 'rejected' && (
              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 uppercase font-medium mb-2 block">Lý do từ chối</label>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-900">
                    {activeLevel === 1 ? selectedDoc.rejectReason 
                     : activeLevel === 2 ? selectedDoc.rejectReasonLevel2 
                     : selectedDoc.rejectReasonLevel3}
                  </p>
                  <p className="text-xs text-red-700 mt-2">
                    Từ chối bởi: {activeLevel === 1 ? selectedDoc.rejectedBy 
                                   : activeLevel === 2 ? selectedDoc.rejectedByLevel2 
                                   : selectedDoc.rejectedByLevel3}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => { setRejectModalOpen(false); setRejectReason(''); setRejectAttachments([]);}}
        title={`Từ chối phê duyệt cấp ${activeLevel}`}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setRejectModalOpen(false); setRejectReason(''); setRejectAttachments([])}}>
              Hủy
            </Button>
            <Button 
              variant="danger"
              onClick={
                activeLevel === 1 ? handleRejectLevel1 
                : activeLevel === 2 ? handleRejectLevel2 
                : handleRejectLevel3
              }
              disabled={!rejectReason.trim() || isProcessing}
            >
              Xác nhận từ chối
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Vui lòng nhập lý do từ chối để người gửi có thể chỉnh sửa tài liệu.
          </p>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="VD: Tài liệu chưa đầy đủ thông tin phần 3, cần bổ sung thêm ví dụ minh họa..."
          />
          
          {/* File Attachments */}
          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Đính kèm file giải thích (nếu cần)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setRejectAttachments(prev => [...prev, ...files]);
                  e.target.value = ''; // Reset input
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
              />
              {rejectAttachments.length > 0 && (
                <div className="space-y-1">
                  {rejectAttachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 truncate">{file.name}</span>
                        <span className="text-gray-500 text-xs flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setRejectAttachments(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="ml-2 p-1 hover:bg-gray-200 rounded text-red-600 flex-shrink-0"
                        title="Xóa file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                💡 Bạn có thể đính kèm file hình ảnh, tài liệu để giải thích chi tiết hơn lý do từ chối
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
