import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from '@emotion/react';
import { AuthProvider } from './context/authProvider';
import './index.css';
import theme from './theme';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Subribbits from './pages/Subribbits/Subribbits';
import Subribbit from './pages/Subribbit/Subribbit';
import Layout from './components/Layout';
import Post from './pages/Post/Post';
createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route path="/subribbits" element={<Subribbits />} />
            <Route path="/subribbits/:name" element={<Subribbit />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);
