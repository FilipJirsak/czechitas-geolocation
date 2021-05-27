import React from "react";
import { render } from "react-dom";
import GPSSingleShot from "./components/GPSSingleShot";
import GPSContinuous from "./components/GPSContinuous";
import "./style.css";

const queryParams = new URLSearchParams();
queryParams.append("cht", "qr");
queryParams.append("chs", "150x150");
queryParams.append("chl", window.location);
queryParams.append("chld", "H|0");
const qrURL = "http://chart.apis.google.com/chart?" + queryParams.toString();

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
      <img src={qrURL} />
    </div>
  </div>
);

render(<App />, document.querySelector("#app"));
