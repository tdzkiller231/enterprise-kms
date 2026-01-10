
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KMSService } from '../services/kmsService';
import { KMSDocument, DocStatus, Comment, Category, Space } from '../types';
import { Button, StatusBadge, Card, Modal } from '../components/UI';
import { ArrowLeft, Clock, User, Download, Share2, MessageSquare, Sparkles, UploadCloud, History, Send, Edit, Star, CheckCircle, FileText } from 'lucide-react';

export const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<KMSDocument | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  const [activeTab, setActiveTab] = useState<'info' | 'versions' | 'comments'>('info');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  
  // Forms
  const [versionNote, setVersionNote] = useState('');
  const [commentText, setCommentText] = useState('');
  const [editForm, setEditForm] = useState({ title: '', description: '', categoryId: '', spaceId: '', tags: '' });
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    if (id) {
      loadDoc(id);
    }
    KMSService.getCategories().then(setCategories);
    KMSService.getSpaces().then(setSpaces);
  }, [id]);

  const loadDoc = (docId: string) => {
    KMSService.getDocumentById(docId).then(d => {
        setDoc(d);
        if (d) {
            setEditForm({
                title: d.title,
                description: d.description,
                categoryId: d.categoryId,
                spaceId: d.spaceId,
                tags: d.tags.join(', ')
            });
        }
    });
  };

  const handleAiSummarize = async () => {
    if (!doc) return;
    setLoadingAi(true);
    const summary = await KMSService.generateAISummary(doc.description);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleNewVersion = async () => {
    if (doc) {
      await KMSService.updateDocumentVersion(doc.id, null, versionNote);
      setIsVersionModalOpen(false);
      setVersionNote('');
      loadDoc(doc.id);
    }
  };

  const handleEditSubmit = async () => {
      if (doc) {
          await KMSService.updateDocument(doc.id, {
              title: editForm.title,
              description: editForm.description,
              categoryId: editForm.categoryId,
              spaceId: editForm.spaceId,
              tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t)
          });
          setIsEditModalOpen(false);
          loadDoc(doc.id);
      }
  };

  const handleSubmitRating = async () => {
      if (doc) {
          await KMSService.rateDocument(doc.id, ratingValue, ratingComment);
          setIsRatingModalOpen(false);
          alert("Đánh giá của bạn đã được ghi nhận!");
      }
  };

  if (!doc) return <div className="p-10">Không tìm thấy tài liệu</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
      </button>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-bold text-gray-900">{doc.title}</h1>
               <StatusBadge status={doc.status} />
            </div>
            <div className="flex space-x-2">
               {/* Admin/Reviewer Action */}
               <Button variant="secondary" onClick={() => setIsVersionModalOpen(true)}>
                 <UploadCloud className="w-4 h-4 mr-2" /> Cập nhật tài liệu
               </Button>
               {/* User Action */}
               <Button variant="secondary" onClick={() => setIsRatingModalOpen(true)}>
                 <Star className="w-4 h-4 mr-2 text-yellow-500" /> Đánh giá
               </Button>
               <Button variant="primary" onClick={() => alert("Downloading...")}>
                 <Download className="w-4 h-4 mr-2" /> Tải tài liệu
               </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t pt-4">
           <div>
               <span className="block text-gray-400 text-xs uppercase mb-1">Danh mục</span>
               <span className="font-medium">{categories.find(c => c.id === doc.categoryId)?.name || doc.categoryId}</span>
           </div>
           <div>
               <span className="block text-gray-400 text-xs uppercase mb-1">Phiên bản hiện tại</span>
               <span className="font-bold text-indigo-600">v{doc.versions[0].version}</span>
           </div>
           <div>
               <span className="block text-gray-400 text-xs uppercase mb-1">Người duyệt</span>
               <div className="flex items-center gap-1">
                   <CheckCircle className="w-3 h-3 text-green-500" />
                   <span>{doc.approverName || 'Chưa duyệt'}</span>
               </div>
           </div>
           <div>
               <span className="block text-gray-400 text-xs uppercase mb-1">Ngày phê duyệt</span>
               <span className="font-medium">{doc.approvalDate || '-'}</span>
           </div>
           <div>
               <span className="block text-gray-400 text-xs uppercase mb-1">Người tải lên</span>
               <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" /> {doc.createdBy.name}
               </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white shadow rounded-lg overflow-hidden min-h-[500px]">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`${activeTab === 'info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Nội dung chi tiết
                </button>
                <button
                  onClick={() => setActiveTab('versions')}
                  className={`${activeTab === 'versions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Phiên bản cũ
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`${activeTab === 'comments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Góp ý & Đánh giá
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Document Preview Disabled - Technical Constraint */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center">
                      <FileText className="w-16 h-16 text-blue-400 mb-3" />
                      <p className="text-blue-900 font-medium mb-2">Không hỗ trợ xem trước tài liệu</p>
                      <p className="text-sm text-blue-600 mb-4 text-center">Vui lòng tải tài liệu về máy để xem nội dung</p>
                      <Button variant="primary" onClick={() => alert("Downloading...")}>
                         <Download className="w-4 h-4 mr-2" /> Tải xuống tài liệu
                      </Button>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Mô tả nội dung</h3>
                    <p className="text-gray-900 leading-relaxed">{doc.description}</p>
                  </div>
                  
                  {/* AI Feature */}
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-indigo-900 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-indigo-600" /> Thông tin chi tiết AI
                      </h4>
                      {!aiSummary && (
                        <Button variant="ghost" size="sm" onClick={handleAiSummarize} isLoading={loadingAi} className="text-xs h-8">
                          Tóm tắt nội dung
                        </Button>
                      )}
                    </div>
                    {aiSummary ? (
                       <p className="text-sm text-indigo-800 animate-fade-in">{aiSummary}</p>
                    ) : (
                      <p className="text-xs text-indigo-400 italic">Tạo tóm tắt thông minh cho tài liệu này bằng KMS AI.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'versions' && (
                <ul className="divide-y divide-gray-200">
                  {doc.versions.map((v, idx) => (
                    <li key={idx} className="py-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-900 mr-2">Version {v.version}</span>
                          {idx === 0 && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Hiện tại</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Cập nhật bởi {v.updatedBy} vào lúc {v.updatedAt}</p>
                        <p className="text-sm text-gray-700 mt-2 italic">"{v.changeLog}"</p>
                      </div>
                      <div className="space-x-2">
                         <Button variant="ghost" size="sm" title="Tải xuống"><Download className="w-4 h-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-6">
                  {/* Comment List */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {doc.comments.length === 0 ? (
                      <div className="text-center py-6 text-gray-400">Chưa có bình luận nào.</div>
                    ) : (
                      doc.comments.map(c => (
                        <div key={c.id} className="flex space-x-3">
                           <img src={c.user.avatar} className="h-8 w-8 rounded-full" />
                           <div className="bg-gray-50 p-3 rounded-lg flex-1">
                              <div className="flex justify-between items-center mb-1">
                                 <span className="text-sm font-bold text-gray-900">{c.user.name}</span>
                                 <span className="text-xs text-gray-500">{c.createdAt}</span>
                              </div>
                              <p className="text-sm text-gray-700">{c.content}</p>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Comment Input */}
                  <div className="flex gap-2 items-start pt-4 border-t">
                    <img src="https://picsum.photos/32/32?random=99" className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                       <textarea 
                         className="w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                         rows={2} 
                         placeholder="Viết bình luận hoặc góp ý..."
                         value={commentText}
                         onChange={(e) => setCommentText(e.target.value)}
                       ></textarea>
                       <div className="mt-2 text-right">
                         <Button size="sm" disabled={!commentText}><Send className="w-3 h-3 mr-2" /> Gửi</Button>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card title="Thông tin bổ sung">
            <dl className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-sm text-gray-500">Không gian</dt>
                 <dd className="text-sm font-medium text-gray-900">{spaces.find(s => s.id === doc.spaceId)?.name || doc.spaceId}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-sm text-gray-500">Ngày hết hạn</dt>
                 <dd className="text-sm font-medium text-red-600">{doc.expiryDate}</dd>
              </div>
              <div className="flex justify-between">
                 <dt className="text-sm text-gray-500">Lượt xem / Tải</dt>
                 <dd className="text-sm font-medium text-gray-900">{doc.views} / {doc.downloads}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Thẻ (Tags)">
            <div className="flex flex-wrap gap-2">
              {doc.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  #{tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Chia sẻ tài liệu"
        footer={<Button onClick={() => setIsShareOpen(false)}>Gửi lời mời</Button>}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Chia sẻ <strong>{doc.title}</strong> với người dùng hoặc nhóm.</p>
          <div>
            <label className="text-xs text-gray-500 uppercase">Người nhận</label>
            <input type="text" placeholder="Nhập email, tên nhân viên hoặc tên nhóm" className="w-full mt-1 p-2 border rounded-md" />
          </div>
        </div>
      </Modal>

      {/* New Version Modal (Update Document) */}
      <Modal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        title="Cập nhật tài liệu (Upload phiên bản mới)"
        footer={<Button onClick={handleNewVersion}>Tải lên & Cập nhật</Button>}
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center items-center bg-gray-50">
             <div className="text-center">
               <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
               <p className="mt-2 text-sm text-gray-600">Chọn file mới để thay thế</p>
               <input type="file" className="mt-2" />
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả thay đổi (Change Log)</label>
            <textarea 
               className="mt-1 block w-full border rounded-md p-2" 
               rows={3} 
               placeholder="Ví dụ: Cập nhật theo yêu cầu kiểm toán..."
               value={versionNote}
               onChange={(e) => setVersionNote(e.target.value)}
            ></textarea>
          </div>
          <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            Lưu ý: Phiên bản mới sẽ cần được phê duyệt lại trước khi phát hành chính thức.
          </p>
        </div>
      </Modal>

      {/* Rating Modal */}
      <Modal
         isOpen={isRatingModalOpen}
         onClose={() => setIsRatingModalOpen(false)}
         title="Đánh giá tài liệu"
         footer={<Button onClick={handleSubmitRating}>Gửi đánh giá</Button>}
      >
         <div className="space-y-4 flex flex-col items-center">
             <p className="text-sm text-gray-600">Bạn đánh giá chất lượng tài liệu này thế nào?</p>
             <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                     <button key={star} onClick={() => setRatingValue(star)} className="focus:outline-none transition-transform hover:scale-110">
                         <Star className={`w-8 h-8 ${ratingValue >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                     </button>
                 ))}
             </div>
             <textarea 
                className="w-full border rounded-md p-2 text-sm mt-4" 
                rows={3} 
                placeholder="Nhận xét của bạn (tùy chọn)..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
             ></textarea>
         </div>
      </Modal>

      {/* Edit Metadata Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa thông tin tài liệu"
        footer={<Button onClick={handleEditSubmit}>Lưu thay đổi</Button>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
            <input 
              type="text" 
              className="mt-1 block w-full border rounded-md p-2" 
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea 
              className="mt-1 block w-full border rounded-md p-2" 
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            ></textarea>
          </div>
        </div>
      </Modal>

    </div>
  );
};
