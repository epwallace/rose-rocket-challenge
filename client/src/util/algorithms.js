/* eslint-disable no-loop-func */

import { isSameLocation } from "./index";

/* NOTE: For an algorithm to be compatible with MovementMap, it must accept an
         array of Movement objects and return an array of RouteSegment
         segments. You can change which algorithm is used by altering which
         algorithm is imported as 'createRoute' in the MovementMap file. */

export const naiveAlgorithm = (input) => {
  // trivial cases
  if (input.length === 0) return input;
  if (input.length === 1) return [input[0].origin, input[0].destination];

  // make a copy of the input since we'll be mutating the array
  // add bridgeId to track which movements are devoid of freight
  let movements = input.map((x) => ({ ...x, bridgeId: null }));

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

    // no movements connect to our start or end; have to to drive to the next movement
    /* TODO: in more optimized algorithm, could find which of the remaining movements
             are closest to start/end of current route */
    next = {
      id: null,
      origin: end.destination,
      destination: movements[0].origin,

      // we can uniquely identify this bridge by the movements it connects
      bridgeId: `${end.id}-${movements[0].id}`,
    };
    next.id = null;
    route.push(next);
    end = next;
    continue;
  }

  return route;
};
