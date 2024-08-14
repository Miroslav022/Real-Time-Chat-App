import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Ui/Login";
import UserDetails from "./Pages/UserDetails";
import UserPhone from "./Pages/UserPhone";
import Home from "./Pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />}>
          <Route index element={<Navigate replace to="step-1" />} />
          <Route path="step-1" element={<UserPhone />} />
          <Route path="step-2" element={<UserDetails />} />
        </Route>
        <Route path="home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
