import { Outlet, Link } from "react-router-dom";
import { useUser, UserProvider } from "../../userContext";
import { useEffect, useState, useContext } from "react";
//import { LanguageContext } from '../../languages.json';
import { useTranslation, Trans } from 'react-i18next';
import startGif from "../../assets/bill.gif"
// using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'
import './Start.css'
import { useLang } from "../../langContext";
//const invoke = window.__TAURI__.invoke;
const getDate = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}

const Start = () => {
  //intro
  const [intro, setIntro] = useState(false)
  // userContext
  const { user, setUser } = useUser();
  const { lang, setLang } = useLang()
  const { t, i18n } = useTranslation();
  // layout classname
  const [startClass, setStartClass] = useState(user.isLogged ? 'layout' : 'start');

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const users = [
    {
      username: "hozifa",
      password: "8433"
    },
    {
      username: "m2",
      password: "43310"
    }
  ]
  const matchUsers = (name, pass) => {
    const result = users.filter((x) => x.username === name && x.password === pass);
    return (Boolean(result.length))
  }
  // handle log in / log out
  const handleClick = (e) => {
    e.preventDefault();
    if (matchUsers(userName, password) && user.isLogged == false) {
      setUser((prev) => ({
        userName: userName,
        password: password,
        isLogged: true
      }));
    }
    if (user.isLogged == true) {
      setUser((prev) => ({
        userName: "",
        password: "",
        isLogged: false
      }));
    }

    user.isLogged ? setIntro(true) : setIntro(false)

  };


  //handle langs
  const handleToggle = () => {
    setLang((prev) =>
      prev === 'ar' ? 'eng' : 'ar'

    )
  }
  useEffect(() => console.log('lang changed'), [lang])
  //handle enter press:

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !user.isLogged) {
      handleClick();
    }
  };
  // Side bar routes
  const routesArr = [['Dashboard', 'لوحة التحكم'], ['Stock', 'إدارة المخزن'], ['Addbill', 'اضف فاتورة']];



  return (

    <div className={startClass}>
      <div className={user.isLogged ? 'sidebar' : 'no-sidebar'}>
        <div className={user.isLogged ? 'sidebar-header' : 'start-header'}>
          <div>




          </div>

          {user.isLogged ? (
            <div>


              <div >
                <h1 style={{ color: "#C3DCCD" }}> CONSALE </h1>
                <ul className='sidebar-list'>
                  {routesArr.map((x) => (
                    <li key={x}>
                      <Link className="sidebar-link" to={`/${x[0]}`} onClick={() => setIntro(false)}>{x[1]}</Link>
                    </li>
                  ))}
                </ul>
                <button className='logout-btn' onClick={(e) => handleClick(e)}>تسجيل خروج</button>

              </div>
              {intro && <img src={startGif} style={{ position: "absolute", top: "60px", left: "650px", width: "400px" }} />}
            </div>
          ) : (
            <form onSubmit={handleClick} className='start' >
              <h1> CONSALE </h1>
              <input className="input" type='text' value={userName} placeholder={lang == 'ar' ? 'اسم المستخدم' : 'username'} onChange={(e) => setUserName(e.target.value)} style={{ textAlign: 'center' }} />
              <input className="input" type='password' value={password} placeholder={lang == 'ar' ? 'كلمة مرور' : 'password'} onChange={(e) => setPassword(e.target.value)} style={{ textAlign: 'center' }} />
              <button className='login-btn' type="submit">{lang == 'ar' ? 'تسجيل دخول' : 'Login'}</button>
              <button className='lang-btn' onClick={handleToggle}><small>{lang === 'eng' ? 'عربي' : 'English'}</small></button>

            </form>
          )}

          <Outlet />

        </div>

      </div>
    </div>

  );
};

export default Start;
