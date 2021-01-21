import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { movementsSelector } from "../slices/movementsSlice";
import { setFocus } from "../slices/focusSlice";
import { usePrevious } from "../util";

const center = {
  lat: 43.6511,
  lng: -79.3473,
};

const polylineOptions = {
  strokeColor: "#000000",
  strokeWeight: 3,
};

/** An interactive Google Map displaying freight movements. */
const MovementMap = () => {
  const dispatch = useDispatch();
  const focus = useSelector((state) => state.focus);
  const previousFocus = usePrevious(focus);
  const movements = useSelector(movementsSelector);
  const [polylines, setPolylines] = useState({});

  // set polyline color to red when movement becomes focused
  useEffect(() => {
    if (focus) {
      polylines[focus].setOptions({ strokeColor: "#FF0000" });
    }
  }, [focus, polylines]);

  // reset polyline color to black when movements loses focus
  useEffect(() => {
    if (previousFocus) {
      polylines[previousFocus].setOptions({ strokeColor: "#000000" });
    }
  }, [previousFocus, polylines]);

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
                  onMouseOver={() => dispatch(setFocus(id))}
                  onMouseOut={() => dispatch(setFocus(null))}
                />
              );
            })
        }
      </GoogleMap>
    </LoadScript>
  );
};

export default MovementMap;
