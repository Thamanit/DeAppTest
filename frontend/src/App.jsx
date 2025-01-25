import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import Layout from './layout/Layout';
import Home from '@/pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Company from './pages/company/Company';
import Companies from './pages/company/Companies';
import CompanyRegister from './pages/company/CompanyRegister';
import VerifyCompanies from './pages/admin/AdminCompanyVerify';
import MyCompany from './pages/myCompany/MyCompany';
import MySpecificCompany from './pages/myCompany/MySpecificCompany';
import MySpecificCompanyUpdate from './pages/myCompany/MySpecificCompanyUpdate';
import ManagePositions from './pages/myCompany/MySpecificCompanyPosition';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const OutletProtectedRoute = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Outlet/>;
  }

  const AdminProtectedRoute = () => {
    const { user } = useContext(AuthContext);

    if (!user?.isAdmin) {
      return (
        <div>
          Admin Only
        </div>
      )
    }

    return <Outlet/>;
  };

  const LoginProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user) {
      return <Navigate to="/" />;
    }

    return children;
  }

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<LoginProtectedRoute><Login /></LoginProtectedRoute>} />
            <Route path="/register" element={<LoginProtectedRoute><Register /></LoginProtectedRoute>} />
            <Route path='/companies' element={<Companies/>} />
            <Route path='/companies/register' element={<ProtectedRoute><CompanyRegister/></ProtectedRoute>} />
            <Route path='/company/:id' element={<Company/>} />
            <Route path='/mycompany' element={<OutletProtectedRoute/>}>
              <Route index element={<MyCompany/>} />
              <Route path='company/:id' element={<MySpecificCompany/>} />
              <Route path='company/:id/update' element={<MySpecificCompanyUpdate/>} />
              <Route path='company/:id/positions' element={<ManagePositions/>} />
            </Route>
            <Route path='/admin' element={<AdminProtectedRoute/>}>
              <Route index element={<>Admin</>} />
              <Route path='company-verification' element={<VerifyCompanies/>} />
            </Route>
            <Route path='/aboutus' element={<div>About Us</div>} />
            <Route path='*' element={<h1>Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App