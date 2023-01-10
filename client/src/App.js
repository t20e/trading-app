import { BrowserRouter, useNavigate, Switch, Route, Link, Routes } from "react-router-dom";
import './styles/global.css'
import './styles/svgClasses.css'
import Landing_page from './components/regLogin/Landing_page'
import Gitlink from './components/GitLink'
import Dashboard from "./components/Dashboard";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/landing_page" element={<Landing_page />}></Route>
          <Route path="/" element={<Dashboard />}></Route>
        </Routes>
        <Gitlink />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
