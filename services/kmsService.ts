
import { KMSDocument, DocStatus, Category, Space, User, Comment, ReportStats, ReportFilters, UserActivityStats, DepartmentStats, DocumentActivityLog, AuditLog, SystemPolicy, KnowledgeTopic, DataSource, SyncSchedule, IngestionLog, FeedbackSuggestion, DocumentRating, FeedbackStatus, SearchFilters, SpaceMember, Role, LifecycleStatus, SyncSource, SyncHistory, CollectedDocument, CollectionStatus, CollectionSource } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn A (Admin)', role: 'Admin', avatar: 'https://picsum.photos/32/32?random=1', department: 'CNTT', email: 'vana@bsr.vn' },
  { id: 'u2', name: 'Trần Thị B (Manager)', role: 'Manager', avatar: 'https://picsum.photos/32/32?random=2', department: 'Nhân sự', email: 'thib@bsr.vn' },
  { id: 'u3', name: 'Lê Văn C (User)', role: 'User', avatar: 'https://picsum.photos/32/32?random=3', department: 'Kinh doanh', email: 'vanc@bsr.vn' },
  { id: 'u4', name: 'Phạm Văn D', role: 'User', avatar: 'https://picsum.photos/32/32?random=4', department: 'Kỹ thuật', email: 'vand@bsr.vn' },
];

const MOCK_CATEGORIES: Category[] = [
  { 
    id: 'c1', 
    code: 'HR-POL', 
    name: 'Chính sách Nhân sự', 
    description: 'Quy định và nội quy nhân sự, chế độ đãi ngộ.', 
    status: 'Active',
    parentId: null,
    expertId: 'u2',
    expertName: 'Trần Thị B (Manager)',
    docCount: 15,
    pendingDocCount: 2,
    createdAt: '2024-01-10',
    updatedAt: '2024-06-15',
    updatedBy: 'Nguyễn Văn A'
  },
  { 
    id: 'c1-1', 
    code: 'HR-POL-COMP', 
    name: 'Chính sách Đãi ngộ', 
    description: 'Quy định về lương thưởng, phúc lợi.', 
    status: 'Active',
    parentId: 'c1',
    parentName: 'Chính sách Nhân sự',
    expertId: 'u2',
    expertName: 'Trần Thị B (Manager)',
    docCount: 8,
    pendingDocCount: 1,
    createdAt: '2024-02-01',
    updatedAt: '2024-05-20',
    updatedBy: 'Trần Thị B'
  },
  { 
    id: 'c1-2', 
    code: 'HR-POL-LEAVE', 
    name: 'Chính sách Nghỉ phép', 
    description: 'Quy định về các loại nghỉ phép, thủ tục xin phép.', 
    status: 'Active',
    parentId: 'c1',
    parentName: 'Chính sách Nhân sự',
    expertId: 'u2',
    expertName: 'Trần Thị B (Manager)',
    docCount: 7,
    pendingDocCount: 1,
    createdAt: '2024-02-01',
    updatedBy: 'Trần Thị B'
  },
  { 
    id: 'c2', 
    code: 'TECH-SPEC', 
    name: 'Tài liệu Kỹ thuật', 
    description: 'Đặc tả kỹ thuật, bản vẽ thiết kế và hướng dẫn vận hành.', 
    status: 'Active',
    parentId: null,
    expertId: 'u4',
    expertName: 'Phạm Văn D',
    docCount: 45,
    pendingDocCount: 5,
    createdAt: '2024-01-15',
    updatedAt: '2024-06-20',
    updatedBy: 'Phạm Văn D'
  },
  { 
    id: 'c2-1', 
    code: 'TECH-SPEC-MECH', 
    name: 'Kỹ thuật Cơ khí', 
    description: 'Bản vẽ thiết kế cơ khí, quy trình lắp ráp.', 
    status: 'Active',
    parentId: 'c2',
    parentName: 'Tài liệu Kỹ thuật',
    expertId: 'u4',
    expertName: 'Phạm Văn D',
    docCount: 20,
    pendingDocCount: 2,
    createdAt: '2024-03-01',
    updatedBy: 'Phạm Văn D'
  },
  { 
    id: 'c2-2', 
    code: 'TECH-SPEC-ELEC', 
    name: 'Kỹ thuật Điện', 
    description: 'Sơ đồ điện, hướng dẫn bảo trì hệ thống điện.', 
    status: 'Active',
    parentId: 'c2',
    parentName: 'Tài liệu Kỹ thuật',
    expertId: 'u4',
    expertName: 'Phạm Văn D',
    docCount: 25,
    pendingDocCount: 3,
    createdAt: '2024-03-01',
    updatedBy: 'Phạm Văn D'
  },
  { 
    id: 'c3', 
    code: 'MKT-ASSET', 
    name: 'Tài liệu Marketing', 
    description: 'Hướng dẫn thương hiệu (Brand Guideline) và assets.', 
    status: 'Active',
    parentId: null,
    expertId: 'u3',
    expertName: 'Lê Văn C (User)',
    docCount: 12,
    pendingDocCount: 0,
    createdAt: '2024-02-10',
    updatedAt: '2024-06-10',
    updatedBy: 'Lê Văn C'
  },
  { 
    id: 'c4', 
    code: 'FIN-REP', 
    name: 'Báo cáo Tài chính', 
    description: 'Báo cáo thu chi, kiểm toán hàng năm.', 
    status: 'Active',
    parentId: null,
    expertId: 'u1',
    expertName: 'Nguyễn Văn A (Admin)',
    docCount: 30,
    pendingDocCount: 0,
    createdAt: '2024-01-05',
    updatedAt: '2024-06-25',
    updatedBy: 'Nguyễn Văn A'
  },
  { 
    id: 'c5', 
    code: 'ARCHIVE', 
    name: 'Tài liệu Lưu trữ', 
    description: 'Tài liệu cũ, không còn sử dụng thường xuyên.', 
    status: 'Inactive',
    parentId: null,
    expertId: 'u1',
    expertName: 'Nguyễn Văn A (Admin)',
    docCount: 100,
    pendingDocCount: 0,
    createdAt: '2023-01-01',
    updatedAt: '2023-12-31',
    updatedBy: 'Hệ thống'
  }
];

const MOCK_SPACE_MEMBERS_S1: SpaceMember[] = [
    { ...MOCK_USERS[0], spaceRole: 'Owner' },
    { ...MOCK_USERS[3], spaceRole: 'Moderator' },
    { ...MOCK_USERS[2], spaceRole: 'Contributor' }
];

const MOCK_SPACES: Space[] = [
  { 
    id: 's1', 
    name: 'Khối Kỹ thuật', 
    type: 'Department',
    description: 'Không gian làm việc cho phòng R&D và Kỹ thuật. Lưu trữ bản vẽ, quy trình vận hành.', 
    privacy: 'Private',
    status: 'Active',
    ownerId: 'u1',
    ownerName: 'Nguyễn Văn A (Admin)',
    memberCount: 45, 
    docCount: 120,
    pendingDocCount: 5,
    categoryIds: ['c2', 'c2-1', 'c2-2'],
    createdAt: '2023-01-15',
    updatedAt: '2024-06-20',
    members: MOCK_SPACE_MEMBERS_S1
  },
  { 
    id: 's2', 
    name: 'Dự án Alpha - Giai đoạn 2', 
    type: 'Project',
    description: 'Tài liệu triển khai dự án Alpha, bao gồm biên bản họp và tài liệu nghiệm thu.', 
    privacy: 'Private',
    status: 'Active',
    ownerId: 'u2',
    ownerName: 'Trần Thị B (Manager)',
    memberCount: 20, 
    docCount: 85,
    pendingDocCount: 2,
    categoryIds: ['c3'],
    createdAt: '2024-02-10',
    updatedAt: '2024-06-25',
    members: [{ ...MOCK_USERS[1], spaceRole: 'Owner' }] 
  },
  { 
    id: 's3', 
    name: 'Cộng đồng Chuyển đổi số', 
    type: 'Community',
    description: 'Nơi chia sẻ kiến thức về công nghệ và chuyển đổi số.', 
    privacy: 'Public',
    status: 'Active',
    ownerId: 'u1',
    ownerName: 'Nguyễn Văn A (Admin)',
    memberCount: 150, 
    docCount: 15,
    pendingDocCount: 0,
    categoryIds: [],
    createdAt: '2023-05-20',
    updatedAt: '2024-06-10',
    members: [{ ...MOCK_USERS[0], spaceRole: 'Owner' }] 
  },
  { 
    id: 's4', 
    name: 'Dự án Cũ 2020', 
    type: 'Project',
    description: 'Dự án đã kết thúc, lưu trữ để tra cứu.', 
    privacy: 'Private',
    status: 'Archived',
    ownerId: 'u1',
    ownerName: 'Nguyễn Văn A (Admin)',
    memberCount: 10, 
    docCount: 300,
    pendingDocCount: 0,
    categoryIds: ['c5'],
    createdAt: '2020-01-01',
    updatedAt: '2023-12-31',
    members: [{ ...MOCK_USERS[0], spaceRole: 'Owner' }] 
  },
];

const MOCK_TOPICS: KnowledgeTopic[] = [
    { id: 't1', spaceId: 's1', name: 'Bảo dưỡng thiết bị', description: 'Quy trình bảo trì định kỳ', docCount: 15 },
    { id: 't2', spaceId: 's1', name: 'Vận hành an toàn', description: 'Quy tắc an toàn lao động', docCount: 30 },
    { id: 't3', spaceId: 's1', name: 'Xử lý sự cố', description: 'Các kịch bản lỗi và cách khắc phục', docCount: 10 },
    { id: 't4', spaceId: 's2', name: 'Chiến dịch Mùa hè', description: 'Marketing campaign Q2', docCount: 5 },
];

const MOCK_COMMENTS: Comment[] = [
  { 
    id: 'cm1', 
    user: MOCK_USERS[1], 
    content: 'Cần làm rõ phần quy định nghỉ phép.', 
    createdAt: '2023-10-16 09:00', 
    docId: 'd1', 
    docTitle: 'Lộ trình phát triển Quý 3/2024',
    parentId: null
  },
  { 
    id: 'cm2', 
    user: MOCK_USERS[2], 
    content: 'Đã cập nhật theo yêu cầu.', 
    createdAt: '2023-10-16 10:30', 
    docId: 'd1', 
    docTitle: 'Lộ trình phát triển Quý 3/2024',
    parentId: 'cm1'
  },
  { 
    id: 'cm3', 
    user: MOCK_USERS[0], 
    content: 'Tài liệu này rất hữu ích cho người mới.', 
    createdAt: '2023-11-01 14:00', 
    docId: 'd2', 
    docTitle: 'Sổ tay nhân viên 2023',
    parentId: null
  },
  {
    id: 'cm4',
    user: MOCK_USERS[3],
    content: 'Phần số liệu tháng 5 còn thiếu, cần bổ sung thêm.',
    createdAt: '2024-06-10 09:30',
    docId: 'd4',
    docTitle: 'Báo cáo tài chính Q2',
    parentId: null
  },
  {
    id: 'cm5',
    user: MOCK_USERS[1],
    content: 'Đã gửi file bổ sung qua email rồi nhé.',
    createdAt: '2024-06-10 11:00',
    docId: 'd4',
    docTitle: 'Báo cáo tài chính Q2',
    parentId: 'cm4'
  },
  {
    id: 'cm6',
    user: MOCK_USERS[2],
    content: '@VanA Phần ISO này cần review lại không anh?',
    createdAt: '2024-06-12 14:20',
    docId: 'd1',
    docTitle: 'Lộ trình phát triển Quý 3/2024',
    parentId: null,
    mentions: ['VanA']
  }
];

const MOCK_DISCUSSIONS: Comment[] = [
    { id: 'disc1', spaceId: 's1', user: MOCK_USERS[3], content: 'Tuần tới chúng ta sẽ có đợt kiểm tra an toàn định kỳ, mọi người chú ý cập nhật tài liệu nhé.', topicTitle: 'Thông báo kiểm tra An toàn', createdAt: '2024-06-20 09:00', replies: [] },
    { id: 'disc2', spaceId: 's1', user: MOCK_USERS[0], content: 'Có ai giữ bản vẽ thiết kế hệ thống bơm nước cũ không?', topicTitle: 'Hỏi về bản vẽ hệ thống cũ', createdAt: '2024-06-18 14:00', replies: [
        { id: 'rep1', user: MOCK_USERS[3], content: 'Tôi đã upload lên mục Lưu trữ rồi nhé.', createdAt: '2024-06-18 15:00', docId: '', docTitle: '' }
    ] }
];

let MOCK_DOCS: KMSDocument[] = [
  // --- Tài liệu của u1 (Nguyễn Văn A) ---
  {
    id: 'my_doc_1',
    title: 'Quy trình Quản lý Dự án 2026',
    description: 'Hướng dẫn quy trình quản lý dự án phần mềm theo Agile/Scrum.',
    summary: 'Tài liệu mô tả chi tiết các bước trong quy trình Agile: sprint planning, daily standup, retrospective và demo.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[0], // u1
    createdAt: '2026-01-05',
    effectiveDate: '2026-01-10',
    expiryDate: '2027-01-10',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2026-01-05', updatedBy: 'Nguyễn Văn A', changeLog: 'Phát hành' }
    ],
    tags: ['agile', 'project-management', 'scrum'],
    viewCount: 120,
    downloadCount: 35,
    comments: [
      { 
        id: 'cmt_my1', 
        user: MOCK_USERS[2], 
        content: 'Tài liệu này rất chi tiết và dễ hiểu, cảm ơn anh!', 
        createdAt: '2026-01-06 10:00', 
        docId: 'my_doc_1',
        docTitle: 'Quy trình Quản lý Dự án 2026',
        parentId: null
      }
    ],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.7,
    ratingCount: 18,
    approvalDate: '2026-01-06',
    approverName: 'Trần Thị B'
  },
  {
    id: 'my_doc_2',
    title: 'Hướng dẫn Sử dụng API Gateway',
    description: 'Tài liệu kỹ thuật về API Gateway và microservices.',
    summary: 'Hướng dẫn cấu hình, authentication, rate limiting và monitoring cho API Gateway trong kiến trúc microservices.',
    categoryIds: ['c2', 'c2-1'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[0], // u1
    createdAt: '2026-01-03',
    effectiveDate: '2026-01-05',
    expiryDate: '2027-06-30',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '2.1', updatedAt: '2026-01-03', updatedBy: 'Nguyễn Văn A', changeLog: 'Thêm phần monitoring' },
      { version: '2.0', updatedAt: '2025-12-20', updatedBy: 'Nguyễn Văn A', changeLog: 'Cập nhật cho version mới' }
    ],
    tags: ['api', 'microservices', 'gateway', 'technical'],
    viewCount: 245,
    downloadCount: 67,
    comments: [
      { 
        id: 'cmt_my2', 
        user: MOCK_USERS[3], 
        content: 'Phần rate limiting có thể giải thích rõ hơn không anh?', 
        createdAt: '2026-01-04 15:30', 
        docId: 'my_doc_2',
        docTitle: 'Hướng dẫn Sử dụng API Gateway',
        parentId: null
      }
    ],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.5,
    ratingCount: 22,
    approvalDate: '2026-01-04',
    approverName: 'Trần Thị B'
  },
  {
    id: 'my_doc_3',
    title: 'Chính sách Coding Standards',
    description: 'Quy tắc viết code và best practices cho team.',
    summary: 'Tài liệu mô tả coding conventions, naming conventions, code review process và các best practices trong lập trình.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[0], // u1
    createdAt: '2025-12-28',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '3.0', updatedAt: '2025-12-28', updatedBy: 'Nguyễn Văn A', changeLog: 'Cập nhật cho năm 2026' }
    ],
    tags: ['coding', 'standards', 'best-practices'],
    viewCount: 450,
    downloadCount: 125,
    comments: [],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.8,
    ratingCount: 45,
    approvalDate: '2025-12-29',
    approverName: 'Trần Thị B'
  },
  {
    id: 'my_expired_1',
    title: 'Quy định Bảo mật Dữ liệu 2025',
    description: 'Chính sách bảo mật và xử lý dữ liệu cá nhân.',
    summary: 'Hướng dẫn quy định về bảo mật, quyền riêng tư và xử lý dữ liệu theo GDPR và luật bảo vệ dữ liệu Việt Nam.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[0], // u1
    createdAt: '2025-01-10',
    effectiveDate: '2025-02-01',
    expiryDate: '2025-12-31', // Đã hết hạn
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '1.5', updatedAt: '2025-06-15', updatedBy: 'Nguyễn Văn A', changeLog: 'Cập nhật theo luật mới' },
      { version: '1.0', updatedAt: '2025-01-10', updatedBy: 'Nguyễn Văn A', changeLog: 'Phát hành' }
    ],
    tags: ['security', 'data-protection', 'policy'],
    viewCount: 890,
    downloadCount: 234,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 67,
    approvalDate: '2025-01-15',
    approverName: 'Trần Thị B'
  },
  {
    id: 'my_expired_2',
    title: 'Hướng dẫn Backup & Recovery 2024',
    description: 'Quy trình sao lưu và phục hồi dữ liệu hệ thống.',
    summary: 'Tài liệu mô tả chiến lược backup, lịch sao lưu tự động và các bước phục hồi dữ liệu khi có sự cố.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[0], // u1
    createdAt: '2024-03-01',
    effectiveDate: '2024-03-15',
    expiryDate: '2025-03-15', // Đã hết hạn
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '2.0', updatedAt: '2024-09-20', updatedBy: 'Nguyễn Văn A', changeLog: 'Thêm cloud backup' },
      { version: '1.0', updatedAt: '2024-03-01', updatedBy: 'Nguyễn Văn A', changeLog: 'Phiên bản đầu' }
    ],
    tags: ['backup', 'recovery', 'disaster-recovery'],
    viewCount: 567,
    downloadCount: 143,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.4,
    ratingCount: 34,
    approvalDate: '2024-03-10',
    approverName: 'Trần Thị B'
  },
  {
    id: 'my_expired_3',
    title: 'Chính sách Remote Work 2023',
    description: 'Quy định làm việc từ xa trong thời kỳ COVID-19.',
    summary: 'Hướng dẫn các quy định, công cụ hỗ trợ và quy trình làm việc từ xa cho toàn bộ nhân viên.',
    categoryIds: ['c1', 'c1-1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[0], // u1
    createdAt: '2023-04-01',
    effectiveDate: '2023-05-01',
    expiryDate: '2024-12-31', // Đã hết hạn
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '1.2', updatedAt: '2024-01-10', updatedBy: 'Nguyễn Văn A', changeLog: 'Điều chỉnh chính sách' },
      { version: '1.0', updatedAt: '2023-04-01', updatedBy: 'Nguyễn Văn A', changeLog: 'Ban hành' }
    ],
    tags: ['remote', 'wfh', 'policy', 'covid'],
    viewCount: 1245,
    downloadCount: 456,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.3,
    ratingCount: 89,
    approvalDate: '2023-04-15',
    approverName: 'Trần Thị B'
  },
  // --- Tài liệu được chia sẻ với u1 ---
  {
    id: 'shared_with_me_1',
    title: 'Kế hoạch Marketing Q1 2026',
    description: 'Chiến lược marketing và các campaign cho quý 1.',
    summary: 'Bao gồm kế hoạch content, budget allocation, target audience và KPIs cho các chiến dịch marketing quý 1/2026.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[2], // Lê Văn C
    createdAt: '2025-12-20',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-03-31',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2025-12-20', updatedBy: 'Lê Văn C', changeLog: 'Phát hành' }
    ],
    tags: ['marketing', 'campaign', 'strategy'],
    viewCount: 78,
    downloadCount: 23,
    comments: [
      { 
        id: 'cmt_sh1', 
        user: MOCK_USERS[0], 
        content: 'Budget cho Social Media campaign có vẻ hơi thấp, nên tăng lên 20%.', 
        createdAt: '2025-12-22 14:20', 
        docId: 'shared_with_me_1',
        docTitle: 'Kế hoạch Marketing Q1 2026',
        parentId: null
      }
    ],
    fileType: 'pptx',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.2,
    ratingCount: 12,
    approvalDate: '2025-12-21',
    approverName: 'Trần Thị B'
  },
  {
    id: 'shared_with_me_2',
    title: 'Báo cáo Phân tích Thị trường 2025',
    description: 'Phân tích xu hướng thị trường và đối thủ cạnh tranh.',
    summary: 'Nghiên cứu chi tiết về thị trường, phân khúc khách hàng, đánh giá đối thủ và cơ hội phát triển.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[1], // Trần Thị B
    createdAt: '2025-12-15',
    effectiveDate: '2025-12-20',
    expiryDate: '2026-06-30',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2025-12-15', updatedBy: 'Trần Thị B', changeLog: 'Hoàn thành' }
    ],
    tags: ['market-analysis', 'research', 'strategy'],
    viewCount: 156,
    downloadCount: 45,
    comments: [],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 24,
    approvalDate: '2025-12-16',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 'shared_with_me_3',
    title: 'Tài liệu Đào tạo TypeScript Advanced',
    description: 'Khóa học TypeScript nâng cao cho developers.',
    summary: 'Các chủ đề nâng cao: generics, decorators, advanced types, performance optimization và best practices.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3], // Phạm Văn D
    createdAt: '2026-01-02',
    effectiveDate: '2026-01-05',
    expiryDate: '2027-01-05',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2026-01-02', updatedBy: 'Phạm Văn D', changeLog: 'Tạo mới' }
    ],
    tags: ['typescript', 'training', 'programming'],
    viewCount: 89,
    downloadCount: 34,
    comments: [
      { 
        id: 'cmt_sh2', 
        user: MOCK_USERS[0], 
        content: 'Tài liệu rất hay, phần generics giải thích rất dễ hiểu!', 
        createdAt: '2026-01-03 16:45', 
        docId: 'shared_with_me_3',
        docTitle: 'Tài liệu Đào tạo TypeScript Advanced',
        parentId: null
      }
    ],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.9,
    ratingCount: 15,
    approvalDate: '2026-01-03',
    approverName: 'Trần Thị B'
  },
  {
    id: 'expiring1',
    title: 'Chính sách Bảo hiểm 2024',
    description: 'Quy định về bảo hiểm y tế và bảo hiểm xã hội cho nhân viên.',
    summary: 'Hướng dẫn quy trình đăng ký, thanh toán và quyền lợi bảo hiểm cho nhân viên trong năm 2024.',
    categoryIds: ['c1', 'c1-1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[0],
    createdAt: '2024-01-01',
    effectiveDate: '2024-01-01',
    expiryDate: '2026-02-08', // Sắp hết hạn trong 30 ngày
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-01-01', updatedBy: 'Nguyễn Văn A', changeLog: 'Phát hành' }
    ],
    tags: ['hr', 'insurance', 'policy'],
    viewCount: 1850,
    downloadCount: 320,
    comments: [],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 45,
    approvalDate: '2024-01-02',
    approverName: 'Trần Thị B'
  },
  {
    id: 'expiring2',
    title: 'Hướng dẫn An toàn Lao động',
    description: 'Quy định về an toàn lao động và vệ sinh công nghiệp.',
    summary: 'Nội quy an toàn, quy trình xử lý sự cố và các thiết bị bảo hộ bắt buộc.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's1',
    createdBy: MOCK_USERS[0],
    createdAt: '2023-12-01',
    effectiveDate: '2024-01-01',
    expiryDate: '2026-01-25', // Sắp hết hạn trong vài ngày
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '2.1', updatedAt: '2024-06-15', updatedBy: 'Phạm Văn D', changeLog: 'Cập nhật theo quy chuẩn mới' },
      { version: '2.0', updatedAt: '2023-12-01', updatedBy: 'Nguyễn Văn A', changeLog: 'Phiên bản năm 2024' }
    ],
    tags: ['safety', 'policy', 'mandatory'],
    viewCount: 3200,
    downloadCount: 890,
    comments: [],
    fileType: 'pdf',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.8,
    ratingCount: 78,
    approvalDate: '2023-12-05',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 'expiring3',
    title: 'Chính sách Chi phí Di chuyển',
    description: 'Quy định về chi phí đi lại và công tác phí.',
    summary: 'Mức chi tiêu chuẩn cho các loại chi phí: xe, khách sạn, ăn uống khi công tác.',
    categoryIds: ['c1', 'c1-1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-02-01',
    effectiveDate: '2024-03-01',
    expiryDate: '2026-01-20', // Đang hết hạn
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-02-01', updatedBy: 'Trần Thị B', changeLog: 'Phiên bản đầu' }
    ],
    tags: ['hr', 'travel', 'expense'],
    viewCount: 2100,
    downloadCount: 450,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.3,
    ratingCount: 35,
    approvalDate: '2024-02-05',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 'recent1',
    title: 'Quy trình Phê duyệt Nghiệp vụ',
    description: 'Hướng dẫn quy trình phê duyệt các nghiệp vụ kinh doanh.',
    summary: 'Các bước thực hiện phê duyệt từ cấp quản lý đến giám đốc.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's2',
    createdBy: MOCK_USERS[0],
    createdAt: '2025-12-15',
    effectiveDate: '2026-01-01',
    expiryDate: '2027-01-01',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2025-12-15', updatedBy: 'Nguyễn Văn A', changeLog: 'Tạo mới' }
    ],
    tags: ['approval', 'business', 'process'],
    viewCount: 245,
    downloadCount: 67,
    comments: [],
    fileType: 'docx',
    isShared: true,
    source: 'Nội bộ',
    avgRating: 4.5,
    ratingCount: 12,
    approvalDate: '2025-12-20',
    approverName: 'Trần Thị B'
  },
  {
    id: 'd1',
    title: 'Lộ trình phát triển Quý 3/2024',
    description: 'Chi tiết lộ trình sản phẩm cho quý sắp tới.',
    summary: 'Kế hoạch phát triển sản phẩm Q3/2024 bao gồm 3 milestone chính, tập trung vào tối ưu hiệu năng và trải nghiệm người dùng.',
    categoryIds: ['c2', 'c2-1'],
    categoryId: 'c2', // Legacy field
    spaceId: 's1',
    createdBy: MOCK_USERS[1],
    createdAt: '2023-10-15',
    effectiveDate: '2023-10-16',
    expiryDate: '2024-10-15',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2023-10-15', updatedBy: 'Trần Thị B', changeLog: 'Phát hành lần đầu' }
    ],
    tags: ['kehoach', 'roadmap', 'quy3'],
    viewCount: 1240,
    downloadCount: 45,
    comments: [MOCK_COMMENTS[0], MOCK_COMMENTS[1]],
    fileType: 'pdf',
    isShared: true,
    source: 'Hệ thống',
    avgRating: 4.5,
    ratingCount: 15,
    approvalDate: '2023-10-16',
    approverName: 'Nguyễn Văn A',
    originSpace: 'Khối Kỹ thuật'
  },
  {
    id: 'd2',
    title: 'Sổ tay nhân viên 2023',
    description: 'Cập nhật nội quy cho toàn bộ nhân viên.',
    summary: 'Quy định nội bộ, chính sách nhân sự, quy trình nghỉ phép và đãi ngộ áp dụng trong năm 2023.',
    categoryIds: ['c1', 'c1-1', 'c1-2'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[0],
    createdAt: '2023-01-01',
    effectiveDate: '2023-01-01',
    expiryDate: '2023-12-31',
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '2.0', updatedAt: '2023-01-01', updatedBy: 'Nguyễn Văn A', changeLog: 'Cập nhật hàng năm' }
    ],
    tags: ['hr', 'noiquy'],
    viewCount: 5600,
    downloadCount: 890,
    comments: [MOCK_COMMENTS[2]],
    fileType: 'pdf',
    source: 'Email HR',
    avgRating: 4.8,
    ratingCount: 42,
    approvalDate: '2023-01-02',
    approverName: 'Hệ thống (Auto)'
  },
  {
    id: 'd3',
    title: 'Đặc tả Dự án Alpha',
    description: 'Yêu cầu kỹ thuật cho dự án Alpha.',
    summary: 'Tài liệu kỹ thuật mô tả kiến trúc hệ thống, yêu cầu phi chức năng và acceptance criteria cho dự án Alpha.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-05-20',
    expiryDate: '2025-05-20',
    status: DocStatus.PENDING,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '0.9', updatedAt: '2024-05-20', updatedBy: 'Lê Văn C', changeLog: 'Bản nháp chờ duyệt' }
    ],
    tags: ['specs', 'alpha'],
    viewCount: 12,
    downloadCount: 0,
    comments: [],
    fileType: 'docx',
    source: 'OneDrive Kỹ thuật',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'd4',
    title: 'Báo cáo tài chính Q2',
    description: 'Số liệu tài chính nội bộ.',
    summary: 'Báo cáo tổng hợp doanh thu, chi phí và lợi nhuận quý 2/2024, kèm phân tích xu hướng và dự báo.',
    categoryIds: ['c4'],
    categoryId: 'c4',
    spaceId: 's2',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-06-01',
    effectiveDate: '2024-06-01',
    expiryDate: '2024-09-30',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-01', updatedBy: 'Lê Văn C', changeLog: 'Final' }
    ],
    tags: ['taichinh', 'internal'],
    viewCount: 50,
    downloadCount: 10,
    comments: [],
    fileType: 'xlsx',
    isShared: true,
    source: 'Hệ thống',
    avgRating: 3.5,
    ratingCount: 6,
    approvalDate: '2024-06-02',
    approverName: 'Trần Thị B'
  },
  {
    id: 'd5',
    title: 'Quy trình ISO 9001:2015',
    description: 'Tài liệu quy trình chất lượng theo tiêu chuẩn ISO 9001:2015.',
    summary: 'Hướng dẫn triển khai hệ thống quản lý chất lượng, quy trình kiểm soát và cải tiến liên tục.',
    categoryIds: ['c2', 'c2-1', 'c2-2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-01-10',
    effectiveDate: '2024-02-01',
    expiryDate: '2027-02-01',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '3.1', updatedAt: '2024-05-15', updatedBy: 'Phạm Văn D', changeLog: 'Cập nhật theo phản hồi audit' },
      { version: '3.0', updatedAt: '2024-01-10', updatedBy: 'Phạm Văn D', changeLog: 'Áp dụng tiêu chuẩn mới 2015' }
    ],
    tags: ['iso', 'chatluong', 'quytr\u00ecnh'],
    viewCount: 2300,
    downloadCount: 456,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.9,
    ratingCount: 67,
    approvalDate: '2024-01-15',
    approverName: 'Nguyễn Văn A',
    originSpace: 'Khối Kỹ thuật'
  },

  // --- Documents with Approval Statuses ---
  {
    id: 'appr1',
    title: 'Quy định Bảo mật Thông tin',
    description: 'Chính sách bảo mật dữ liệu và thông tin khách hàng.',
    summary: 'Hướng dẫn các quy định bảo mật, quyền truy cập và xử lý dữ liệu nhạy cảm trong tổ chức.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-06-28',
    status: DocStatus.PENDING,
    lifecycleStatus: 'PendingLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-28', updatedBy: 'Phạm Văn D', changeLog: 'Bản đầu tiên chờ duyệt' }
    ],
    tags: ['security', 'policy'],
    viewCount: 5,
    downloadCount: 0,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'appr2',
    title: 'Hướng dẫn Onboarding Nhân viên mới',
    description: 'Quy trình đào tạo và tiếp nhận nhân viên mới vào công ty.',
    summary: 'Checklist và timeline cho quá trình onboarding từ ngày 1 đến ngày 90.',
    categoryIds: ['c1', 'c1-1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-06-27',
    status: DocStatus.PENDING,
    lifecycleStatus: 'PendingLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-27', updatedBy: 'Lê Văn C', changeLog: 'Tạo mới' }
    ],
    tags: ['hr', 'onboarding'],
    viewCount: 8,
    downloadCount: 1,
    comments: [],
    fileType: 'docx',
    source: 'Nội bộ',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'appr3',
    title: 'Tiêu chuẩn Thiết kế UI/UX',
    description: 'Design system và component library cho sản phẩm.',
    summary: 'Nguyên tắc thiết kế giao diện, màu sắc, typography và UX patterns được khuyến nghị.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-06-26',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'ApprovedLevel1' as LifecycleStatus,
    versions: [
      { version: '2.0', updatedAt: '2024-06-26', updatedBy: 'Phạm Văn D', changeLog: 'Cập nhật design tokens' }
    ],
    tags: ['design', 'uiux'],
    viewCount: 45,
    downloadCount: 12,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.2,
    ratingCount: 5,
    approvalDate: '2024-06-27 10:30',
    approverName: 'Trần Thị B (Manager)',
    approverLevel1Avatar: MOCK_USERS[1].avatar
  },
  {
    id: 'appr4',
    title: 'Quy trình Kiểm thử Phần mềm',
    description: 'Hướng dẫn test case, automation và báo cáo bug.',
    summary: 'Quy trình kiểm thử end-to-end bao gồm unit test, integration test và UAT.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-06-25',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'ApprovedLevel1' as LifecycleStatus,
    versions: [
      { version: '1.5', updatedAt: '2024-06-25', updatedBy: 'Lê Văn C', changeLog: 'Thêm automation guidelines' }
    ],
    tags: ['testing', 'qa'],
    viewCount: 67,
    downloadCount: 23,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.5,
    ratingCount: 8,
    approvalDate: '2024-06-26 14:00',
    approverName: 'Trần Thị B (Manager)',
    approverLevel1Avatar: MOCK_USERS[1].avatar
  },
  {
    id: 'appr5',
    title: 'Chính sách Làm việc từ xa',
    description: 'Quy định remote work và hybrid working.',
    summary: 'Hướng dẫn điều kiện, quy trình đăng ký và trách nhiệm khi làm việc từ xa.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-06-24',
    status: DocStatus.PENDING,
    lifecycleStatus: 'PendingLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-24', updatedBy: 'Trần Thị B', changeLog: 'Chính sách mới' }
    ],
    tags: ['hr', 'remote', 'policy'],
    viewCount: 3,
    downloadCount: 0,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'appr6',
    title: 'Quy trình Đánh giá Hiệu suất 2024',
    description: 'Tiêu chí và quy trình đánh giá nhân viên.',
    summary: 'Hướng dẫn chi tiết về các tiêu chí KPI, thang điểm đánh giá và lịch trình thực hiện đánh giá hiệu suất.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's1',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-06-29',
    status: DocStatus.PENDING,
    lifecycleStatus: 'PendingLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-29', updatedBy: 'Lê Văn C', changeLog: 'Bản nháp đầu tiên' }
    ],
    tags: ['hr', 'performance', 'kpi'],
    viewCount: 2,
    downloadCount: 0,
    comments: [],
    fileType: 'docx',
    source: 'Nội bộ',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'appr7',
    title: 'Hướng dẫn Sử dụng Hệ thống ERP',
    description: 'Tài liệu training cho hệ thống ERP mới.',
    summary: 'Hướng dẫn từng bước sử dụng các module trong hệ thống ERP: kế toán, mua hàng, bán hàng.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-06-29',
    status: DocStatus.PENDING,
    lifecycleStatus: 'PendingLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-29', updatedBy: 'Phạm Văn D', changeLog: 'Tạo mới' }
    ],
    tags: ['erp', 'training', 'system'],
    viewCount: 7,
    downloadCount: 1,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'appr8',
    title: 'Quy định Bảo hành Sản phẩm',
    description: 'Chính sách bảo hành và đổi trả sản phẩm.',
    summary: 'Điều khoản bảo hành, quy trình xử lý khiếu nại và thời gian bảo hành cho các loại sản phẩm.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-06-28',
    status: DocStatus.PENDING,
    lifecycleStatus: 'PendingLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-28', updatedBy: 'Lê Văn C', changeLog: 'Draft version' }
    ],
    tags: ['warranty', 'policy', 'customer'],
    viewCount: 4,
    downloadCount: 0,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 0,
    ratingCount: 0
  },
  {
    id: 'appr9',
    title: 'Tài liệu API Integration v2.0',
    description: 'Hướng dẫn tích hợp API cho đối tác.',
    summary: 'Tài liệu kỹ thuật về các endpoint API, authentication và ví dụ code mẫu.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-06-27',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'ApprovedLevel1' as LifecycleStatus,
    versions: [
      { version: '2.0', updatedAt: '2024-06-27', updatedBy: 'Phạm Văn D', changeLog: 'Thêm OAuth 2.0' }
    ],
    tags: ['api', 'integration', 'technical'],
    viewCount: 52,
    downloadCount: 18,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.3,
    ratingCount: 6,
    approvalDate: '2024-06-28 09:15',
    approverName: 'Nguyễn Văn A (Admin)',
    approverLevel1Avatar: MOCK_USERS[0].avatar
  },
  {
    id: 'appr10',
    title: 'Báo cáo Phân tích Thị trường Q2/2024',
    description: 'Tổng quan thị trường và xu hướng ngành.',
    summary: 'Phân tích chi tiết về tình hình thị trường, đối thủ cạnh tranh và cơ hội phát triển trong quý 2.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-06-26',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'ApprovedLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-26', updatedBy: 'Trần Thị B', changeLog: 'Báo cáo hoàn chỉnh' }
    ],
    tags: ['market', 'analysis', 'report'],
    viewCount: 89,
    downloadCount: 31,
    comments: [],
    fileType: 'pptx',
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 12,
    approvalDate: '2024-06-27 16:45',
    approverName: 'Nguyễn Văn A (Admin)',
    approverLevel1Avatar: MOCK_USERS[0].avatar
  },
  {
    id: 'appr11',
    title: 'Kế hoạch Đào tạo An toàn Lao động 2024',
    description: 'Chương trình đào tạo ATLĐ cho toàn thể nhân viên.',
    summary: 'Lịch trình, nội dung đào tạo và yêu cầu chứng chỉ an toàn lao động theo quy định.',
    categoryIds: ['c1', 'c1-2'],
    categoryId: 'c1',
    spaceId: 's1',
    createdBy: MOCK_USERS[0],
    createdAt: '2024-06-25',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'ApprovedLevel1' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-25', updatedBy: 'Nguyễn Văn A', changeLog: 'Kế hoạch năm 2024' }
    ],
    tags: ['training', 'safety', 'hr'],
    viewCount: 73,
    downloadCount: 25,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.8,
    ratingCount: 9,
    approvalDate: '2024-06-26 11:20',
    approverName: 'Trần Thị B (Manager)',
    approverLevel1Avatar: MOCK_USERS[1].avatar
  },

  // --- More Approved Documents for Space s1 (Khối Kỹ thuật) ---
  {
    id: 's1-doc1',
    title: 'Hướng dẫn Vận hành Máy CNC',
    description: 'Quy trình vận hành và bảo trì máy CNC trong xưởng sản xuất.',
    summary: 'Tài liệu hướng dẫn chi tiết về cách vận hành an toàn, bảo dưỡng định kỳ và xử lý sự cố máy CNC.',
    categoryIds: ['c2', 'c2-1'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-03-15',
    effectiveDate: '2024-03-20',
    expiryDate: '2025-03-20',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '2.1', updatedAt: '2024-05-10', updatedBy: 'Phạm Văn D', changeLog: 'Cập nhật quy trình bảo trì' },
      { version: '2.0', updatedAt: '2024-03-15', updatedBy: 'Phạm Văn D', changeLog: 'Phiên bản mới' }
    ],
    tags: ['cnc', 'vanhanh', 'kyth uật'],
    viewCount: 567,
    downloadCount: 89,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.7,
    ratingCount: 23,
    approvalDate: '2024-03-18',
    approverName: 'Nguyễn Văn A',
    originSpace: 'Khối Kỹ thuật'
  },
  {
    id: 's1-doc2',
    title: 'Sơ đồ Hệ thống Điện Nhà máy',
    description: 'Bản vẽ sơ đồ điện tổng thể và hướng dẫn xử lý sự cố.',
    summary: 'Sơ đồ mạch điện 3 pha, hệ thống chiếu sáng và các thiết bị điện công suất lớn trong nhà máy.',
    categoryIds: ['c2', 'c2-2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-02-10',
    effectiveDate: '2024-02-15',
    expiryDate: '2026-02-15',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '3.0', updatedAt: '2024-02-10', updatedBy: 'Phạm Văn D', changeLog: 'Cập nhật theo hiện trạng mới' }
    ],
    tags: ['dien', 'sodo', 'nhama y'],
    viewCount: 432,
    downloadCount: 78,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 18,
    approvalDate: '2024-02-12',
    approverName: 'Trần Thị B',
    originSpace: 'Khối Kỹ thuật'
  },
  {
    id: 's1-doc3',
    title: 'Quy trình An toàn Lao động',
    description: 'Hướng dẫn an toàn khi làm việc với máy móc và hóa chất.',
    summary: 'Quy trình đảm bảo an toàn lao động trong môi trường sản xuất, bao gồm trang bị bảo hộ và xử lý sự cố.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[0],
    createdAt: '2024-01-20',
    effectiveDate: '2024-02-01',
    expiryDate: '2025-02-01',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '4.2', updatedAt: '2024-04-15', updatedBy: 'Nguyễn Văn A', changeLog: 'Bổ sung quy định mới' },
      { version: '4.0', updatedAt: '2024-01-20', updatedBy: 'Nguyễn Văn A', changeLog: 'Cập nhật theo luật mới' }
    ],
    tags: ['antoan', 'baohol ao', 'quydinh'],
    viewCount: 1234,
    downloadCount: 234,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.9,
    ratingCount: 45,
    approvalDate: '2024-01-25',
    approverName: 'Nguyễn Văn A',
    originSpace: 'Khối Kỹ thuật'
  },
  {
    id: 's1-doc4',
    title: 'Checklist Bảo trì Định kỳ Thiết bị',
    description: 'Danh sách kiểm tra bảo trì hàng tháng cho các thiết bị chính.',
    summary: 'Checklist chi tiết để đảm bảo tất cả thiết bị được bảo trì đúng lịch và hoạt động ổn định.',
    categoryIds: ['c2', 'c2-1'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2024-05-01',
    effectiveDate: '2024-05-15',
    expiryDate: '2025-05-15',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.2', updatedAt: '2024-06-01', updatedBy: 'Phạm Văn D', changeLog: 'Bổ sung thiết bị mới' },
      { version: '1.0', updatedAt: '2024-05-01', updatedBy: 'Phạm Văn D', changeLog: 'Phát hành lần đầu' }
    ],
    tags: ['baotri', 'checklist', 'thiet bi'],
    viewCount: 345,
    downloadCount: 112,
    comments: [],
    fileType: 'xlsx',
    source: 'Nội bộ',
    avgRating: 4.4,
    ratingCount: 15,
    approvalDate: '2024-05-10',
    approverName: 'Trần Thị B',
    originSpace: 'Khối Kỹ thuật'
  },
  {
    id: 's1-doc5',
    title: 'Báo cáo Hiệu suất Sản xuất Q2/2024',
    description: 'Phân tích hiệu suất và năng suất sản xuất quý 2.',
    summary: 'Báo cáo tổng hợp số liệu sản xuất, tỷ lệ đạt KPI và các điểm cần cải thiện trong quý 2/2024.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-06-20',
    effectiveDate: '2024-06-25',
    expiryDate: '2024-09-30',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-20', updatedBy: 'Trần Thị B', changeLog: 'Báo cáo quý 2' }
    ],
    tags: ['baocao', 'hieusuat', 'q2'],
    viewCount: 189,
    downloadCount: 34,
    comments: [],
    fileType: 'pdf',
    source: 'Hệ thống',
    avgRating: 4.1,
    ratingCount: 8,
    approvalDate: '2024-06-22',
    approverName: 'Nguyễn Văn A',
    originSpace: 'Khối Kỹ thuật'
  },

  // --- More Approved Documents for Space s2 (Dự án Alpha) ---
  {
    id: 's2-doc1',
    title: 'Biên bản Họp Kick-off Dự án Alpha',
    description: 'Biên bản họp khởi động dự án Alpha - Giai đoạn 2.',
    summary: 'Tóm tắt nội dung họp, phân công nhiệm vụ và timeline chi tiết cho dự án Alpha giai đoạn 2.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-02-15',
    effectiveDate: '2024-02-15',
    expiryDate: '2025-02-15',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-02-15', updatedBy: 'Trần Thị B', changeLog: 'Biên bản đầu tiên' }
    ],
    tags: ['meeting', 'alpha', 'kickoff'],
    viewCount: 156,
    downloadCount: 45,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.3,
    ratingCount: 12,
    approvalDate: '2024-02-16',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 's2-doc2',
    title: 'Kế hoạch Marketing Q2/2024',
    description: 'Chiến lược marketing và kế hoạch triển khai cho quý 2.',
    summary: 'Kế hoạch chi tiết về các chiến dịch marketing, ngân sách và KPI cần đạt trong quý 2/2024.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-03-20',
    effectiveDate: '2024-04-01',
    expiryDate: '2024-06-30',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '2.1', updatedAt: '2024-04-10', updatedBy: 'Lê Văn C', changeLog: 'Điều chỉnh ngân sách' },
      { version: '2.0', updatedAt: '2024-03-20', updatedBy: 'Lê Văn C', changeLog: 'Kế hoạch Q2' }
    ],
    tags: ['marketing', 'kehoach', 'q2'],
    viewCount: 234,
    downloadCount: 67,
    comments: [],
    fileType: 'pptx',
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 18,
    approvalDate: '2024-03-25',
    approverName: 'Trần Thị B'
  },
  {
    id: 's2-doc3',
    title: 'Tài liệu Nghiệm thu Giai đoạn 1',
    description: 'Báo cáo nghiệm thu hoàn thành giai đoạn 1 của dự án Alpha.',
    summary: 'Tài liệu tổng hợp kết quả đạt được, đánh giá và bài học kinh nghiệm từ giai đoạn 1.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-05-10',
    effectiveDate: '2024-05-15',
    expiryDate: '2026-05-15',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-05-10', updatedBy: 'Trần Thị B', changeLog: 'Nghiệm thu chính thức' }
    ],
    tags: ['nghiemthu', 'alpha', 'baocao'],
    viewCount: 189,
    downloadCount: 56,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.7,
    ratingCount: 15,
    approvalDate: '2024-05-12',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 's2-doc4',
    title: 'Danh sách Tài nguyên Dự án',
    description: 'Danh sách nhân lực, thiết bị và tài nguyên được phân bổ cho dự án.',
    summary: 'Tài liệu quản lý tài nguyên bao gồm danh sách thành viên, vai trò và thiết bị hỗ trợ.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-02-20',
    effectiveDate: '2024-02-25',
    expiryDate: '2025-02-25',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.3', updatedAt: '2024-06-01', updatedBy: 'Trần Thị B', changeLog: 'Cập nhật nhân sự mới' },
      { version: '1.0', updatedAt: '2024-02-20', updatedBy: 'Trần Thị B', changeLog: 'Phiên bản đầu' }
    ],
    tags: ['tainguyen', 'nhansu', 'thietbi'],
    viewCount: 145,
    downloadCount: 34,
    comments: [],
    fileType: 'xlsx',
    source: 'Nội bộ',
    avgRating: 4.2,
    ratingCount: 9,
    approvalDate: '2024-02-22',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 's2-doc5',
    title: 'Hướng dẫn Sử dụng Công cụ Quản lý Dự án',
    description: 'Tài liệu hướng dẫn sử dụng các công cụ quản lý dự án như Jira, Trello.',
    summary: 'Hướng dẫn từng bước về cách sử dụng các công cụ để theo dõi tiến độ và quản lý task.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[2],
    createdAt: '2024-03-01',
    effectiveDate: '2024-03-05',
    expiryDate: '2025-03-05',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.1', updatedAt: '2024-04-15', updatedBy: 'Lê Văn C', changeLog: 'Bổ sung hướng dẫn Trello' },
      { version: '1.0', updatedAt: '2024-03-01', updatedBy: 'Lê Văn C', changeLog: 'Hướng dẫn Jira' }
    ],
    tags: ['huongdan', 'jira', 'tool'],
    viewCount: 312,
    downloadCount: 98,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.8,
    ratingCount: 25,
    approvalDate: '2024-03-03',
    approverName: 'Trần Thị B'
  },
  {
    id: 's2-doc6',
    title: 'Báo cáo Tiến độ Tháng 6/2024',
    description: 'Báo cáo tiến độ dự án Alpha cho tháng 6.',
    summary: 'Tổng hợp tiến độ thực hiện, các vấn đề phát sinh và kế hoạch tháng tiếp theo.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-06-25',
    effectiveDate: '2024-06-25',
    expiryDate: '2024-09-30',
    status: DocStatus.APPROVED,
    lifecycleStatus: 'Active' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-06-25', updatedBy: 'Trần Thị B', changeLog: 'Báo cáo tháng 6' }
    ],
    tags: ['baocao', 'tiendo', 'thang6'],
    viewCount: 78,
    downloadCount: 23,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.4,
    ratingCount: 7,
    approvalDate: '2024-06-26',
    approverName: 'Nguyễn Văn A'
  },

  // --- Documents with Expiry Management ---
  {
    id: 'exp1',
    title: 'Quy chế Quản lý Tài chính 2024',
    description: 'Quy định về quản lý ngân sách, quyết toán và thanh toán.',
    summary: 'Quy chế quản lý tài chính áp dụng trong năm 2024, bao gồm quy trình phê duyệt chi và kiểm soát ngân sách.',
    categoryIds: ['c4'],
    categoryId: 'c4',
    spaceId: 's2',
    createdBy: MOCK_USERS[1],
    createdAt: '2024-01-01',
    effectiveDate: '2024-01-01',
    expiryDate: '2024-12-10', // Sắp hết hạn
    status: DocStatus.APPROVED,
    lifecycleStatus: 'NearExpired' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2024-01-01', updatedBy: 'Trần Thị B', changeLog: 'Phát hành' }
    ],
    tags: ['finance', 'policy'],
    viewCount: 234,
    downloadCount: 67,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.3,
    ratingCount: 12,
    daysUntilExpiry: 8,
    approvalDate: '2024-01-02',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 'exp2',
    title: 'Hướng dẫn An toàn Lao động 2023',
    description: 'Quy định an toàn lao động trong môi trường sản xuất.',
    summary: 'Hướng dẫn chi tiết về các biện pháp bảo hộ, quy trình xử lý sự cố và huấn luyện an toàn.',
    categoryIds: ['c2'],
    categoryId: 'c2',
    spaceId: 's1',
    createdBy: MOCK_USERS[3],
    createdAt: '2023-01-15',
    effectiveDate: '2023-02-01',
    expiryDate: '2024-01-31', // Đã hết hạn
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '2.0', updatedAt: '2023-01-15', updatedBy: 'Phạm Văn D', changeLog: 'Cập nhật tiêu chuẩn mới' }
    ],
    tags: ['safety', 'labor'],
    viewCount: 1520,
    downloadCount: 340,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.7,
    ratingCount: 45,
    daysUntilExpiry: -305,
    approvalDate: '2023-01-20',
    approverName: 'Nguyễn Văn A',
    extensionHistory: [
      {
        id: 'ext001',
        oldExpiryDate: '2023-12-31',
        newExpiryDate: '2024-01-31',
        reason: 'Chờ ban hành quy định mới',
        extendedBy: MOCK_USERS[0],
        extendedAt: '2023-12-20 10:00'
      }
    ],
    lastExtensionReason: 'Chờ ban hành quy định mới'
  },
  {
    id: 'exp3',
    title: 'Chính sách Bảo mật Dữ liệu',
    description: 'Quy định về bảo mật và xử lý dữ liệu cá nhân.',
    summary: 'Chính sách bảo mật tuân thủ GDPR và các quy định về dữ liệu cá nhân tại Việt Nam.',
    categoryIds: ['c1'],
    categoryId: 'c1',
    spaceId: 's3',
    createdBy: MOCK_USERS[0],
    createdAt: '2023-06-01',
    effectiveDate: '2023-07-01',
    expiryDate: '2024-11-30', // Sắp hết hạn
    status: DocStatus.APPROVED,
    lifecycleStatus: 'NearExpired' as LifecycleStatus,
    versions: [
      { version: '1.5', updatedAt: '2024-06-01', updatedBy: 'Nguyễn Văn A', changeLog: 'Cập nhật theo PDPA' }
    ],
    tags: ['security', 'privacy', 'gdpr'],
    viewCount: 890,
    downloadCount: 234,
    comments: [],
    fileType: 'pdf',
    source: 'Nội bộ',
    avgRating: 4.6,
    ratingCount: 28,
    daysUntilExpiry: 28,
    approvalDate: '2023-06-15',
    approverName: 'Nguyễn Văn A'
  },
  {
    id: 'exp4',
    title: 'Quy trình Kiểm kê Tài sản 2023',
    description: 'Hướng dẫn kiểm kê tài sản định kỳ hàng năm.',
    summary: 'Quy trình và biểu mẫu kiểm kê tài sản cố định, công cụ dụng cụ và vật tư.',
    categoryIds: ['c4'],
    categoryId: 'c4',
    spaceId: 's2',
    createdBy: MOCK_USERS[2],
    createdAt: '2023-03-01',
    effectiveDate: '2023-04-01',
    expiryDate: '2024-03-31', // Đã hết hạn
    status: DocStatus.EXPIRED,
    lifecycleStatus: 'Expired' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2023-03-01', updatedBy: 'Lê Văn C', changeLog: 'Phát hành' }
    ],
    tags: ['asset', 'inventory'],
    viewCount: 456,
    downloadCount: 123,
    comments: [],
    fileType: 'xlsx',
    source: 'Nội bộ',
    avgRating: 4.1,
    ratingCount: 18,
    daysUntilExpiry: -246,
    approvalDate: '2023-03-10',
    approverName: 'Trần Thị B'
  },
  {
    id: 'arch1',
    title: 'Kế hoạch Marketing 2022',
    description: 'Chiến lược marketing và truyền thông năm 2022.',
    summary: 'Kế hoạch chi tiết các chiến dịch marketing, ngân sách và KPIs cho năm 2022.',
    categoryIds: ['c3'],
    categoryId: 'c3',
    spaceId: 's2',
    createdBy: MOCK_USERS[2],
    createdAt: '2021-12-01',
    effectiveDate: '2022-01-01',
    expiryDate: '2022-12-31',
    status: DocStatus.ARCHIVED,
    lifecycleStatus: 'Archived' as LifecycleStatus,
    versions: [
      { version: '1.0', updatedAt: '2021-12-01', updatedBy: 'Lê Văn C', changeLog: 'Phát hành' }
    ],
    tags: ['marketing', '2022', 'archived'],
    viewCount: 1200,
    downloadCount: 345,
    comments: [],
    fileType: 'pptx',
    source: 'Nội bộ',
    avgRating: 4.4,
    ratingCount: 22,
    approvalDate: '2021-12-10',
    approverName: 'Trần Thị B'
  }
];

// --- Feedback & Ratings Mocks ---
let MOCK_SUGGESTIONS: FeedbackSuggestion[] = [
    {
        id: 'sug1',
        content: 'Nội dung trang 5 về quy trình an toàn chưa cập nhật theo ISO mới.',
        docId: 'd1',
        docTitle: 'Lộ trình phát triển Quý 3/2024',
        categoryId: 'c2',
        spaceId: 's1',
        user: MOCK_USERS[3], // Pham Van D
        status: 'New',
        createdAt: '2024-06-25 09:00',
        history: [{ user: 'Phạm Văn D', action: 'Gửi góp ý', timestamp: '2024-06-25 09:00' }]
    },
    {
        id: 'sug2',
        content: 'Báo cáo thiếu số liệu tháng 5.',
        docId: 'd4',
        docTitle: 'Báo cáo tài chính Q2',
        categoryId: 'c3',
        spaceId: 's2',
        user: MOCK_USERS[1], // Tran Thi B
        handler: MOCK_USERS[0], // Nguyen Van A
        status: 'Processing',
        createdAt: '2024-06-26 14:00',
        history: [
            { user: 'Trần Thị B', action: 'Gửi góp ý', timestamp: '2024-06-26 14:00' },
            { user: 'Nguyễn Văn A', action: 'Tiếp nhận xử lý', timestamp: '2024-06-26 15:00' }
        ]
    }
];

const MOCK_RATINGS: DocumentRating[] = [
    {
        id: 'r1',
        docId: 'd2',
        docTitle: 'Sổ tay nhân viên 2023',
        user: MOCK_USERS[2],
        rating: 5,
        comment: 'Rất chi tiết và dễ hiểu, cảm ơn team HR.',
        createdAt: '2024-01-15'
    },
    {
        id: 'r2',
        docId: 'd2',
        docTitle: 'Sổ tay nhân viên 2023',
        user: MOCK_USERS[3],
        rating: 4,
        comment: '',
        createdAt: '2024-02-20'
    },
    {
        id: 'r3',
        docId: 'd1',
        docTitle: 'Lộ trình phát triển Quý 3/2024',
        user: MOCK_USERS[2],
        rating: 4,
        comment: 'Cần bổ sung thêm timeline chi tiết hơn.',
        createdAt: '2023-11-05'
    }
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'al1', action: 'Phê duyệt', user: 'Nguyễn Văn A', target: 'Lộ trình phát triển Q3', timestamp: '2024-06-15 10:00', details: 'Duyệt phiên bản 1.0' },
  { id: 'al2', action: 'Chia sẻ', user: 'Trần Thị B', target: 'Báo cáo tài chính Q2', timestamp: '2024-06-14 14:30', details: 'Chia sẻ cho Phòng Marketing' },
  { id: 'al4', action: 'Xóa danh mục', user: 'Nguyễn Văn A', target: 'Tài liệu cũ 2020', timestamp: '2024-06-10 08:00', details: 'Dọn dẹp hệ thống' },
];

const MOCK_POLICY: SystemPolicy = {
  retentionDays: 365,
  maxShareDurationDays: 30,
  defaultReviewer: 'Nguyễn Văn A',
  passwordRequiredForShare: true,
};

let MOCK_TAGS = ['kehoach', 'roadmap', 'quy3', 'hr', 'noiquy', 'specs', 'alpha', 'taichinh', 'internal', 'iso', 'huanluyen'];

// --- Knowledge Ingestion Mocks ---
const MOCK_DATA_SOURCES: DataSource[] = [
  { id: 'ds1', name: 'Email HR', type: 'Outlook M365', status: 'Active', lastSync: '10:30 AM' },
  { id: 'ds2', name: 'OneDrive Kỹ thuật', type: 'OneDrive Folder', status: 'Active', lastSync: '10:30 AM' },
  { id: 'ds3', name: 'SharePoint Quy trình', type: 'SP Site', status: 'Error', lastSync: '09:50 AM' },
  { id: 'ds4', name: 'Maximo Docs', type: 'API', status: 'Active', lastSync: 'Yesterday' },
  { id: 'ds5', name: 'Ổ đĩa D:/Docs', type: 'Agent', status: 'Active', lastSync: '11:00 AM' },
];

const MOCK_SCHEDULES: SyncSchedule[] = [
  { id: 'sch1', sourceId: 'ds1', sourceName: 'Email HR', frequency: '15 phút', type: 'Incremental', status: 'Running', lastRun: '10:30 AM' },
  { id: 'sch2', sourceId: 'ds2', sourceName: 'OneDrive Kỹ thuật', frequency: '6 giờ', type: 'Incremental', status: 'Idle', lastRun: '04:30 AM' },
  { id: 'sch3', sourceId: 'ds3', sourceName: 'SharePoint Quy trình', frequency: '00:00 hàng ngày', type: 'Full', status: 'Error', lastRun: 'Yesterday' },
];

const MOCK_INGESTION_LOGS: IngestionLog[] = [
  { id: 'log1', timestamp: '10:30', sourceName: 'Email HR', newDocsCount: 12, errorCount: 0, details: 'Sync successful', status: 'Success' },
  { id: 'log2', timestamp: '10:30', sourceName: 'OneDrive Kỹ thuật', newDocsCount: 5, errorCount: 1, details: 'Permission denied on /Confidential', status: 'Warning' },
  { id: 'log3', timestamp: '09:50', sourceName: 'SharePoint Quy trình', newDocsCount: 0, errorCount: 2, details: 'Connection timeout', status: 'Error' },
  { id: 'log4', timestamp: '09:00', sourceName: 'Maximo Docs', newDocsCount: 45, errorCount: 0, details: 'Batch import completed', status: 'Success' },
];

// --- Sync Sources Mock Data ---
let MOCK_SYNC_SOURCES: SyncSource[] = [
  {
    id: 'sync1',
    type: 'SharePoint',
    name: 'SharePoint Phòng HR',
    endpoint: 'https://bsrpetro.sharepoint.com/sites/hr',
    username: 'admin@bsrpetro.com',
    token: '••••••••••••',
    frequency: 'Daily',
    approvalMode: 'Manual',
    syncMode: 'Incremental',
    connectionStatus: 'Connected',
    lastSync: '2024-12-02 08:00',
    lastSyncStatus: 'Success',
    createdAt: '2024-10-15',
    createdBy: MOCK_USERS[0],
    isActive: true
  },
  {
    id: 'sync2',
    type: 'Google Drive',
    name: 'Google Drive Kỹ thuật',
    endpoint: 'https://drive.google.com/drive/folders/abc123xyz',
    username: 'kythuat@bsrpetro.com',
    token: '••••••••••••',
    frequency: 'Weekly',
    approvalMode: 'Auto',
    syncMode: 'Full',
    connectionStatus: 'Connected',
    lastSync: '2024-11-30 14:30',
    lastSyncStatus: 'Success',
    createdAt: '2024-09-20',
    createdBy: MOCK_USERS[0],
    isActive: true
  },
  {
    id: 'sync3',
    type: 'Confluence',
    name: 'Confluence Wiki Nội bộ',
    endpoint: 'https://bsr.atlassian.net/wiki',
    username: 'bot@bsrpetro.com',
    token: '••••••••••••',
    frequency: 'Manual',
    approvalMode: 'Manual',
    syncMode: 'Incremental',
    connectionStatus: 'Error',
    lastSync: '2024-11-28 10:15',
    lastSyncStatus: 'Error',
    createdAt: '2024-08-10',
    createdBy: MOCK_USERS[0],
    isActive: true
  }
];

let MOCK_SYNC_HISTORY: SyncHistory[] = [
  {
    id: 'hist1',
    sourceId: 'sync1',
    sourceName: 'SharePoint Phòng HR',
    syncTime: '2024-12-02 08:00',
    docsCollected: 15,
    docsSuccess: 15,
    docsError: 0,
    status: 'Success',
    triggeredBy: 'Auto',
    details: 'Thu thập từ SharePoint: https://bsrpetro.sharepoint.com/sites/hr'
  },
  {
    id: 'hist2',
    sourceId: 'sync1',
    sourceName: 'SharePoint Phòng HR',
    syncTime: '2024-12-01 08:00',
    docsCollected: 8,
    docsSuccess: 7,
    docsError: 1,
    status: 'Error',
    triggeredBy: 'Auto',
    errorMessage: '1 tài liệu không thể đồng bộ do lỗi quyền truy cập',
    details: 'Thu thập từ SharePoint: https://bsrpetro.sharepoint.com/sites/hr'
  },
  {
    id: 'hist3',
    sourceId: 'sync2',
    sourceName: 'Google Drive Kỹ thuật',
    syncTime: '2024-11-30 14:30',
    docsCollected: 23,
    docsSuccess: 23,
    docsError: 0,
    status: 'Success',
    triggeredBy: 'Auto',
    details: 'Thu thập từ Google Drive: https://drive.google.com/drive/folders/abc123xyz'
  },
  {
    id: 'hist4',
    sourceId: 'sync3',
    sourceName: 'Confluence Wiki Nội bộ',
    syncTime: '2024-11-28 10:15',
    docsCollected: 0,
    docsSuccess: 0,
    docsError: 5,
    status: 'Error',
    triggeredBy: 'Manual',
    triggeredByUser: MOCK_USERS[0],
    errorMessage: 'Connection timeout - không thể kết nối đến Confluence server',
    details: 'Thu thập từ Confluence: https://bsr.atlassian.net/wiki'
  }
];

// --- Mock Collected Documents for Knowledge Collection ---
let MOCK_COLLECTED_DOCUMENTS: CollectedDocument[] = [
  {
    id: 'col1',
    fileName: 'Quy_trinh_bao_tri_thiet_bi.pdf',
    fileSize: 2450000,
    source: 'Email',
    sourceDetail: 'email@kythuat.com - 25/12/2024',
    collectedBy: 'u3',
    collectedByName: 'Lê Văn C',
    collectedAt: '2024-12-25 09:30',
    status: 'Collected',
    notes: 'Tài liệu từ email phòng kỹ thuật'
  },
  {
    id: 'col2',
    fileName: 'Bao_cao_tai_chinh_thang_11.xlsx',
    fileSize: 1200000,
    source: 'SharePoint',
    sourceDetail: 'SharePoint Phòng Tài chính',
    collectedBy: 'u2',
    collectedByName: 'Trần Thị B',
    collectedAt: '2024-12-24 14:15',
    status: 'Classified',
    categoryIds: ['c4'],
    spaceId: 's2',
    tags: ['taichinh', 'baocao', 'thang11'],
    effectiveDate: '2024-11-01',
    expiryDate: '2025-11-30',
    notes: 'Đã phân loại vào danh mục Tài chính'
  },
  {
    id: 'col3',
    fileName: 'Huong_dan_su_dung_ERP.docx',
    fileSize: 3800000,
    source: 'OneDrive',
    sourceDetail: 'OneDrive - Shared with me',
    collectedBy: 'u4',
    collectedByName: 'Phạm Văn D',
    collectedAt: '2024-12-23 10:00',
    status: 'InApproval',
    categoryIds: ['c3'],
    spaceId: 's2',
    tags: ['erp', 'huongdan', 'training'],
    effectiveDate: '2024-12-20',
    expiryDate: '2025-12-20',
    contributorName: 'Nguyễn Thị E - Phòng CNTT',
    notes: 'Đã gửi phê duyệt - chờ xét duyệt từ Manager'
  },
  {
    id: 'col4',
    fileName: 'ISO_9001_2015_Guidelines.pdf',
    fileSize: 5200000,
    source: 'GoogleDrive',
    sourceDetail: 'Google Drive - ISO Documents',
    collectedBy: 'u3',
    collectedByName: 'Lê Văn C',
    collectedAt: '2024-12-22 16:45',
    status: 'Collected',
    notes: 'Cần review trước khi phân loại'
  },
  {
    id: 'col5',
    fileName: 'Chinh_sach_nghi_phep_2025.pdf',
    fileSize: 890000,
    source: 'Local',
    sourceDetail: 'Upload từ máy tính cá nhân',
    collectedBy: 'u2',
    collectedByName: 'Trần Thị B',
    collectedAt: '2024-12-21 11:20',
    status: 'Classified',
    categoryIds: ['c1', 'c1-2'],
    spaceId: 's3',
    tags: ['hr', 'nghiphep', '2025'],
    effectiveDate: '2025-01-01',
    expiryDate: '2025-12-31',
    contributorName: 'Phòng Nhân sự',
    notes: 'Chính sách nghỉ phép năm 2025'
  },
  {
    id: 'col6',
    fileName: 'Ban_ve_he_thong_dien.dwg',
    fileSize: 12500000,
    source: 'Email',
    sourceDetail: 'kythuat@company.vn - 20/12/2024',
    collectedBy: 'u4',
    collectedByName: 'Phạm Văn D',
    collectedAt: '2024-12-20 09:00',
    status: 'Approved',
    categoryIds: ['c2', 'c2-2'],
    spaceId: 's1',
    tags: ['banve', 'dien', 'kythuat'],
    effectiveDate: '2024-12-15',
    expiryDate: '2026-12-15',
    contributorName: 'Kỹ sư Điện - Phòng Kỹ thuật',
    notes: 'Đã được phê duyệt và lưu vào kho tài liệu'
  },
  {
    id: 'col7',
    fileName: 'Checklist_kiem_tra_chat_luong.xlsx',
    fileSize: 620000,
    source: 'SharePoint',
    sourceDetail: 'SharePoint QA Team',
    collectedBy: 'u3',
    collectedByName: 'Lê Văn C',
    collectedAt: '2024-12-19 13:30',
    status: 'Rejected',
    notes: 'Bị từ chối - Nội dung không đầy đủ, cần bổ sung thêm thông tin'
  },
  {
    id: 'col8',
    fileName: 'Training_Material_Safety.pptx',
    fileSize: 8900000,
    source: 'Other',
    sourceDetail: 'USB Drive - Training Department',
    collectedBy: 'u1',
    collectedByName: 'Nguyễn Văn A',
    collectedAt: '2024-12-18 15:00',
    status: 'Discarded',
    notes: 'Đã loại bỏ - Tài liệu trùng lặp với tài liệu hiện có'
  }
];

// --- Mock Activity Logs for Reports ---
const MOCK_ACTIVITY_LOGS: DocumentActivityLog[] = [
  // Today's activities
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'view', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-22 10:30' },
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'download', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-22 09:15' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'view', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-22 08:45' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'view', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-22 14:20' },
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'share', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-22 11:30' },
  
  // Yesterday's activities  
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'share', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-21 16:20' },
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'comment', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-21 14:10' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'upload', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-21 11:00' },
  { docId: 'd5', docTitle: 'Báo cáo Doanh thu Q4', activityType: 'view', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-21 15:30' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'download', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-21 10:15' },
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'view', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-21 09:00' },
  
  // 2 days ago
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'rate', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-20 13:45', details: '5 sao' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'view', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-20 11:20' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'view', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-20 10:30' },
  { docId: 'd5', docTitle: 'Báo cáo Doanh thu Q4', activityType: 'upload', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-20 08:15' },
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'comment', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-20 16:45' },
  
  // 3 days ago
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'view', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-19 14:20' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'download', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-19 12:10' },
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'share', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-19 10:00' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'view', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-19 09:30' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'upload', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-19 08:00' },
  
  // 4 days ago
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'view', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-18 15:30' },
  { docId: 'd5', docTitle: 'Báo cáo Doanh thu Q4', activityType: 'view', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-18 13:20' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'comment', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-18 11:00' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'download', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-18 09:45' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'share', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-18 08:30' },
  
  // 5 days ago
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'rate', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-17 14:15', details: '4 sao' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'view', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-17 12:30' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'view', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-17 10:20' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'upload', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-17 09:00' },
  { docId: 'd5', docTitle: 'Báo cáo Doanh thu Q4', activityType: 'download', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-17 08:15' },
  
  // 6 days ago
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'view', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-16 16:00' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'comment', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-16 14:30' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'share', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-16 12:15' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'view', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-16 10:45' },
  { docId: 'd5', docTitle: 'Báo cáo Doanh thu Q4', activityType: 'view', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-16 09:20' },
  
  // Additional activities for better stats
  { docId: 'd1', docTitle: 'Chính sách Làm việc từ xa', activityType: 'view', userId: 'u3', userName: 'Lê Văn C', department: 'Kinh doanh', timestamp: '2024-12-15 15:00' },
  { docId: 'd2', docTitle: 'Quy trình Onboarding', activityType: 'download', userId: 'u2', userName: 'Trần Thị B', department: 'Nhân sự', timestamp: '2024-12-15 13:30' },
  { docId: 'd3', docTitle: 'Quy định Bảo mật thông tin', activityType: 'upload', userId: 'u4', userName: 'Phạm Văn D', department: 'Kỹ thuật', timestamp: '2024-12-15 11:15' },
  { docId: 'd4', docTitle: 'Hướng dẫn Sử dụng Phần mềm CRM', activityType: 'share', userId: 'u1', userName: 'Nguyễn Văn A', department: 'CNTT', timestamp: '2024-12-15 09:45' },
];

// --- RBAC Mock Data ---
let MOCK_ROLES: Role[] = [
  {
    id: 'role1',
    name: 'System Admin',
    description: 'Quản trị viên hệ thống - Toàn quyền trên toàn bộ hệ thống KMS',
    systemPermissions: ['view_dashboard', 'manage_categories', 'manage_spaces', 'view_all_docs', 'upload_docs', 'edit_docs', 'delete_docs', 'approve_docs', 'manage_users', 'manage_roles', 'view_reports', 'manage_ingestion'],
    categoryPermissions: MOCK_CATEGORIES.map(cat => ({ categoryId: cat.id, actions: ['view', 'upload', 'edit', 'approve', 'version'] })),
    spacePermissions: MOCK_SPACES.map(sp => ({ spaceId: sp.id, role: 'Owner' as const })),
    approvalPermissions: [],
    status: 'Active',
    userCount: 2,
    createdAt: '2024-01-01',
    createdBy: 'Hệ thống',
    assignedUserIds: ['u1']
  },
  {
    id: 'role2',
    name: 'Content Manager',
    description: 'Quản lý nội dung - Phê duyệt tài liệu, quản lý danh mục và không gian',
    systemPermissions: ['view_dashboard', 'manage_categories', 'view_all_docs', 'upload_docs', 'edit_docs', 'approve_docs', 'view_reports'],
    categoryPermissions: [
      { categoryId: 'c1', actions: ['view', 'upload', 'edit', 'approve'] },
      { categoryId: 'c2', actions: ['view', 'upload', 'edit', 'approve'] },
      { categoryId: 'c3', actions: ['view', 'approve'] }
    ],
    spacePermissions: [
      { spaceId: 's1', role: 'Moderator' },
      { spaceId: 's2', role: 'Moderator' }
    ],
    approvalPermissions: [
      { categoryId: 'c1', level: 1 },
      { categoryId: 'c2', level: 1 }
    ],
    status: 'Active',
    userCount: 5,
    createdAt: '2024-01-15',
    createdBy: 'Nguyễn Văn A',
    assignedUserIds: ['u2']
  },
  {
    id: 'role3',
    name: 'Document Contributor',
    description: 'Người đóng góp - Tải lên và chỉnh sửa tài liệu trong phạm vi được giao',
    systemPermissions: ['view_dashboard', 'upload_docs', 'edit_docs'],
    categoryPermissions: [
      { categoryId: 'c1', actions: ['view', 'upload'] },
      { categoryId: 'c2', actions: ['view', 'upload', 'edit'] },
      { categoryId: 'c3', actions: ['view', 'upload'] }
    ],
    spacePermissions: [
      { spaceId: 's1', role: 'Contributor' },
      { spaceId: 's3', role: 'Contributor' }
    ],
    approvalPermissions: [],
    status: 'Active',
    userCount: 25,
    createdAt: '2024-02-01',
    createdBy: 'Nguyễn Văn A',
    assignedUserIds: ['u3', 'u4']
  },
  {
    id: 'role4',
    name: 'Viewer',
    description: 'Người xem - Chỉ có quyền xem tài liệu đã được phê duyệt',
    systemPermissions: ['view_dashboard'],
    categoryPermissions: MOCK_CATEGORIES.map(cat => ({ categoryId: cat.id, actions: ['view'] })),
    spacePermissions: MOCK_SPACES.filter(s => s.privacy === 'Public').map(sp => ({ spaceId: sp.id, role: 'Viewer' as const })),
    approvalPermissions: [],
    status: 'Active',
    userCount: 150,
    createdAt: '2024-01-01',
    createdBy: 'Hệ thống',
    assignedUserIds: []
  },
  {
    id: 'role5',
    name: 'Technical Reviewer',
    description: 'Chuyên gia kỹ thuật - Phê duyệt tài liệu kỹ thuật cấp 2',
    systemPermissions: ['view_dashboard', 'view_all_docs', 'approve_docs'],
    categoryPermissions: [
      { categoryId: 'c2', actions: ['view', 'approve'] }
    ],
    spacePermissions: [
      { spaceId: 's1', role: 'Moderator' }
    ],
    approvalPermissions: [
      { categoryId: 'c2', level: 2 }
    ],
    status: 'Active',
    userCount: 3,
    createdAt: '2024-03-10',
    createdBy: 'Nguyễn Văn A',
    notes: 'Chỉ phê duyệt tài liệu kỹ thuật phức tạp',
    assignedUserIds: []
  }
];

export const KMSService = {
  getStats: async () => {
    return {
      totalDocs: MOCK_DOCS.length,
      pendingApproval: MOCK_DOCS.filter(d => d.status === DocStatus.PENDING).length,
      expiredDocs: MOCK_DOCS.filter(d => d.status === DocStatus.EXPIRED).length,
      totalViews: MOCK_DOCS.reduce((acc, curr) => acc + curr.views, 0),
    };
  },

  getDocuments: async (filters?: SearchFilters) => {
    let docs = [...MOCK_DOCS];
    
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters?.sharedOnly) {
        docs = docs.filter(d => d.isShared);
    }

    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      docs = docs.filter(d => filters.categoryIds?.includes(d.categoryId));
    }

    if (filters?.spaceIds && filters.spaceIds.length > 0) {
      docs = docs.filter(d => filters.spaceIds?.includes(d.spaceId));
    }
    
    if (filters?.tags && filters.tags.length > 0) {
       docs = docs.filter(d => d.tags.some(t => filters.tags?.includes(t)));
    }

    if (filters?.fileTypes && filters.fileTypes.length > 0) {
       docs = docs.filter(d => filters.fileTypes?.includes(d.fileType));
    }

    if (filters?.createdBy) {
       docs = docs.filter(d => d.createdBy.id === filters.createdBy);
    }

    if (filters?.status && filters.status.length > 0) {
       docs = docs.filter(d => filters.status?.includes(d.status));
    }

    if (filters?.dateFrom) {
       // Filter by Approval Date OR Created Date
       docs = docs.filter(d => (d.approvalDate || d.createdAt) >= filters.dateFrom!);
    }
    
    if (filters?.dateTo) {
       docs = docs.filter(d => (d.approvalDate || d.createdAt) <= filters.dateTo!);
    }
    
    // Sort
    if (filters?.sortBy) {
        if (filters.sortBy === 'newest') docs.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
        if (filters.sortBy === 'views') docs.sort((a,b) => b.views - a.views);
        if (filters.sortBy === 'rating') docs.sort((a,b) => (b.avgRating || 0) - (a.avgRating || 0));
        // Relevance mock: simplified as standard order or title match priority
    }

    return docs;
  },
  
  getSearchSuggestions: async (query: string) => {
      // Mock AI suggestions
      if (!query) return [];
      const q = query.toLowerCase();
      const suggestions = [];
      
      // Suggest docs
      const relatedDocs = MOCK_DOCS.filter(d => d.title.toLowerCase().includes(q)).slice(0, 2);
      if (relatedDocs.length > 0) suggestions.push(`Tài liệu: ${relatedDocs[0].title}`);
      
      // Suggest tags
      const relatedTags = MOCK_TAGS.filter(t => t.includes(q)).slice(0, 2);
      relatedTags.forEach(t => suggestions.push(`Thẻ: #${t}`));
      
      // Suggest intent
      if (q.includes('báo cáo')) suggestions.push('Bạn đang tìm: Báo cáo tài chính quý gần nhất?');
      if (q.includes('quy trình')) suggestions.push('Gợi ý: Quy trình ISO 2024');
      
      return suggestions;
  },

  getDocumentById: async (id: string) => {
    return MOCK_DOCS.find(d => d.id === id);
  },

  getCategories: async () => MOCK_CATEGORIES,
  
  getSpaces: async () => MOCK_SPACES,

  createSpace: async (spaceData: Partial<Space>) => {
    const ownerUser = MOCK_USERS.find(u => u.id === spaceData.ownerId);
    const newSpace: Space = {
        id: `s${Date.now()}`,
        name: spaceData.name || 'New Space',
        type: spaceData.type || 'Project',
        description: spaceData.description || '',
        privacy: spaceData.privacy || 'Private',
        status: 'Active',
        ownerId: spaceData.ownerId || 'u1',
        ownerName: ownerUser?.name,
        memberCount: 1,
        docCount: 0,
        pendingDocCount: 0,
        categoryIds: spaceData.categoryIds || [],
        createdAt: new Date().toISOString().split('T')[0],
        members: ownerUser ? [{ ...ownerUser, spaceRole: 'Owner' }] : []
    };
    MOCK_SPACES.push(newSpace);
    return newSpace;
  },

  updateSpaceStatus: async (id: string, status: 'Active' | 'Archived') => {
      const idx = MOCK_SPACES.findIndex(s => s.id === id);
      if (idx !== -1) {
          const space = MOCK_SPACES[idx];
          
          // Validation for archiving
          if (status === 'Archived' && space.pendingDocCount && space.pendingDocCount > 0) {
              throw new Error('Không thể lưu trữ không gian do đang có tài liệu chờ phê duyệt');
          }
          
          MOCK_SPACES[idx].status = status;
          MOCK_SPACES[idx].updatedAt = new Date().toISOString().split('T')[0];
          return MOCK_SPACES[idx];
      }
      throw new Error("Space not found");
  },

  updateSpace: async (id: string, spaceData: Partial<Space>) => {
      const idx = MOCK_SPACES.findIndex(s => s.id === id);
      if (idx !== -1) {
          MOCK_SPACES[idx] = {
              ...MOCK_SPACES[idx],
              ...spaceData,
              updatedAt: new Date().toISOString().split('T')[0]
          };
          return MOCK_SPACES[idx];
      }
      throw new Error("Space not found");
  },

  addSpaceMember: async (spaceId: string, userId: string, role: SpaceRole = 'Viewer') => {
      const space = MOCK_SPACES.find(s => s.id === spaceId);
      const user = MOCK_USERS.find(u => u.id === userId);
      
      if (!space || !user) throw new Error("Space or User not found");
      
      if (!space.members) space.members = [];
      
      // Check if already member
      const existing = space.members.find(m => m.id === userId);
      if (existing) {
          existing.spaceRole = role;
      } else {
          space.members.push({ ...user, spaceRole: role });
          space.memberCount = space.members.length;
      }
      
      return space;
  },

  removeSpaceMember: async (spaceId: string, userId: string) => {
      const space = MOCK_SPACES.find(s => s.id === spaceId);
      if (!space) throw new Error("Space not found");
      
      if (userId === space.ownerId) {
          throw new Error("Không thể xóa Owner khỏi không gian");
      }
      
      if (space.members) {
          space.members = space.members.filter(m => m.id !== userId);
          space.memberCount = space.members.length;
      }
      
      return space;
  },

  deleteSpace: async (id: string) => {
      const space = MOCK_SPACES.find(s => s.id === id);
      if (!space) throw new Error("Space not found");
      
      if (space.docCount > 0) {
          throw new Error("Không thể xóa không gian đang chứa tài liệu");
      }
      
      if (space.memberCount > 1) {
          throw new Error("Không thể xóa không gian đang có thành viên");
      }
      
      MOCK_SPACES = MOCK_SPACES.filter(s => s.id !== id);
      return true;
  },

  getSpaceById: async (id: string) => MOCK_SPACES.find(s => s.id === id),

  getTopicsBySpace: async (spaceId: string) => MOCK_TOPICS.filter(t => t.spaceId === spaceId),

  getDiscussionsBySpace: async (spaceId: string) => MOCK_DISCUSSIONS.filter(d => d.spaceId === spaceId),

  getAllUsers: async () => MOCK_USERS,

  getAllComments: async () => MOCK_COMMENTS,

  getAuditLogs: async () => MOCK_AUDIT_LOGS,

  getSystemPolicy: async () => MOCK_POLICY,

  getTags: async () => MOCK_TAGS,

  // --- Feedback Methods ---
  getSuggestions: async () => MOCK_SUGGESTIONS,

  getRatings: async () => MOCK_RATINGS,

  updateSuggestionStatus: async (id: string, status: FeedbackStatus, handlerId?: string) => {
    const sug = MOCK_SUGGESTIONS.find(s => s.id === id);
    if (sug) {
       sug.status = status;
       if (handlerId) {
           sug.handler = MOCK_USERS.find(u => u.id === handlerId);
       }
       sug.history?.push({
          user: 'Hệ thống',
          action: `Cập nhật trạng thái thành ${status}`,
          timestamp: new Date().toISOString()
       });
       return sug;
    }
    throw new Error("Không tìm thấy góp ý");
  },

  assignReviewer: async (id: string, handlerId: string) => {
      const sug = MOCK_SUGGESTIONS.find(s => s.id === id);
      if (sug) {
          sug.handler = MOCK_USERS.find(u => u.id === handlerId);
          sug.status = 'Processing';
          sug.history?.push({
              user: 'Admin',
              action: `Giao xử lý cho ${sug.handler?.name}`,
              timestamp: new Date().toISOString()
          });
          return sug;
      }
      throw new Error("Không tìm thấy góp ý");
  },

  updateDocumentFromFeedback: async (docId: string, feedbackId: string, updateData: {
    title: string;
    summary: string;
    categoryIds: string[];
    tags: string[];
    newFile: File | null;
    processingNote: string;
  }) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    const feedback = MOCK_SUGGESTIONS.find(s => s.id === feedbackId);
    
    if (!doc || !feedback) {
      throw new Error("Không tìm thấy tài liệu hoặc góp ý");
    }

    // Update document metadata (saved as draft/pending version)
    doc.title = updateData.title;
    doc.summary = updateData.summary;
    doc.categoryIds = updateData.categoryIds;
    doc.tags = updateData.tags;
    
    // In real app, upload new file to storage
    if (updateData.newFile) {
      doc.fileName = updateData.newFile.name;
    }

    // Update feedback status
    feedback.status = 'Processing';
    feedback.history = feedback.history || [];
    feedback.history.push({
      user: 'Admin',
      action: 'Cập nhật metadata và file tài liệu',
      timestamp: new Date().toLocaleString('vi-VN')
    });
    
    if (updateData.processingNote) {
      feedback.history.push({
        user: 'Admin',
        action: `Ghi chú: ${updateData.processingNote}`,
        timestamp: new Date().toLocaleString('vi-VN')
      });
    }

    return { doc, feedback };
  },

  createVersionFromFeedback: async (docId: string, feedbackId: string, changeLog: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    const feedback = MOCK_SUGGESTIONS.find(s => s.id === feedbackId);
    
    if (!doc || !feedback) {
      throw new Error("Không tìm thấy tài liệu hoặc góp ý");
    }

    // Create new version
    const currentVersion = doc.versions[0].version;
    const versionParts = currentVersion.split('.');
    const newVersionNum = `${versionParts[0]}.${parseInt(versionParts[1]) + 1}`;

    doc.versions.unshift({
      version: newVersionNum,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin',
      changeLog: changeLog
    });

    // Set document to pending approval for new version
    doc.status = DocStatus.PENDING;

    // Update feedback to resolved
    feedback.status = 'Resolved';
    feedback.history = feedback.history || [];
    feedback.history.push({
      user: 'Admin',
      action: `Đã tạo phiên bản ${newVersionNum} từ góp ý này`,
      timestamp: new Date().toLocaleString('vi-VN')
    });

    return { doc, feedback, newVersion: newVersionNum };
  },

  rateDocument: async (docId: string, rating: number, comment?: string) => {
     const doc = MOCK_DOCS.find(d => d.id === docId);
     if (doc) {
        doc.avgRating = rating; // Simplified
        MOCK_RATINGS.push({
            id: `r${Date.now()}`,
            docId,
            docTitle: doc.title,
            rating,
            comment,
            user: MOCK_USERS[2], // Mock current user
            createdAt: new Date().toISOString().split('T')[0]
        });
     }
  },

  addTag: async (tag: string) => {
    if (!MOCK_TAGS.includes(tag)) {
        MOCK_TAGS.push(tag);
    }
    return MOCK_TAGS;
  },

  deleteTag: async (tag: string) => {
    MOCK_TAGS = MOCK_TAGS.filter(t => t !== tag);
    return MOCK_TAGS;
  },

  createDocument: async (doc: Partial<KMSDocument>) => {
    const newDoc: KMSDocument = {
      ...doc,
      id: `d${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      expiryDate: doc.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Default 1 year expiry
      views: 0,
      downloads: 0,
      comments: [],
      versions: [{ version: '1.0', updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Người dùng hiện tại', changeLog: 'Tải lên lần đầu' }],
      createdBy: MOCK_USERS[2], // Simulating current user
      status: DocStatus.PENDING,
      tags: doc.tags || [],
      fileType: doc.fileType || 'pdf',
      isShared: false,
      source: 'Hệ thống'
    } as KMSDocument;
    MOCK_DOCS.push(newDoc);
    return newDoc;
  },

  updateDocument: async (id: string, data: Partial<KMSDocument>) => {
    const idx = MOCK_DOCS.findIndex(d => d.id === id);
    if (idx !== -1) {
      MOCK_DOCS[idx] = { ...MOCK_DOCS[idx], ...data };
      return MOCK_DOCS[idx];
    }
    throw new Error("Doc not found");
  },

  updateDocumentVersion: async (id: string, file: any, changeLog: string) => {
    const doc = MOCK_DOCS.find(d => d.id === id);
    if (doc) {
      const newVerNum = (parseFloat(doc.versions[0].version) + 0.1).toFixed(1);
      doc.versions.unshift({
        version: newVerNum,
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: 'Người dùng hiện tại',
        changeLog: changeLog
      });
      doc.status = DocStatus.PENDING; // Needs re-approval
      return doc;
    }
    throw new Error("Doc not found");
  },

  approveDocument: async (id: string, isApproved: boolean) => {
    const idx = MOCK_DOCS.findIndex(d => d.id === id);
    if (idx !== -1) {
      MOCK_DOCS[idx].status = isApproved ? DocStatus.APPROVED : DocStatus.REJECTED;
      if (isApproved) {
          MOCK_DOCS[idx].approvalDate = new Date().toISOString().split('T')[0];
          MOCK_DOCS[idx].approverName = 'Quản trị viên';
      }
      return MOCK_DOCS[idx];
    }
    throw new Error("Không tìm thấy tài liệu");
  },

  renewDocument: async (id: string, newExpiryDate: string) => {
     const idx = MOCK_DOCS.findIndex(d => d.id === id);
    if (idx !== -1) {
      MOCK_DOCS[idx].status = DocStatus.APPROVED;
      MOCK_DOCS[idx].expiryDate = newExpiryDate;
      return MOCK_DOCS[idx];
    }
    throw new Error("Không tìm thấy tài liệu");
  },

  archiveDocument: async (id: string) => {
    const idx = MOCK_DOCS.findIndex(d => d.id === id);
    if (idx !== -1) {
      MOCK_DOCS[idx].status = DocStatus.ARCHIVED;
      return MOCK_DOCS[idx];
    }
    throw new Error("Không tìm thấy tài liệu");
  },

  getReports: async (filters?: ReportFilters): Promise<ReportStats> => {
    // Lọc documents theo filters
    let filteredDocs = [...MOCK_DOCS];
    let filteredLogs = [...MOCK_ACTIVITY_LOGS];
    
    if (filters?.dateFrom || filters?.dateTo) {
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : new Date('2024-01-01');
      const toDate = filters.dateTo ? new Date(filters.dateTo) : new Date();
      
      filteredDocs = filteredDocs.filter(d => {
        const docDate = new Date(d.createdAt);
        return docDate >= fromDate && docDate <= toDate;
      });
      
      filteredLogs = filteredLogs.filter(l => {
        const logDate = new Date(l.timestamp);
        return logDate >= fromDate && logDate <= toDate;
      });
    }
    
    if (filters?.department) {
      filteredDocs = filteredDocs.filter(d => d.createdBy.department === filters.department);
      filteredLogs = filteredLogs.filter(l => l.department === filters.department);
    }
    
    if (filters?.userId) {
      filteredDocs = filteredDocs.filter(d => d.createdBy.id === filters.userId);
      filteredLogs = filteredLogs.filter(l => l.userId === filters.userId);
    }
    
    if (filters?.categoryId) {
      filteredDocs = filteredDocs.filter(d => d.categoryIds?.includes(filters.categoryId) || d.categoryId === filters.categoryId);
    }
    
    if (filters?.spaceId) {
      filteredDocs = filteredDocs.filter(d => d.spaceId === filters.spaceId);
    }
    
    // Tính toán user activity stats
    const userStatsMap = new Map<string, UserActivityStats>();
    
    MOCK_USERS.forEach(user => {
      const viewCount = filteredLogs.filter(l => l.userId === user.id && l.activityType === 'view').length;
      const downloadCount = filteredLogs.filter(l => l.userId === user.id && l.activityType === 'download').length;
      const uploadCount = filteredLogs.filter(l => l.userId === user.id && l.activityType === 'upload').length;
      const shareCount = filteredLogs.filter(l => l.userId === user.id && l.activityType === 'share').length;
      const contributionCount = filteredLogs.filter(l => l.userId === user.id && (l.activityType === 'comment' || l.activityType === 'rate')).length;
      
      userStatsMap.set(user.id, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        department: user.department || 'N/A',
        viewCount,
        downloadCount,
        uploadCount,
        shareCount,
        contributionCount,
        lastActiveDate: filteredLogs.filter(l => l.userId === user.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp
      });
    });
    
    // Tính toán department stats
    const deptMap = new Map<string, DepartmentStats>();
    const departments = ['CNTT', 'Nhân sự', 'Kinh doanh', 'Kỹ thuật', 'Marketing'];
    
    departments.forEach(dept => {
      const deptUsers = MOCK_USERS.filter(u => u.department === dept);
      const deptLogs = filteredLogs.filter(l => l.department === dept);
      
      deptMap.set(dept, {
        department: dept,
        memberCount: deptUsers.length,
        viewCount: deptLogs.filter(l => l.activityType === 'view').length,
        uploadCount: deptLogs.filter(l => l.activityType === 'upload').length,
        shareCount: deptLogs.filter(l => l.activityType === 'share').length,
        contributionScore: deptLogs.length * 10 + deptLogs.filter(l => l.activityType === 'upload').length * 50
      });
    });
    
    // Tính toán time series data (7 ngày gần nhất)
    const timeSeriesData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = filteredLogs.filter(l => l.timestamp.startsWith(dateStr));
      timeSeriesData.push({
        date: dateStr,
        views: dayLogs.filter(l => l.activityType === 'view').length,
        uploads: dayLogs.filter(l => l.activityType === 'upload').length,
        downloads: dayLogs.filter(l => l.activityType === 'download').length
      });
    }
    
    return {
      totalDocuments: filteredDocs.length,
      totalViews: filteredLogs.filter(l => l.activityType === 'view').length,
      totalDownloads: filteredLogs.filter(l => l.activityType === 'download').length,
      totalShares: filteredLogs.filter(l => l.activityType === 'share').length,
      totalUploads: filteredLogs.filter(l => l.activityType === 'upload').length,
      
      categoryStats: MOCK_CATEGORIES.map(c => ({
        name: c.name,
        count: filteredDocs.filter(d => d.categoryIds?.includes(c.id) || d.categoryId === c.id).length
      })).filter(s => s.count > 0),
      
      usageStats: filteredDocs.map(d => ({
        docName: d.title,
        views: d.viewCount || 0,
        downloads: d.downloadCount || 0
      })).sort((a,b) => b.views - a.views).slice(0, 10),
      
      expiryStats: [
        { status: 'Đã hết hạn', count: filteredDocs.filter(d => d.status === DocStatus.EXPIRED).length },
        { status: 'Sắp hết hạn', count: filteredDocs.filter(d => d.lifecycleStatus === 'NearExpired').length },
        { status: 'Còn hiệu lực', count: filteredDocs.filter(d => d.status === DocStatus.APPROVED).length }
      ],
      
      contributionStats: Array.from(deptMap.values()).map(d => ({
        dept: d.department,
        count: d.uploadCount
      })),
      
      userActivityStats: Array.from(userStatsMap.values()).sort((a, b) => 
        (b.viewCount + b.uploadCount + b.shareCount) - (a.viewCount + a.uploadCount + a.shareCount)
      ),
      
      departmentStats: Array.from(deptMap.values()).sort((a, b) => b.contributionScore - a.contributionScore),
      
      activityLogs: filteredLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 50),
      
      timeSeriesData
    };
  },

  // --- Knowledge Ingestion Methods ---
  getDataSources: async () => MOCK_DATA_SOURCES,
  getSyncSchedules: async () => MOCK_SCHEDULES,
  getIngestionLogs: async () => MOCK_INGESTION_LOGS,
  
  // Gemini Integration Placeholder
  generateAISummary: async (content: string) => {
    // In a real app, this would use GoogleGenAI
    await new Promise(r => setTimeout(r, 1500)); // Simulate latency
    return `Tóm tắt AI: Tài liệu này đề cập đến các khía cạnh chính của ${content.substring(0, 20)}... Có vẻ như đây là một nguồn thông tin quan trọng cho nhóm, tập trung vào tính tuân thủ và hiệu quả vận hành.`;
  },

  // --- RBAC Methods ---
  getRoles: async () => MOCK_ROLES,

  createRole: async (roleData: Partial<Role>) => {
    const newRole: Role = {
      id: `role${Date.now()}`,
      name: roleData.name || 'New Role',
      description: roleData.description || '',
      systemPermissions: roleData.systemPermissions || [],
      categoryPermissions: roleData.categoryPermissions || [],
      spacePermissions: roleData.spacePermissions || [],
      approvalPermissions: roleData.approvalPermissions || [],
      status: 'Active',
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Quản trị viên',
      notes: roleData.notes,
      assignedUserIds: []
    };
    MOCK_ROLES.push(newRole);
    return newRole;
  },

  updateRole: async (id: string, roleData: Partial<Role>) => {
    const idx = MOCK_ROLES.findIndex(r => r.id === id);
    if (idx !== -1) {
      MOCK_ROLES[idx] = { ...MOCK_ROLES[idx], ...roleData };
      return MOCK_ROLES[idx];
    }
    throw new Error("Role not found");
  },

  deleteRole: async (id: string) => {
    const role = MOCK_ROLES.find(r => r.id === id);
    if (role && role.userCount > 0) {
      throw new Error("Không thể xóa Role đang có User gán vào");
    }
    MOCK_ROLES = MOCK_ROLES.filter(r => r.id !== id);
    return true;
  },

  assignUsersToRole: async (roleId: string, userIds: string[]) => {
    const role = MOCK_ROLES.find(r => r.id === roleId);
    if (role) {
      role.assignedUserIds = userIds;
      role.userCount = userIds.length;
      return role;
    }
    throw new Error("Role not found");
  },

  // --- Category Methods ---
  createCategory: async (categoryData: Partial<Category>) => {
    const newCategory: Category = {
      id: `c${Date.now()}`,
      code: categoryData.code || '',
      name: categoryData.name || '',
      description: categoryData.description || '',
      parentId: categoryData.parentId || null,
      status: 'Active',
      expertId: categoryData.expertId,
      expertName: MOCK_USERS.find(u => u.id === categoryData.expertId)?.name,
      docCount: 0,
      pendingDocCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedBy: 'Quản trị viên'
    };
    MOCK_CATEGORIES.push(newCategory);
    return newCategory;
  },

  updateCategory: async (id: string, categoryData: Partial<Category>) => {
    const idx = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (idx !== -1) {
      const expertName = categoryData.expertId 
        ? MOCK_USERS.find(u => u.id === categoryData.expertId)?.name 
        : MOCK_CATEGORIES[idx].expertName;
      
      MOCK_CATEGORIES[idx] = { 
        ...MOCK_CATEGORIES[idx], 
        ...categoryData,
        expertName,
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: 'Quản trị viên'
      };
      return MOCK_CATEGORIES[idx];
    }
    throw new Error("Category not found");
  },

  deleteCategory: async (id: string) => {
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    if (!category) throw new Error("Category not found");
    
    const hasChildren = MOCK_CATEGORIES.some(c => c.parentId === id);
    if (hasChildren) {
      throw new Error("Không thể xóa danh mục có danh mục con");
    }
    
    if (category.docCount && category.docCount > 0) {
      throw new Error("Không thể xóa danh mục đang chứa tài liệu");
    }
    
    MOCK_CATEGORIES = MOCK_CATEGORIES.filter(c => c.id !== id);
    return true;
  },

  updateCategoryStatus: async (id: string, status: 'Active' | 'Inactive') => {
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    if (!category) throw new Error("Category not found");
    
    if (status === 'Inactive' && category.pendingDocCount && category.pendingDocCount > 0) {
      throw new Error("Không thể ngừng áp dụng danh mục có tài liệu chờ phê duyệt");
    }
    
    const idx = MOCK_CATEGORIES.findIndex(c => c.id === id);
    MOCK_CATEGORIES[idx].status = status;
    MOCK_CATEGORIES[idx].updatedAt = new Date().toISOString().split('T')[0];
    MOCK_CATEGORIES[idx].updatedBy = 'Quản trị viên';
    
    return MOCK_CATEGORIES[idx];
  },

  // --- Comment/Thread Methods ---
  getDocumentComments: async (docId: string) => {
    return MOCK_COMMENTS.filter(c => c.docId === docId);
  },

  addComment: async (commentData: Partial<Comment>) => {
    const newComment: Comment = {
      id: `cm${Date.now()}`,
      user: MOCK_USERS[0], // Mock current user
      content: commentData.content || '',
      createdAt: new Date().toLocaleString('vi-VN'),
      docId: commentData.docId,
      docTitle: commentData.docTitle,
      parentId: commentData.parentId || null,
      mentions: commentData.mentions || [],
      isEdited: false
    };
    
    MOCK_COMMENTS.push(newComment);
    
    // Update document comment count
    const doc = MOCK_DOCS.find(d => d.id === commentData.docId);
    if (doc) {
      if (!doc.comments) doc.comments = [];
      doc.comments.push(newComment);
    }
    
    return newComment;
  },

  updateComment: async (commentId: string, updates: Partial<Comment>) => {
    const idx = MOCK_COMMENTS.findIndex(c => c.id === commentId);
    if (idx !== -1) {
      MOCK_COMMENTS[idx] = {
        ...MOCK_COMMENTS[idx],
        ...updates,
        isEdited: true,
        editedAt: new Date().toLocaleString('vi-VN'),
        editedBy: 'Current User'
      };
      return MOCK_COMMENTS[idx];
    }
    throw new Error("Comment not found");
  },

  deleteComment: async (commentId: string) => {
    const commentIndex = MOCK_COMMENTS.findIndex(c => c.id === commentId);
    if (commentIndex === -1) throw new Error("Comment not found");
    
    const comment = MOCK_COMMENTS[commentIndex];
    
    // Also delete replies
    const deleteWithReplies = (id: string) => {
      const replies = MOCK_COMMENTS.filter(c => c.parentId === id);
      replies.forEach(r => deleteWithReplies(r.id));
      const idx = MOCK_COMMENTS.findIndex(c => c.id === id);
      if (idx !== -1) MOCK_COMMENTS.splice(idx, 1);
    };
    
    deleteWithReplies(commentId);
    
    // Update document comment count
    const doc = MOCK_DOCS.find(d => d.id === comment.docId);
    if (doc && doc.comments) {
      doc.comments = doc.comments.filter(c => c.id !== commentId);
    }
    
    return true;
  },

  // --- New Document Repository Methods ---
  
  getFeedbacksByDocument: async (docId: string) => {
    return MOCK_SUGGESTIONS.filter(s => s.docId === docId);
  },

  createFeedback: async (feedbackData: Partial<FeedbackSuggestion>) => {
    const newFeedback: FeedbackSuggestion = {
      id: `sug${Date.now()}`,
      content: feedbackData.content || '',
      docId: feedbackData.docId || '',
      docTitle: feedbackData.docTitle || '',
      categoryId: feedbackData.categoryId || '',
      spaceId: feedbackData.spaceId || '',
      user: MOCK_USERS[2], // Mock current user
      status: 'New',
      createdAt: new Date().toLocaleString('vi-VN'),
      history: [
        { 
          user: 'Người dùng hiện tại', 
          action: 'Gửi góp ý', 
          timestamp: new Date().toLocaleString('vi-VN') 
        }
      ]
    };
    MOCK_SUGGESTIONS.push(newFeedback);
    return newFeedback;
  },

  shareDocument: async (docId: string, userIds: string[]) => {
    // Mock sharing - in real app would send notifications
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (doc) {
      doc.isShared = true;
    }
    return true;
  },

  incrementViewCount: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (doc) {
      doc.viewCount = (doc.viewCount || 0) + 1;
    }
  },

  incrementDownloadCount: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (doc) {
      doc.downloadCount = (doc.downloadCount || 0) + 1;
    }
  },

  restoreDocumentVersion: async (docId: string, versionNumber: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error("Document not found");
    
    const oldVersion = doc.versions.find(v => v.version === versionNumber);
    if (!oldVersion) throw new Error("Version not found");
    
    // Create new version from old one
    const newVersionNum = (parseFloat(doc.versions[0].version) + 0.1).toFixed(1);
    doc.versions.unshift({
      version: newVersionNum,
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'Người dùng hiện tại',
      changeLog: `Khôi phục từ phiên bản ${versionNumber}`
    });
    
    doc.status = DocStatus.PENDING; // Needs approval
    return doc;
  },

  // --- Sync Source Methods ---
  
  getSyncSources: async () => {
    return MOCK_SYNC_SOURCES;
  },

  createSyncSource: async (sourceData: Partial<SyncSource>) => {
    const newSource: SyncSource = {
      id: `sync${Date.now()}`,
      type: sourceData.type || 'SharePoint',
      name: sourceData.name || '',
      endpoint: sourceData.endpoint || '',
      username: sourceData.username,
      token: sourceData.token,
      frequency: sourceData.frequency || 'Daily',
      approvalMode: sourceData.approvalMode || 'Manual',
      syncMode: sourceData.syncMode || 'Incremental',
      connectionStatus: 'Disconnected',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: MOCK_USERS[0],
      isActive: true
    };
    MOCK_SYNC_SOURCES.push(newSource);
    return newSource;
  },

  updateSyncSource: async (id: string, sourceData: Partial<SyncSource>) => {
    const idx = MOCK_SYNC_SOURCES.findIndex(s => s.id === id);
    if (idx !== -1) {
      MOCK_SYNC_SOURCES[idx] = {
        ...MOCK_SYNC_SOURCES[idx],
        ...sourceData
      };
      return MOCK_SYNC_SOURCES[idx];
    }
    return null;
  },

  deleteSyncSource: async (id: string) => {
    const idx = MOCK_SYNC_SOURCES.findIndex(s => s.id === id);
    if (idx !== -1) {
      MOCK_SYNC_SOURCES.splice(idx, 1);
      return true;
    }
    return false;
  },

  testSyncConnection: async (connectionData: { type: string; endpoint: string; username: string; token: string }) => {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock success/failure (90% success rate)
    const success = Math.random() > 0.1;
    
    return {
      success,
      message: success 
        ? 'Kết nối thành công! Nguồn dữ liệu hoạt động bình thường.' 
        : 'Kết nối thất bại. Vui lòng kiểm tra lại endpoint, username và token.'
    };
  },

  manualSync: async (sourceId: string) => {
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const source = MOCK_SYNC_SOURCES.find(s => s.id === sourceId);
    if (!source) {
      return { success: false, message: 'Nguồn không tồn tại', docsCollected: 0, docsSuccess: 0, docsError: 0 };
    }

    // Mock sync results
    const docsCollected = Math.floor(Math.random() * 20) + 5;
    const docsSuccess = Math.floor(docsCollected * 0.9);
    const docsError = docsCollected - docsSuccess;

    // Update source
    source.lastSync = new Date().toLocaleString('vi-VN');
    source.lastSyncStatus = docsError === 0 ? 'Success' : 'Error';
    source.connectionStatus = 'Connected';

    // Add to history
    const historyItem: SyncHistory = {
      id: `hist${Date.now()}`,
      sourceId: source.id,
      sourceName: source.name,
      syncTime: new Date().toLocaleString('vi-VN'),
      docsCollected,
      docsSuccess,
      docsError,
      status: docsError === 0 ? 'Success' : 'Error',
      triggeredBy: 'Manual',
      triggeredByUser: MOCK_USERS[0],
      errorMessage: docsError > 0 ? `${docsError} tài liệu không thể đồng bộ do lỗi quyền truy cập` : undefined,
      details: `Thu thập từ ${source.type}: ${source.endpoint}`
    };
    MOCK_SYNC_HISTORY.push(historyItem);

    return { 
      success: true, 
      message: 'Đồng bộ hoàn tất',
      docsCollected,
      docsSuccess,
      docsError
    };
  },

  getSyncHistory: async (sourceId: string) => {
    return MOCK_SYNC_HISTORY
      .filter(h => h.sourceId === sourceId)
      .sort((a, b) => new Date(b.syncTime).getTime() - new Date(a.syncTime).getTime());
  },

  // ============================
  // Approvals - 2 Level Workflow
  // ============================

  getApprovalsLevel1: async () => {
    // Documents pending Level 1 approval
    return MOCK_DOCS.filter(d => 
      d.lifecycleStatus === 'PendingLevel1' || d.status === DocStatus.PENDING
    );
  },

  getApprovalsLevel2: async () => {
    // Documents pending Level 2 approval (already approved by Level 1)
    return MOCK_DOCS.filter(d => 
      d.lifecycleStatus === 'ApprovedLevel1'
    );
  },

  approveLevel1: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    
    // Update document status
    doc.lifecycleStatus = 'PendingLevel2'; // Move to Level 2
    doc.approverLevel1Name = 'Lê Văn C (User)'; // Mock manager
    doc.approverLevel1Date = new Date().toLocaleString('vi-VN');
    doc.approverLevel1Avatar = MOCK_USERS[2].avatar;

    return doc;
  },

  rejectLevel1: async (docId: string, reason: string, attachments?: File[]) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    
    // Simulate file upload (in real app, upload to server/storage)
    const attachmentUrls: string[] = [];
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        // Mock URL - in real app, upload and get URL
        attachmentUrls.push(`/uploads/reject-attachments/${docId}/${file.name}`);
        console.log(`Uploaded attachment: ${file.name} (${file.size} bytes)`);
      });
    }
    
    // Update document status
    doc.lifecycleStatus = 'RejectedLevel1';
    doc.rejectReason = reason;
    doc.rejectedBy = 'Lê Văn C (User)';
    doc.rejectedAt = new Date().toLocaleString('vi-VN');
    (doc as any).rejectAttachments = attachmentUrls; // Store attachment URLs

    return doc;
  },

  approveLevel2: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    
    // Update document status
    doc.lifecycleStatus = 'PendingLevel3'; // Move to Level 3
    doc.approverLevel2Name = 'Trần Thị B (Manager)'; // Mock category expert
    doc.approverLevel2Date = new Date().toLocaleString('vi-VN');
    doc.approverLevel2Avatar = MOCK_USERS[1].avatar;

    return doc;
  },

  rejectLevel2: async (docId: string, reason: string, attachments?: File[]) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    
    // Simulate file upload (in real app, upload to server/storage)
    const attachmentUrls: string[] = [];
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        // Mock URL - in real app, upload and get URL
        attachmentUrls.push(`/uploads/reject-attachments/${docId}/${file.name}`);
        console.log(`Uploaded attachment: ${file.name} (${file.size} bytes)`);
      });
    }
    
    // Update document status
    doc.lifecycleStatus = 'RejectedLevel2';
    doc.rejectReasonLevel2 = reason;
    doc.rejectedByLevel2 = 'Trần Thị B (Manager)';
    doc.rejectedAtLevel2 = new Date().toLocaleString('vi-VN');
    (doc as any).rejectAttachmentsLevel2 = attachmentUrls; // Store attachment URLs

    return doc;
  },

  approveLevel3: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    
    // Update document status - Final approval
    doc.lifecycleStatus = 'Active'; // Now in Knowledge Repository
    doc.status = DocStatus.APPROVED;
    doc.approverLevel3Name = 'Nguyễn Văn A (Admin)';
    doc.approverLevel3Date = new Date().toLocaleString('vi-VN');
    doc.approverLevel3Avatar = MOCK_USERS[0].avatar;
    doc.approvalDate = new Date().toLocaleString('vi-VN');

    return doc;
  },

  rejectLevel3: async (docId: string, reason: string, attachments?: File[]) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');
    
    // Simulate file upload (in real app, upload to server/storage)
    const attachmentUrls: string[] = [];
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        // Mock URL - in real app, upload and get URL
        attachmentUrls.push(`/uploads/reject-attachments/${docId}/${file.name}`);
        console.log(`Uploaded attachment: ${file.name} (${file.size} bytes)`);
      });
    }
    
    // Update document status
    doc.lifecycleStatus = 'RejectedLevel3';
    doc.rejectReasonLevel3 = reason;
    doc.rejectedByLevel3 = 'Nguyễn Văn A (Admin)';
    doc.rejectedAtLevel3 = new Date().toLocaleString('vi-VN');
    (doc as any).rejectAttachmentsLevel3 = attachmentUrls; // Store attachment URLs

    return doc;
  },

  // ============================
  // Expired Documents Management
  // ============================

  getNearExpiredDocuments: async () => {
    // Documents with lifecycle status NearExpired
    return MOCK_DOCS.filter(d => d.lifecycleStatus === 'NearExpired');
  },

  getExpiredDocuments: async () => {
    // Documents with lifecycle status Expired
    return MOCK_DOCS.filter(d => d.lifecycleStatus === 'Expired');
  },

  getArchivedDocuments: async () => {
    // Documents with lifecycle status Archived
    return MOCK_DOCS.filter(d => d.lifecycleStatus === 'Archived');
  },

  getExpiryStatistics: async () => {
    return {
      nearExpired: MOCK_DOCS.filter(d => d.lifecycleStatus === 'NearExpired').length,
      expired: MOCK_DOCS.filter(d => d.lifecycleStatus === 'Expired').length,
      archived: MOCK_DOCS.filter(d => d.lifecycleStatus === 'Archived').length
    };
  },

  extendDocumentExpiry: async (docId: string, newExpiryDate: string, reason: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    // Calculate days until expiry for the new date
    const today = new Date();
    const expiryDate = new Date(newExpiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Create extension history entry
    const extension = {
      id: `ext${Date.now()}`,
      oldExpiryDate: doc.expiryDate || '',
      newExpiryDate,
      reason,
      extendedBy: MOCK_USERS[0],
      extendedAt: new Date().toLocaleString('vi-VN')
    };

    // Update document
    doc.expiryDate = newExpiryDate;
    doc.lastExtensionReason = reason;
    doc.daysUntilExpiry = diffDays;
    doc.extensionHistory = doc.extensionHistory || [];
    doc.extensionHistory.push(extension);

    // Update lifecycle status based on new expiry date
    const threshold = 30; // days before expiry to mark as NearExpired
    if (diffDays > threshold) {
      doc.lifecycleStatus = 'Active';
    } else if (diffDays > 0) {
      doc.lifecycleStatus = 'NearExpired';
    }

    return doc;
  },

  createNewVersionFromExpired: async (docId: string, data: {
    file?: File;
    newExpiryDate: string;
    changeLog: string;
    metadata?: any;
  }) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    // Calculate new version number
    const currentVersion = parseFloat(doc.versions[0]?.version || '1.0');
    const newVersion = (currentVersion + 0.1).toFixed(1);

    // Create new version entry
    const newVersionEntry = {
      version: newVersion,
      updatedAt: new Date().toLocaleString('vi-VN'),
      updatedBy: MOCK_USERS[0].name,
      changeLog: data.changeLog
    };

    // Update document
    doc.versions.unshift(newVersionEntry);
    doc.expiryDate = data.newExpiryDate;
    doc.lifecycleStatus = 'PendingLevel1'; // Goes back to approval workflow
    doc.status = DocStatus.PENDING;

    // Calculate days until expiry
    const today = new Date();
    const expiryDate = new Date(data.newExpiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    doc.daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return doc;
  },

  archiveDocument: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    // Set to Archived status
    doc.lifecycleStatus = 'Archived';
    doc.status = DocStatus.ARCHIVED;

    // Document is now hidden from:
    // - Repository search
    // - Space views
    // - Normal search results
    // Only accessible in Admin > Archived section

    return doc;
  },

  // ============================
  // My Documents - Personal Workspace
  // ============================

  getMyCreatedDocuments: async (userId: string) => {
    return MOCK_DOCS.filter(d => d.createdBy.id === userId);
  },

  getSharedWithMe: async (userId: string) => {
    // Mock: Filter documents that are shared (in real app, check share records)
    return MOCK_DOCS.filter(d => d.isShared && d.createdBy.id !== userId).slice(0, 3);
  },

  getMyFavorites: async (userId: string) => {
    // Mock: Return some favorite docs
    return MOCK_DOCS.filter(d => ['d1', 'd5'].includes(d.id));
  },

  getMyFollowing: async (userId: string) => {
    // Mock: Return some followed docs
    return MOCK_DOCS.filter(d => ['d2', 'd4'].includes(d.id));
  },

  getMyCommentedDocuments: async (userId: string) => {
    // Mock: Return documents where user has commented
    // In real app: JOIN documents with comments table WHERE comments.userId = userId
    return MOCK_DOCS.filter(d => d.comments && d.comments.some(c => c.user.id === userId));
  },

  getMyExpiredDocuments: async (userId: string) => {
    // Mock: Return expired documents created by user
    const now = new Date().getTime();
    return MOCK_DOCS.filter(d => {
      if (d.createdBy.id !== userId) return false;
      if (!d.expiryDate) return false;
      return new Date(d.expiryDate).getTime() < now;
    });
  },

  getMyRecentViews: async (userId: string) => {
    // Mock view history
    return [
      {
        id: 'v1',
        docId: 'd1',
        docTitle: 'Lộ trình phát triển Quý 3/2024',
        userId,
        viewedAt: new Date(Date.now() - 3600000).toLocaleString('vi-VN')
      },
      {
        id: 'v2',
        docId: 'd2',
        docTitle: 'Sổ tay nhân viên 2023',
        userId,
        viewedAt: new Date(Date.now() - 7200000).toLocaleString('vi-VN')
      },
      {
        id: 'v3',
        docId: 'd5',
        docTitle: 'Quy trình ISO 9001:2015',
        userId,
        viewedAt: new Date(Date.now() - 86400000).toLocaleString('vi-VN')
      }
    ];
  },

  getMyDownloads: async (userId: string) => {
    // Mock download history
    return [
      {
        id: 'dl1',
        docId: 'd1',
        docTitle: 'Lộ trình phát triển Quý 3/2024',
        userId,
        downloadedAt: new Date(Date.now() - 1800000).toLocaleString('vi-VN'),
        fileType: 'pdf',
        fileSize: 2048000
      },
      {
        id: 'dl2',
        docId: 'd5',
        docTitle: 'Quy trình ISO 9001:2015',
        userId,
        downloadedAt: new Date(Date.now() - 172800000).toLocaleString('vi-VN'),
        fileType: 'pdf',
        fileSize: 5120000
      }
    ];
  },

  getMyDocumentsStats: async (userId: string) => {
    const created = MOCK_DOCS.filter(d => d.createdBy.id === userId);
    const shared = MOCK_DOCS.filter(d => d.isShared && d.createdBy.id !== userId).slice(0, 3);
    const commented = MOCK_DOCS.filter(d => d.comments && d.comments.some(c => c.user.id === userId));
    const now = new Date().getTime();
    const expired = MOCK_DOCS.filter(d => {
      if (d.createdBy.id !== userId) return false;
      if (!d.expiryDate) return false;
      return new Date(d.expiryDate).getTime() < now;
    });
    
    return {
      created: created.length,
      shared: shared.length,
      commented: commented.length,
      expired: expired.length,
      favorite: 2,
      following: 2,
      recentView: 3,
      downloads: 2
    };
  },

  favoriteDocument: async (docId: string, userId: string) => {
    // In real app: Insert into favorites table
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  unfavoriteDocument: async (docId: string, userId: string) => {
    // In real app: Delete from favorites table
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  followDocument: async (docId: string, userId: string) => {
    // In real app: Insert into follows table
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  unfollowDocument: async (docId: string, userId: string) => {
    // In real app: Delete from follows table
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  resubmitDocument: async (docId: string) => {
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (!doc) throw new Error('Document not found');

    // Reset to PendingLevel1
    doc.lifecycleStatus = 'PendingLevel1';
    doc.status = DocStatus.PENDING;
    delete doc.rejectReason;
    delete doc.rejectedBy;
    delete doc.rejectedAt;

    return doc;
  },

  deleteDocument: async (docId: string) => {
    const idx = MOCK_DOCS.findIndex(d => d.id === docId);
    if (idx === -1) throw new Error('Document not found');

    const doc = MOCK_DOCS[idx];
    // Only allow delete if Draft or Pending
    if (doc.lifecycleStatus !== 'PendingLevel1' && doc.lifecycleStatus !== 'RejectedLevel1') {
      throw new Error('Không thể xóa tài liệu đã duyệt');
    }

    MOCK_DOCS.splice(idx, 1);
    return { success: true };
  },

  updateExpiredDocument: async (docId: string, updateData: { newExpiryDate: string; reason: string; newVersion?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (doc) {
      // Reset document to pending approval status
      doc.lifecycleStatus = 'PendingLevel1';
      doc.status = DocStatus.PENDING;
      doc.expiryDate = updateData.newExpiryDate;
      
      // Clear previous approval data
      delete doc.approverLevel1Name;
      delete doc.approverLevel1Date;
      delete doc.approverLevel2Name;
      delete doc.approverLevel2Date;
      delete doc.approverLevel3Name;
      delete doc.approverLevel3Date;
      
      // Add new version
      const newVersionNumber = updateData.newVersion || `${parseFloat(doc.versions[0]?.version || '1.0') + 0.1}`;
      doc.versions.unshift({
        version: newVersionNumber,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Nguyễn Văn A',
        changeLog: updateData.reason
      });
      
      // Save update history
      if (!doc.extensionHistory) {
        doc.extensionHistory = [];
      }
      doc.extensionHistory.push({
        id: `upd-${Date.now()}`,
        previousExpiryDate: doc.expiryDate,
        newExpiryDate: updateData.newExpiryDate,
        extendedBy: 'Nguyễn Văn A',
        extendedAt: new Date().toISOString(),
        reason: updateData.reason,
        approvedBy: 'Đang chờ phê duyệt',
        approvedAt: ''
      });
      doc.lastExtensionReason = updateData.reason;
    }
    return { success: true };
  },

  recordView: async (docId: string, userId: string) => {
    // In real app: Insert into view_history table
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  },

  recordDownload: async (docId: string, userId: string) => {
    // In real app: Insert into download_history table
    const doc = MOCK_DOCS.find(d => d.id === docId);
    if (doc) {
      doc.downloadCount = (doc.downloadCount || 0) + 1;
    }
    return { success: true };
  },

  // --- Knowledge Collection Methods ---
  
  getCollectedDocuments: async (filters?: { 
    status?: CollectionStatus[];
    source?: CollectionSource;
    collectedBy?: string;
    query?: string;
  }) => {
    let docs = [...MOCK_COLLECTED_DOCUMENTS];
    
    if (filters?.status && filters.status.length > 0) {
      docs = docs.filter(d => filters.status?.includes(d.status));
    }
    
    if (filters?.source) {
      docs = docs.filter(d => d.source === filters.source);
    }
    
    if (filters?.collectedBy) {
      docs = docs.filter(d => d.collectedBy === filters.collectedBy);
    }
    
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      docs = docs.filter(d => 
        d.fileName.toLowerCase().includes(q) ||
        (d.notes && d.notes.toLowerCase().includes(q)) ||
        (d.contributorName && d.contributorName.toLowerCase().includes(q))
      );
    }
    
    // Sort by collection date (newest first)
    docs.sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
    
    return docs;
  },

  uploadCollectedDocuments: async (data: {
    files: File[];
    source: CollectionSource;
    sourceDetail: string;
    contributorName?: string;
    collectedBy: string;
  }) => {
    const currentUser = MOCK_USERS.find(u => u.id === data.collectedBy);
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');
    
    const newDocs: CollectedDocument[] = data.files.map(file => ({
      id: `col${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: file.name,
      fileSize: file.size,
      source: data.source,
      sourceDetail: data.sourceDetail,
      collectedBy: data.collectedBy,
      collectedByName: currentUser?.name || 'Unknown',
      collectedAt: dateStr,
      status: 'Collected',
      contributorName: data.contributorName,
      notes: `Được tải lên từ ${data.source}`
    }));
    
    MOCK_COLLECTED_DOCUMENTS.push(...newDocs);
    return newDocs;
  },

  classifyCollectedDocuments: async (data: {
    documentIds: string[];
    categoryIds: string[];
    spaceId?: string;
    tags?: string[];
    effectiveDate?: string;
    expiryDate?: string;
    notes?: string;
  }) => {
    const docs = MOCK_COLLECTED_DOCUMENTS.filter(d => data.documentIds.includes(d.id));
    
    if (docs.length === 0) {
      throw new Error('Không tìm thấy tài liệu');
    }
    
    docs.forEach(doc => {
      doc.status = 'Classified';
      doc.categoryIds = data.categoryIds;
      doc.spaceId = data.spaceId;
      doc.tags = data.tags;
      doc.effectiveDate = data.effectiveDate;
      doc.expiryDate = data.expiryDate;
      if (data.notes) {
        doc.notes = (doc.notes ? doc.notes + '\n' : '') + data.notes;
      }
    });
    
    return docs;
  },

  sendToApproval: async (documentIds: string[]) => {
    const docs = MOCK_COLLECTED_DOCUMENTS.filter(d => documentIds.includes(d.id));
    
    if (docs.length === 0) {
      throw new Error('Không tìm thấy tài liệu');
    }
    
    // Check if all docs are classified
    const unclassifiedDocs = docs.filter(d => d.status !== 'Classified');
    if (unclassifiedDocs.length > 0) {
      throw new Error('Có tài liệu chưa được phân loại. Vui lòng phân loại trước khi gửi duyệt.');
    }
    
    docs.forEach(doc => {
      doc.status = 'InApproval';
    });
    
    return docs;
  },

  deleteCollectedDocuments: async (documentIds: string[]) => {
    documentIds.forEach(id => {
      const idx = MOCK_COLLECTED_DOCUMENTS.findIndex(d => d.id === id);
      if (idx !== -1) {
        // Only allow delete if not yet approved
        const doc = MOCK_COLLECTED_DOCUMENTS[idx];
        if (doc.status !== 'Approved') {
          MOCK_COLLECTED_DOCUMENTS.splice(idx, 1);
        }
      }
    });
    
    return { success: true };
  },

  getCurrentUser: async () => {
    // In real app: Get from authentication context
    // For now, return first user (Admin)
    return MOCK_USERS[0];
  }
};

