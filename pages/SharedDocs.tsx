import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { KMSDocument } from '../types';
import { Button, StatusBadge } from '../components/UI';
import { Share2, FileText, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SharedDocs: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<KMSDocument[]>([]);

  useEffect(() => {
    KMSService.getDocuments({ sharedOnly: true }).then(setDocs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <Share2 className="w-6 h-6" />
         </div>
         <h1 className="text-2xl font-bold text-gray-900">Tài liệu được chia sẻ với tôi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer" onClick={() => navigate(`/documents/${doc.id}`)}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <StatusBadge status={doc.status} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14">{doc.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 h-12">{doc.description}</p>
              
              <div className="border-t pt-4 flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" /> {doc.createdBy.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> {doc.createdAt}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 w-full text-center">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {docs.length === 0 && (
         <div className="text-center py-20 text-gray-500">
           <Share2 className="w-16 h-16 mx-auto mb-4 text-gray-200" />
           <p className="text-lg">Chưa có tài liệu nào được chia sẻ với bạn.</p>
         </div>
      )}
    </div>
  );
};