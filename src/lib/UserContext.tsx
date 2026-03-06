import React, { createContext, useState, ReactNode, useContext } from 'react';

// Định nghĩa kiểu dữ liệu cho người dùng
interface User {
    username: string;
    email: string;
    role: string;
    // Bạn có thể thêm các trường khác vào đây nếu cần
}

// Định nghĩa kiểu dữ liệu cho context
interface UserContextType {
    currentUser: User | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Tạo context với giá trị mặc định
export const UserContext = createContext<UserContextType | undefined>(undefined); // Đảm bảo export đúng

// Tạo provider để bao bọc toàn bộ ứng dụng và cung cấp giá trị context
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook để dễ dàng sử dụng context
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
