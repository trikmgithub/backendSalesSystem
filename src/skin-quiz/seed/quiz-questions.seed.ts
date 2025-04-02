// src/skin-quiz/seed/quiz-questions.seed.ts
export const quizQuestionsSeed = [
  {
    questionId: 'Q1',
    questionText: 'Da của bạn thường trông ra sao vào buổi chiều?',
    options: [
      {
        text: 'Trán, mũi và cằm bị bóng dầu nhưng phần còn lại trên mặt lại bình thường hoặc khô',
        points: 1,
        skinType: 'da_hon_hop',
      },
      {
        text: 'Da của tôi không bị bóng, khá khô và có cảm giác căng ở một số khu vực',
        points: 5,
        skinType: 'da_kho',
      },
      {
        text: 'Toàn bộ khuôn mặt tôi bị bóng, có cảm giác nhờn dầu và dễ bị mụn đầu đen và mụn trứng cá',
        points: 2,
        skinType: 'da_dau',
      },
      {
        text: 'Da của tôi mềm mại và thấy dễ chịu khi chạm vào',
        points: 3,
        skinType: 'da_thuong',
      },
      {
        text: 'Da của tôi bị khô và tôi có thể nhận thấy một số nếp nhăn',
        points: 4,
        skinType: 'da_kho_lao_hoa',
      },
    ],
  },
  {
    questionId: 'Q2',
    questionText: 'Vùng trán của bạn trông như thế nào?',
    options: [
      {
        text: 'Da khá phẳng mịn, với một vài nếp nhăn nhẹ',
        points: 4,
        skinType: 'da_thuong',
      },
      {
        text: 'Tôi nhận thấy một vài vết bong tróc dọc theo đường chân tóc, lông mày và giữa hai bên lông mày',
        points: 2,
        skinType: 'da_hon_hop',
      },
      {
        text: 'Da bóng nhẵn và không được mịn. Có những nốt mụn nhỏ và một số mụn đầu đen',
        points: 1,
        skinType: 'da_dau',
      },
      {
        text: 'Không hẳn, da của tôi hầu như không có nếp nhăn',
        points: 3,
        skinType: 'da_thuong',
      },
    ],
  },
  {
    questionId: 'Q3',
    questionText: 'Mô tả về vùng má của bạn?',
    options: [
      {
        text: 'Tôi bị một vài vết hằn do da khô',
        points: 4,
        skinType: 'da_kho',
      },
      {
        text: 'Có. Tôi bị các nếp nhăn quanh vùng mắt và/hoặc ở khóe miệng',
        points: 2,
        skinType: 'da_lao_hoa',
      },
      {
        text: 'Không, tôi hầu như không có nếp nhăn',
        points: 1,
        skinType: 'da_thuong',
      },
      {
        text: 'Không hẳn, da của tôi lão hóa tương đối chậm',
        points: 3,
        skinType: 'da_thuong',
      },
    ],
  },
  {
    questionId: 'Q4',
    questionText: 'Mô tả về vùng mũi của bạn?',
    options: [
      {
        text: 'Da có nhiều dầu và có xu hướng bị mụn đầu đen thường xuyên',
        points: 5,
        skinType: 'da_dau',
      },
      { text: 'Da khá khô, đôi khi có vảy', points: 3, skinType: 'da_kho' },
      {
        text: 'Vùng mũi có dầu nhưng má thì khô',
        points: 4,
        skinType: 'da_hon_hop',
      },
      {
        text: 'Da bình thường, không quá dầu hay quá khô',
        points: 2,
        skinType: 'da_thuong',
      },
    ],
  },
  {
    questionId: 'Q5',
    questionText: 'Sau khi rửa mặt, da bạn cảm thấy như thế nào?',
    options: [
      { text: 'Khô, căng và có thể đỏ', points: 5, skinType: 'da_kho' },
      { text: 'Sạch và thoải mái', points: 2, skinType: 'da_thuong' },
      {
        text: 'Vùng chữ T vẫn hơi nhờn nhưng má thì cảm thấy căng',
        points: 3,
        skinType: 'da_hon_hop',
      },
      {
        text: 'Nhanh chóng trở nên bóng nhờn lại',
        points: 4,
        skinType: 'da_dau',
      },
    ],
  },
  {
    questionId: 'Q6',
    questionText:
      'Trong điều kiện thời tiết nóng và ẩm, da bạn phản ứng thế nào?',
    options: [
      {
        text: 'Trở nên rất dầu, đặc biệt ở vùng chữ T',
        points: 5,
        skinType: 'da_hon_hop',
      },
      { text: 'Trở nên rất bóng nhờn khắp mặt', points: 4, skinType: 'da_dau' },
      {
        text: 'Cảm thấy dễ chịu và ẩm vừa phải',
        points: 2,
        skinType: 'da_thuong',
      },
      { text: 'Không thay đổi nhiều', points: 3, skinType: 'da_thuong' },
      { text: 'Dễ bị kích ứng và đỏ', points: 1, skinType: 'da_nhay_cam' },
    ],
  },
  {
    questionId: 'Q7',
    questionText: 'Da mặt bạn đã thay đổi ra sao trong 5 năm trở lại đây?',
    options: [
      {
        text: 'Da tôi bị bóng dầu nhiều hơn ở vùng chữ T (trán, mũi và cằm)',
        points: 2,
        skinType: 'da_hon_hop',
      },
      {
        text: 'Da tôi dễ bong tróc hơn và thường cảm thấy căng',
        points: 5,
        skinType: 'da_kho',
      },
      {
        text: 'Da có nhiều khuyết điểm hơn so với trước đây',
        points: 1,
        skinType: 'da_nhay_cam',
      },
      {
        text: 'Da tôi vẫn ở tình trạng tốt và dễ dàng chăm sóc',
        points: 3,
        skinType: 'da_thuong',
      },
      {
        text: 'Da tôi có vẻ mỏng đi và kém đàn hồi hơn, và thêm các nếp nhăn và vết hằn',
        points: 4,
        skinType: 'da_lao_hoa',
      },
    ],
  },
  {
    questionId: 'Q8',
    questionText: 'Giới tính của bạn là',
    options: [
      { text: 'Nam', points: 3, skinType: 'da_thuong' },
      { text: 'Nữ', points: 3, skinType: 'da_thuong' },
    ],
  },
  {
    questionId: 'Q9',
    questionText: 'Độ tuổi của bạn là',
    options: [
      { text: 'Dưới 25', points: 1, skinType: 'da_thuong' },
      { text: 'Từ 25 tới 40', points: 3, skinType: 'da_thuong' },
      { text: 'Từ 40 tới 50', points: 4, skinType: 'da_lao_hoa' },
      { text: 'Trên 50', points: 5, skinType: 'da_lao_hoa' },
    ],
  },
];
