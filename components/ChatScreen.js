import styled from "styled-components";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../FirebaseConfig/firebase";

import {Avatar, IconButton} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';

import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";

import Message from '../components/Message';
import { useState } from "react";

import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

import TimeAgo from 'timeago-react';
import { useRef } from "react";

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);

    const router = useRouter();

    const [input, setInput] = useState("");

    const endOfMessagesRef = useRef(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "start",
        });
    };

    // console.log(messages);

    const [messagesSnapshot] = useCollection(
                                    db
                                    .collection("chats")
                                    .doc(router.query.id)
                                    .collection("messages")
                                    .orderBy("timestamp", "asc")
                                );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => 
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={
                        {
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime(),
                        }
                    }
                />
            )
        } else {
            return JSON.parse(messages).map((message) => 
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            )
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();

        if (input) {
            // update last seen
            db
            .collection("users")
            .doc(user.uid)
            .set(
                {
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                }
            ), {merge: true};

            // push message
            db
            .collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .add(
                {
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    message: input,
                    user: user.email,
                    photoURL: user.photoURL,
                }
            );

            setInput("");
            scrollToBottom();
        }
    };

    const recipientEmail = getRecipientEmail(chat.users, user);

    const [recipientSnapshot] = useCollection(
                                    db
                                    .collection("users")
                                    .where("email", "==", recipientEmail)
                                );

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar 
                        src={recipient.photoURL}
                    />
                ):(
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot? (
                        <p>
                            Last Active: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ):"Unavailable"}
                        </p>
                    ):(
                        <p>loading...</p>
                    )}
                </HeaderInformation>

                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>

                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}

                <EndOfMessage 
                    ref={endOfMessagesRef}
                />
            </MessageContainer>

            <InputContainer onSubmit={sendMessage}>
                <InsertEmoticonIcon />

                <Input
                    placeholder="Type message"
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                />

                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;


const Container = styled.div`
`;

const Header = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    height:80px;
    padding: 10px;
    border-bottom: 1px solid whitesmoke;
    background-color: white;;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > P {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div`
    margin-left: auto;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 100px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100px;
`;

const Input = styled.input`
    border: none;
    outline: none;
    padding: 20px;
    margin: 0 15px;
    border-radius: 10px;
    background-color: whitesmoke; 
    width: 100%;
`;