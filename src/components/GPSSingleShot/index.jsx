import React, { useState, useEffect } from "react";
import "./style.css";

export default () => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Služba geolokace není v tomto prohlížeči dostupná.");
    }
  }, []);

  const gpsSuccess = (position) => {
    setLoading(false);
    setPosition(position.coords);
  };

  const gpsError = (error) => {
    setError(error.message);
  };

  const handleClick = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(gpsSuccess, gpsError);
  };
  return (
    <>
      {loading && <div>Zjišťuji polohu…</div>}
      {position && (
        <div>
          <div>Zeměpisná šířka: {position.latitude}°</div>
          <div>Zeměpisná délka: {position.longitude}°</div>
          <div>Přesnost: {position.accuracy} m</div>
          <div>Výška na mořem: {position.altitude} m</div>
          <div>Přesnost výšky: {position.altitudeAccuracy} m</div>
          <div>Směr pohledu: {position.heading}°</div>
          <div>Rychlost: {position.speed} m/s</div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <button onClick={handleClick} disabled={!navigator.geolocation}>
        Zjistit polohu
      </button>
    </>
  );
};
