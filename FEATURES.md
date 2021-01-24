# Features

## Suggested Features from the Specifications

In addition to the required tasks, I completed these suggestions from the
document you provided.

### Allow dispatcher to enter a city with the lat/lng values

I accomplished this by creating the `CoordinateFinder` components, which allows
the user to search for a city (or address, postal code, etc.) using the
[OpenCage Geocoding API](https://opencagedata.com/api). The user can manually
input coordinates if they do not wish to use the search bar.

### Ability to toggle between movement/driver route modes

- The user can switch between "movement" and "route" modes by clicking the
  blue button in the table component.
- Initially, I allowed the user to view the movements and the driver route
  simultaneously. It looked alright when both movements and route segments
  were depicted as straight lines.
- Once I began displaying the the driver routes as complex polylines based on
  the driving directions, the hybrid display looked too busy.

### Route optimization: prevent `[A -> X -> X -> B]`-style repetitions

The `naiveAlgorithm` will not produce routes of this nature, as long as the
input is correctly formed (i.e. no `[Toronto -> Toronto]` route is provided.

### Route optimization: minimize distance traveled when planning a route

TODO: write this when optimization is complete

### Visualize driver routes with polylines

I implemented this by using the
[Google Maps Directions API](https://developers.google.com/maps/documentation/directions/overview).
After the routing algorithm computes a route, the sequence of locations is
passed to the Directions API, which returns a polyline for the connecting
segments of the route.

### Algorithm modifiability and modularity

The `algorithms.js` file proposes a common interface for the routing
algorithms (`Movement[] -> RouteSegment[]`), and JSDoc `typedefs` can be found
in the `typedefs.js` file. To use a different algorithm, a developer simply
needs to import the algorithm of their choice to `MovementMap` with the name
`createRoute`.

### Making the page aesthetically pleasing and user-friendly

I used [Tailwind CSS](https://tailwindcss.com/docs) to style the page. It
makes the `className`s a little unruly, but I find it speeds up the CSS
process pretty considerably, especially with respect to responsive design.
I do think there's a lot that can be improved, as I'll discuss in another
section.
