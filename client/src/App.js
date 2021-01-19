import { useState } from "react";
import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";

function App() {
  const [movements, setMovements] = useState([
    // NOTE: dummy data for setting up components
    {
      id: "2948294798040",
      origin: { lat: 43.6511, lng: -79.347 },
      destination: { lat: 45.4215, lng: -75.6972 },
      description: "Toronto -> Ottawa",
    },
    {
      id: "2948294798041`",
      origin: { lat: 45.4215, lng: -75.6972 },
      destination: { lat: 45.5017, lng: -73.5673 },
      description: "Ottawa -> Montreal",
    },
  ]);

  return (
    <div className="App">
      <h1>Rose Rocket Challenge</h1>

      <h2>Current Movements:</h2>
      <MovementForm />
      <MovementTable movementList={movements} />
      <MovementMap movements={movements} />
    </div>
  );
}

export default App;
