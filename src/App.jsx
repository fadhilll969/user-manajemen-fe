import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Layout from "./component/Layout";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import UserManagement from "./component/User-Manajemen/UserManagement";
import TambahDataUser from "./component/User-Manajemen/TambahDataUser";
import EditDataUser from "./component/User-Manajemen/EditDataUser";
import Register from "./component/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit-data-management" element={<EditDataUser />} />
        <Route path="/tambah-data-management" element={<TambahDataUser />} />

        {/* sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;