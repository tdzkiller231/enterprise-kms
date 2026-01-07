# Thu thập Tri thức (Knowledge Collection)

## Tổng quan
Màn hình **Thu thập Tri thức** cho phép người dùng thu thập tài liệu từ các nguồn bên ngoài (Email, SharePoint, OneDrive, Google Drive, Local files) khi không thể kết nối API trực tiếp.

## Quy trình 3 bước

### Bước 1: Thu thập (Collect)
- Người dùng tải lên files/folders từ nhiều nguồn
- Chỉ cần điền thông tin tối thiểu:
  - Nguồn tài liệu (Email, SharePoint, OneDrive, etc.)
  - Chi tiết nguồn (email address, link SharePoint, v.v.)
  - Tên người đóng góp (tùy chọn)
- Trạng thái: **Collected** (Chưa phân loại)

### Bước 2: Phân loại (Classify)
- Chọn tài liệu đã thu thập
- Điền đầy đủ metadata:
  - Danh mục (Categories) - có thể chọn nhiều
  - Không gian làm việc (Space)
  - Tags
  - Ngày hiệu lực / Ngày hết hạn
  - Ghi chú
- Hỗ trợ phân loại hàng loạt (bulk classification)
- Trạng thái: **Classified** (Đã phân loại)

### Bước 3: Phê duyệt (Approval)
- Sau khi phân loại, tài liệu được gửi vào quy trình phê duyệt
- Trạng thái: **InApproval** → **Approved** / **Rejected**
- Tài liệu được duyệt sẽ chuyển sang Kho tài liệu chính

## Các trạng thái

| Trạng thái | Mô tả | Hành động có thể thực hiện |
|-----------|-------|---------------------------|
| **Collected** | Mới tải lên, chưa phân loại | Phân loại, Xóa |
| **Classified** | Đã điền đầy đủ metadata | Gửi duyệt, Sửa, Xóa |
| **InApproval** | Đang chờ phê duyệt | Chỉ xem |
| **Approved** | Đã được duyệt | Đã chuyển sang Kho tài liệu |
| **Rejected** | Bị từ chối | Xem lý do, Xóa |
| **Discarded** | Đã loại bỏ | Không hiển thị |

## Tính năng

### 1. Upload Modal
- Chọn nhiều files cùng lúc
- Drag & drop support
- Hiển thị preview file đã chọn
- Validate file size/type

### 2. Classify Modal
- Form phân loại chi tiết
- Multi-select categories
- Tags autocomplete
- Date pickers
- Bulk actions: áp dụng metadata cho nhiều tài liệu

### 3. Bộ lọc & Tìm kiếm
- Lọc theo trạng thái
- Lọc theo nguồn
- Tìm kiếm theo tên file, ghi chú
- Sắp xếp theo ngày thu thập

### 4. Bulk Operations
- Chọn nhiều tài liệu
- Phân loại hàng loạt
- Gửi duyệt hàng loạt
- Xóa hàng loạt

## API Methods (KMSService)

```typescript
// Lấy danh sách tài liệu đã thu thập
getCollectedDocuments(filters?: {
  status?: CollectionStatus[];
  source?: CollectionSource;
  collectedBy?: string;
  query?: string;
}): Promise<CollectedDocument[]>

// Upload tài liệu mới
uploadCollectedDocuments(data: {
  files: File[];
  source: CollectionSource;
  sourceDetail: string;
  contributorName?: string;
  collectedBy: string;
}): Promise<CollectedDocument[]>

// Phân loại tài liệu
classifyCollectedDocuments(data: {
  documentIds: string[];
  categoryIds: string[];
  spaceId?: string;
  tags?: string[];
  effectiveDate?: string;
  expiryDate?: string;
  notes?: string;
}): Promise<CollectedDocument[]>

// Gửi phê duyệt
sendToApproval(documentIds: string[]): Promise<CollectedDocument[]>

// Xóa tài liệu
deleteCollectedDocuments(documentIds: string[]): Promise<{ success: boolean }>

// Lấy thông tin user hiện tại
getCurrentUser(): Promise<User>
```

## Routes

```typescript
// URL: /knowledge-collection
<Route path="/knowledge-collection" element={<KnowledgeCollection />} />
```

## Mock Data

File: `services/kmsService.ts`
- `MOCK_COLLECTED_DOCUMENTS`: 8 tài liệu mẫu với đủ các trạng thái

## Sử dụng

1. Truy cập menu **Thu thập tri thức** trên sidebar
2. Click nút **Tải lên tài liệu**
3. Chọn nguồn và files
4. Upload → Tài liệu hiển thị với trạng thái "Collected"
5. Chọn tài liệu → Click **Phân loại**
6. Điền đầy đủ thông tin → Lưu
7. Chọn tài liệu đã phân loại → Click **Gửi duyệt**
8. Tài liệu chuyển sang quy trình phê duyệt

## Lưu ý

- Chỉ có thể gửi duyệt tài liệu đã **Classified**
- Không thể xóa tài liệu đã **Approved**
- Có thể phân loại nhiều tài liệu cùng lúc nếu chúng có cùng metadata
- Tài liệu **Rejected** có thể xóa và upload lại

## Files liên quan

- `pages/KnowledgeCollection.tsx` - Component chính
- `services/kmsService.ts` - Service methods
- `types.ts` - TypeScript interfaces (CollectedDocument, CollectionStatus, CollectionSource)
- `App.tsx` - Route configuration
- `components/Layout.tsx` - Navigation menu

## Screenshots / Demo

Dev server: http://localhost:3000/#/knowledge-collection

---

**Tác giả:** GitHub Copilot  
**Ngày tạo:** 2024-12-22  
**Phiên bản:** 1.0
