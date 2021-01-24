# Features

## Suggested Features from the Specifications

In addition to the required tasks, I completed these suggestions from the
document you provided.

> Make UI more user-friendly for dispatchers by expanding the movement model
> and allowing dispatchers to enter City Name along with Lat/Lng for movement
> Start and End Locations.

- I accomplished this by creating the `CoordinateFinder` components, which
  allows the user to search for a city (or address, postal code, etc.) using
  the [OpenCage Geocoding API](https://opencagedata.com/api). The user can
  manually input coordinates if they do not wish to use the search bar.

> Ability to see Driver Route on the map (either alongside with the movements
> or ability to toggle between Movements or Driver Route views)

- The user can switch between "movement" and "route" modes by clicking the
  blue button in the table component.
- Initially, I allowed the user to view the movements and the driver route
  simultaneously. It looked alright when both movements and route segments
  were depicted as straight lines.
- Once I began displaying the the driver routes as complex polylines based on
  the driving directions, the hybrid display looked too busy.

> We want to be sure that the Driver Route is optimized. We do not want to see
> 2 or more same locations in a row if it could be optimized.
> Example: If there are available movements that visit the same city:
> `[Toronto -> Montreal]` and `[Montreal -> Ottawa]` then the Driver Route
> should be `[Toronto -> Montreal -> Ottawa]` instead of
> `[Toronto -> Montreal -> Montreal -> Ottawa]`.

TODO: write this when testing is complete

> We want to be sure that the Driver Route has some logic to optimize for
> visiting the nearest cities first.
> Example: If there are just 2 available movements: `[Toronto -> Montreal]`
> and `[Scarborough -> Ottawa]` then the driver route should start with
> `[Toronto -> Scarborough -> ...]` or `[Scarborough -> Toronto -> ...]`. Any
> other route would result in a Driver Route that would be highly unoptimized.

TODO: write this when optimization is complete

> Being able to visualize routes as polylines that follow the road network,
> instead of simple straight lines.

- I implemented this by using the
  [Google Maps Directions API](https://developers.google.com/maps/documentation/directions/overview).
  After the routing algorithm computes a route, the sequence of locations is
  passed to the Directions API, which returns a polyline for the connecting
  segments of the route.

> Design code and project in such a way that it is easy for developers to make
> modifications on the routing algorithm or replace it completely with
> different implementation on demand.

TODO: write this after finishing

> Making the page aesthetically pleasing and user-friendly

- I used [Tailwind CSS](https://tailwindcss.com/docs) to style the page. It
  makes the `className`s a little unruly, but I find it speeds up the CSS
  process pretty considerably, especially with respect to responsive design.

TODO: accessibility
