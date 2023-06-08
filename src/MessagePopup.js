import React, { useState, useEffect } from 'react';
import './MessagePopup.css'; // Assuming you have a CSS file to style the popup

const MessagePopup = ({ message, show }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [show]);

    return (
        <div className={`message-popup ${isVisible ? 'visible' : ''}`}>
            {message}
        </div>
    );
};

export default MessagePopup;