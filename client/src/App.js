import { BrowserRouter, useNavigate, Switch, Route, Link, Routes } from "react-router-dom";
import './styles/global.css'
import './styles/svgClasses.css'
import Landing_page from './components/regLogin/Landing_page'
import Gitlink from './components/GitLink'
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing_page" element={<Landing_page />}></Route>
        <Route path="/" element={<Dashboard />}></Route>
      </Routes>
      <Gitlink />
    </BrowserRouter>
  );
}

export default App;
