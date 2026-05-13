# Thành viên nhóm 10

| STT | Họ và tên           | MSSV     |
|-----|---------------------|----------|
| 1   | Dương Đăng Khoa     | 23110240 |
| 2   | Hồ Minh Trí         | 23110349 |
| 3   | Nguyễn Huỳnh Tự     | 23110361 |
| 4   | Chau Võ Minh Danh   | 23110190 |

# Bài tập 04 - 13/05/2026

# Yêu cầu bài tập

## 1. Xây dựng trang chủ bán hàng

Sau khi đăng nhập thành công với vai trò MEMBER:
- Điều hướng người dùng vào trang chủ bán hàng.

Trang chủ cần có:

### Header
- Logo
- Navigation menu
- Thanh tìm kiếm
- Thông tin thành viên đăng nhập
- Username hoặc avatar
- Nút Logout
- Cart icon

### Banner / Slider
- Banner quảng cáo sản phẩm
- Responsive
- Có thể sử dụng slider/carousel

### Khu vực sản phẩm
Hiển thị:
- Sản phẩm khuyến mãi
- Sản phẩm mới nhất
- Sản phẩm bán chạy nhất

Yêu cầu:
- Dữ liệu lấy trực tiếp từ database
- Không được hard code dữ liệu

### Danh mục sản phẩm
- Hiển thị danh mục tương ứng của sản phẩm

### Footer
- Responsive
- Thiết kế hiện đại bằng Tailwind CSS

---

## 2. Xây dựng trang chi tiết sản phẩm

Trang chi tiết sản phẩm cần có:

### Gallery hình ảnh
Nếu sản phẩm có nhiều hình:
- Sử dụng SwiperJS hoặc thư viện tương đương
- Có thumbnail preview
- Responsive

### Thông tin sản phẩm
Hiển thị:
- Tên sản phẩm
- Giá sản phẩm
- Giá khuyến mãi (nếu có)
- Mô tả sản phẩm
- Danh mục sản phẩm
- Số lượng tồn kho
- Số lượng đã bán

### Chức năng số lượng
- Tăng/giảm số lượng sản phẩm
- Không cho số âm
- Không vượt quá số lượng tồn kho

### Sản phẩm tương tự
- Hiển thị các sản phẩm cùng danh mục
- Lấy dữ liệu từ database

### Breadcrumb
Ví dụ:
Home > Category > Product

---

## 3. Xây dựng chức năng tìm kiếm và lọc dữ liệu

### Tìm kiếm
Cho phép tìm kiếm theo:
- Tên sản phẩm
- Mô tả sản phẩm

### Bộ lọc nhiều điều kiện
Hỗ trợ lọc theo:
- Danh mục sản phẩm
- Khoảng giá
- Sản phẩm khuyến mãi
- Sản phẩm bán chạy
- Sản phẩm mới nhất
- Còn hàng

### Sắp xếp dữ liệu
Hỗ trợ:
- Giá tăng dần
- Giá giảm dần
- Mới nhất
- Bán chạy nhất

---

- Dữ liệu hiển thị từ database thật
- Không ảnh hưởng chức năng authentication cũ
- Code rõ ràng, dễ maintain
