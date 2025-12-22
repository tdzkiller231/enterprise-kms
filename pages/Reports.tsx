import React, { useState, useEffect } from 'react';
import { KMSService } from '../services/kmsService';
import { ReportStats, ReportFilters, User } from '../types';
import { Card } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { BarChart2, PieChart as PieIcon, TrendingUp, AlertTriangle, Download, Filter, Users, Building2, Calendar, FileText, Eye, Upload, Share2, MessageSquare, RefreshCw } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Reports: React.FC = () => {
  const [data, setData] = useState<ReportStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'departments' | 'activities'>('overview');
  const [filters, setFilters] = useState<ReportFilters>({});
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadReports();
  }, []);

  const loadUsers = async () => {
    const allUsers = await KMSService.getAllUsers();
    setUsers(allUsers);
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const reportData = await KMSService.getReports(filters);
      setData(reportData);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadReports();
  };

  const resetFilters = () => {
    setFilters({});
    setTimeout(() => loadReports(), 100);
  };

  const exportToCSV = () => {
    if (!data) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Export based on active tab
    if (activeTab === 'users') {
      csvContent += "Người dùng,Phòng ban,Lượt xem,Lượt tải,Tải lên,Chia sẻ,Đóng góp\n";
      data.userActivityStats.forEach(user => {
        csvContent += `${user.userName},${user.department},${user.viewCount},${user.downloadCount},${user.uploadCount},${user.shareCount},${user.contributionCount}\n`;
      });
    } else if (activeTab === 'departments') {
      csvContent += "Phòng ban,Số thành viên,Lượt xem,Tải lên,Chia sẻ,Điểm đóng góp\n";
      data.departmentStats.forEach(dept => {
        csvContent += `${dept.department},${dept.memberCount},${dept.viewCount},${dept.uploadCount},${dept.shareCount},${dept.contributionScore}\n`;
      });
    } else if (activeTab === 'activities') {
      csvContent += "Thời gian,Người dùng,Phòng ban,Hoạt động,Tài liệu\n";
      data.activityLogs.forEach(log => {
        csvContent += `${log.timestamp},${log.userName},${log.department},${log.activityType},${log.docTitle}\n`;
      });
    } else {
      csvContent += "Tổng quan hệ thống\n";
      csvContent += `Tổng tài liệu,${data.totalDocuments}\n`;
      csvContent += `Tổng lượt xem,${data.totalViews}\n`;
      csvContent += `Tổng lượt tải,${data.totalDownloads}\n`;
      csvContent += `Tổng chia sẻ,${data.totalShares}\n`;
      csvContent += `Tổng tải lên,${data.totalUploads}\n`;
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bao_cao_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data) return <div className="p-10 text-center">Đang tải báo cáo...</div>;

  const departments = ['CNTT', 'Nhân sự', 'Kinh doanh', 'Kỹ thuật', 'Marketing'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất dữ liệu CSV
        </button>
      </div>

      {/* Filters Section */}
      <Card title="Bộ lọc báo cáo">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              Người dùng
            </label>
            <select
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange('userId', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building2 className="w-4 h-4 inline mr-1" />
              Phòng ban
            </label>
            <select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <div className="flex items-end gap-2">
            <button
              onClick={applyFilters}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center justify-center"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4 mr-1" />}
              {loading ? 'Đang lọc...' : 'Áp dụng'}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </Card>

      {/* Report Navigation */}
      <div className="bg-white p-2 rounded-lg shadow inline-flex mb-4">
        <button 
           onClick={() => setActiveTab('overview')}
           className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
        >
           <TrendingUp className="w-4 h-4 inline mr-1" />
           Tổng quan
        </button>
        <button 
           onClick={() => setActiveTab('users')}
           className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
        >
           <Users className="w-4 h-4 inline mr-1" />
           Người dùng
        </button>
        <button 
           onClick={() => setActiveTab('departments')}
           className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'departments' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
        >
           <Building2 className="w-4 h-4 inline mr-1" />
           Phòng ban
        </button>
        <button 
           onClick={() => setActiveTab('activities')}
           className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'activities' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-900'}`}
        >
           <FileText className="w-4 h-4 inline mr-1" />
           Nhật ký hoạt động
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tổng tài liệu</p>
                  <p className="text-3xl font-bold">{data.totalDocuments}</p>
                </div>
                <FileText className="w-10 h-10 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Lượt xem</p>
                  <p className="text-3xl font-bold">{data.totalViews}</p>
                </div>
                <Eye className="w-10 h-10 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Lượt tải</p>
                  <p className="text-3xl font-bold">{data.totalDownloads}</p>
                </div>
                <Download className="w-10 h-10 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Chia sẻ</p>
                  <p className="text-3xl font-bold">{data.totalShares}</p>
                </div>
                <Share2 className="w-10 h-10 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tải lên</p>
                  <p className="text-3xl font-bold">{data.totalUploads}</p>
                </div>
                <Upload className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>
          
          {/* Time Series Chart */}
          {data.timeSeriesData && data.timeSeriesData.length > 0 && (
            <Card title="Xu hướng hoạt động 7 ngày qua">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" name="Lượt xem" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="downloads" name="Lượt tải" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="uploads" name="Tải lên" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Số lượng tài liệu theo Danh mục">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categoryStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Số lượng" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Đóng góp tri thức theo Phòng ban">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.contributionStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="dept"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.contributionStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          {/* Top Documents */}
          <Card title="Top 10 Tài liệu được sử dụng nhiều nhất">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tài liệu</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lượt xem</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lượt tải</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.usageStats.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.docName}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">{item.views}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">{item.downloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Expiry Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Trạng thái hiệu lực tài liệu">
              <div className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.expiryStats} dataKey="count" nameKey="status" innerRadius={60} outerRadius={80} paddingAngle={5}>
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card title="Cảnh báo">
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-red-50 rounded-md">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Tài liệu đã hết hạn ({data.expiryStats[0].count})</h4>
                    <p className="text-xs text-red-600 mt-1">Cần rà soát và lưu trữ hoặc gia hạn ngay lập tức.</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-yellow-50 rounded-md">
                  <Clock className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Sắp hết hạn ({data.expiryStats[1].count})</h4>
                    <p className="text-xs text-yellow-600 mt-1">Sẽ hết hạn trong vòng 30 ngày tới.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card title="Bảng xếp hạng Người dùng tích cực">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      <Eye className="w-4 h-4 inline mr-1" />Xem
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      <Download className="w-4 h-4 inline mr-1" />Tải
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      <Upload className="w-4 h-4 inline mr-1" />Tải lên
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      <Share2 className="w-4 h-4 inline mr-1" />Chia sẻ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      <MessageSquare className="w-4 h-4 inline mr-1" />Đóng góp
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng điểm</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.userActivityStats.map((user, idx) => {
                    const totalScore = user.viewCount + user.downloadCount * 2 + user.uploadCount * 10 + user.shareCount * 5 + user.contributionCount * 3;
                    return (
                      <tr key={user.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {idx < 3 ? (
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                              idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-600'
                            }`}>
                              {idx + 1}
                            </span>
                          ) : (
                            idx + 1
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full" src={user.userAvatar} alt="" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.department}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{user.viewCount}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{user.downloadCount}</td>
                        <td className="px-6 py-4 text-right text-sm text-green-600 font-semibold">{user.uploadCount}</td>
                        <td className="px-6 py-4 text-right text-sm text-blue-600 font-semibold">{user.shareCount}</td>
                        <td className="px-6 py-4 text-right text-sm text-purple-600 font-semibold">{user.contributionCount}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">{totalScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-sm">
              <p className="font-medium text-blue-800">Công thức tính điểm:</p>
              <p className="text-blue-700 mt-1">
                Tổng điểm = Xem (×1) + Tải (×2) + Tải lên (×10) + Chia sẻ (×5) + Đóng góp (×3)
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <Card title="Thống kê theo Phòng ban">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số thành viên</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lượt xem</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tải lên</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Chia sẻ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Điểm đóng góp</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Xếp hạng</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.departmentStats.map((dept, idx) => (
                    <tr key={dept.department} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-500">{dept.memberCount}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{dept.viewCount}</td>
                      <td className="px-6 py-4 text-right text-sm text-green-600 font-semibold">{dept.uploadCount}</td>
                      <td className="px-6 py-4 text-right text-sm text-blue-600 font-semibold">{dept.shareCount}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">{dept.contributionScore}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        {idx < 3 ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            idx === 0 ? 'bg-yellow-100 text-yellow-800' : 
                            idx === 1 ? 'bg-gray-100 text-gray-800' : 
                            'bg-orange-100 text-orange-800'
                          }`}>
                            Top {idx + 1}
                          </span>
                        ) : (
                          <span className="text-gray-500">#{idx + 1}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Department Contribution Chart */}
          <Card title="Biểu đồ Đóng góp theo Phòng ban">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="uploadCount" name="Tải lên" fill="#10b981" />
                  <Bar yAxisId="left" dataKey="shareCount" name="Chia sẻ" fill="#3b82f6" />
                  <Bar yAxisId="right" dataKey="contributionScore" name="Điểm đóng góp" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <Card title="Nhật ký Hoạt động Chi tiết">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng ban</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hoạt động</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tài liệu</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.activityLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.activityType === 'view' ? 'bg-blue-100 text-blue-800' :
                          log.activityType === 'download' ? 'bg-purple-100 text-purple-800' :
                          log.activityType === 'upload' ? 'bg-green-100 text-green-800' :
                          log.activityType === 'share' ? 'bg-orange-100 text-orange-800' :
                          log.activityType === 'comment' ? 'bg-pink-100 text-pink-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.activityType === 'view' ? '👁️ Xem' :
                           log.activityType === 'download' ? '⬇️ Tải xuống' :
                           log.activityType === 'upload' ? '⬆️ Tải lên' :
                           log.activityType === 'share' ? '🔗 Chia sẻ' :
                           log.activityType === 'comment' ? '💬 Bình luận' :
                           '⭐ Đánh giá'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {log.docTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.details || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// Helper component import
import { Clock } from 'lucide-react';