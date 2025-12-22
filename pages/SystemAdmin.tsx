import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { User, AuditLog, SystemPolicy } from '../types';
import { Button, Card } from '../components/UI';
import { Shield, Users, Activity, FileCog, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const SystemAdmin: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rbac';
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [policy, setPolicy] = useState<SystemPolicy | null>(null);

  useEffect(() => {
    KMSService.getAllUsers().then(setUsers);
    KMSService.getAuditLogs().then(setAuditLogs);
    KMSService.getSystemPolicy().then(setPolicy);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Quản trị Hệ thống</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow p-1 flex space-x-1 overflow-x-auto">
        {[
          { id: 'rbac', label: 'Phân quyền (RBAC)', icon: Shield },
          { id: 'users', label: 'Người dùng & Vai trò', icon: Users },
          { id: 'audit', label: 'Nhật ký hệ thống', icon: Activity },
          { id: 'policy', label: 'Cấu hình chính sách', icon: FileCog },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: RBAC */}
      {activeTab === 'rbac' && (
        <Card title="Ma trận Phân quyền (Role-Based Access Control)">
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                   <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Quyền hạn / Vai trò</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase">Admin</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase">Manager</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase">Guest</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                   {[
                      'Xem danh mục công khai',
                      'Xem tài liệu nội bộ',
                      'Tải lên tài liệu',
                      'Chỉnh sửa tài liệu',
                      'Phê duyệt tài liệu',
                      'Xóa tài liệu',
                      'Quản lý hệ thống'
                   ].map((perm, idx) => (
                      <tr key={idx}>
                         <td className="px-4 py-3 font-medium text-gray-900">{perm}</td>
                         <td className="px-4 py-3 text-center"><input type="checkbox" checked readOnly className="text-indigo-600 rounded" /></td>
                         <td className="px-4 py-3 text-center"><input type="checkbox" checked={idx < 5} readOnly className="text-indigo-600 rounded" /></td>
                         <td className="px-4 py-3 text-center"><input type="checkbox" checked={idx < 4} readOnly className="text-indigo-600 rounded" /></td>
                         <td className="px-4 py-3 text-center"><input type="checkbox" checked={idx < 1} readOnly className="text-indigo-600 rounded" /></td>
                      </tr>
                   ))}
                </tbody>
             </table>
             <div className="mt-4 flex justify-end">
                <Button>Lưu cấu hình phân quyền</Button>
             </div>
          </div>
        </Card>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
         <div className="space-y-4">
            <div className="flex justify-between">
               <input type="text" placeholder="Tìm kiếm người dùng..." className="border rounded-md px-3 py-2 text-sm w-64" />
               <Button>Thêm người dùng mới</Button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
               <ul className="divide-y divide-gray-200">
                  {users.map(u => (
                     <li key={u.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                           <img src={u.avatar} className="w-10 h-10 rounded-full" />
                           <div>
                              <div className="font-bold text-gray-900">{u.name}</div>
                              <div className="text-sm text-gray-500">{u.department} • {u.role}</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <Button size="sm" variant="secondary">Reset Mật khẩu</Button>
                           <Button size="sm" variant="ghost">Sửa</Button>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      )}

      {/* TAB: AUDIT */}
      {activeTab === 'audit' && (
         <div className="space-y-4">
            <div className="flex gap-2 mb-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Tìm kiếm nhật ký..." className="w-full pl-10 pr-4 py-2 border rounded-md text-sm" />
               </div>
               <input type="date" className="border rounded-md px-3 py-2 text-sm" />
               <Button variant="secondary">Xuất báo cáo</Button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
               <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Thời gian</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Người dùng</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Hành động</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Chi tiết</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                     {auditLogs.map(log => (
                        <tr key={log.id}>
                           <td className="px-6 py-4 text-gray-500">{log.timestamp}</td>
                           <td className="px-6 py-4 font-medium text-gray-900">{log.user}</td>
                           <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                 {log.action}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-gray-500 truncate max-w-xs" title={log.details}>
                              {log.target} - {log.details}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* TAB: POLICY */}
      {activeTab === 'policy' && policy && (
         <Card title="Cấu hình Chính sách Quản trị Tri thức (KM Policy)">
            <div className="space-y-6 max-w-2xl">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Thời gian lưu trữ mặc định (Retention Period)</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                     <input type="number" defaultValue={policy.retentionDays} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 sm:text-sm" />
                     <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">Ngày</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Tài liệu sau thời gian này sẽ được đánh dấu hết hạn.</p>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Thời hạn chia sẻ tối đa</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                     <input type="number" defaultValue={policy.maxShareDurationDays} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 sm:text-sm" />
                     <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">Ngày</span>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Người phê duyệt mặc định (Default Reviewer)</label>
                  <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm">
                     <option>{policy.defaultReviewer}</option>
                     <option>Trần Thị B</option>
                  </select>
               </div>

               <div className="flex items-center">
                  <input type="checkbox" id="pwd-share" defaultChecked={policy.passwordRequiredForShare} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <label htmlFor="pwd-share" className="ml-2 block text-sm text-gray-900">Yêu cầu mật khẩu cho tất cả link chia sẻ ra ngoài</label>
               </div>

               <div className="pt-4 border-t border-gray-200">
                  <Button>Lưu chính sách</Button>
               </div>
            </div>
         </Card>
      )}
    </div>
  );
};