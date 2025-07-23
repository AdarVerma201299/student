import "./App.css";

import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main className="flex-grow min-h-7">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
