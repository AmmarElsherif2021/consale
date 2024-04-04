
import { useEffect } from "react";
import { useUser, UserProvider } from "../../userContext"
import { useLang } from "../../langContext";
const Login = () => {
    const { user, setUser } = useUser();
    const { lang, setLang } = useLang()
    const handleClick = () => {
        setUser((prev) => ({
            ...user,
            isLogged: !prev.isLogged
        }))
    }


    //useEffect
    useEffect(() => console.log(user.isLogged), [user])
    return (
        <UserProvider>
            <div>
                <h1>Login</h1>
                <button onClick={handleClick}>log in</button>

            </div>
        </UserProvider>

    )
}
export default Login