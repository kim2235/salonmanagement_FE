import React, { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css'; // Reuse the InputText styles

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea: React.FC<TextAreaProps> = (props) => {
    return <textarea className={`${styles.inputText} ${styles.textArea}`} {...props} />;
};

export default TextArea;
