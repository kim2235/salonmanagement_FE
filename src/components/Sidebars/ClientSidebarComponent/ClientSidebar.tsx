import React from 'react';
import styles from './Sidebar.module.css'; // Adjust the path as necessary

interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id?: string;
    active?: boolean;
}

interface SidebarProps {
    items: SidebarItem[];
    onItemClick: (id: string, type: 'link' | 'div') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items,onItemClick }) => {

    return (
        <div className="w-48 p-4 overflow-y-auto h-full">
            <ul className="mt-4 space-y-2">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`p-2 rounded ${item.active ? styles.activeButton : styles.navButtonHover}`}
                        onClick={() => item.id && onItemClick(item.id, item.type)}
                    >
                        {item.type === 'link' ? (
                            <a href={item.href}>{item.label}</a>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
