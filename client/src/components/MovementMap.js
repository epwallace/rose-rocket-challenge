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
import { naiveAlgorithm as createRoute } from "../util/algorithms";
import { getRoute } from "../api/index";

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

  // reset polyline color when movements loses focus
  useEffect(() => {
    if (previousFocus) {
      polylines[previousFocus].setOptions({
        strokeColor: mode === "movement" ? orange : blue,
      });
    }
  }, [previousFocus, polylines, mode]);

  useEffect(() => {
    dispatch(setFocus(null));
    const generateRoutePolylines = async () => {
      // determine which route the druver will take to complete the deliveries
      const routeSegments = createRoute(movements);

      // compute and store the polyline for each segment in the route
      for await (let x of routeSegments) {
        x.polyline = await getRoute(x.origin, x.destination);
      }
      setRoute(routeSegments);
    };
    generateRoutePolylines();
  }, [movements, dispatch]);

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
    disableDefaultUI: true,
  });

  const renderMap = () => {
    const arrowhead = {
      icon: {
        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 4,
        fillOpacity: 0.8,
        strokeWeight: 0,
      },
      repeat: "100px",
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
          // in route mode, display the driver's route
          mode === "route" &&
            route.map((movement, i) => {
              const { id, bridgeId, polyline, origin, destination } = movement;
              const movementOptions = {
                fillColor: focus === id ? red : blue,
                strokeColor: focus === id ? red : blue,
                strokeWeight: 4,
                strokeOpacity: 0.8,
                icons: [arrowhead],
              };
              const bridgeOptions = {
                strokeColor: orange,
                strokeWeight: 0,
                strokeOpacity: 1,
                icons: [thinClosedArrow, dashed],
                zIndex: 2,
              };
              return (
                <div key={id | bridgeId}>
                  <Polyline
                    id={id | bridgeId}
                    path={polyline}
                    options={id ? movementOptions : bridgeOptions}
                    onLoad={(line) => mapIdToPolyline(id || bridgeId, line)} // maintain a reference
                    onMouseOver={() => dispatch(id && setFocus(id))}
                    onMouseOut={() => dispatch(setFocus(null))}
                  />
                  {i === 0 && <Marker position={origin} label={"0"} />}
                  <Marker position={destination} label={(i + 1).toString()} />
                </div>
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
