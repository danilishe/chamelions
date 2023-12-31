import './App.css';
import React from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Chameleons from "./chameleons/Chameleons";

function Layout() {
    return (<div>
        <h1>Тут всё есть</h1>
    </div>);
}

function Navigation() {
    return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Game protos</a>
        <div className="navbar-nav">
            <NavLink to="/" className="nav-item nav-link">Home</NavLink>
            <NavLink to="/chameleons" className="nav-item nav-link">Chameleons</NavLink>
        </div>
    </nav>);
}

function NotFound() {
    let location = useLocation();
    return (<h1>Такой игрушки '{location.pathname}' пока нет</h1>);
}

export default function App() {

    return (
        <div>
            <Navigation />
            <Routes>
                <Route index path="/" element={<Layout />} />
                <Route path="/chameleons" element={<Chameleons />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>

    );
}