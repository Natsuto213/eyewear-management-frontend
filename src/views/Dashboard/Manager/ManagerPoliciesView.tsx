import { useState } from 'react';
import { Pencil, Save, X, Plus } from 'lucide-react';

interface Policy {
    id: string;
    title: string;
    content: string;
}

const initialPolicies: Record<string, Policy> = {
    warranty: {
        id: 'warranty',
        title: 'Chính sách bảo hành',
        content: `CHẾ ĐỘ BẢO HÀNH TẠI KÍNH MẮT ANNA
MỘT SỐ LƯU Ý VỀ KÍNH MÀI

• Đối với lens mài thường: có hiện tượng lóang, láu, nhức mỏi mắt.
• Hình tượng hóa đơn bán hàng là điều kiện để giải quyết theo thỏa thuận từ 6 đến 7 ngày khi tới thêm về kính mài.
• Thích nghi với kính mài.

Nguyên nhân:
• Có độ mà chưa đổi trong mắt kính đó nên giống kính cận và gọng kính có đang dùng đó
• Do mắt cận thính bên nhiều hơn số với đổi kính cũ
• Đeo kính thêm có nhiều nhều tự mắt gọng kính cũ
• Sẹo mắt có đi trong suốt khi thay kính cũ
• Vật phẩm đắc thêm nó đã ổn
• Đôi lần là đến các mục không hay sao đấy
• Đề làm kính là các chuyên gia họa sỹ sẽ
• Giả thường cần có nhiều bởi tính chất về khả năng tổng hợp để mắt trống kính cũ (gọng kính mài có gọng kính thứ 2)

CHẾ ĐỘ BẢO HÀNH KÍNH ĐẾN TẶNG ANNA

• Anna bảo hành cho cửa hàng thì khách hàng khác không mang giày hoặc thêm mắt. Trợ giá 10% là giảm yết khi khinh hàng đến 45 đổi sản phẩm gia giá hoặc thuốc thêm hơn. Áp dụng 1 lần duy nhất tổng tổng tổng làm trong 365 ngày từ khi mua hàng.
• Sau 207 ngày đẹp kể từ lần mua hàng, Anna bồi trợ đổi kính gọng kính (45 sản phẩm cùng mắt khi thay nguồn tương tự).`,
    },
    return: {
        id: 'return',
        title: 'Chính sách đổi trả',
        content: `CHÍNH SÁCH ĐỔI TRẢ

• Trong 07 ngày đầu tiên, bảo hành do lỗi nhà sản xuất thi lỗi kỹ thuật không mà vật thi thời và bị lỗi. Khách hàng có thể đổi sang sản phẩm tương đương hoặc hoàn tiền.
• Do mail, kiếm tra kỹ tình trạng gói hàng trước khi nhận hàng từ nhân viên giao hàng quốc tế.
• Sản phẩm đổi trả phải còn nguyên tem nhãn, chưa qua sử dụng, còn đầy đủ phụ kiện.
• Bảo hành áp dụng với các sản phẩm tì khuôn mặt khuyến mãi.
• Liên hệ Hotline ngay khi có tình trạng hàng hỏng, bể, hư, hay không nhận được sản phẩm.`,
    },
    payment: {
        id: 'payment',
        title: 'Chính sách thanh toán',
        content: `CHÍNH SÁCH THANH TOÁN

• Thanh toán trực tiếp tại cửa hàng: Tiền mặt hoặc thẻ ngân hàng (Visa, MasterCard, JCB).
• Thanh toán online qua: Chuyển khoản ngân hàng, Momo, ZaloPay, VNPay.
• Đặt cọc trước 30% giá trị đơn hàng cho các đơn hàng đặt trước hoặc mài kính.
• Thanh toán toàn bộ khi nhận hàng tại cửa hàng hoặc trước khi giao hàng.
• Hóa đơn VAT được xuất theo yêu cầu trong vòng 05 ngày kể từ ngày mua hàng.`,
    },
    shipping: {
        id: 'shipping',
        title: 'Chính sách giao hàng',
        content: `CHÍNH SÁCH GIAO HÀNG

• Giao hàng nội thành TP.HCM: 1-2 ngày làm việc, phí 25.000đ (miễn phí với đơn hàng trên 500.000đ).
• Giao hàng toàn quốc: 3-5 ngày làm việc, phí tùy theo khu vực và trọng lượng.
• Đơn hàng kính mài: Thêm 2-3 ngày làm việc cho quá trình gia công.
• Giao hàng nhanh (trong ngày): Áp dụng nội thành TP.HCM, phí 50.000đ.
• Kiểm tra hàng trước khi thanh toán, không nhận hàng hỏng vỡ.
• Miễn phí giao hàng toàn quốc với đơn hàng trên 2.000.000đ.`,
    },
};

const tabIds = ['warranty', 'return', 'payment', 'shipping'];

export default function ManagerPoliciesView() {
    const [activeTab, setActiveTab] = useState('warranty');
    const [policies, setPolicies] = useState(initialPolicies);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const handleEdit = (id: string) => {
        setEditingId(id);
        setEditContent(policies[id].content);
    };

    const handleSave = (id: string) => {
        setPolicies(prev => ({
            ...prev,
            [id]: { ...prev[id], content: editContent },
        }));
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditContent('');
    };

    const currentPolicy = policies[activeTab];
    const isEditing = editingId === activeTab;

    return (
        <div className="p-6 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                    Danh sách chính sách
                </h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        <Plus className="h-4 w-4" />
                        Thêm chính sách
                    </button>
                    <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        Lưu tất cả
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tab Bar */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    {tabIds.map(tabId => (
                        <button
                            key={tabId}
                            onClick={() => setActiveTab(tabId)}
                            className={`flex-1 px-4 py-3 text-sm transition-colors relative ${activeTab === tabId
                                ? 'text-purple-700 bg-white border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            style={{ fontWeight: activeTab === tabId ? 600 : 400 }}
                        >
                            {policies[tabId].title}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-base text-gray-800" style={{ fontWeight: 600 }}>{currentPolicy.title}</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => handleEdit(activeTab)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Chỉnh sửa
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSave(activeTab)}
                                    className="flex items-center gap-1.5 text-green-600 hover:text-green-800 text-sm px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-green-200"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    Lưu
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-red-200"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Hủy
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full h-80 text-sm text-gray-700 leading-relaxed p-4 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none bg-purple-50/30"
                        />
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-5">
                            {currentPolicy.content.split('\n').map((line, i) => {
                                if (line.startsWith('CHẾ ĐỘ') || line.startsWith('CHÍNH SÁCH')) {
                                    return <p key={i} className="text-sm text-gray-800 mb-2 mt-3" style={{ fontWeight: 700 }}>{line}</p>;
                                }
                                if (line.startsWith('MỘT SỐ') || line.startsWith('Nguyên nhân')) {
                                    return <p key={i} className="text-sm text-gray-600 mb-2" style={{ fontWeight: 600 }}>{line}</p>;
                                }
                                if (line.startsWith('•')) {
                                    return (
                                        <p key={i} className="text-sm text-gray-600 mb-1.5 pl-2">
                                            {line}
                                        </p>
                                    );
                                }
                                return line ? <p key={i} className="text-sm text-gray-600 mb-1.5">{line}</p> : <br key={i} />;
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
