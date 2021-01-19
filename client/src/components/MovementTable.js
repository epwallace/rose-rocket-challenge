import React from "react";
import { useSelector } from "react-redux";
import { movementsSelector } from "../slices/movementsSlice";

/** A tabular representation of a list of freight movements. */
const MovementTable = () => {
  const movements = useSelector(movementsSelector);
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th>ID</th>
          <th>Origin LAT</th>
          <th>Origin LNG</th>
          <th>Destination LAT</th>
          <th>Destination LNG</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {movements &&
          movements.map((movement) => {
            const { id, origin, destination, description } = movement;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{origin.lat}</td>
                <td>{origin.lng}</td>
                <td>{destination.lat}</td>
                <td>{destination.lng}</td>
                <td>{description}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default MovementTable;
