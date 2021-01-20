import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { launchCreateForm, launchEditForm } from "../slices/formSlice";
import { movementsSelector } from "../slices/movementsSlice";

/** A tabular representation of a list of freight movements. */
const MovementTable = () => {
  const dispatch = useDispatch();
  const movements = useSelector(movementsSelector);

  return (
    <>
      <button onClick={() => dispatch(launchCreateForm())}>
        add new movement
      </button>
      <table className="table-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Origin LAT</th>
            <th>Origin LNG</th>
            <th>Destination LAT</th>
            <th>Destination LNG</th>
            <th>Description</th>
            <th>Actions</th>
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
                  <td>
                    <button
                      onClick={() => dispatch(launchEditForm({ movement }))}
                    >
                      edit
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default MovementTable;
