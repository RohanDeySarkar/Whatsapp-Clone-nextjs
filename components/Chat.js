import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from '../FirebaseConfig/firebase';;
import styled from "styled-components";
import getRecipientEmail from "../utils/getRecipientEmail";

import {useRouter} from "next/router";

function Chat({id, users}) {
    const router = useRouter();

    const [user, loading] = useAuthState(auth);

    const recipientEmail = getRecipientEmail(users, user);

    const [recipientSnapshot] = useCollection(
                                    db
                                    .collection('users')
                                    .where('email', '==', recipientEmail)
                                );

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const enterChat = () => {
        router.push(`/chat/${id}`)
    };

    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar 
                    src={recipient?.photoURL}
                />
            ) : (
                <UserAvatar>
                    {recipientEmail[0]}
                </UserAvatar>
            )}
            
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat;


const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    word-break: break-word;
    cursor: pointer;

    :hover {
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;