import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/Customs.css"
import Home from "./pages/Home";
import DemoPage from "./pages/DemoPage";
import ClientListPage from "./pages/ClientListPage";
import AddNewClientPage from "./pages/AddNewClientPage";
import CatalogPage from "./pages/CatalogPage";
import SalesPage from "./pages/SalesPage";
import './components/SchedulerComponent/Scheduler.css';
import TeamMemberPage from "./pages/TeammemberPage";
import MarketingPage from "./pages/MarketingPage";
import DealsPage from "./pages/DealsPage";
import ProductPage from "./pages/ProductPage";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/clientlist" element={<ClientListPage />} />
                    <Route path="/add-new-client" element={<AddNewClientPage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/sales" element={<SalesPage />} />
                    <Route path="/team" element={<TeamMemberPage />} />
                    <Route path="/marketing" element={<MarketingPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    <Route path="/product" element={<ProductPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
