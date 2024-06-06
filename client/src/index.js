import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <NextUIProvider>
    <Toaster
      toastOptions={{ style: { backgroundColor: "rgb(36,36,36)", color: "white", borderRadius: 16, textTransform: "capitalize" } }}
      position="top-center"
      reverseOrder={false}
    />
    <main className="dark text-foreground bg-background">
      <App />
      <Analytics />
      <SpeedInsights />
    </main>
  </NextUIProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log());
