import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <div className="App flex flex-col min-h-screen">
        {/* Navbar - fixed at top */}
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        {/* Main content - flex-grow to push footer down */}
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="max-w-7xl mx-auto w-full">
            <AppRoutes />
          </div>
        </main>

        {/* Footer - always at bottom */}
        <footer className="bg-gray-800 text-white">
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
