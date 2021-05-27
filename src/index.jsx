import React from "react";
import { render } from "react-dom";
import GPSSingleShot from "./components/GPSSingleShot";
import GPSContinuous from "./components/GPSContinuous";
import "./style.css";

const App = () => (
  <div className="container">
    <section>
      <h1>Zjištění aktuální pozice</h1>
      <GPSSingleShot />
    </section>
    <section>
      <h1>Průběžné sledování pozice</h1>
      <GPSContinuous />
    </section>
    <div className="qr">
      <img src="http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=https%3A//jirsak.org&chld=H|0" />
    </div>
  </div>
);

render(<App />, document.querySelector("#app"));
