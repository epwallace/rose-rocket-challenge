import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addMovement,
  movementsSelector,
  updateMovement,
} from "../slices/movementsSlice";
import { closeForm } from "../slices/formSlice";

const MovementForm = (props) => {
  const { movement } = props;
  const movements = useSelector(movementsSelector);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, reset } = useForm({
    mode: "onBlur",
  });

  // if the movement prop is provided, set the fields accordingly
  useEffect(() => {
    if (movement) {
      const { origin, destination, description } = movement;

      // populate the form fields
      reset({
        description,
        originLat: origin.lat,
        originLng: origin.lng,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
      });
    }
  }, [movement, movements, reset]);

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

  /* TODO: this function is a monstrosity!!!!!
           split into handleCreation/handleEdit to simplify logic
           and add helpers where it's useful (e.g. first 9 lines) */
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
    if (movement) {
      duplicates = duplicates.filter(
        (duplicate) => duplicate.id !== movement.id
      );
    }

    if (duplicates.length) {
      const duplicateId = duplicates[0].id;

      if (movement) {
        // case: user's edit introduces a duplicate movement; warn them, but allow it
        let confirmed = window.confirm(
          `An identical movement already exists (id: ${duplicateId}). 
          Proceed anyway?`
        );
        if (confirmed) {
          dispatch(
            updateMovement({
              origin,
              destination,
              description,
              id: movement.id,
            })
          );
          dispatch(closeForm());
        }
      } else {
        // creating a movement: do not permit a duplicate
        alert(
          `This movement already exists (id: ${duplicates[0].id}! 
            Please adjust the coordinates, or edit movement ${duplicates[0].id}.`
        );
      }
    } else {
      if (!movement) dispatch(addMovement(origin, destination, description));
      else
        dispatch(
          updateMovement({ origin, destination, description, id: movement.id })
        );
      dispatch(closeForm());
    }
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

      <button onClick={() => dispatch(closeForm())}>cancel</button>
    </form>
  );
};

export default MovementForm;
