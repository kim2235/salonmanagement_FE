import React, { useState, useRef, useEffect } from 'react';
import styles from './Popover.module.css';

interface PopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Popover: React.FC<PopoverProps> = ({ trigger, content, position = 'bottom' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [adjustedPosition, setAdjustedPosition] = useState(position);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

    const closePopover = () => {
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
            popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            closePopover();
        }
    };

    const adjustPositionIfNeeded = () => {
        if (!popoverRef.current || !triggerRef.current) return;

        const popoverRect = popoverRef.current.getBoundingClientRect();
        const triggerRect = triggerRef.current.getBoundingClientRect();

        if (position === 'right' && popoverRect.right > window.innerWidth) {
            setAdjustedPosition('left');
        } else if (position === 'left' && popoverRect.left < 0) {
            setAdjustedPosition('right');
        } else if (position === 'bottom' && popoverRect.bottom > window.innerHeight) {
            setAdjustedPosition('top');
        } else if (position === 'top' && popoverRect.top < 0) {
            setAdjustedPosition('bottom');
        } else {
            setAdjustedPosition(position);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            adjustPositionIfNeeded();
        }
    }, [isOpen]);

    return (
        <div className={styles.popoverWrapper}>
            <div ref={triggerRef} onClick={togglePopover} className={styles.trigger}>
                {trigger}
            </div>
            {isOpen && (
                <div ref={popoverRef} className={`${styles.popover} ${styles[adjustedPosition]}`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default Popover;
