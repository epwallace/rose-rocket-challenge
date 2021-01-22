import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { movementsSelector } from "../slices/movementsSlice";
import { setFocus } from "../slices/focusSlice";
import { usePrevious } from "../util";
import { naiveAlgorithm } from "../util/algorithms";

const orange = "#fab132";
const red = "#fa3261";
const blue = "#328ffa";
const center = {
  lat: 43.6511,
  lng: -79.3473,
};

/** An interactive Google Map displaying freight movements. */
const MovementMap = () => {
  const dispatch = useDispatch();
  const focus = useSelector((state) => state.focus);
  const mode = useSelector((state) => state.mode);
  const previousFocus = usePrevious(focus);
  const movements = useSelector(movementsSelector);
  const [polylines, setPolylines] = useState({});
  const [route, setRoute] = useState([]);

  // set polyline color to red when movement becomes focused
  useEffect(() => {
    if (focus) {
      polylines[focus].setOptions({ strokeColor: red });
    }
  }, [focus, polylines]);

  // reset polyline color to black when movements loses focus
  useEffect(() => {
    if (previousFocus) {
      polylines[previousFocus].setOptions({ strokeColor: orange });
    }
  }, [previousFocus, polylines]);

  useEffect(() => {
    setRoute(naiveAlgorithm(movements));
  }, [movements]);

  /** Maps a movement ID to a Polyline (in "polylines" state object)
   * @param {string} id The movement ID corresponding to the Polyline
   * @param {Polyline} polyline A Polyline object
   */
  const mapIdToPolyline = (id, line) => {
    setPolylines((prevState) => {
      return { ...prevState, [id]: line };
    });
  };

  // use isLoaded to conditionally render the map (ensures window.google is defined)
  const { isLoaded } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: "AIzaSyBp8nFSp3hZPV-np6jNSR2I73BO2jCcr8A",
    mapIds: ["a7fb051b40295fef"],
  });

  const renderMap = () => {
    const arrowhead = {
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 5,
      },
      repeat: "150px",
    };

    const thinClosedArrow = {
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 2,
      },
      repeat: "150px",
    };

    const openArrow = {
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 3,
      },
      repeat: "50px",
      offset: "20px",
    };

    const dashed = {
      icon: {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 2,
      },
      repeat: "10px",
    };

    return (
      <GoogleMap
        mapContainerClassName="w-full h-96 min-h-full mx-auto rounded-lg"
        center={center}
        zoom={6}
        options={{ mapId: "a7fb051b40295fef" }}
      >
        {
          // BUG: markers with same location have overlapping labels
          // BUG: markers need to be deleted/updated along with movements
          // generate markers for all locations the driver must visit
          route.length &&
            route.map((point, index) => {
              return (
                <Marker
                  position={point.origin}
                  label={(index + 1).toString()}
                  key={point.id}
                />
              );
            })
        }

        {
          // in route mode, display the driver's route
          mode === "route" &&
            route.map((movement, i) => {
              const { id, origin, destination } = movement;
              const path = [origin, destination];
              return (
                <Polyline
                  path={path}
                  key={id}
                  options={{
                    strokeColor: focus === id && id ? red : blue,
                    strokeWeight: id ? 8 : 0,
                    strokeOpacity: 0.8,

                    // when a truck must drive without freight, change the line style
                    icons: id ? [arrowhead] : [thinClosedArrow, dashed],
                  }}
                  onMouseOver={() => dispatch(setFocus(id))}
                  onMouseOut={() => dispatch(setFocus(null))}
                />
              );
            })
        }

        {
          // convert movements into polylines
          mode === "movement" &&
            movements &&
            movements.map((movement) => {
              const { id, origin, destination } = movement;
              const path = [origin, destination];

              return (
                <Polyline
                  path={path}
                  key={id}
                  id={id}
                  options={{
                    strokeColor: orange,
                    strokeWeight: 4,
                    icons: [openArrow],
                    zIndex: 1,
                  }}
                  onLoad={(line) => mapIdToPolyline(id, line)} // maintain a reference
                  onMouseOver={() => id && dispatch(setFocus(id))}
                  onMouseOut={() => dispatch(setFocus(null))}
                />
              );
            })
        }
      </GoogleMap>
    );
  };
  return isLoaded ? renderMap() : null;
};

export default MovementMap;
