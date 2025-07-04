# UDPT - Ứng Dụng Phân Tán

📚 Đồ án môn học - Trường Đại học Khoa học Tự nhiên TP.HCM  
📆 Kỳ II - Năm học 2025  
👨‍💻 Nhóm Seminar - UDPT

---

## 📁 Cấu trúc repository

```bash
.
├── frontend
├── libs
├── docker-compose.yml               # Cấu hình cho môi trường production
├── docker-compose.override.yml      # Ghi đè cho môi trường development
├── services/                        # Chứa toàn bộ các microservices
│   ├── gateway/
│   ├── patient_services/
│   ├── doctor_services/
│   ├── appointment_services/
│   ├── medicine_services/
│   └── user_services/
```

---

## ⚙️ Cấu hình cần chuẩn bị
### REMEMBER SERVICES PORT
gateway = 3000
user = 3001
doctor = 3002
patient = 3003
appointment = 3004


### 1. `.env` trong thư mục `gateway`
```env
# Ví dụ
PATIENT_PROTO_PATH=shared_proto/patient/patient.proto
PATIENT_PACKAGE=patientPackage 
PATIENT_SERVICE_NAME=PatientService
PATIENT_SERVICE_HOST=patient-services:3001
```

### 2. `clientproto/serviceMethod.json` trong gateway
```json
  "patient": {
    "PatientService": {
      "GetVisit": { "method": "GET", "params": ["id"] },
      "ListVisits": { "method": "GET", "params": ["userId"] },
      "CreateVisit": { "method": "POST" },
      "UpdateVisit": { "method": "PUT", "params": ["id"] },
      "Check": { "method": "GET" }
    }
  }
```

---

## 🚀 Cách chạy project

### 🛠️ 1. Chạy ở chế độ Development

> Dành cho lập trình viên, sử dụng volumes để mount mã nguồn trực tiếp

```bash
# Build và chạy với mã nguồn mount từ máy thật (hot-reload)
docker-compose up --build

# hoặc nếu đã build rồi:
docker-compose up
```

📌 Mặc định Docker sẽ tự động load cả:
- `docker-compose.yml`
- `docker-compose.override.yml`

📍 Các thay đổi trong source code sẽ được áp dụng ngay nếu app hỗ trợ hot-reload.

---

### 📦 2. Chạy ở chế độ Production

> Dùng image build sẵn, không mount code. Phù hợp deploy thật hoặc test tích hợp.

```bash
# Bước 1: Build toàn bộ service (chỉ cần 1 lần nếu không đổi source/Dockerfile)
docker-compose -f docker-compose.yml build

# Bước 2: Chạy production (không dùng override dev)
docker-compose -f docker-compose.yml up -d
```

📍 Container chạy từ image, không phụ thuộc mã nguồn bên ngoài.

---

## 🔄 Chuyển đổi giữa Dev và Prod

### 🛠️ ➤ Từ **Dev** ➡ **Prod**

```bash
docker-compose -f docker-compose.yml up -d
```

📌 Prod **sẽ không** sử dụng `volumes:` để mount code nữa → image cần build đủ.

### 🧪 ➤ Từ **Prod** ➡ **Dev**

```bash
docker-compose up -d
```

📌 Dev sẽ mount code từ local → bạn có thể chỉnh sửa trực tiếp không cần rebuild image.

###  3. stop container
docker-compose stop

### 🧠 Ghi nhớ nhanh

| Mục tiêu                  | Lệnh dùng                                             |
|---------------------------|-------------------------------------------------------|
| Build image prod lần đầu  | `docker-compose -f docker-compose.yml build`          |
| Chạy prod                 | `docker-compose -f docker-compose.yml up -d`          |
| Chạy dev                  | `docker-compose up --build` (có override)             |
| Dừng dev                  | `docker-compose down`                                 |
| Dừng prod                 | `docker-compose -f docker-compose.yml down`           |

---

## 🧪 Một số lệnh hữu ích

| Mục đích                          | Lệnh                                                                  |
|-----------------------------------|-----------------------------------------------------------------------|
| Xem log toàn bộ services          | `docker-compose logs -f`                                              |
| Xem log riêng 1 service           | `docker-compose logs -f <service-name>`                               |
| Truy cập container                | `docker exec -it <container-name> sh`                                 |
| Dừng các container                | `docker-compose down`                                                 |
| Xoá sạch container + volume       | `docker-compose down -v`                                              |
| Kiểm tra container đang chạy      | `docker ps`                                                           |
| Build lại toàn bộ                 | `docker-compose build` (dev) / `-f docker-compose.yml build` (prod)   |

---
