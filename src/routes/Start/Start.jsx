import { Outlet, Link } from "react-router-dom";
import { useUser, UserProvider } from "../../userContext";
import { useEffect, useState, useContext } from "react";
//import { LanguageContext } from '../../languages.json';
import { useTranslation, Trans } from 'react-i18next';
import startGif from "../../assets/bill.gif"
// using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'
import './Start.css'
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
  const [intro, setIntro] = useState(true)
  // userContext
  const { user, setUser } = useUser();
  const { t, i18n } = useTranslation();
  // layout classname
  const [startClass, setStartClass] = useState(user.isLogged ? 'layout' : 'start');

  // handle log in / log out
  const handleClick = (e) => {
    e.preventDefault();
    setUser((prev) => {
      const isLogged = !prev.isLogged;
      setIntro(true);

      isLogged ? invoke('set_shift_start', { invokeMessage: `shift started ${getDate()}` }) : invoke('set_shift_start', { invokeMessage: `ended ${getDate()}` });
      return {
        ...prev,
        isLogged
      };
    });
  };

  // Side bar routes
  const routesArr = [['Dashboard', 'لوحة التحكم'], ['Stock', 'إدارة المخزن'], ['Addbill', 'اضف فاتورة']];

  // langs context:
  //const { language, setLanguage, languages } = useContext(LanguageContext);
  //<div>
  //<button onClick={() => setLanguage(language === 'ar' ? 'eng' : 'ar')}>
  //{languages[language].toggleButton}
  //</button>

  return (
    <UserProvider>
      <div className={startClass}>
        <div className={user.isLogged ? 'sidebar' : 'no-sidebar'}>
          <div className={user.isLogged ? 'sidebar-header' : 'start-header'}>
            <div>

              <h1> CONSALE </h1>


            </div>

            {user.isLogged ? (
              <div>
                <div>

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
              <button className='login-btn' onClick={handleClick}>تسجيل دخول</button>
            )}

            <Outlet />

          </div>

        </div>
      </div>
    </UserProvider>
  );
};

export default Start;
