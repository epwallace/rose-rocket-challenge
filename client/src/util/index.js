import { useEffect, useRef } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/** Perform a deep equality test on two LatLng objects
 *
 * @param {{lat: number, lng: number}} x
 * @param {{lat: number, lng: number}} y
 */
export const isSameLocation = (x, y) => {
  return x.lat === y.lat && x.lng === y.lng;
};

export const getMidpoint = (x, y) => {
  return {
    lat: (x.lat + y.lat) / 2,
    lng: (x.lng + y.lng) / 2,
  };
};
