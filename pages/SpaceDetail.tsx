

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KMSService } from '../services/kmsService';
import { Space, KMSDocument, Comment, KnowledgeTopic, DocStatus, Category } from '../types';
import { Button, StatusBadge, Card, Modal } from '../components/UI';
import { DocumentThread } from '../components/DocumentThread';
import { DocumentFormModal } from '../components/DocumentModals';
import { 
  ArrowLeft, Users, FileText, MessageSquare, BookOpen, Settings, 
  Plus, Search, Folder, Send, UploadCloud, Trash2, Lock, Globe, Archive, AlertTriangle
} from 'lucide-react';

export const SpaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [space, setSpace] = useState<Space | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'docs' | 'members'>('docs');
  
  // Data for tabs
  const [docs, setDocs] = useState<KMSDocument[]>([]);
  const [topics, setTopics] = useState<KnowledgeTopic[]>([]);
  const [discussions, setDiscussions] = useState<Comment[]>([]);
  
  // Filters
  const [docFilter, setDocFilter] = useState('');

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  // Document Thread
  const [selectedDocForThread, setSelectedDocForThread] = useState<KMSDocument | null>(null);
  const [threadOpen, setThreadOpen] = useState(false);

  useEffect(() => {
    if (id) loadSpaceData(id);
    KMSService.getAllUsers().then(setAllUsers);
  }, [id]);

  const loadSpaceData = async (spaceId: string) => {
    const s = await KMSService.getSpaceById(spaceId);
    setSpace(s);

    if (s) {
      const d = await KMSService.getDocuments({ spaceIds: [spaceId] });
      setDocs(d);
      
      const t = await KMSService.getTopicsBySpace(spaceId);
      setTopics(t);

      const disc = await KMSService.getDiscussionsBySpace(spaceId);
      setDiscussions(disc);
    }
  };

  const handleUploadSuccess = () => {
    if (id) loadSpaceData(id);
  };

  const handleArchiveToggle = async () => {
      if (space) {
          try {
              const newStatus = space.status === 'Active' ? 'Archived' : 'Active';
              await KMSService.updateSpaceStatus(space.id, newStatus);
              setIsArchiveConfirmOpen(false);
              loadSpaceData(space.id);
          } catch (error: any) {
              alert(error.message);
          }
      }
  };

  const handleAddMember = async (userId: string, role: any) => {
      if (space) {
          await KMSService.addSpaceMember(space.id, userId, role);
          loadSpaceData(space.id);
      }
  };

  const handleRemoveMember = async (userId: string) => {
      if (space && confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
          try {
              await KMSService.removeSpaceMember(space.id, userId);
              loadSpaceData(space.id);
          } catch (error: any) {
              alert(error.message);
          }
      }
  };

  const handleChangeMemberRole = async (userId: string, newRole: any) => {
      if (space) {
          await KMSService.addSpaceMember(space.id, userId, newRole);
          loadSpaceData(space.id);
      }
  };

  const handleOpenThread = (doc: KMSDocument) => {
      setSelectedDocForThread(doc);
      setThreadOpen(true);
  };

  const getCurrentUserRole = () => {
      // Mock - in real app, get from auth context
      return space?.members?.find(m => m.id === 'u1')?.spaceRole || 'Viewer';
  };

  if (!space) return <div className="p-10">Đang tải không gian...</div>;

  const isArchived = space.status === 'Archived';

  return (
    <div className="min-h-screen bg-gray-50 -m-4 sm:-m-6 lg:-m-8">
      {/* LEVEL 2: WORKSPACE HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <button onClick={() => navigate('/spaces')} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900">
             <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách
           </button>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 <div className={`h-16 w-16 rounded-lg flex items-center justify-center text-white font-bold text-3xl shadow-lg ${isArchived ? 'bg-gray-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                    {space.name.charAt(0)}
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
                        {isArchived && <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded flex items-center"><Archive className="w-3 h-3 mr-1"/> Lưu trữ</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs">{space.type}</span>
                        <span className="flex items-center gap-1">
                            {space.privacy === 'Private' ? <Lock className="w-3 h-3"/> : <Globe className="w-3 h-3"/>}
                            {space.privacy === 'Private' ? 'Riêng tư' : 'Công khai'}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-2xl mt-2">{space.description}</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <Button variant="secondary"><Users className="w-4 h-4 mr-2" /> {space.memberCount} Thành viên</Button>
                 {activeTab === 'docs' && !isArchived && (
                    <Button onClick={() => setUploadModalOpen(true)}><UploadCloud className="w-4 h-4 mr-2" /> Upload tài liệu</Button>
                 )}
              </div>
           </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
           <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                 { id: 'docs', label: 'Tài liệu', icon: FileText },
                 { id: 'members', label: 'Thành viên', icon: Users },
              ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                       activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                 >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                 </button>
              ))}
           </nav>
        </div>
      </div>

      {/* LEVEL 3: TAB CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         
         {isArchived && activeTab !== 'settings' && (
             <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                 <div className="flex">
                     <div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-yellow-400" /></div>
                     <div className="ml-3">
                         <p className="text-sm text-yellow-700">
                             Không gian này đang ở trạng thái <strong>Lưu trữ</strong>. Bạn chỉ có thể xem nội dung nhưng không thể thêm tài liệu hay thảo luận mới.
                         </p>
                     </div>
                 </div>
             </div>
         )}

         {/* TAB 1: DOCUMENTS */}
         {activeTab === 'docs' && (
            <div className="space-y-4">
               {/* Filters */}
               <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Tìm tài liệu trong không gian này..." 
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                        value={docFilter}
                        onChange={(e) => setDocFilter(e.target.value)}
                     />
                  </div>
               </div>

               {/* Docs List */}
               <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                     {docs.filter(d => (d.status === 'Approved' || d.lifecycleStatus === 'ApprovedLevel1' || d.lifecycleStatus === 'Active') && d.title.toLowerCase().includes(docFilter.toLowerCase())).map(doc => (
                        <li key={doc.id} className="hover:bg-gray-50">
                           <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                              <div 
                                 className="flex items-center flex-1 cursor-pointer"
                                 onClick={() => navigate(`/documents/${doc.id}`)}
                              >
                                 <div className="flex-shrink-0 bg-indigo-50 p-2 rounded">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                 </div>
                                 <div className="ml-4 flex-1">
                                    <div className="text-sm font-medium text-indigo-600 truncate">{doc.title}</div>
                                    <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
                                       <span>v{doc.versions[0].version}</span>
                                       <span>•</span>
                                       <span>{doc.createdAt}</span>
                                       <span>•</span>
                                       <span>{doc.createdBy.name}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 {/* Thread Comment Button */}
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleOpenThread(doc);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Thảo luận về tài liệu"
                                 >
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="font-medium">{doc.comments?.length || 0}</span>
                                 </button>
                              </div>
                           </div>
                        </li>
                     ))}
                     {docs.filter(d => d.status === 'Approved' || d.lifecycleStatus === 'ApprovedLevel1' || d.lifecycleStatus === 'Active').length === 0 && <li className="p-10 text-center text-gray-500">Chưa có tài liệu đã duyệt nào.</li>}
                  </ul>
               </div>
            </div>
         )}

         {/* TAB 2: DISCUSSIONS (FORUM) */}
         {activeTab === 'discuss' && (
            <div className="text-center py-12 text-gray-500">
               <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
               <p className="text-lg font-medium">Thảo luận tập trung vào từng tài liệu</p>
               <p className="text-sm mt-2">
                  Mỗi tài liệu có một thread thảo luận riêng. <br />
                  Nhấn vào icon <MessageSquare className="w-4 h-4 inline" /> bên cạnh tài liệu để tham gia.
               </p>
            </div>
         )}

         {/* TAB 3: TOPICS */}
         {activeTab === 'topics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="col-span-full flex justify-end">
                  <Button variant="secondary" disabled={isArchived}><Plus className="w-4 h-4 mr-2" /> Thêm chủ đề</Button>
               </div>
               {topics.map(topic => (
                  <div key={topic.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded">
                           <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{topic.name}</h3>
                     </div>
                     <p className="text-sm text-gray-600 mb-4 h-10">{topic.description}</p>
                     <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                        <span>{topic.docCount} tài liệu</span>
                        <button className="text-indigo-600 hover:underline">Xem chi tiết</button>
                     </div>
                  </div>
               ))}
               {topics.length === 0 && <p className="col-span-full text-center text-gray-500">Chưa có chủ đề nào.</p>}
            </div>
         )}

         {/* TAB 4: MEMBERS */}
         {activeTab === 'members' && (
            <Card title="Danh sách thành viên">
               <div className="flex justify-between mb-4">
                  <input type="text" placeholder="Tìm thành viên..." className="border rounded px-3 py-1 text-sm w-64" />
                  <Button size="sm" disabled={isArchived} onClick={() => setAddMemberModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Thêm thành viên</Button>
               </div>
               
               {/* Role Permission Table */}
               <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Ma trận phân quyền vai trò</h4>
                  <table className="min-w-full text-xs">
                     <thead>
                        <tr className="border-b">
                           <th className="text-left py-2 px-3">Vai trò</th>
                           <th className="text-center py-2 px-2">Xem</th>
                           <th className="text-center py-2 px-2">Đăng bài</th>
                           <th className="text-center py-2 px-2">Sửa/Xóa tài liệu</th>
                           <th className="text-center py-2 px-2">Quản lý thành viên</th>
                           <th className="text-center py-2 px-2">Quản lý không gian</th>
                        </tr>
                     </thead>
                     <tbody className="text-gray-600">
                        <tr className="border-b">
                           <td className="py-2 px-3 font-medium">Viewer</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✖</td>
                           <td className="text-center">✖</td>
                           <td className="text-center">✖</td>
                           <td className="text-center">✖</td>
                        </tr>
                        <tr className="border-b">
                           <td className="py-2 px-3 font-medium">Contributor</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">Sửa bài mình</td>
                           <td className="text-center">✖</td>
                           <td className="text-center">✖</td>
                        </tr>
                        <tr className="border-b">
                           <td className="py-2 px-3 font-medium">Moderator</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✖</td>
                        </tr>
                        <tr>
                           <td className="py-2 px-3 font-medium">Owner</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                           <td className="text-center">✔</td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div className="space-y-4">
                  {space.members?.map(m => (
                     <div key={m.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-3">
                           <img src={m.avatar} className="w-10 h-10 rounded-full" />
                           <div>
                              <div className="font-bold text-gray-900 flex items-center gap-2">
                                  {m.name}
                                  {m.id === space.ownerId && <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 rounded font-semibold">Owner</span>}
                              </div>
                              <div className="text-xs text-gray-500">{m.department} • {m.email}</div>
                           </div>
                        </div>
                        <div className="flex gap-2 items-center">
                           <select 
                              className="text-xs border rounded p-1 bg-white" 
                              disabled={isArchived || m.id === space.ownerId} 
                              value={m.spaceRole}
                              onChange={(e) => handleChangeMemberRole(m.id, e.target.value)}
                           >
                              <option value="Owner">Quản trị (Owner)</option>
                              <option value="Moderator">Kiểm duyệt (Moderator)</option>
                              <option value="Contributor">Đóng góp (Contributor)</option>
                              <option value="Viewer">Chỉ xem (Viewer)</option>
                           </select>
                           <button 
                              className="text-red-400 hover:text-red-600 disabled:opacity-50" 
                              disabled={isArchived || m.id === space.ownerId}
                              onClick={() => handleRemoveMember(m.id)}
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>
         )}

         {/* TAB 5: SETTINGS */}
         {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
               <Card title="Cập nhật thông tin Không gian">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Tên không gian</label>
                        <input type="text" defaultValue={space.name} className="mt-1 block w-full border rounded-md p-2" disabled={isArchived} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea defaultValue={space.description} rows={3} className="mt-1 block w-full border rounded-md p-2" disabled={isArchived} />
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="flex-1">
                             <label className="block text-sm font-medium text-gray-700">Quyền riêng tư</label>
                             <select className="mt-1 block w-full border rounded-md p-2 bg-white" defaultValue={space.privacy} disabled={isArchived}>
                                 <option value="Private">Riêng tư</option>
                                 <option value="Public">Công khai</option>
                             </select>
                         </div>
                         <div className="flex-1">
                             <label className="block text-sm font-medium text-gray-700">Loại không gian</label>
                             <select className="mt-1 block w-full border rounded-md p-2 bg-white" defaultValue={space.type} disabled={isArchived}>
                                 <option value="Department">Phòng ban</option>
                                 <option value="Project">Dự án</option>
                                 <option value="Community">Cộng đồng</option>
                             </select>
                         </div>
                     </div>
                     <Button disabled={isArchived}>Lưu thay đổi</Button>
                  </div>
               </Card>

               <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                   <h3 className="text-lg font-bold text-red-800 mb-2">Vùng nguy hiểm</h3>
                   {isArchived ? (
                       <div>
                           <p className="text-sm text-red-600 mb-4">Không gian này đang được lưu trữ. Bạn có thể khôi phục lại hoạt động bình thường.</p>
                           <Button variant="secondary" onClick={() => setIsArchiveConfirmOpen(true)}>Khôi phục hoạt động</Button>
                       </div>
                   ) : (
                       <div>
                           <p className="text-sm text-red-600 mb-4">Lưu trữ không gian sẽ chuyển nó sang chế độ chỉ xem. Các thành viên không thể thêm tài liệu hay thảo luận mới.</p>
                           <Button variant="danger" onClick={() => setIsArchiveConfirmOpen(true)}><Archive className="w-4 h-4 mr-2" /> Lưu trữ Không gian</Button>
                       </div>
                   )}
               </div>
            </div>
         )}
      </div>
      
      {/* Upload Modal - Using DocumentFormModal */}
      <DocumentFormModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Archive Confirm Modal */}
      <Modal isOpen={isArchiveConfirmOpen} onClose={() => setIsArchiveConfirmOpen(false)} title={isArchived ? 'Khôi phục Không gian' : 'Xác nhận Lưu trữ'} 
        footer={<Button variant={isArchived ? 'primary' : 'danger'} onClick={handleArchiveToggle}>{isArchived ? 'Khôi phục' : 'Xác nhận Lưu trữ'}</Button>}>
          <p className="text-gray-700">
              {isArchived 
                ? `Bạn có chắc chắn muốn khôi phục không gian "${space.name}" trở lại trạng thái hoạt động?` 
                : `Bạn có chắc chắn muốn lưu trữ không gian "${space.name}"? Hành động này sẽ khóa các tính năng thêm mới.`}
          </p>
      </Modal>

      {/* Add Member Modal */}
      {addMemberModalOpen && (
         <Modal isOpen={addMemberModalOpen} onClose={() => setAddMemberModalOpen(false)} title="Thêm thành viên vào không gian">
            <div className="space-y-4">
               <p className="text-sm text-gray-600">Chọn người dùng và vai trò để thêm vào không gian <strong>{space.name}</strong></p>
               
               <div className="max-h-96 overflow-y-auto space-y-2">
                  {allUsers.filter(u => !space.members?.find(m => m.id === u.id)).map(user => (
                     <div key={user.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                           <img src={user.avatar} className="w-8 h-8 rounded-full" />
                           <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.department}</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <select className="text-xs border rounded px-2 py-1" id={`role-${user.id}`}>
                              <option value="Viewer">Viewer</option>
                              <option value="Contributor">Contributor</option>
                              <option value="Moderator">Moderator</option>
                           </select>
                           <Button 
                              size="sm" 
                              onClick={() => {
                                 const roleSelect = document.getElementById(`role-${user.id}`) as HTMLSelectElement;
                                 handleAddMember(user.id, roleSelect.value);
                                 setAddMemberModalOpen(false);
                              }}
                           >
                              Thêm
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
               
               {allUsers.filter(u => !space.members?.find(m => m.id === u.id)).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Tất cả người dùng đã là thành viên</p>
               )}
            </div>
         </Modal>
      )}

      {/* Document Thread Side Panel */}
      {selectedDocForThread && (
         <DocumentThread
            document={selectedDocForThread}
            isOpen={threadOpen}
            onClose={() => {
               setThreadOpen(false);
               setSelectedDocForThread(null);
            }}
            currentUserRole={getCurrentUserRole()}
            currentUserId="u1"
         />
      )}
    </div>
  );
};
