import { createContext, useState, useContext } from "react";
// Create a context object with a default value
export const LangContext = createContext({});


export const useLang = () => {
    return useContext(LangContext);
};


// Create a context provider component that uses the custom hook
export const LangProvider = ({ children }) => {
    // Use the custom hook to get the lang state and the login function
    const [lang, setLang] = useState('ar')
    // Return the context provider component with the context value
    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}