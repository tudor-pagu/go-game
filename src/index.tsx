import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './typescript/App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import ErrorPage from './ErrorPage';
import Game from './typescript/Game';
import {loader as gameLoader} from "./typescript/Game";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/game/:gameID",
    element: <Game />,
    loader: gameLoader,
  }
])
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
