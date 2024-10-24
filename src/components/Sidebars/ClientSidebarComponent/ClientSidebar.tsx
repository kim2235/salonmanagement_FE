import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id: string;
    active?: boolean;
    icon?: React.ReactNode;
}

interface SidebarProps {
    items: SidebarItem[];
    onItemClick: (id: string, type: 'link' | 'div') => void;
    activeItem: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onItemClick, activeItem }) => {
    return (
        <div className="w-48 p-4 overflow-y-auto h-full bg-gray-100">
            <ul className="mt-4 space-y-2">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className={`flex items-center p-2 rounded cursor-pointer transition ${
                            activeItem === item.id ? styles.activeButton : styles.navButtonHover // Check if this item is active
                        }`}
                        onClick={() => onItemClick(item.id, item.type)} // Pass both id and type
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.type === 'link' ? (
                            <a href={item.href} className="flex-1">
                                {item.label}
                            </a>
                        ) : (
                            <span className="flex-1">{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
