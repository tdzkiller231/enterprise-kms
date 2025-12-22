# Nâng cấp Module Báo cáo & Thống kê

## Tổng quan
Module báo cáo đã được nâng cấp toàn diện để đáp ứng yêu cầu nghiệp vụ về thống kê và xuất dữ liệu hoạt động người dùng, phục vụ công tác đánh giá và khen thưởng.

## Các tính năng mới

### 1. Bộ lọc báo cáo đa chiều
- **Lọc theo người dùng**: Xem hoạt động của từng cá nhân cụ thể
- **Lọc theo phòng ban**: Thống kê theo đơn vị tổ chức
- **Lọc theo khoảng thời gian**: Chọn khoảng thời gian cụ thể (từ ngày - đến ngày)
- **Lọc theo danh mục**: Thống kê theo danh mục tài liệu
- **Lọc theo không gian**: Thống kê theo không gian làm việc

### 2. Thống kê chi tiết theo 4 tab chính

#### Tab "Tổng quan"
- 5 thẻ thống kê nổi bật: Tổng tài liệu, Lượt xem, Lượt tải, Chia sẻ, Tải lên
- Biểu đồ xu hướng 7 ngày qua (Line Chart)
- Thống kê tài liệu theo danh mục (Bar Chart)
- Đóng góp tri thức theo phòng ban (Pie Chart)
- Top 10 tài liệu được sử dụng nhiều nhất
- Trạng thái hiệu lực tài liệu và cảnh báo

#### Tab "Người dùng"
- Bảng xếp hạng người dùng tích cực
- Thống kê chi tiết cho mỗi người:
  - Số lượt xem
  - Số lượt tải xuống
  - Số tài liệu tải lên
  - Số lần chia sẻ
  - Số đóng góp (comment, đánh giá)
- Tính điểm tổng hợp theo công thức:
  - Xem (×1) + Tải (×2) + Tải lên (×10) + Chia sẻ (×5) + Đóng góp (×3)
- Hiển thị top 3 với huy chương vàng, bạc, đồng

#### Tab "Phòng ban"
- Thống kê theo từng phòng ban:
  - Số thành viên
  - Lượt xem
  - Số tài liệu tải lên
  - Số lần chia sẻ
  - Điểm đóng góp tổng hợp
- Xếp hạng phòng ban
- Biểu đồ so sánh đóng góp giữa các phòng ban

#### Tab "Nhật ký hoạt động"
- Danh sách chi tiết tất cả hoạt động
- Hiển thị:
  - Thời gian
  - Người thực hiện
  - Phòng ban
  - Loại hoạt động (xem, tải, tải lên, chia sẻ, bình luận, đánh giá)
  - Tài liệu liên quan
  - Chi tiết bổ sung
- Mã màu theo loại hoạt động để dễ phân biệt

### 3. Xuất dữ liệu CSV
- Nút "Xuất dữ liệu CSV" ở góc trên bên phải
- Xuất dữ liệu theo tab đang xem:
  - Tab Tổng quan: Xuất thống kê tổng hợp
  - Tab Người dùng: Xuất bảng xếp hạng người dùng
  - Tab Phòng ban: Xuất thống kê phòng ban
  - Tab Nhật ký: Xuất nhật ký hoạt động chi tiết
- File CSV tự động đặt tên theo format: `bao_cao_{tab}_{ngay}.csv`

## Cấu trúc dữ liệu

### Types mới (types.ts)
```typescript
- ReportFilters: Bộ lọc báo cáo
- UserActivityStats: Thống kê hoạt động người dùng
- DepartmentStats: Thống kê phòng ban
- DocumentActivityLog: Nhật ký hoạt động tài liệu
- ReportStats (mở rộng): Dữ liệu báo cáo đầy đủ
```

### Service API (kmsService.ts)
```typescript
getReports(filters?: ReportFilters): Promise<ReportStats>
```
- Hỗ trợ lọc dữ liệu theo các tiêu chí
- Tính toán thống kê động
- Tạo dữ liệu time series cho biểu đồ xu hướng

## Ứng dụng thực tế

### Đánh giá nhân viên
- Xem hoạt động của từng cá nhân trong khoảng thời gian
- So sánh mức độ tham gia giữa các nhân viên
- Căn cứ để khen thưởng dựa trên điểm đóng góp

### Đánh giá phòng ban
- So sánh hiệu suất giữa các phòng ban
- Xác định phòng ban có mức độ chia sẻ tri thức cao
- Động viên các phòng ban tích cực

### Báo cáo định kỳ
- Xuất báo cáo hàng tuần/tháng/quý
- Phân tích xu hướng sử dụng hệ thống
- Theo dõi hiệu quả triển khai KMS

## Hướng dẫn sử dụng

1. **Truy cập**: Vào menu "Báo cáo & Thống kê"
2. **Chọn bộ lọc**: 
   - Chọn người dùng (hoặc để trống cho tất cả)
   - Chọn phòng ban (hoặc để trống cho tất cả)
   - Chọn khoảng thời gian
   - Nhấn "Áp dụng"
3. **Xem báo cáo**: Chuyển đổi giữa các tab để xem thống kê khác nhau
4. **Xuất dữ liệu**: Nhấn nút "Xuất dữ liệu CSV" để tải về

## Dữ liệu mẫu
Hệ thống đã có 40+ hoạt động mẫu trong 7 ngày gần đây để demo đầy đủ tính năng.

## Lưu ý kỹ thuật
- Dữ liệu hiện tại đang dùng mock data
- Khi tích hợp backend thực, cần implement API endpoint tương ứng
- Công thức tính điểm có thể tùy chỉnh theo yêu cầu đơn vị
- Hỗ trợ xuất CSV với encoding UTF-8 cho tiếng Việt

## Tác giả
GitHub Copilot - Ngày cập nhật: 22/12/2024
