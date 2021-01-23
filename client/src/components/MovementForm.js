import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addMovement,
  movementsSelector,
  updateMovement,
} from "../slices/movementsSlice";
import { closeForm, getCurrentMovement } from "../slices/formSlice";
import CoordinateFinder from "./CoordinateFinder";

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

  // TODO: render error messages on the form (e.g. "This field is required")
  return (
    <div className="w-full max-w-screen-sm mx-auto">
      <h2 className="text-lg font-bold mb-2">Add a new movement:</h2>
      <form
        className="flex flex-col mx-auto"
        onSubmit={handleSubmit(currentMovement ? handleUpdate : handleCreation)}
      >
        {/* coordinates section */}
        <fieldset className="flex flex-col md:flex-row md:justify-between items-center">
          <CoordinateFinder name="origin" register={register} />
          <CoordinateFinder name="destination" register={register} />
        </fieldset>

        {/* movement description */}
        <label className="flex flex-col mt-2 w-full mx-auto">
          <span>Description:</span>
          <input type="text" name="description" ref={register} />
        </label>

        {/* submission */}
        <div className="flex flex-col w-full max-w-screen-xs mx-auto">
          {/* submit button */}
          <input
            className="btn-green mt-2"
            type="submit"
            value="Submit Movement"
          />

          {/* cancel button */}
          <button
            className="btn-yellow mt-2"
            onClick={() => dispatch(closeForm())}
          >
            cancel
          </button>
        </div>
        {!formState.isValid && formState.isSubmitted && (
          <p>Please fix all errors and resubmit.</p>
        )}
      </form>
    </div>
  );
};

export default MovementForm;
