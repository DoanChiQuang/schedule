# Cách chạy dự án
- B1: Chạy lệnh: git clone git@github.com:DoanChiQuang/calender-booking.git => Để download source về
- B2:
  + Tại thư mục: URL/calender-booking: Chạy lệnh: "npm run build", sau đó chạy lệnh: "npm run start" => Để chạy Front-end
  + Tại thư mục: URL/calender-booking/backend: Chạy lệnh: npm run start => Để chạy Back-end
 
# Để code được Back-end
- B1: Thực hiện theo dấu "+" thứ 2 tại B2 trong cách chạy dự án
- B2: Mở Postman
  + http://localhost:5000/api/signin
  + Params: {
      username: "admin",
      password: "123456"
    }
- Download phần mềm Quản Trị Cơ Sở Dữ Liệu (Đề xuất: 3T Studio: https://studio3t.com/download/)
- Kết nối với CDSL bằng mongoDB Alat: mongodb+srv://chiquang127:IRbzHKeUVadhnNGL@clustercalenderbooking.hyagn3o.mongodb.net/
