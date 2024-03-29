import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './typescript/App';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from "react-router-dom"
import ErrorPage from './ErrorPage';
import GameComp from './typescript/GameComp';
import { loader as gameLoader } from "./typescript/GameComp";
import Header from './typescript/Header';

import secret from "./secret";
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createHashRouter([
  {
    path: "/",
    element:
      (<ChakraProvider>
        <Header />
      </ChakraProvider>
      ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App/>,
      },
      {
        path: "/game/:gameID",
        element: <GameComp />,
        loader: gameLoader,
      }
    ]
  }
])
root.render(
// <React.StrictMode>
    <RouterProvider router={router} />
 // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
