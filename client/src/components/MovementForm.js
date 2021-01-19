import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { addMovement, movementsSelector } from "../slices/movementsSlice";

const MovementForm = () => {
  const movements = useSelector(movementsSelector);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState } = useForm({ mode: "onBlur" });

  // TODO: define types for movement and locations (latLng) for more descriptive JSDoc params
  /** Find all movements from origin to destination in the given array
   * @param {[Object]} movements An array of movements
   * @param {{lat: number, lng: number}} origin Originating latitude and longitude
   * @param {{lat: number, lng: number}} destination Destination latitude and longitude
   */
  const findDuplicateMovements = (movements, origin, destination) => {
    return Object.values(movements).filter((movement) => {
      return (
        movement.origin.lat === origin.lat &&
        movement.origin.lng === origin.lng &&
        movement.destination.lat === destination.lat &&
        movement.destination.lng === destination.lng
      );
    });
  };

  const onSubmit = (data) => {
    const origin = {
      lat: data["originLat"],
      lng: data["originLng"],
    };
    const destination = {
      lat: data["destinationLat"],
      lng: data["destinationLng"],
    };
    const description = data.description;

    // check if the provided coordinates are already associated with a movement
    let duplicates = findDuplicateMovements(movements, origin, destination);
    if (duplicates.length) {
      alert(
        `This movement already exists (id: ${duplicates[0].id}! Please adjust the coordinates, or edit movement ${duplicates[0].id}.`
      );
      return;
    }

    // if no duplicates are found, create the movement
    dispatch(addMovement(origin, destination, description));
  };

  /** Generate a form input that takes a coordinate in the range [-90, 90] */
  const createCoordinateInput = (name, label) => {
    return (
      <label
        className={
          formState.errors[name]
            ? "m-1 rounded-md bg-red-300 px-2 py-1 font-bold"
            : "m-1"
        }
      >
        <span>{label}</span>
        <input
          className="m-1"
          type="number"
          name={name}
          ref={register({
            required: true,
            valueAsNumber: true,
            validate: (x) =>
              (x >= -90 && x <= 90) ||
              "Must be a number in the range [-90, 90]",
          })}
        />
      </label>
    );
  };

  // TODO: render error messages on the form (e.g. "This field is required")
  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      {/* coordinates section */}
      <fieldset className="flex justify-between">
        {/* originating coordinates */}
        <fieldset>
          <legend>Originating Coordinates:</legend>
          {createCoordinateInput("originLat", "Latitude")}
          {createCoordinateInput("originLng", "Longitude")}
        </fieldset>

        {/* destination coordinates */}
        <fieldset>
          <legend>Desintation Coordinates:</legend>
          {createCoordinateInput("destinationLat", "Latitude")}
          {createCoordinateInput("destinationLng", "Longitude")}
        </fieldset>
      </fieldset>

      {/* movement description */}
      <label>
        <span>Description:</span>
        <input type="text" name="description" ref={register} />
      </label>

      {/* submission */}
      <input type="submit" />
      {!formState.isValid && formState.isSubmitted && (
        <p>Please fix all errors and resubmit.</p>
      )}
    </form>
  );
};

export default MovementForm;
