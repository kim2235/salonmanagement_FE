import React, { InputHTMLAttributes } from 'react';
import styles from './InputText.module.css';
interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {}
const InputText: React.FC<InputTextProps> = (props) => {
    return <input className={styles.inputText} {...props} />;
};
export default InputText;
