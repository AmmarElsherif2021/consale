import { createContext,useState,useContext } from "react";
// Create a context object with a default value
export const UserContext = createContext({});


export const useUser = () => {
  return useContext(UserContext);
};


// Create a context provider component that uses the custom hook
export const UserProvider=({ children })=> {
  // Use the custom hook to get the user state and the login function
  const [user, setUser] = useState({
    userName:'',
    password:'',
    isLogged:false
  })
  // Return the context provider component with the context value
  return (
    <UserContext.Provider value={{ user,setUser }}>
      {children}
    </UserContext.Provider>
  );
}