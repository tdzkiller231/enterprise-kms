
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DocumentRepository } from './pages/DocumentRepository';
import { DocumentDetail } from './pages/DocumentDetail';
import { CategoryManager } from './pages/CategoryManager';
import { SpacesList } from './pages/SpacesList';
import { SpaceDetail } from './pages/SpaceDetail';
import { Approvals } from './pages/Approvals';
import { ExpiredDocs } from './pages/ExpiredDocs';
import { SystemAdmin } from './pages/SystemAdmin';
import { FeedbackList } from './pages/FeedbackList';
import { Reports } from './pages/Reports';
import { SearchConfig } from './pages/SearchConfig';
import { SearchPage } from './pages/SearchPage';
import { RoleManagement } from './pages/RoleManagement';
import { MyDocuments } from './pages/MyDocuments';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 1. Phân quyền */}
          <Route path="/rbac" element={<RoleManagement />} />
          
          {/* 2. Danh mục tri thức */}
          <Route path="/categories" element={<CategoryManager />} />
          
          {/* 3. Không gian tri thức */}
          <Route path="/spaces" element={<SpacesList />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />
          
          {/* 4. Kho tài liệu */}
          <Route path="/repo" element={<DocumentRepository />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          
          {/* 5. Cộng tác tri thức */}
          <Route path="/feedback" element={<FeedbackList />} />
          
          {/* 7. Tài liệu hết hạn */}
          <Route path="/expired" element={<ExpiredDocs />} />
          
          {/* 8. Tìm kiếm tri thức */}
          <Route path="/search-page" element={<SearchPage />} />
          
          {/* 9. Phê duyệt tài liệu */}
          <Route path="/approvals" element={<Approvals />} />
          
          {/* 10. Báo cáo & Phân tích */}
          <Route path="/reports" element={<Reports />} />
          
          {/* 11. Tài liệu của tôi */}
          <Route path="/my-documents" element={<MyDocuments />} />
          
          {/* Legacy Routes & Fallbacks */}
          <Route path="/" element={<Navigate to="/rbac" replace />} />
          <Route path="/system" element={<SystemAdmin />} />
          <Route path="/admin" element={<Navigate to="/system" replace />} />
          <Route path="*" element={<Navigate to="/rbac" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
