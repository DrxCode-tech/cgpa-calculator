import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Calculator/Home";
import Ask from "./Calculator/Ask";
import Calco from "./Calculator/Calculator";
import "./Calculator/Bye.jsx";

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/ask" element={<Ask />} />
        <Route path="/calco" element={<Calco />} />
        <Route path="/bye" element={<Bye />} />
      </Routes>
    </Router>
  )
}