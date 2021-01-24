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
import { isSameMovement } from "../util";

const MovementForm = () => {
  const currentMovement = useSelector(getCurrentMovement);
  const movements = useSelector(movementsSelector);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, setValue } = useForm({
    mode: "onBlur",
  });

  // if a movement is being edited, set the description accordingly
  // NOTE: origin/destination coordinates are set in CoordinateFinder
  useEffect(() => {
    if (currentMovement) setValue("description", currentMovement.description);
  }, [currentMovement, setValue]);

  /** A proposed movement that has been drafted but not saved into the system.
   * Essentially a Movement without an id param.
   *
   * @typedef MovementDraft
   * @property {Location} origin the starting location of the freight
   * @property {Location} destination the ending location of the freight
   * @property {string} description a text description of the freight
   */

  /** Convert the FormData from MovementForm into a MovementDraft
   * @returns {MovementDraft}
   */
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

  /** Creates a new movement with the provided data
   * @param {MovementDraft} data
   */
  const handleCreation = (data) => {
    const newMovement = formatFormData(data);
    const { origin, destination, description } = newMovement;

    // check for duplicates
    let duplicates = movements.filter((x) => isSameMovement(newMovement, x));
    if (duplicates.length) {
      // the movement has duplicate coordinates: forbid creation
      alert(
        `This movement already exists (id: ${duplicates[0].id}! You may not create a duplicate.`
      );
    } else {
      // the movement is unique: allow creation
      dispatch(addMovement(origin, destination, description));
      dispatch(closeForm());
    }
  };

  /** Update an existing movement with the provided data
   * @param {MovementDraft} data
   */
  const handleUpdate = (data) => {
    const updatedMovement = formatFormData(data);
    const payload = {
      ...updatedMovement,
      id: currentMovement.id,
    };

    // check for duplicates, ignoring the unedited version of this movement
    let duplicates = movements
      .filter((x) => isSameMovement(updatedMovement, x))
      .filter((dupe) => dupe.id !== currentMovement.id);

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
      <h2 className="text-lg font-bold mb-2">
        {currentMovement
          ? `Edit movement ${currentMovement.id}:`
          : "Add a new movement:"}
      </h2>
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
