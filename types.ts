
export enum DocStatus {
  DRAFT = 'Bản nháp',
  PENDING = 'Chờ phê duyệt',
  APPROVED = 'Đã phê duyệt',
  REJECTED = 'Bị từ chối',
  EXPIRED = 'Hết hạn',
  ARCHIVED = 'Lưu trữ'
}

export type FeedbackStatus = 'New' | 'Processing' | 'Resolved' | 'ConvertedToVersion';

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'User' | 'Manager';
  avatar: string;
  department?: string;
  email?: string;
}

export interface Permission {
  roleId: string; // e.g., 'Manager', 'User', 'Guest'
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canShare: boolean;
}

// RBAC Types
export interface CategoryPermission {
  categoryId: string;
  actions: string[]; // ['view', 'upload', 'edit', 'approve', 'version']
}

export interface SpacePermission {
  spaceId: string;
  role: 'Viewer' | 'Contributor' | 'Moderator' | 'Owner';
}

export interface ApprovalPermission {
  categoryId?: string;
  spaceId?: string;
  level: number; // 1, 2, 3...
  isBackup?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  systemPermissions: string[]; // ['view_dashboard', 'manage_users', etc.]
  categoryPermissions: CategoryPermission[];
  spacePermissions: SpacePermission[];
  approvalPermissions: ApprovalPermission[];
  status: 'Active' | 'Inactive';
  userCount: number;
  createdAt: string;
  createdBy: string;
  notes?: string;
  assignedUserIds?: string[];
}

export interface Category {
  id: string;
  code: string; // Added code field
  name: string;
  description: string;
  parentId?: string | null;
  parentName?: string;
  status: 'Active' | 'Inactive';
  permissions?: Permission[];
  expertId?: string;
  expertName?: string;
  docCount?: number;
  pendingDocCount?: number;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
}

// --- NEW SPACE TYPES ---
export type SpaceType = 'Department' | 'Project' | 'Community' | 'Personal';
export type SpaceRole = 'Owner' | 'Moderator' | 'Contributor' | 'Viewer';

export interface SpaceMember extends User {
  spaceRole: SpaceRole;
}

export interface Space {
  id: string;
  name: string;
  type: SpaceType; // Phòng ban, Dự án...
  description: string;
  privacy: 'Public' | 'Private';
  status: 'Active' | 'Archived';
  coverUrl?: string; // Cover image
  ownerId: string;
  ownerName?: string;
  memberCount: number;
  docCount: number;
  members?: SpaceMember[];
  categoryIds?: string[]; // Linked categories
  createdAt: string;
  updatedAt?: string;
  pendingDocCount?: number; // For archive validation
}

export interface KnowledgeTopic {
  id: string;
  spaceId: string;
  name: string;
  description: string;
  docCount: number;
}

export interface DocumentVersion {
  version: string;
  updatedAt: string;
  updatedBy: string;
  changeLog: string;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
  docId?: string; // For document threads
  docTitle?: string;
  spaceId?: string; // For Space Discussions
  topicTitle?: string; // Thread subject
  replies?: Comment[];
  parentId?: string | null; // For nested replies
  isEdited?: boolean;
  editedAt?: string;
  editedBy?: string;
  mentions?: string[]; // User IDs mentioned with @
}

export interface FeedbackSuggestion {
  id: string;
  content: string;
  docId: string;
  docTitle: string;
  categoryId: string;
  spaceId: string;
  user: User;
  handler?: User;
  status: FeedbackStatus;
  createdAt: string;
  history?: { user: string; action: string; timestamp: string }[];
}

export interface DocumentRating {
  id: string;
  docId: string;
  docTitle: string;
  user: User;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export type LifecycleStatus = 
  | 'Active'             // Đang hiệu lực trong kho tri thức
  | 'NearExpired'        // Sắp hết hạn (trong vòng N ngày, ví dụ 7-30 ngày)
  | 'Expired'            // Đã quá Ngày hết hạn, cần xử lý: Gia hạn/Version mới/Lưu trữ
  | 'Archived'           // Đã lưu trữ, không hiển thị trong Kho tài liệu thường
  | 'Hidden'
  | 'PendingLevel1'      // Chờ duyệt cấp 1 (Quản lý phòng ban)
  | 'ApprovedLevel1'     // Đã duyệt cấp 1, chờ duyệt cấp 2
  | 'RejectedLevel1'     // Bị từ chối cấp 1
  | 'PendingLevel2'      // Chờ duyệt cấp 2 (Chuyên gia danh mục)
  | 'ApprovedLevel2'     // Đã duyệt cấp 2, chờ duyệt cấp 3
  | 'RejectedLevel2'     // Bị từ chối cấp 2
  | 'PendingLevel3'      // Chờ duyệt cấp 3 (Giám đốc/Admin)
  | 'ApprovedLevel3'     // Đã duyệt cấp 3, vào kho tri thức chính thức
  | 'RejectedLevel3';    // Bị từ chối cấp 3

export interface ExtensionHistory {
  id: string;
  oldExpiryDate: string;
  newExpiryDate: string;
  reason: string;
  extendedBy: User;
  extendedAt: string;
}

export interface KMSDocument {
  id: string;
  title: string;
  description: string; // Detailed description for internal use
  summary: string; // Tóm tắt nội dung - optimized for search & display
  categoryIds: string[]; // Multiple categories allowed
  spaceId?: string; // Optional - removed from Kho (only for origin tracking)
  createdBy: User;
  createdAt: string;
  effectiveDate?: string; // Ngày hiệu lực
  expiryDate?: string; // Ngày hết hạn
  status: DocStatus;
  lifecycleStatus: LifecycleStatus; // Đang hiệu lực / Hết hạn / Bị ẩn
  versions: DocumentVersion[];
  tags: string[];
  viewCount: number; // Renamed from views for consistency
  downloadCount: number; // Renamed from downloads
  comments: Comment[];
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isShared?: boolean;
  source: string; // Nguồn dữ liệu: nội bộ / bên ngoài / tên hệ thống
  avgRating: number;
  ratingCount: number; // Số lượt đánh giá
  approvalDate?: string;
  approverName?: string;
  originSpace?: string; // "Được duyệt từ Không gian X" - read-only display
  
  // Approval Level 1 fields (Quản lý phòng ban)
  approverLevel1Name?: string;
  approverLevel1Avatar?: string;
  approverLevel1Date?: string;
  
  // Approval Level 2 fields (Chuyên gia danh mục)
  approverLevel2Name?: string;
  approverLevel2Avatar?: string;
  approverLevel2Date?: string;
  
  // Approval Level 3 fields (Giám đốc/Admin)
  approverLevel3Name?: string;
  approverLevel3Avatar?: string;
  approverLevel3Date?: string;
  
  // Rejection fields
  rejectReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectReasonLevel2?: string;
  rejectedByLevel2?: string;
  rejectedAtLevel2?: string;
  rejectReasonLevel3?: string;
  rejectedByLevel3?: string;
  rejectedAtLevel3?: string;
  
  // Extension/Expiry fields
  extensionHistory?: ExtensionHistory[];
  lastExtensionReason?: string;
  daysUntilExpiry?: number; // Calculated field
  
  // Legacy field for backward compatibility
  categoryId?: string;
}

export interface SearchFilters {
  query?: string;
  categoryIds?: string[];
  spaceIds?: string[];
  tags?: string[];
  fileTypes?: string[];
  createdBy?: string;
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'newest' | 'views' | 'rating';
  sharedOnly?: boolean;
}

// --- Report & Analytics Types ---
export interface ReportFilters {
  userId?: string;           // Lọc theo cá nhân
  department?: string;       // Lọc theo phòng ban
  dateFrom?: string;         // Khoảng thời gian từ ngày
  dateTo?: string;           // Khoảng thời gian đến ngày
  categoryId?: string;       // Lọc theo danh mục
  spaceId?: string;          // Lọc theo không gian
}

export interface UserActivityStats {
  userId: string;
  userName: string;
  userAvatar?: string;
  department: string;
  viewCount: number;         // Số lượt xem
  downloadCount: number;     // Số lượt tải xuống
  uploadCount: number;       // Số tài liệu đã tải lên
  shareCount: number;        // Số lần chia sẻ
  contributionCount: number; // Số đóng góp (comment, feedback)
  lastActiveDate?: string;
}

export interface DepartmentStats {
  department: string;
  memberCount: number;
  viewCount: number;
  uploadCount: number;
  shareCount: number;
  contributionScore: number; // Điểm đóng góp tổng hợp
}

export interface DocumentActivityLog {
  docId: string;
  docTitle: string;
  activityType: 'view' | 'download' | 'upload' | 'share' | 'comment' | 'rate';
  userId: string;
  userName: string;
  department: string;
  timestamp: string;
  details?: string;
}

export interface ReportStats {
  // Thống kê tổng quan
  totalDocuments: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  totalUploads: number;
  
  // Thống kê theo danh mục
  categoryStats: {name: string, count: number}[];
  
  // Top tài liệu được sử dụng nhiều nhất
  usageStats: {docName: string, views: number, downloads: number}[];
  
  // Thống kê trạng thái hiệu lực
  expiryStats: {status: string, count: number}[];
  
  // Thống kê đóng góp theo phòng ban
  contributionStats: {dept: string, count: number}[];
  
  // Thống kê hoạt động người dùng chi tiết
  userActivityStats: UserActivityStats[];
  
  // Thống kê theo phòng ban chi tiết
  departmentStats: DepartmentStats[];
  
  // Nhật ký hoạt động chi tiết
  activityLogs: DocumentActivityLog[];
  
  // Thống kê theo thời gian (trend)
  timeSeriesData?: {date: string, views: number, uploads: number, downloads: number}[];
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface SystemPolicy {
  retentionDays: number;
  maxShareDurationDays: number;
  defaultReviewer: string;
  passwordRequiredForShare: boolean;
}

// --- Knowledge Ingestion Types ---
export interface DataSource {
  id: string;
  name: string;
  type: 'Outlook M365' | 'OneDrive Folder' | 'SP Site' | 'API' | 'Agent';
  status: 'Active' | 'Error' | 'Inactive';
  lastSync?: string;
}

export interface SyncSchedule {
  id: string;
  sourceId: string;
  sourceName: string;
  frequency: string; // e.g., '15 phút', '00:00 hàng ngày'
  type: 'Incremental' | 'Full';
  status: 'Running' | 'Idle' | 'Error';
  lastRun?: string;
}

export interface IngestionLog {
  id: string;
  timestamp: string;
  sourceName: string;
  newDocsCount: number;
  errorCount: number;
  details: string;
  status: 'Success' | 'Warning' | 'Error';
}

// Sync Source Types
export type SyncSourceType = 'SharePoint' | 'Google Drive' | 'OneDrive' | 'Confluence' | 'Local Folder' | 'API';
export type SyncFrequency = 'Manual' | 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
export type SyncMode = 'Full' | 'Incremental';
export type ConnectionStatus = 'Connected' | 'Disconnected' | 'Error' | 'Testing';
export type ApprovalMode = 'Auto' | 'Manual';

export interface SyncSource {
  id: string;
  type: SyncSourceType;
  name: string;
  endpoint: string;
  username?: string;
  token?: string;
  frequency: SyncFrequency;
  approvalMode: ApprovalMode;
  syncMode: SyncMode;
  connectionStatus: ConnectionStatus;
  lastSync?: string;
  lastSyncStatus?: 'Success' | 'Error';
  createdAt: string;
  createdBy: User;
  isActive: boolean;
}

export interface SyncHistory {
  id: string;
  sourceId: string;
  sourceName: string;
  syncTime: string;
  docsCollected: number;
  docsSuccess: number;
  docsError: number;
  status: 'Running' | 'Success' | 'Error';
  triggeredBy: 'Auto' | 'Manual';
  triggeredByUser?: User;
  errorMessage?: string;
  details?: string;
}

// My Documents Types
export interface ViewHistory {
  id: string;
  docId: string;
  docTitle: string;
  userId: string;
  viewedAt: string;
}

export interface DownloadHistory {
  id: string;
  docId: string;
  docTitle: string;
  userId: string;
  downloadedAt: string;
  fileType: string;
  fileSize?: number;
}

export interface DocumentBookmark {
  id: string;
  docId: string;
  userId: string;
  bookmarkedAt: string;
}

export interface DocumentFollow {
  id: string;
  docId: string;
  userId: string;
  followedAt: string;
  notifyOnNewVersion: boolean;
  notifyOnUpdate: boolean;
  notifyOnComment: boolean;
}

// --- Knowledge Collection Types ---
export type CollectionStatus = 'Collected' | 'Classified' | 'InApproval' | 'Approved' | 'Rejected' | 'Discarded';
export type CollectionSource = 'Email' | 'SharePoint' | 'OneDrive' | 'GoogleDrive' | 'Local' | 'Other';

export interface CollectedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath?: string;
  
  // Source information
  source: CollectionSource;
  sourceDetail: string; // Email subject, SharePoint URL, etc.
  
  // Collection metadata
  collectedBy: User;
  collectedAt: string;
  contributorName?: string; // Original author from external source
  
  // Classification status
  status: CollectionStatus;
  classifiedBy?: User;
  classifiedAt?: string;
  
  // Document metadata (filled during classification)
  title?: string;
  description?: string;
  categoryIds?: string[];
  spaceId?: string;
  tags?: string[];
  effectiveDate?: string;
  expiryDate?: string;
  
  // Linked to main document after approval
  documentId?: string;
  
  // Notes and rejection
  classificationNotes?: string;
  rejectionReason?: string;
}
