import { useState } from "react";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";

function App() {
  const [movements, setMovements] = useState([
    // NOTE: dummy data for setting up components
    {
      id: "2948294798040",
      origLAT: 43.6511,
      origLNG: -79.347,
      destLAT: 45.4215,
      destLNG: -75.6972,
      description: "Toronto -> Ottawa",
    },
    {
      id: "2948294798041`",
      origLAT: 45.4215,
      origLNG: -75.6972,
      destLAT: 45.5017,
      destLNG: -73.5673,
      description: "Ottawa -> Montreal",
    },
  ]);

  return (
    <div className="App">
      <h1>Rose Rocket Challenge</h1>

      <h2>Current Movements:</h2>
      <MovementTable movementList={movements} />
      <MovementMap movements={movements} className="mx-auto" />
    </div>
  );
}

export default App;
