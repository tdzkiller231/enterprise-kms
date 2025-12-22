import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { KMSService } from '../services/kmsService';
import { Card } from '../components/UI';
import { FileText, Eye, CheckCircle, AlertCircle } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    KMSService.getStats().then(setStats);
  }, []);

  const dummyChartData = [
    { name: 'Nhân sự', docs: 45 },
    { name: 'Kỹ thuật', docs: 120 },
    { name: 'Kinh doanh', docs: 85 },
    { name: 'Marketing', docs: 60 },
  ];

  const dummyStatusData = [
    { name: 'Hoạt động', value: 400 },
    { name: 'Chờ duyệt', value: 30 },
    { name: 'Hết hạn', value: 45 },
    { name: 'Bản nháp', value: 20 },
  ];

  if (!stats) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tổng quan Tri thức</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <FileText className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Tổng số tài liệu</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalDocs}</p>
          </div>
        </Card>
        
        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Chờ phê duyệt</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingApproval}</p>
          </div>
        </Card>

        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Eye className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Tổng lượt xem</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
          </div>
        </Card>

        <Card className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Tài liệu hết hạn</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.expiredDocs}</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tài liệu theo danh mục" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="docs" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Phân bổ trạng thái tài liệu" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dummyStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {dummyStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AI Insights Panel (Persona addition) */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">✨</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold">Thông tin chi tiết từ AI</h3>
            <p className="mt-1 text-indigo-100">
              Kho tri thức của bạn đang phát triển! Không gian <strong>Kỹ thuật</strong> đã tăng 20% hoạt động trong tuần này.
              Chúng tôi đề xuất xem xét <strong>3</strong> tài liệu đã hết hạn trong danh mục <strong>Nhân sự</strong>.
            </p>
            <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-50">
              Xem đề xuất AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};