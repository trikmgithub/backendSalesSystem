// src/skin-quiz/seed/skin-types.seed.ts
export const skinTypesSeed = [
  {
    skinType: 'da_thuong',
    description:
      'Da thường cân bằng về độ ẩm, không quá khô hay quá nhờn. Lỗ chân lông nhỏ, ít khuyết điểm và không quá nhạy cảm.',
    recommendations: [
      'Sử dụng sữa rửa mặt dịu nhẹ để duy trì độ pH tự nhiên',
      'Dùng kem dưỡng ẩm nhẹ vào ban ngày',
      'Áp dụng kem chống nắng SPF 30+ hàng ngày',
      'Tẩy da chết 1-2 lần/tuần để loại bỏ tế bào chết',
      'Đắp mặt nạ dưỡng ẩm 1-2 lần/tuần để duy trì độ ẩm',
    ],
  },
  {
    skinType: 'da_kho',
    description:
      'Da khô thường thiếu độ ẩm và dầu tự nhiên, khiến da căng, có vảy và dễ bong tróc. Lỗ chân lông thường nhỏ và ít nhìn thấy.',
    recommendations: [
      'Sử dụng sữa rửa mặt không chứa xà phòng để tránh làm khô da thêm',
      'Dùng kem dưỡng ẩm đậm đặc có chứa ceramide hoặc hyaluronic acid',
      'Tránh tắm nước quá nóng và kéo dài',
      'Sử dụng serum dưỡng ẩm trước khi thoa kem dưỡng',
      'Đắp mặt nạ cấp ẩm 2-3 lần/tuần',
      'Cân nhắc sử dụng máy tạo độ ẩm trong phòng',
    ],
  },
  {
    skinType: 'da_dau',
    description:
      'Da dầu sản xuất quá nhiều bã nhờn (sebum), khiến da trông bóng nhờn, đặc biệt là ở vùng chữ T. Lỗ chân lông thường to và dễ thấy.',
    recommendations: [
      'Sử dụng sữa rửa mặt có chứa salicylic acid để kiểm soát dầu',
      'Chọn kem dưỡng ẩm dạng gel hoặc không chứa dầu',
      'Sử dụng toner chứa AHA/BHA để kiểm soát bã nhờn',
      'Đắp mặt nạ đất sét 1-2 lần/tuần để hút dầu thừa',
      'Luôn làm sạch mặt sau khi đổ mồ hôi',
      'Sử dụng giấy thấm dầu vào giữa ngày nếu cần',
    ],
  },
  {
    skinType: 'da_hon_hop',
    description:
      'Da hỗn hợp có những vùng dầu (thường là vùng chữ T) và những vùng thường hoặc khô (má và viền mặt). Đây là loại da phổ biến nhất.',
    recommendations: [
      'Sử dụng các sản phẩm làm sạch dịu nhẹ cho toàn bộ khuôn mặt',
      'Áp dụng các sản phẩm kiểm soát dầu chỉ ở vùng chữ T',
      'Dưỡng ẩm nhiều hơn ở các vùng khô',
      'Sử dụng các sản phẩm khác nhau cho các vùng da khác nhau',
      'Đắp mặt nạ đất sét ở vùng chữ T và mặt nạ dưỡng ẩm ở vùng má',
    ],
  },
  {
    skinType: 'da_nhay_cam',
    description:
      'Da nhạy cảm dễ bị kích ứng, đỏ, châm chích hoặc ngứa khi tiếp xúc với nhiều sản phẩm. Có thể đi kèm với các tình trạng da khác.',
    recommendations: [
      'Sử dụng sản phẩm không chứa hương liệu và hypoallergenic',
      'Tránh các thành phần như cồn, paraben và sulfate',
      'Luôn thử sản phẩm mới trên một vùng da nhỏ trước',
      'Bảo vệ da khỏi thay đổi nhiệt độ cực đoan',
      'Chọn kem chống nắng vật lý thay vì hóa học',
      'Sử dụng sản phẩm có thành phần làm dịu như lô hội và chiết xuất yến mạch',
    ],
  },
  {
    skinType: 'da_lao_hoa',
    description:
      'Da lão hóa thường có nếp nhăn, mất độ đàn hồi, khô và có thể có đốm nâu. Kết cấu da có thể mỏng hơn và kém săn chắc.',
    recommendations: [
      'Sử dụng sản phẩm chứa retinol để thúc đẩy tái tạo tế bào',
      'Bổ sung collagen qua sản phẩm bôi ngoài da và thực phẩm',
      'Dùng serum vitamin C để làm sáng và chống oxy hóa',
      'Áp dụng kem dưỡng ẩm giàu dưỡng chất',
      'Sử dụng kem mắt đặc trị để giảm quầng thâm và nếp nhăn',
      'Không bao giờ bỏ qua kem chống nắng, ngay cả vào mùa đông',
    ],
  },
  {
    skinType: 'da_kho_lao_hoa',
    description:
      'Kết hợp giữa da khô và dấu hiệu lão hóa. Da không chỉ thiếu độ ẩm mà còn có nếp nhăn, đường chân chim và mất độ đàn hồi.',
    recommendations: [
      'Sử dụng sữa rửa mặt dạng kem không chứa sulfate',
      'Dùng serum dưỡng ẩm đậm đặc với hyaluronic acid',
      'Áp dụng kem dưỡng giàu chất béo và chống oxy hóa',
      'Thêm dầu dưỡng vào quy trình chăm sóc buổi tối',
      'Dùng mặt nạ ngủ qua đêm 2-3 lần/tuần',
      'Bổ sung thực phẩm giàu omega-3 và collagen',
      'Đầu tư vào máy tạo độ ẩm và xông hơi mặt định kỳ',
    ],
  },
];
