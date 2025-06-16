**Để chạy service này:**

```bash
cd source/serivces/appointment_services
npm install
npm run dev
```

**Để test api:**
- Mở postman, import file 'Doctor's Appointments API.postman_collection.json' vào postman 
- Chạy các routes đã được sắp xếp sẵn.


**NOTES:**
- Các model như User, Doctor hiện được tạo để test thử, khi nào có các apis kia sẽ thay bằng các apis đó.
- Không có Delete vì chỉ cập nhật Status khi xóa lịch hẹn.
- Dockerfile sẽ được bổ sung sau khi hoàn tất api.