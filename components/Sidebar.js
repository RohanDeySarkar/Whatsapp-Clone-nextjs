import styled from "styled-components";

import {Avatar, Button, IconButton} from "@material-ui/core";
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import * as EmailValidator from "email-validator";
import { auth, db } from '../FirebaseConfig/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import Chat from './Chat';

function Sidebar() {
    const [user, loading] = useAuthState(auth);

    const userChatRef = db
                        .collection('chats')
                        .where('users', 'array-contains', user?.email);
    // get all chat doc containing current user
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt("Enter email address of the user")

        if (!input) return;

        if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
            db
            .collection('chats')
            .add(
                {
                    users: [user.email, input],
                }
            )
        }
    };

    const chatAlreadyExists = (recipientEmail) => {
        // !! -> if gets back any val returns TRUE, else if gets back nothing, undefined returns FALSE
        return !!chatsSnapshot?.docs.find((chat) => 
            chat.data().users.find((user) => user === recipientEmail)?.length > 0
        )
    };

    // console.log(user)
    return (
        <Container>
            <Header>
                <UserAvatar
                    src={user.photoURL}
                    alt="" 
                    onClick={() => auth.signOut()}
                />

                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon />

                <input 
                    placeholder="Search"
                />
            </Search>

            <SidebarButton 
                onClick={createChat}
            >
                start a new chat
            </SidebarButton>

            {chatsSnapshot?.docs.map((chat) => 
                <Chat 
                    key={chat.id}
                    id={chat.id}
                    users={chat.data().users}
                />
            )}
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

   ::-webkit-scrollbar {
       display: none;
   }
`;

const Header = styled.div`
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    background-color: white; 
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;

    > input {
        outline: none;
        border: none;
        width: 100%;
        /* flex: 1; */
    }
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;