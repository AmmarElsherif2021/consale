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
      username: 'hozifa'

    }
    ,
    {
      username: "m2",

    }
  ];

  // const matchUsers = (name, pass) => {
  //   const result = users.filter((x) => x.username === name && x.password === pass);
  //   return (Boolean(result.length))
  // };

  // handle log in / log out
  const handleClick = async (e) => {
    e.preventDefault();
    if (!user.isLogged) {
      const result = await invoke('check_credentials', { username: userName, password: password });
      if (result === 'Credentials are valid') {
        setUser((prev) => ({
          userName: "hozifa",
          isLogged: true
        }));
      }
      if (result === 'Invalid credentials') {
        setUser((prev) => ({
          userName: "",
          isLogged: false
        }));
      }
    } else {
      setUser((prev) => ({
        userName: "",
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

  const routesArr = [['Dashboard', ' الحسابات', 'Countings'], ['Stock', 'إدارة المخزن', 'Stock Management'], ['Addbill', 'اضف فاتورة', 'Add Bill']];



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
                      <Link className="sidebar-link" to={`/${x[0]}`} onClick={() => setIntro(false)}>{lang == 'ar' ? x[1] : x[2]}</Link>
                    </li>
                  ))}
                </ul>
                <button className='logout-btn' onClick={(e) => handleClick(e)}>{lang == 'ar' ? 'تسجيل خروج' : 'Log out'} </button>

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
