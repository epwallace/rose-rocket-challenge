import React from "react";

/** A tabular representation of a list of freight movements. */
const MovementTable = (props) => {
  const { movementList } = props;
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
        {movementList &&
          movementList.map((movement) => {
            const {
              id,
              origLAT,
              origLNG,
              destLAT,
              destLNG,
              description,
            } = movement;
            return (
              <tr>
                <td>{id}</td>
                <td>{origLAT}</td>
                <td>{origLNG}</td>
                <td>{destLAT}</td>
                <td>{destLNG}</td>
                <td>{description}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default MovementTable;
