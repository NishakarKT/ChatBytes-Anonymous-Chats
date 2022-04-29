import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Lobby.css";
// constants
import { SEARCHING } from "../../constants/images";
// services
import socket from "../../services/socket";
// material-ui
import { TextField, Button } from "@material-ui/core";
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

const Lobby = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [searching, setSearching] = useState(false);

    const search = (e) => {
        e.preventDefault();
        setNameErr(!Boolean(name));

        if (name) {
            setSearching(true);
            socket.emit("onJoin", name);

            let count = 0;
            const searches = 10;
            const search = setInterval(() => {
                if (++count === searches) {
                    clearInterval(search);
                    setSearching(false);
                    alert("Sorry, try again after sometime.");
                }
                socket.emit("search");
            }, 1000);

            socket.on("searchResult", ({ friendName, friendId }) => {
                clearInterval(search);
                socket.emit("connectToChat", { name, friendId });
                history.push("/chat/" + name + "/" + friendName + "/" + friendId);
                setSearching(false);
            });
        }
    };

    return (
        <div className={`lobby ${searching ? "lobby__dim" : ""}`}>
            {searching ? <img className="lobby__searching" src={SEARCHING} alt="" /> : null}
            {!searching ?
                <form className="lobby__box" onSubmit={(e) => search(e)}>
                    <TextField label="Name" error={nameErr} helperText={nameErr ? "What's your name ?" : ""} onChange={(e) => setName(e.target.value)} />
                    <Button type="submit"><SearchRoundedIcon /></Button>
                </form>
                : null}
        </div>
    );
};

export default Lobby;
