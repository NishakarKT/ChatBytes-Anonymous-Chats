import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./Chat.css";
// constants
import { LOBBY } from "../../constants/routes";
// services
import socket from "../../services/socket";
// components
import Message from "../../components/message/Message";
// material-ui
import { Button } from "@material-ui/core";
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

const Chat = () => {
    let key = 0;
    const history = useHistory();
    const { user, friend, friendId } = useParams();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("sentMessage", message => {
            setMessages(messages => [...messages, { ...message, time: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }]);
        });
        socket.emit("checkParams", user);
        socket.on("checkedParams", user => {
            if (!user) {
                socket.emit("end", friendId);
                history.push(LOBBY);
            }
        });
        socket.on("end", () => history.push(LOBBY));
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        setText("");
        e.target.previousElementSibling.scrollTop = e.target.previousElementSibling.scrollHeight;
        const message = {
            sender: user,
            text: text
        };
        setMessages(messages => [...messages, { ...message, time: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }]);
        socket.emit("sendMessage", { message, friendId });
    };

    const leave = () => {
        socket.emit("end", friendId);
        history.push(LOBBY);
    };

    return (
        <div className="chat">
            <div className="chat__box">
                <div className="chat__head">
                    <p>{friend}</p>
                    <Button onClick={() => leave()}><ArrowBackRoundedIcon /></Button>
                </div>
                <div className="chat__body">
                    {messages.map(message => <Message key={key++} name={user} sender={message.sender} text={message.text} time={message.time} />)}
                </div>
                <form className="chat__foot" onSubmit={(e) => sendMessage(e)}>
                    <input type="text" placeholder="Type your message" value={text} onChange={(e) => setText(e.target.value)} />
                    <Button type="submit"><SendRoundedIcon /></Button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
