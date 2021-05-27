import React, { useState, useEffect, useRef } from "react";
import "./style.css";

Loader.load(); //Inicializace Mapy.cz
let map; //Objekt mapy
let geometryCurrentPosition; //Objekt geometrie – zobrazení aktuální polohy
let geometryCurrentPositionPrecision; //Objekt geometrie – zobrazení přesnosti polohy

const optionsCurrentPosition = {
  color: "red",
  opacity: 0.5,
  outlineColor: "red",
  outlineOpacity: 1,
  outlineWidth: 1,
};
const optionsCurrentPositionPrecision = {
  color: "blue",
  opacity: 0.1,
  outlineColor: "blue",
  outlineOpacity: 0.5,
  outlineWidth: 3,
};

const equator = 6378000 * 2 * Math.PI; /* delka rovniku (m) */

const coordsFromPosition = (position) => {
  return SMap.Coords.fromWGS84(position.coords.longitude, position.coords.latitude);
};

const circleCoordsFromPosition = (position) => {
  if (!position.coords.accuracy) {
    return null;
  }

  const lon = position.coords.longitude;
  const lat = position.coords.latitude;
  const yrad = (Math.PI * lat) / 180; // zemepisna sirka v radianech
  const line = equator * Math.cos(yrad); // delka rovnobezky (m) na ktere lezi stred kruznice
  const angle = (360 * position.coords.accuracy) / line; // o tento uhel se po rovnobezce posuneme
  return [SMap.Coords.fromWGS84(lon, lat), SMap.Coords.fromWGS84(lon + angle, lat)];
};

export default () => {
  const mapElement = useRef(null);
  const [watch, setWatch] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Služba geolokace není v tomto prohlížeči dostupná.");
    }
  }, []);

  const mapInit = (position) => {
    setShow(true);
    const center = coordsFromPosition(position);
    if (!map) {
      map = new SMap(mapElement.current, center, 13);
      map.addDefaultLayer(SMap.DEF_BASE).enable();
      map.addDefaultControls();
      const markerLayer = new SMap.Layer.Marker();
      map.addLayer(markerLayer);
      markerLayer.enable();
      markerLayer.addMarker(new SMap.Marker(SMap.Coords.fromWGS84(14.4252625, 50.0833886), "Czechitas", {}));

      const geometryLayer = new SMap.Layer.Geometry();
      map.addLayer(geometryLayer);
      geometryLayer.enable();

      geometryCurrentPosition = new SMap.Geometry(SMap.GEOMETRY_CIRCLE, null, [center, 7], optionsCurrentPosition);
      geometryCurrentPositionPrecision = new SMap.Geometry(SMap.GEOMETRY_CIRCLE, null, circleCoordsFromPosition(position), optionsCurrentPositionPrecision);
      geometryLayer.addGeometry(geometryCurrentPosition);
      geometryLayer.addGeometry(geometryCurrentPositionPrecision);
    } else {
      map.setCenter(center, true);
    }

    setWatch(
      navigator.geolocation.watchPosition(gpsChange, gpsError, {
        enableHighAccuracy: true, //požadovat vyšší přesnost
        timeout: 10 * 60 * 1000, //jak dlouho čekat na zjištění polohy, v milisekundách
        maximumAge: 0, //jak staré mohou být údaje, v milisekundách
      })
    );
  };

  const gpsChange = (position) => {
    map.setCenter(coordsFromPosition(position), true);
    geometryCurrentPositionPrecision.setCoords(circleCoordsFromPosition(position));
  };

  const gpsError = (error) => {
    setError(error.message);
  };

  const handleClickStart = () => {
    navigator.geolocation.getCurrentPosition(mapInit, gpsError);
  };

  const handleClickStop = () => {
    setShow(false);
    setWatch((watch) => {
      navigator.geolocation.clearWatch(watch);
      return null;
    });
  };

  return (
    <>
      {error && <div className="error">{error}</div>}
      <div className="map" style={{ display: show ? "block" : "none" }} ref={mapElement}></div>
      <button onClick={handleClickStart} disabled={!navigator.geolocation || watch}>
        Zobrazit na mapě
      </button>
      <button onClick={handleClickStop} disabled={!navigator.geolocation || !watch}>
        Ukončit
      </button>
    </>
  );
};
