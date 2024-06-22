import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../../services/socketService";
import { insertMessage } from "../../../redux/user/userSlice";
import Message from "./Message";
import RecieverInfo from "./RecieverInfo";

const ChatSection = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatIndex = params.chatIndex;
    const status = useSelector((state) => state.user.status);
    const myId = useSelector((state) => state.user.user._id);
    const chats = useSelector((state) => state.user.user.chats);
    const recieverData = chats[chatIndex].members.find((mem) => mem._id !== myId);

    const scrollRef = useRef()
    const [message, setMessage] = useState("");

    useEffect(() => {
        scrollRef.current.scrollIntoView({
            behavior: 'smooth'
        });
    }, [chats[chatIndex]])

    const handleSubmit = () => {
        setMessage("");
        if (message === "") return
        socket.emit(
            "send-message",
            {
                creator: myId,
                receiver: recieverData._id,
                content: message,
                chatId: chats[chatIndex]._id,
            },
            (val) => {
                dispatch(insertMessage({ chatId: chats[chatIndex]._id, message: val }))
            }
        );
    };

    return status == "loading" ? <p>loading</p> : (
        <div className="row g-4">
            <div className="col-8">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{chats[chatIndex].name} - {recieverData.username}</span>
                        <Link type="button" to="/home" class="btn-close" aria-label="Close"></Link>
                    </div>
                    <div ref={scrollRef} className="card-body" style={{ minHeight: "80vh", overflowY: "scroll" }} >
                        {chats[chatIndex].messages.map((ele) => {
                            return <Message message={ele} myId={myId} />
                        })}
                    </div>
                    <div className="card-footer">
                        <div className="input-group">
                            <input type="text" class="form-control" placeholder="message" aria-label="message" aria-describedby="message"
                                value={message} onChange={(e) => { setMessage(e.target.value) }} />
                            <button class="btn btn-primary" type="button" id="message" onClick={handleSubmit}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <RecieverInfo info={recieverData} />
            </div>
        </div>
    );
};

export default ChatSection;
