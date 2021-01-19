import React, { useState } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { movementsSelector } from "../slices/movementsSlice";

const center = {
  lat: 43.6511,
  lng: -79.3473,
};

const polylineOptions = {
  strokeColor: "#000000",
  strokeWeight: 2,
};

/** An interactive Google Map displaying freight movements. */
const MovementMap = () => {
  const movements = useSelector(movementsSelector);
  const [polylines, setPolylines] = useState({});

  /** Change the stroke color of a specified Polyline.
   * @param {string} id The movement ID corresponding to the Polyline
   * @param {string} color The hex code for the desired color (defaults to red: "#FF0000")
   */
  const setPolylineColor = (id, color = "#ff0000") => {
    const line = polylines[id];
    line.setOptions({ strokeColor: color });
  };

  /** Maps a movement ID to a Polyline (in "polylines" state object)
   * @param {string} id The movement ID corresponding to the Polyline
   * @param {Polyline} polyline A Polyline object
   */
  const mapIdToPolyline = (id, line) => {
    setPolylines((prevState) => {
      return { ...prevState, [id]: line };
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBp8nFSp3hZPV-np6jNSR2I73BO2jCcr8A">
      <GoogleMap
        mapContainerClassName="w-1/2 h-96 mx-auto"
        center={center}
        zoom={6}
      >
        {
          // convert movements into polylines
          movements &&
            movements.map((movement) => {
              const { id, origin, destination } = movement;
              const path = [origin, destination];

              return (
                <Polyline
                  path={path}
                  key={id}
                  id={id}
                  options={polylineOptions}
                  onLoad={(line) => mapIdToPolyline(id, line)} // maintain a reference
                  onMouseOver={() => setPolylineColor(id)}
                  onMouseOut={() => setPolylineColor(id, "#000000")}
                />
              );
            })
        }
      </GoogleMap>
    </LoadScript>
  );
};

export default MovementMap;
