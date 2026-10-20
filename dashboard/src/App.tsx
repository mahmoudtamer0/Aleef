import './App.css'
import Dashboard from './components/dashboard/Dashboard'
import NavBar from './components/navBar/navBar'
import SidBar from './components/sideBar/sidBar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './pages/home'
import Users from './components/users/Users'
import DoctorsRequests from './components/doctorsRequests/DoctorsRequests'
import Doctors from './components/doctors/Doctors'
import UserDetails from './components/userDetails/UserDetails'
import DoctorReqDetails from './components/doctorReqDetails/DoctorReqDetails'
import ProductsManagement from './components/productsManagment/ProductsManagment'
import ProductDetails from './components/productsManagment/ProdcutsDetails'
import AppointmentsManagement from './components/appoinments/Appointments'
import Orders from './components/orders/Orders'
import OrderDetails from './components/orders/OrderDetails'
import ChatMonitoring from './components/chats/Chats'
import AppointmentDetails from './components/appoinments/AppoinmentDetails'

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <SidBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors-requests" element={<DoctorsRequests />} />
            <Route path="/doctors/:doctorId" element={<DoctorReqDetails />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/products/:prodId" element={<ProductDetails />} />
            <Route path="/appointments" element={<AppointmentsManagement />} />
            <Route path="/appointments/:appointmentId" element={<AppointmentDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/chats/" element={<ChatMonitoring />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
