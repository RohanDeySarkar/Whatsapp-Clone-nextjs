const getRecipientEmail = (users, userLoggedIn) => {
    return (
        // returning val not list
        users?.filter((user) => user !== userLoggedIn?.email)[0]
    )
};

// const getRecipientEmail = (users, userLoggedIn) => (
//         users?.filter((user) => user !== userLoggedIn?.email)[0]
// );

export default getRecipientEmail;