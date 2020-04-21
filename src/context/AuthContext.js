import React, {useState, createContext } from 'react';

function AuthContext(){
    const TokenContext = createContext();
    const UserIdContext = createContext();

    const TokenProvider = (props) => {
        const [token, setToken] = useState(null);
        const changeToken = token_ => setToken(token_);
        const tokenState = { token, changeToken };
        return (
            <TokenContext.Provider value={tokenState}>
                {props.children}
            </TokenContext.Provider>
        );
    }
    const UserIdProvider = (props) => {
        const [userId, setUserId] = useState(null);
        const changeUserId = userId_ => setUserId(userId_);
        const userIdState = { userId, changeUserId };
        return (
            <UserIdContext.Provider value={userIdState}>
                {props.children}
            </UserIdContext.Provider>
        );
    }


    return {
        TokenContext,
        TokenProvider,
        UserIdContext,
        UserIdProvider
    }

}

export default AuthContext();