/**
 * src/utils/formatters.js
 * Centralized formatting functions for Currency, Numbers, Dates, etc.
 * Uses standard Intl APIs to support multiple locales.
 */

/**
 * Lấy locale hiện tại của hệ thống (mặc định vi-VN)
 */
const getCurrentLocale = () => window.currentLanguage === 'en' ? 'en-US' : 'vi-VN';

/**
 * Lấy Timezone hiện tại của hệ thống
 */
const getCurrentTimezone = () => window.currentTimezone || 'Asia/Ho_Chi_Minh';

/**
 * Format số tiền thành chuỗi hiển thị đúng chuẩn.
 * @param {number} amount - Số tiền cần format.
 * @param {string} currency - Mã tiền tệ (VND, USD...). Mặc định VND.
 * @returns {string} Chuỗi hiển thị tiền tệ (VD: 100.000 ₫)
 */
export const formatCurrency = (amount, currency = 'VND') => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0 ₫';

    return new Intl.NumberFormat(getCurrentLocale(), {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'VND' ? 0 : 2,
    }).format(amount);
};

/**
 * Format số lượng hiển thị (phân cách hàng nghìn).
 * @param {number} number 
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined || isNaN(number)) return '0';
    return new Intl.NumberFormat(getCurrentLocale()).format(number);
};

/**
 * Format Date object hoặc ISO string ra dạng DD/MM/YYYY cho người dùng xem.
 * @param {string|Date} dateVal - Thời gian truyền vào.
 * @returns {string} (VD: 25/12/2026)
 */
export const formatDate = (dateVal) => {
    if (!dateVal) return '';
    try {
        const d = new Date(dateVal);
        return new Intl.DateTimeFormat(getCurrentLocale(), {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: getCurrentTimezone()
        }).format(d);
    } catch (e) {
        return dateVal.toString();
    }
};

/**
 * Format Date kết hợp DateTime ra dạng hiển thị đầy đủ.
 * @param {string|Date} dateVal 
 * @returns {string} (VD: 25/12/2026 14:30)
 */
export const formatDateTime = (dateVal) => {
    if (!dateVal) return '';
    try {
        const d = new Date(dateVal);
        return new Intl.DateTimeFormat(getCurrentLocale(), {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: getCurrentTimezone()
        }).format(d);
    } catch (e) {
        return dateVal.toString();
    }
};

/**
 * Hàm gọi API từ Client gửi lên Backend (Chuyển thời gian địa phương về ISO 8601 chuẩn)
 * Đảm bảo dữ liệu gửi lên DB là thống nhất.
 */
export const toISODate = (dateVal) => {
    if (!dateVal) return null;
    return new Date(dateVal).toISOString();
};
