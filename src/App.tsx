import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import MisReservas from './pages/MisReservas'
import Admin from './pages/Admin'
import Tablon from './pages/Tablon'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="mis-reservas" element={<MisReservas />} />
        <Route path="tablon" element={<Tablon />} />
        <Route path="admin" element={<Admin />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  )
}

export default App