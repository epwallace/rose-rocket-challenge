/* eslint-disable no-loop-func */

import { isSameLocation } from "./index";

export const naiveAlgorithm = (input) => {
  // trivial cases
  if (input.length === 0) return input;
  if (input.length === 1) return [input[0].origin, input[0].destination];

  // make a copy of the input since we'll be mutating the array
  let movements = [...input];

  // pick any node to begin; we'll start with the last for now
  let start = movements.pop();
  let end = { ...start };
  let next = null;
  let route = [start];

  while (movements.length) {
    // see if another movement begins at our ending location
    let startsAtDest = movements.filter((x) =>
      isSameLocation(x.origin, end.destination)
    );

    // add a suitable node to the end of the route and update refs
    if (startsAtDest.length) {
      next = startsAtDest[0];
      route.push(next);
      movements = movements.filter((x) => x.id !== next.id);
      end = next;
      continue;
    }

    // see if another movement ends at our starting location
    let endsAtOrigin = movements.filter((x) =>
      isSameLocation(start.origin, x.destination)
    );

    // add a suitable node to the beginning of the route and update refs
    if (endsAtOrigin.length) {
      next = endsAtOrigin[0];
      route = [next, ...route];
      movements = movements.filter((x) => x.id !== next.id);
      start = next;
      continue;
    }

    // no movements connect to our start or end; let's just append another
    next = movements[0];
    route.push(next);
    movements = movements.filter((x) => x.id !== next.id);
    end = next;
    continue;
  }

  // fold sequence of movements into a route of points
  const result = route.reduce(
    (acc, x) => {
      if (acc[acc.length - 1] === x.origin) return [...acc, x.destination];
      return [...acc, x.origin, x.destination];
    },
    [route[0].origin]
  );

  console.log("result:", result);
  return result;
};
