import React from 'react';

interface TextViewProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

const TextView: React.FC<TextViewProps> = ({ text, className, style }) => {
    return <span className={className} style={style}>{text}</span>;
};

export default TextView;
