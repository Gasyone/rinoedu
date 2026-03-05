window.i18n = {
    languages: ['vi', 'en'],
    defaultLanguage: 'vi',
    translations: {
        vi: {
            'Trang chủ': 'Trang chủ',
            'Dashboard': 'Bảng điều khiển',
            'Tất cả ứng dụng': 'Tất cả ứng dụng',
            'Workspace Cá nhân': 'Không gian Cá nhân',
            'Business Workspace': 'Không gian Doanh nghiệp',
            // System categories
            'Hệ thống': 'Hệ thống',
            'Tổ chức': 'Tổ chức',
            'Truyền thông': 'Truyền thông',
            'Học tập & Sáng tạo': 'Học tập & Sáng tạo',
            'Kinh doanh & Vận hành': 'Kinh doanh & Vận hành',
            'Công cụ': 'Công cụ',
            'Giảng dạy': 'Giảng dạy',
            'Vận hành': 'Vận hành',

            // App names
            'Quản lý Đào tạo': 'Quản lý Đào tạo',
            'Quản lý Giảng dạy': 'Quản lý Giảng dạy',
            'Quản lý tài khoản': 'Quản lý tài khoản',
            'Cài đặt': 'Cài đặt',
            'Đăng xuất': 'Đăng xuất',
            'Đổi Workspace': 'Đổi không gian làm việc',
            'Thông báo': 'Thông báo',
            'Tìm kiếm...': 'Tìm kiếm...',

            // Common
            'Đóng': 'Đóng',
            'Lưu': 'Lưu',
            'Hủy bỏ': 'Hủy bỏ',
            'Quay lại': 'Quay lại',
            'Xác nhận': 'Xác nhận'
        },
        en: {
            'Trang chủ': 'Home',
            'Dashboard': 'Dashboard',
            'Tất cả ứng dụng': 'All Applications',
            'Workspace Cá nhân': 'Personal Workspace',
            'Business Workspace': 'Business Workspace',

            // System categories
            'Hệ thống': 'System Controls',
            'Tổ chức': 'Organization',
            'Truyền thông': 'Communication',
            'Học tập & Sáng tạo': 'Learning & Creativity',
            'Kinh doanh & Vận hành': 'Business & Operations',
            'Công cụ': 'Utilities',
            'Giảng dạy': 'Teaching',
            'Vận hành': 'Operations',

            // App names
            'Quản lý Đào tạo': 'Center Operations',
            'Quản lý Giảng dạy': 'Class Management',
            'Quản lý tài khoản': 'Account Manager',
            'Cài đặt': 'Settings',
            'Đăng xuất': 'Log Out',
            'Đổi Workspace': 'Switch Workspace',
            'Thông báo': 'Notifications',
            'Tìm kiếm...': 'Search...',

            // Common
            'Đóng': 'Close',
            'Lưu': 'Save',
            'Hủy bỏ': 'Cancel',
            'Quay lại': 'Back',
            'Xác nhận': 'Confirm'
        }
    },

    // Translation helper function
    t: function (key) {
        // Access global selected language, fallback to default
        const currentLang = window.currentLanguage || this.defaultLanguage;

        if (this.translations[currentLang] && this.translations[currentLang][key]) {
            return this.translations[currentLang][key];
        }

        // Return key if translation not found (helps identify missing translations)
        return key;
    }
};

// Global state for language
window.currentLanguage = localStorage.getItem('rino_language') || 'vi';

// Helper to switch language
window.setLanguage = function (lang) {
    if (window.i18n.languages.includes(lang)) {
        window.currentLanguage = lang;
        localStorage.setItem('rino_language', lang);

        // Dispatch custom event so React components can re-render
        window.dispatchEvent(new Event('languageChanged'));
    }
};

// Global state for timezone
window.currentTimezone = localStorage.getItem('rino_timezone') || 'Asia/Ho_Chi_Minh';

// Helper to switch timezone
window.setTimezone = function (tz) {
    window.currentTimezone = tz;
    localStorage.setItem('rino_timezone', tz);

    // Dispatch custom event 
    window.dispatchEvent(new Event('timezoneChanged'));
};
