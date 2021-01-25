import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { getCurrentMovement } from "../slices/formSlice";

const CoordinateFinder = ({ name, register, ...rest }) => {
  const movement = useSelector(getCurrentMovement);
  const [query, setQuery] = useState("");
  const [lat, setLat] = useState(movement ? movement[name].lat : "");
  const [lng, setLng] = useState(movement ? movement[name].lng : "");
  const [resultName, setResultName] = useState("");
  const registerOptions = { required: true, valueAsNumber: true };

  const handleLookup = async () => {
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=6200d6d5ca854eb4904746b8af471a2e`
      );
      const { lat, lng } = res.data.results[0].geometry;
      const { formatted } = res.data.results[0];
      setLat(lat);
      setLng(lng);
      setResultName(formatted);
    } catch (err) {
      console.log(err);
      alert("Search failed; please try again or enter coordinates manually.");
    }
  };

  return (
    <fieldset className="flex flex-col p-3 rounded-lg w-2/5">
      <legend>{name} coordinates</legend>

      {/* query input */}
      <label htmlFor="query" className="sr-only">
        coordinate search
      </label>
      <input
        type="text"
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"enter a city or address"}
      />

      {/* query submission */}
      <button
        type="button"
        className="btn-blue w-max mt-2 mb-3 mx-auto"
        onClick={handleLookup}
      >
        get coordinates
      </button>
      <p className="mb-2">
        <span>
          {resultName ? (
            <>
              Result: <span className="font-bold">{resultName}</span>
            </>
          ) : (
            "Search or manually enter coordinates."
          )}
        </span>
      </p>

      {/* latitude input */}
      <label htmlFor={`${name}Lat`} className="sr-only">
        latitude
      </label>
      <input
        name={`${name}Lat`}
        type="number"
        step="any"
        value={lat}
        ref={register(registerOptions)}
        onChange={(e) => setLat(e.target.value)}
        placeholder={"latitude"}
      />

      {/* longitude input */}
      <label htmlFor={`${name}Lng`} className="sr-only">
        longitude
      </label>
      <input
        name={`${name}Lng`}
        type="number"
        step="any"
        value={lng}
        ref={register(registerOptions)}
        onChange={(e) => setLng(e.target.value)}
        placeholder={"longitude"}
      />
    </fieldset>
  );
};

export default CoordinateFinder;
