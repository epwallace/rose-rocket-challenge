import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addMovement,
  movementsSelector,
  updateMovement,
} from "../slices/movementsSlice";
import { closeForm, getCurrentMovement } from "../slices/formSlice";

const MovementForm = () => {
  const currentMovement = useSelector(getCurrentMovement);
  const movements = useSelector(movementsSelector);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
  });

  // if a movement is being edited, set the fields accordingly
  useEffect(() => {
    if (currentMovement) {
      const { origin, destination, description } = currentMovement;

      // populate the form fields
      reset({
        description,
        originLat: origin.lat,
        originLng: origin.lng,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
      });
    }
  }, [currentMovement, reset]);

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

  /** Convert the FormData from MovementForm into {origin, destination, description} */
  const formatFormData = (data) => {
    const origin = {
      lat: data["originLat"],
      lng: data["originLng"],
    };
    const destination = {
      lat: data["destinationLat"],
      lng: data["destinationLng"],
    };
    const description = data.description;

    return { origin, destination, description };
  };

  /** Creates a new movement with the provided data */
  const handleCreation = (data) => {
    const { origin, destination, description } = formatFormData(data);

    // check for duplicates
    let duplicates = findDuplicateMovements(movements, origin, destination);
    if (duplicates.length) {
      // the movement has duplicate coordinates: forbid creation
      alert(
        `This movement already exists (id: ${duplicates[0].id}! Please provide unique coordinates.`
      );
    } else {
      // the movement has unique coordinates: allow creation
      dispatch(addMovement(origin, destination, description));
      dispatch(closeForm());
    }
  };

  /** Update an existing movement with the provided data */
  const handleUpdate = (data) => {
    const { origin, destination, description } = formatFormData(data);
    const payload = {
      origin,
      destination,
      description,
      id: currentMovement.id,
    };

    // check for duplicates
    let duplicates = findDuplicateMovements(movements, origin, destination);

    // if the coordinates are unchanged, the current movement will be in the array
    duplicates = duplicates.filter((dupe) => dupe.id !== currentMovement.id);

    if (duplicates.length) {
      // the new coordinates are already associated with a movement: warn user
      let confirmed = window.confirm(
        `An identical movement already exists (id: ${duplicates[0].id}). Proceed anyway?`
      );
      if (!confirmed) return;
    }
    // the new coordinates are unique, or the user confirms duplication
    dispatch(updateMovement(payload));
    dispatch(closeForm());
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
          step="any"
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
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(currentMovement ? handleUpdate : handleCreation)}
    >
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

      <button onClick={() => dispatch(closeForm())}>cancel</button>
    </form>
  );
};

export default MovementForm;
