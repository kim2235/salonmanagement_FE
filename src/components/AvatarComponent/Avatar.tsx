import React from 'react';
import { FaUser } from 'react-icons/fa';
import styles from './Avatar.module.css';

interface AvatarProps {
    imageUrl?: string;
    name?: string; // Name is now optional
    size?: string; // Optional size prop
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, name, size = '50px' }) => {
    const initials = name
        ? name.split(' ').map((word) => word[0]).join('')
        : '';

    const customStyle = {
        '--avatar-size': size,
        width: size,
        height: size,
    } as React.CSSProperties;

    return (
        <div className={styles.avatar} style={customStyle}>
            {imageUrl ? (
                <img src={imageUrl} alt={name} />
            ) : name ? (
                <span>{initials}</span>
            ) : (
                <FaUser color="#fff" size={size} />
            )}
        </div>
    );
};

export default Avatar;
