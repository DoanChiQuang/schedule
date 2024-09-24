import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {/* Header */}
            <div>Header</div>

            {/* Navbar */}
            <div>Navbar Left</div>

            {/* Content */}
            {children}

            {/* Footer */}
            <div>Footer</div>
        </div>
    );
};

export default AdminLayout;
