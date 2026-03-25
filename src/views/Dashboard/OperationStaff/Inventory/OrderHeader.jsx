import React from 'react';
import { Truck, ClipboardList, CheckCircle } from 'lucide-react';

const OrderHeader = ({ orderData, status, actualReceiveDate, setActualReceiveDate, getStatusVN, formatDate }) => {
    return (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center text-sm">
                <h2 className="text-lg font-semibold text-slate-800 uppercase flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-700" /> Thông tin nguồn cung
                </h2>
                <div className={`px-4 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center gap-2 
                    ${status === "Pending Verification" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                    {status === "Pending Verification" ? <ClipboardList className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {getStatusVN(status).toUpperCase()}
                </div>
            </div>

            <div className="p-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-4">
                        <p><span className="text-slate-500 font-medium">Nhà cung cấp:</span> <span className="font-bold ml-2 text-slate-800">{orderData.supplierName}</span></p>
                        <p><span className="text-slate-500 font-medium">Số điện thoại:</span> <span className="ml-2 text-slate-800">{orderData.supplierPhone}</span></p>
                        <p><span className="text-slate-500 font-medium">Địa chỉ:</span> <span className="ml-2 text-slate-800">{orderData.supplierAddress}</span></p>
                    </div>
                    <div className="space-y-4 border-l border-slate-100 pl-8">
                        <p><span className="text-blue-800 font-bold uppercase text-[12px]">Mã phiếu:</span> <span className="font-mono text-blue-700 font-bold ml-2">{orderData.receiptCode}</span></p>
                        <p><span className="text-slate-500 font-medium">Ngày đặt đơn:</span> <span className="ml-2 text-slate-800">{formatDate(orderData.orderDate)}</span></p>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-700 font-bold uppercase text-[12px]">Ngày nhận thực tế:</span>
                            <input
                                type="date"
                                className="ml-2 border-slate-300 rounded-md text-sm font-semibold py-1 px-2 focus:ring-blue-500 outline-none border bg-white"
                                value={actualReceiveDate}
                                onChange={(e) => setActualReceiveDate(e.target.value)}
                                disabled={status !== "Pending Verification"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderHeader;