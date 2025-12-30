
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  CheckSquare, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  Clock,
  LogOut,
  Share2,
  MessageSquare,
  BarChart2,
  FolderTree,
  Layers,
  ChevronDown,
  Database,
  FileCog,
  ShieldAlert,
  Tag,
  Radio,
  FileSearch
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Admin Menu Structure based on Final KMS Governance Standard (BSR-tailored)
  const navItems = [
    { 
      name: 'Phân quyền', // 1
      icon: ShieldAlert, 
      path: '/rbac'
    },
    { 
      name: 'Danh mục tri thức', // 2
      icon: FolderTree, 
      path: '/categories'
    },
    { 
      name: 'Không gian tri thức', // 3
      icon: Layers, 
      path: '/spaces'
    },
    { 
      name: 'Kho tài liệu', // 4 (thay cho Quản lý tài liệu)
      icon: Database, 
      path: '/repo'
    },
    { 
      name: 'Cộng tác tri thức', // 5 (thay cho Góp ý, đánh giá)
      icon: MessageSquare, 
      path: '/feedback'
    },
    { 
      name: 'Tài liệu Hết hạn', // 7
      icon: Clock, 
      path: '/expired'
    },
    {
      name: 'Tìm kiếm tri thức', // 8
      icon: FileSearch,
      path: '/search-page'
    },
    { 
      name: 'Phê duyệt tài liệu', // 9
      icon: CheckSquare, 
      path: '/approvals'
    },
    { 
      name: 'Báo cáo & Phân tích', 
      icon: BarChart2, 
      path: '/reports'
    },
    { 
      name: 'Tài liệu của tôi', // User workspace
      icon: Files, 
      path: '/my-documents'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950 flex-shrink-0 border-b border-slate-800">
          <span className="text-lg font-bold tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            KMS Admin
          </span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300">
            <Menu />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isChildActive = item.children?.some(child => location.pathname + location.search === child.path);

              return (
                <div key={item.name} className="space-y-1 mb-1">
                  {hasChildren ? (
                     <div className="group">
                        <div 
                           className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${isChildActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                        >
                           <div className="flex items-center">
                              <item.icon className={`mr-3 h-5 w-5 ${isChildActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                              {item.name}
                           </div>
                           <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="ml-8 space-y-1 mt-1 border-l border-slate-700 pl-2">
                           {item.children?.map(child => (
                              <NavLink
                                 key={child.name}
                                 to={child.path}
                                 children={({ isActive: childNavLinkActive }) => child.name}
                                 className={({ isActive: childNavLinkActive }) => 
                                    `block px-3 py-2 text-xs rounded-md ${location.pathname + location.search === child.path ? 'bg-indigo-900/50 text-indigo-300' : 'text-slate-400 hover:text-slate-200'}`
                                 }
                              />
                           ))}
                        </div>
                     </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive || location.pathname.startsWith(item.path) ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`mr-3 h-5 w-5 ${isActive || location.pathname.startsWith(item.path) ? 'text-white' : 'text-slate-400'}`} />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </nav>
          
          <div className="p-4 bg-slate-900 border-t border-slate-800 mt-auto">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                 AD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Quản trị viên</p>
                <p className="text-xs text-slate-400">System Owner</p>
              </div>
              <LogOut className="ml-auto h-5 w-5 text-slate-400 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-between items-center">
            <div className="flex-1 flex max-w-md ml-4 md:ml-0">
              <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  name="search"
                  id="search"
                  className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                  placeholder="Tìm nhanh..."
                  type="search"
                />
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
