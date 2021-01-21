import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { launchCreateForm, launchEditForm } from "../slices/formSlice";
import { deleteMovement, movementsSelector } from "../slices/movementsSlice";
import { setFocus } from "../slices/focusSlice";
import { toggleMode } from "../slices/modeSlice";

/** A tabular representation of a list of freight movements. */
const MovementTable = () => {
  const dispatch = useDispatch();
  const focus = useSelector((state) => state.focus);
  const movements = useSelector(movementsSelector);
  const mode = useSelector((state) => state.mode);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      `Delete movement with id ${id}? This operation is irreversible.`
    );
    if (confirmed) dispatch(deleteMovement(id));
  };

  return (
    <>
      <table className="table-auto mx-auto p-3">
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
                <tr
                  key={id}
                  className={focus === id ? "active" : ""}
                  onMouseEnter={() => dispatch(setFocus(id))}
                  onMouseLeave={() => dispatch(setFocus(null))}
                >
                  <td>{id}</td>
                  <td>{origin.lat}</td>
                  <td>{origin.lng}</td>
                  <td>{destination.lat}</td>
                  <td>{destination.lng}</td>
                  <td>{description}</td>
                  <td className="flex">
                    {/* edit button */}
                    <button
                      className="btn-blue py-1"
                      onClick={() => dispatch(launchEditForm({ movement }))}
                    >
                      edit
                    </button>

                    {/* delete button */}
                    <button
                      className="btn-red ml-1"
                      onClick={() => handleDelete(movement.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <button
        className="block btn-green mx-auto mt-2"
        onClick={() => dispatch(launchCreateForm())}
      >
        add new movement
      </button>
      <button
        className="block btn-blue mx-auto mt-2"
        onClick={() => dispatch(toggleMode())}
      >
        route mode
      </button>
    </>
  );
};

export default MovementTable;
