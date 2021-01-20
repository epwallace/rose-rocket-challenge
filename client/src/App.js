import { useSelector } from "react-redux";
import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";
import { getFormStatus, getCurrentMovement } from "./slices/formSlice";

const App = () => {
  const formIsActive = useSelector(getFormStatus);
  const currentMovement = useSelector(getCurrentMovement);

  return (
    <div className="App">
      <h1>Rose Rocket Challenge</h1>

      <h2>Current Movements:</h2>
      {formIsActive ? (
        <MovementForm movement={currentMovement} />
      ) : (
        <MovementTable />
      )}
      <MovementMap />
    </div>
  );
};

export default App;
