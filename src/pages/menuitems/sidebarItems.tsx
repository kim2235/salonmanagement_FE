import { FaHome, FaUsers, FaBox, FaChartLine, FaStore, FaTools, FaBullhorn } from 'react-icons/fa';

export interface SidebarItem {
    label: string;
    href?: string;
    type: 'link' | 'div';
    id: string;
    active?: boolean;
    icon?: React.ReactNode;
}

// Define and export the sidebarItems array
export const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', href: '/', type: 'link', id: 'dashboard', icon: <FaHome /> },
    { label: 'Client List', href: '/clientlist', type: 'link', id: 'clientlist', icon: <FaUsers /> },
    { label: 'Service/Package', href: '/catalog', type: 'link', id: 'servicepackage', icon: <FaBox /> },
    { label: 'Product Page', href: '/product', type: 'link', id: 'product', icon: <FaStore />},
    { label: 'Sales', href: '/sales', type: 'link', id: 'sales', icon: <FaChartLine /> },
    { label: 'Team', href: '/team', type: 'link', id: 'team', icon: <FaTools /> },
    { label: 'Marketing Kit', href: '/marketing', type: 'link', id: 'marketing', icon: <FaBullhorn /> },
];
