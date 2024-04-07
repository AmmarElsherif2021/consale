import React, { useEffect, useState } from 'react';
import { createBrowserRouter, Route, Navigate, Router } from 'react-router-dom';
import Login from './routes/Login/Login';
import Start from './routes/Start/Start';
import Dashboard from './routes/Dashboard/Dashboard';
import AddBill from './routes/AddBill/AddBill';
import Stock from './routes/Stock/Stock';
import { UserProvider, useUser } from './userContext';
import { RouterProvider } from 'react-router-dom';
import AccCard from './layout/cards/AccCard/AccCard';
import { BillProvider } from './billContext';
import { StockProvider } from './stockContext.jsx';
import { LangProvider, useLang } from './langContext.jsx';



const Routes = () => {
  const { user, setUser } = useUser();
  const { lang, setLang } = useLang
  useEffect(() => {
    user ? console.log(user.isLogged) : console.log('there is no user');
  }, [user]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LangProvider><Start /></LangProvider>,
      children: [


        {
          path: "Dashboard",
          element: user && user.isLogged ? <Dashboard /> : <Navigate to="/" />,

        }
        ,
        {
          path: "AddBill",
          element: user && user.isLogged ? <AddBill /> : <Navigate to="/" />
        },
        {
          path: "Stock",
          element: user && user.userName === "hozifa" && user.isLogged ? <StockProvider><Stock /></StockProvider> : <Navigate to="/" />
        }]
    }])
  return (
    <RouterProvider router={router} />
  )
}
const App = () => {


  return (
    <StockProvider>
      <UserProvider>
        <Routes />
      </UserProvider>
    </StockProvider>

  )
};

export default App;




/*
const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
    <h1>Welcome to Tauri!</h1>

    <div className="row">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo vite" alt="Vite logo" />
      </a>
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
      </a>
      <a href="https://reactjs.org" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>

    <p>Click on the Tauri, Vite, and React logos to learn more.</p>

    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault();
        greet();
      }}
    >
      <input
        id="greet-input"
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter a name..."
      />
      <button type="submit">Greet</button>
    </form>

    <p>{greetMsg}</p>
    </div>
  );
*/
