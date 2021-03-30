import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";

import { db } from "../../FirebaseConfig/firebase";

function Chat({messages, chat}) {
    // console.log(chat);
    // console.log(messages);

    return (
        <Container>
            <Head>
                <title>Chat</title>
            </Head>

            <Sidebar />

            <ChatContainer>
                <ChatScreen 
                    chat={chat}
                    messages={messages}
                />
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    // context -> id from url
    const ref = db.collection("chats").doc(context.query.id);
    
    // PREP the msgs on the server [get() instead of onSnapshot() since server side]
    const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get();

    const messages = messagesRes.docs.map((doc) => (
        {
            id: doc.id,
            ...doc.data(),
        }
    )).map((messages) => (
        {
            ...messages,
            timestamp: messages.timestamp.toDate().getTime()
        }
    ));

    // PREP the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    // terminal
    // console.log(chat);

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat 
        }
    }
}


const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
`;