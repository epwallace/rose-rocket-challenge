import { useEffect, useRef } from "react";

// Types:

/** A coordinate pair representing a geographic location.
 * @typedef Location
 * @property {number} lat the latitude of the location
 * @property {number} lng the longitude of the location
 */

/** A movement of freight from one location to another.
 * @typedef Movement
 * @property {number} id a unique number identifying the movement
 * @property {Location} origin the starting location of the freight
 * @property {Location} destination the ending location of the freight
 * @property {string} description a text description of the freight
 */

/** Custom hook for capturing the previous value of props, state, or any
 * other calulated value. Taken from the
 * {@link https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state|React docs}.
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/** Perform a deep equality test on two locations
 *
 * @param {Location} x
 * @param {Location} y
 */
export const isSameLocation = (x, y) => {
  return x.lat === y.lat && x.lng === y.lng;
};

/** Perform a deep equality test on two movements.
 *
 * @param {Movement} x
 * @param {Movement} y
 */
export const isSameMovement = (x, y) => {
  const { origin: origX, destination: destX, description: descX } = x;
  const { origin: origY, destination: destY, description: descY } = y;
  return (
    isSameLocation(origX, origY) &&
    isSameLocation(destX, destY) &&
    descX === descY
  );
};

/** Calculate the midpoint of the straight line connecting two locations
 *
 * @param {Location} x
 * @param {Location} y
 */
export const getMidpoint = (x, y) => {
  return {
    lat: (x.lat + y.lat) / 2,
    lng: (x.lng + y.lng) / 2,
  };
};
