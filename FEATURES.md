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

## Areas of Improvement

There are many aspects of the app that need work. Here are some things I'd
improve if I had additional time:

- **persistent movement focus:** Currently, a user can "focus" a movement by hovering
  over the corresponding table row or polyline. They will simultaneously
  light up, but the effect ends on mouseout. I think it would be useful to
  have a more persistent option: perhaps clicking on a line/table row would
  toggle a colour change and launch an info window on the map. This could
  allow a user to launch the edit form or delete a polyline without looking
  for the corresponding row in the table. It would also make it possible to
  hide the table completely, so the user could see more of the map at once.

- **map legend:** I'd like to display a legend that explains the meaning of the
  of the different line colours and styles. I had a hard time figuring out how
  to make this work with the Google Maps API (they explain how to make a
  legend for markers, but I'm not sure how to show the lines). I'm not sure if
  there's a nice way to do it. In the worst case, I could just create my own
  SVGs and use those. But it would be nice to do that programmatically.

- **map markers**: I'd like to use some custom markers on the Google map to make
  things a little more attractive and informative. For instance, I'd like to use
  different markers for the starting/ending points of the driver route.

- **accessibility:** the contrast of some buttons doesn't meet the WCAG standard,
  and I'm not sure how to handle keyboard navigation with the Google map. I'd
  need to look into this, but it doesn't seem friendly to screen-reader users
  or keyboard-only users. On that note, some focusable element are missing a
  focus style as well.

- **form logic:** I ran into an issue (#5) where the values of the coordinate
  fields in `CoordinateFinder` didn't populate correctly. The way I fixed it
  is a bit hacky: I set the description field in the parent component in
  and the coordinate fields in the child component. I know there
  are some details about working with controlled components in the
  react-hooks-form documentation, so I think I could handle this a little more
  elegantly if I had time.

- **route table:** there's currently a table view for the movements, but not
  the driver's route.

- **handling impossible routes**: what happens when a dispatcher accidentally
  enters a movement from Toronto to Dubai? It doesn't make it into the route,
  because the Directions API (rightfully) can't find a way to drive there. But
  the user isn't notified, which could lead to issues.

- **API consistency:** I'm using OpenCage for forward geocoding in the client,
  and Google Maps for everything else in the backend. Just for consistency, it
  might be nice to geocode through the backend as well.

## Ideas for Other Features

These weren't on the list, but I think they'd be fun to implement!

- allow the dispatcher to switch between different drivers and move
  movements between them; could also create algorithms to help delegate
  movements efficiently
- add a checkbox to each table row that would allow a user to toggle
  the visibility of each row
- add a search function that would allow the user to filter movements
