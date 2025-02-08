import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter'

import { ToastContainer} from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <AppRouter />

    </BrowserRouter>
  </StrictMode>,
)
