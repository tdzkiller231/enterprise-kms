import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KMSService } from '../services/kmsService';
import { Space, KMSDocument, Comment } from '../types';
import { Button, Modal, Card, StatusBadge } from '../components/UI';
import { Layers, Plus, Users, Settings, Edit2, Trash2, FileText, MessageCircle, Folder } from 'lucide-react';

export const SpaceManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'list';
  const setActiveView = (view: string) => setSearchParams({ view });

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allDocs, setAllDocs] = useState<KMSDocument[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);

  useEffect(() => {
    KMSService.getSpaces().then(setSpaces);
    KMSService.getDocuments().then(setAllDocs);
    KMSService.getAllComments().then(setComments);
  }, []);

  const openModal = (space?: Space) => {
    setCurrentSpace(space || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="text-indigo-600" /> Không gian Tri thức
        </h1>
        {currentView === 'list' && (
           <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" /> Tạo không gian</Button>
        )}
      </div>

      {/* Internal Navigation for Module 3 */}
      <div className="bg-white rounded-lg shadow p-1 flex space-x-1 overflow-x-auto mb-6">
        <button onClick={() => setActiveView('list')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${currentView === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Layers className="w-4 h-4 mr-2" /> Danh sách Không gian
        </button>
        <button onClick={() => setActiveView('members')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${currentView === 'members' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Users className="w-4 h-4 mr-2" /> Quản lý Thành viên
        </button>
        <button onClick={() => setActiveView('docs')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${currentView === 'docs' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <FileText className="w-4 h-4 mr-2" /> Tài liệu trong Không gian
        </button>
        <button onClick={() => setActiveView('discussions')} className={`flex items-center px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${currentView === 'discussions' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <MessageCircle className="w-4 h-4 mr-2" /> Thảo luận / Chủ đề
        </button>
      </div>

      {/* VIEW 3.1: LIST */}
      {currentView === 'list' && (
        <div className="grid grid-cols-1 gap-4">
          {spaces.map(space => (
            <div key={space.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
                  {space.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{space.name}</h3>
                  <p className="text-sm text-gray-500">{space.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {space.memberCount} thành viên</span>
                      <span className="flex items-center gap-1 bg-gray-100 px-2 rounded-full text-xs">ID: {space.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => openModal(space)} title="Cấu hình">
                    <Settings className="w-4 h-4" />
                  </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3.2: MEMBERS */}
      {currentView === 'members' && (
         <Card title="Quản lý thành viên theo Không gian">
            <div className="space-y-6">
               {spaces.map(space => (
                  <div key={space.id} className="border-b pb-4 last:border-0">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md font-bold text-gray-800">{space.name}</h3>
                        <Button size="sm" variant="secondary">Thêm thành viên</Button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {space.members?.map(m => (
                           <div key={m.id} className="flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
                              <img src={m.avatar} className="w-5 h-5 rounded-full mr-2" />
                              <span className="text-sm text-gray-700">{m.name}</span>
                              <button className="ml-2 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                           </div>
                        ))}
                        {(!space.members || space.members.length === 0) && <span className="text-sm text-gray-400 italic">Chưa có thành viên</span>}
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      )}

      {/* VIEW 3.3: DOCS IN SPACES */}
      {currentView === 'docs' && (
         <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
               <h3 className="text-sm font-medium text-gray-700">Tài liệu phân theo Không gian</h3>
            </div>
            <ul className="divide-y divide-gray-200">
               {allDocs.map(doc => {
                  const spaceName = spaces.find(s => s.id === doc.spaceId)?.name || 'Chung';
                  return (
                     <li key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="flex items-center text-sm font-medium text-indigo-600">
                                 <Folder className="w-4 h-4 mr-1 text-gray-400" />
                                 {spaceName}
                              </div>
                              <div className="mt-1 text-sm text-gray-900 font-semibold">{doc.title}</div>
                              <div className="mt-1 text-xs text-gray-500">Người tạo: {doc.createdBy.name} • {doc.createdAt}</div>
                           </div>
                           <StatusBadge status={doc.status} />
                        </div>
                     </li>
                  )
               })}
            </ul>
         </div>
      )}

      {/* VIEW 3.4: DISCUSSIONS */}
      {currentView === 'discussions' && (
         <Card title="Thảo luận & Chủ đề mới nhất">
            <div className="space-y-4">
               {comments.map(c => (
                  <div key={c.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex-shrink-0">
                        <img src={c.user.avatar} className="w-10 h-10 rounded-full" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-gray-900">{c.user.name}</span>
                           <span className="text-xs text-gray-500">{c.createdAt}</span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{c.content}</p>
                        <div className="mt-2 text-xs text-indigo-600 font-medium">
                           Tại tài liệu: {c.docTitle}
                        </div>
                     </div>
                  </div>
               ))}
               {comments.length === 0 && <p className="text-center text-gray-500">Chưa có thảo luận nào.</p>}
            </div>
         </Card>
      )}

      {/* Space Config Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSpace ? 'Cấu hình Không gian' : 'Tạo Không gian mới'}
        footer={<Button onClick={() => setIsModalOpen(false)}>Lưu cấu hình</Button>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên không gian</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" defaultValue={currentSpace?.name} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả mục đích</label>
            <textarea className="mt-1 block w-full border rounded-md p-2" rows={3} defaultValue={currentSpace?.description}></textarea>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
             <div className="flex items-center mt-2">
                <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked={currentSpace?.status === 'Active'} />
                <span className="ml-2 text-sm text-gray-600">Kích hoạt không gian này</span>
             </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};