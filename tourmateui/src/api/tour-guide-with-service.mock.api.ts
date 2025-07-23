import { TourGuideDetailWithServices, TourService } from "@/types/tour-guide-detail";

const mockServices: TourService[] = [
  {
    serviceId: 1,
    serviceName: "Tour City Sài Gòn 1 ngày",
    price: 800000,
    duration: "8 giờ",
    content: `
      <h3>Lịch trình tour</h3>
      <p><strong>8:00 - 9:00:</strong> Đón khách tại khách sạn, khởi hành</p>
      <p><strong>9:00 - 10:30:</strong> Tham quan Dinh Độc Lập</p>
      <p><strong>10:30 - 12:00:</strong> Nhà thờ Đức Bà, Bưu điện Trung tâm</p>
      <p><strong>12:00 - 13:30:</strong> Nghỉ trưa tại nhà hàng địa phương</p>
      <p><strong>13:30 - 15:00:</strong> Chợ Bến Thành</p>
      <p><strong>15:00 - 16:30:</strong> Phố đi bộ Nguyễn Huệ, Bitexco</p>
      <p><strong>16:30 - 17:00:</strong> Trả khách về khách sạn</p>
    `,
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop",
    tourGuideId: 1,
    createdDate: "2024-01-15T08:00:00Z",
    isDeleted: false,
    title: "Khám phá Sài Gòn trong 1 ngày",
    tourDesc: "Khám phá các địa điểm nổi tiếng và văn hóa của Sài Gòn cùng hướng dẫn viên địa phương có kinh nghiệm."
  },
  {
    serviceId: 2,
    serviceName: "Tour Ẩm thực đường phố",
    price: 500000,
    duration: "4 giờ",
    content: `
      <h3>Các món ăn sẽ thưởng thức</h3>
      <p><strong>Phở:</strong> Món phở truyền thống tại quán lâu đời</p>
      <p><strong>Bánh mì:</strong> Bánh mì Việt Nam với nhiều loại nhân</p>
      <p><strong>Chè:</strong> Các loại chè truyền thống</p>
      <p><strong>Cơm tấm:</strong> Cơm tấm sườn nướng</p>
      <p><strong>Cà phê:</strong> Cà phê phin Việt Nam</p>
    `,
    image: "https://images.unsplash.com/photo-1559847844-d9697bc4071d?w=600&h=400&fit=crop",
    tourGuideId: 1,
    createdDate: "2024-01-20T09:00:00Z",
    isDeleted: false,
    title: "Trải nghiệm ẩm thực Sài Gòn",
    tourDesc: "Khám phá văn hóa ẩm thực đường phố Sài Gòn với những món ăn đặc trưng và hấp dẫn nhất."
  },
  {
    serviceId: 3,
    serviceName: "Tour Củ Chi - Mekong 2 ngày",
    price: 2500000,
    duration: "2 ngày 1 đêm",
    content: `
      <h3>Ngày 1: Địa đạo Củ Chi</h3>
      <p><strong>8:00:</strong> Khởi hành từ TP.HCM</p>
      <p><strong>10:00 - 15:00:</strong> Tham quan địa đạo Củ Chi</p>
      <p><strong>15:00:</strong> Di chuyển về khách sạn</p>
      <h3>Ngày 2: Đồng bằng sông Cửu Long</h3>
      <p><strong>8:00:</strong> Khởi hành đi Cần Thơ</p>
      <p><strong>10:00 - 16:00:</strong> Tour miệt vườn, chợ nổi</p>
      <p><strong>17:00:</strong> Về lại TP.HCM</p>
    `,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=400&fit=crop",
    tourGuideId: 1,
    createdDate: "2024-01-10T07:30:00Z",
    isDeleted: false,
    title: "Combo Củ Chi - Mekong",
    tourDesc: "Khám phá lịch sử tại địa đạo Củ Chi và văn hóa miệt vườn sông nước miền Tây."
  },
  {
    serviceId: 4,
    serviceName: "Tour Vũng Tàu cuối tuần",
    price: 1200000,
    duration: "2 ngày 1 đêm",
    content: `
      <h3>Ngày 1: Khám phá Vũng Tàu</h3>
      <p><strong>8:00:</strong> Khởi hành từ TP.HCM</p>
      <p><strong>10:00:</strong> Tượng Chúa Kitô</p>
      <p><strong>12:00:</strong> Nghỉ trưa, nhận phòng</p>
      <p><strong>15:00:</strong> Bãi biển Thùy Vân</p>
      <p><strong>18:00:</strong> Chợ đêm Vũng Tàu</p>
      <h3>Ngày 2: Thư giãn và về</h3>
      <p><strong>8:00:</strong> Ngọn hải đăng</p>
      <p><strong>10:00:</strong> Tự do tắm biển</p>
      <p><strong>14:00:</strong> Trả phòng, về TP.HCM</p>
    `,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    tourGuideId: 1,
    createdDate: "2024-01-05T08:15:00Z",
    isDeleted: false,
    title: "Nghỉ dưỡng Vũng Tàu",
    tourDesc: "Tour cuối tuần lý tưởng cho gia đình với biển đẹp và không khí trong lành."
  },
  {
    serviceId: 5,
    serviceName: "Tour Đà Lạt 3 ngày 2 đêm",
    price: 3200000,
    duration: "3 ngày 2 đêm",
    content: `
      <h3>Ngày 1: Khởi hành - Đà Lạt</h3>
      <p><strong>6:00:</strong> Khởi hành từ TP.HCM</p>
      <p><strong>12:00:</strong> Nghỉ trưa tại Bảo Lộc</p>
      <p><strong>15:00:</strong> Đến Đà Lạt, nhận phòng</p>
      <p><strong>16:00:</strong> Hồ Xuân Hương, chợ Đà Lạt</p>
      <h3>Ngày 2: Tham quan Đà Lạt</h3>
      <p><strong>8:00:</strong> Thác Elephant, Crazy House</p>
      <p><strong>14:00:</strong> Langbiang, làng Cù Lần</p>
      <h3>Ngày 3: Về TP.HCM</h3>
      <p><strong>8:00:</strong> Ga Đà Lạt, vườn hoa</p>
      <p><strong>13:00:</strong> Khởi hành về TP.HCM</p>
    `,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop",
    tourGuideId: 1,
    createdDate: "2024-01-25T07:00:00Z",
    isDeleted: false,
    title: "Đà Lạt thành phố hoa",
    tourDesc: "Khám phá thành phố ngàn hoa với khí hậu mát mẻ và cảnh đẹp lãng mạn."
  },
  {
    serviceId: 6,
    serviceName: "Tour Phan Thiết - Mũi Né",
    price: 1800000,
    duration: "2 ngày 1 đêm",
    content: `
      <h3>Ngày 1: TP.HCM - Phan Thiết</h3>
      <p><strong>7:00:</strong> Khởi hành từ TP.HCM</p>
      <p><strong>11:00:</strong> Đến Phan Thiết, tham quan tháp Chăm</p>
      <p><strong>14:00:</strong> Nhận phòng, nghỉ ngơi</p>
      <p><strong>16:00:</strong> Đồi cát bay, sunset</p>
      <h3>Ngày 2: Mũi Né - TP.HCM</h3>
      <p><strong>5:00:</strong> Sunrise tại đồi cát</p>
      <p><strong>8:00:</strong> Suối tiên, làng chài</p>
      <p><strong>12:00:</strong> Trả phòng</p>
      <p><strong>14:00:</strong> Khởi hành về TP.HCM</p>
    `,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    tourGuideId: 1,
    createdDate: "2024-02-01T06:45:00Z",
    isDeleted: false,
    title: "Phan Thiết - Thiên đường cát trắng",
    tourDesc: "Khám phá vẻ đẹp hoang sơ của biển Mũi Né với những đồi cát tuyệt đẹp."
  }
];

export const mockTourGuideDetail = {
  tourGuideId: 1,
  fullName: "Nguyễn Văn An",
  gender: "Nam",
  dateOfBirth: "1990-05-15",
  accountId: 123,
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  phone: "0901234567",
  isVerified: true,
  bannerImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73826?w=600&h=300&fit=crop",
  yearOfExperience: 8,
  description: `
    <p>Xin chào! Tôi là Nguyễn Văn An, một hướng dẫn viên du lịch với hơn 8 năm kinh nghiệm trong ngành.</p>
    <p>Tôi chuyên dẫn tour tại khu vực TP.HCM và các tỉnh miền Nam. Với niềm đam mê khám phá văn hóa địa phương và chia sẻ những câu chuyện thú vị về lịch sử, tôi luôn mong muốn mang đến cho du khách những trải nghiệm tuyệt vời nhất.</p>
    <p>Tôi thành thạo tiếng Anh và có thể giao tiếp cơ bản bằng tiếng Trung. Hãy để tôi đồng hành cùng bạn khám phá vẻ đẹp của Việt Nam!</p>
  `,
  company: "Công ty Du lịch Việt",
  areaId: 0,
  area: {
                areaId: 0,
                areaName: "TP.HCM và miền Nam",
                areaTitle: "",
                areaSubtitle: "",
                areaContent: "",
                bannerImg: "",
                areaType: "",
                createdAt: ""
            },
  tourServices: mockServices
};