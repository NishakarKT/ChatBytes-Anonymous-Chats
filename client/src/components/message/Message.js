import React from "react";
import "./Message.css";

const Message = ({ sender, name, text, time }) => {
    const myText = Boolean(sender === name);
    return (
        <div className={`message ${myText ? "message__myText" : ""}`}>
            <p className="message__sender">{sender}</p>
            <p className="message__text">{text}</p>
            <p className="message__time">{time}</p>
        </div>
    );
};

export default Message;
