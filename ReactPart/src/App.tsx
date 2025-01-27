import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Charities from "./pages/Charities/Charities";
import Listing from "./pages/Listing/Listing";
import ManageListings from "./pages/ManageListings/ManageListings";
import { UserProvider } from "./context/UserProvider";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/LogIn"
            element={
              <ProtectedRoute
                needToBeLoggedIn={false}
                redirectPath={"/Profile"}
              >
                <LogIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Register"
            element={
              <ProtectedRoute
                needToBeLoggedIn={false}
                redirectPath={"/Profile"}
              >
                <Register />
              </ProtectedRoute>
            }
          />
          <Route path="/Charities" element={<Charities />} />
          <Route path="/Listing" element={<Listing />} />
          {/* <Route
            path="/ManageListings"
            element={
              <ProtectedRoute needToBeLoggedIn={true} redirectPath={"/LogIn"}>
                <ManageListings />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/ManageListings" element={<ManageListings />}/>
          
          <Route
            path="/Profile"
            element={
              <ProtectedRoute needToBeLoggedIn={true} redirectPath={"/LogIn"}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
