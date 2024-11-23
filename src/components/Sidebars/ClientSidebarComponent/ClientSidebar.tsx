import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
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
        <div className="w-48 p-4 overflow-y-auto h-fit">
            <ul className="mt-4 space-y-2">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className={`flex items-center p-2 rounded cursor-pointer transition ${
                            item.active
                                ? 'bg-green-200 border border-green-300 shadow-lg'
                                : 'border border-gray-100 hover:bg-green-200 hover:shadow-md'
                        }`}
                        onClick={() => onItemClick(item.id, item.type)} // Pass both id and type
                    >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.type === 'link' ? (
                            <Link to={item.href || '#'} className="flex-1">
                                {item.label}
                            </Link>
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
