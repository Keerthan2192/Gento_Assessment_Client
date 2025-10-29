import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Table from "./components/Table";

const App = () => {
  return (
    <div className="app">
      <Header />
      <Table />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
