# Nâng cấp Module Báo cáo & Thống kê

## Tổng quan
Module báo cáo đã được nâng cấp toàn diện để đáp ứng yêu cầu nghiệp vụ về thống kê và xuất dữ liệu hoạt động người dùng, phục vụ công tác đánh giá và khen thưởng.

## Bổ sung yêu cầu phân tích báo cáo

Chức năng Thống kê & Báo cáo cung cấp các thông tin tổng hợp về tình hình khai thác và đóng góp tri thức trong hệ thống, đồng thời hỗ trợ cơ chế Gamification nhằm khuyến khích cá nhân và phòng ban tích cực tham gia chia sẻ, cập nhật và sử dụng tri thức.

Các kết quả thống kê được sử dụng để:
- Đánh giá mức độ đóng góp tri thức của cá nhân và đơn vị
- Hiển thị bảng xếp hạng đóng góp tri thức
- Ghi nhận huy hiệu tri thức cho người dùng
- Cung cấp dữ liệu phục vụ các chương trình thi đua và đánh giá nội bộ

Hệ thống quản lý và tính toán điểm đóng góp tri thức dựa trên các hành động của người dùng trong hệ thống.

Các loại điểm gồm:
- Điểm tải lên tài liệu tri thức
- Điểm phê duyệt tài liệu
- Điểm góp ý / bình luận có giá trị
- Điểm tài liệu được sử dụng hoặc tải về
- Điểm tham gia chia sẻ Lessons Learned
- Điểm cập nhật tài liệu hết hạn

### Cơ chế tính điểm đóng góp tri thức (KCS)

Điểm KCS của cá nhân được tính theo công thức:

KCS = Tổng (Số lần hành động x Trọng số hành động)

Bảng trọng số mặc định:

| Hành động | Trọng số điểm |
|---|---|
| Tải lên tài liệu tri thức | 10 |
| Phê duyệt tài liệu | 8 |
| Góp ý / bình luận có giá trị | 4 |
| Đánh giá tài liệu | 3 |
| Tải xuống tài liệu (khai thác tri thức) | 2 |
| Chia sẻ tài liệu | 3 |
| Chia sẻ Lessons Learned | 12 |
| Cập nhật tài liệu hết hạn (làm sạch tri thức) | 9 |

Quy tắc xếp hạng và huy hiệu người dùng:

| Mức điểm KCS | Huy hiệu |
|---|---|
| >= 150 | Chuyên gia Tri thức |
| 90 - 149 | Huy hiệu Vàng |
| 50 - 89 | Huy hiệu Bạc |
| 20 - 49 | Huy hiệu Đồng |
| < 20 | Thành viên Mới |

Điểm đóng góp tri thức của phòng ban được tính bằng tổng điểm KCS của các thành viên trong cùng đơn vị.

### 10.2 Thông tin quản lý

#### 10.2.1 Thông tin tổng quan hệ thống
Hệ thống cung cấp các chỉ số tổng hợp về tình trạng kho tri thức.

| Thông tin | Mô tả |
|---|---|
| Tài liệu tải lên | Số lượng tài liệu do người dùng đóng góp |
| Tài liệu tải xuống | Số lần tài liệu được tải |
| Chia sẻ tài liệu | Số lần tài liệu được chia sẻ |
| Đánh giá tài liệu | Số lần người dùng đánh giá tài liệu |
| Góp ý tài liệu | Số lần người dùng đóng góp ý kiến |

#### 10.2.2 Thông tin đóng góp tri thức của người dùng
Hệ thống tổng hợp dữ liệu hoạt động để đánh giá mức độ đóng góp tri thức của từng cá nhân.

| Thông tin | Mô tả |
|---|---|
| Người dùng | Tên người sử dụng hệ thống |
| Phòng ban | Đơn vị công tác |
| Số tài liệu tải lên | Tổng số tài liệu người dùng đóng góp |
| Số lượt tải xuống | Tổng số lần tải tài liệu |
| Số lượt chia sẻ | Tổng số lần chia sẻ tài liệu |
| Số lượt đánh giá | Tổng số lần đánh giá tài liệu |
| Số lượt góp ý | Tổng số lần góp ý tài liệu |
| Số lượt phê duyệt tài liệu | Tổng số lần phê duyệt tài liệu |
| Số lượt làm sạch tri thức | Tổng số lần cập nhật tài liệu sắp hết hạn |
| Knowledge Contribution Score | Điểm đóng góp tri thức của người dùng |
| Xếp hạng đóng góp | Thứ hạng đóng góp trong hệ thống |

Điểm đóng góp tri thức của cá nhân sẽ được tính vào tổng điểm tự đánh giá trong phân hệ Đánh giá và được tính vào kết quả đánh giá hoàn thành nhiệm vụ cá nhân.

#### 10.2.3 Thông tin đóng góp tri thức theo phòng ban
Hệ thống tổng hợp dữ liệu đóng góp tri thức theo đơn vị.

| Thông tin | Mô tả |
|---|---|
| Phòng ban | Tên đơn vị |
| Số lượng người dùng | Số thành viên sử dụng hệ thống |
| Tổng tài liệu tải lên | Tổng số tài liệu do phòng ban đóng góp |
| Tổng lượt chia sẻ | Tổng số lượt chia sẻ tài liệu |
| Tổng lượt đánh giá | Tổng số lượt đánh giá tài liệu |
| Số lượt phê duyệt tài liệu | Tổng số lần phê duyệt tài liệu |
| Số lượt làm sạch tri thức | Tổng số lần cập nhật tài liệu sắp hết hạn |
| Knowledge Contribution Score | Tổng điểm đóng góp tri thức của phòng ban |
| Xếp hạng phòng ban | Thứ hạng đóng góp tri thức |

Điểm đóng góp tri thức của phòng ban sẽ được tính vào tổng điểm đánh giá trong phân hệ Đánh giá và được tính vào kết quả đánh giá hoàn thành nhiệm vụ tập thể.

#### 10.2.4 Thông tin xu hướng phát triển tri thức
Hệ thống cung cấp dữ liệu thống kê theo thời gian để theo dõi sự phát triển của kho tri thức.

| Thông tin | Mô tả |
|---|---|
| Xu hướng tải lên tài liệu | Số lượng tài liệu được tải lên theo thời gian |
| Xu hướng chia sẻ tri thức | Số lượt chia sẻ tài liệu |
| Xu hướng khai thác tri thức | Số lượt tải xuống tài liệu |
| Xu hướng đóng góp tri thức | Tổng điểm đóng góp tri thức theo thời gian |

#### 10.2.5 Nhật ký hoạt động tri thức
Hệ thống ghi nhận lịch sử hoạt động của người dùng liên quan đến tri thức.

| Thông tin | Mô tả |
|---|---|
| Thời gian | Thời điểm phát sinh hoạt động |
| Người dùng | Người thực hiện thao tác |
| Phòng ban | Đơn vị công tác |
| Loại hoạt động | Tải lên, tải xuống, chia sẻ, đánh giá, góp ý |
| Tài liệu liên quan | Tên tài liệu được thao tác |
| Điểm đóng góp tri thức | Điểm phát sinh từ hoạt động |

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
