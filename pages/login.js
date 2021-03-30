import styled from "styled-components";

import Head from "next/head";
import { Button } from "@material-ui/core";

import {auth, provider} from '../FirebaseConfig/firebase';

function Login() {
    const signIn = () => {
        auth
        .signInWithPopup(provider)
        .catch(alert)
    };

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo 
                    src="https://i.pinimg.com/originals/79/dc/31/79dc31280371b8ffbe56ec656418e122.png"
                    alt=""
                />

                <Button
                    startIcon={ 
                        <img
                            style={{
                                height: "30px",
                                paddingRight: "20px"
                            }} 
                            src="https://hrcdn.net/community-frontend/assets/google-colored-20b8216731.svg" 
                            alt=""
                        />
                    }
                    onClick={signIn}
                >
                    Sign in with Google
                </Button>
            </LoginContainer>
        </Container>
    )
}

export default Login;


const Container = styled.div`
    /* display: grid;
    place-items: center; */
    height: 100vh;
    background-color: rgb(1, 181, 165);
`;

const LoginContainer = styled.div`
    display: grid;
    place-items: center;

    > button {
        margin-top: 100px;
        background-color: rgb(235, 235, 235);
        color: #474747;
        font-weight: 800;
        padding: 10px 30px;
    }

    > button:hover {
        background-color: gainsboro;
        color: #383838;
    }
`;

const Logo = styled.img`
    height: 400px;
    object-fit: contain;
`