import { useSelector } from "react-redux";
import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";
import { getFormStatus } from "./slices/formSlice";

const App = () => {
  const formIsActive = useSelector(getFormStatus);

  return (
    <div className="App">
      <h1>Rose Rocket Challenge</h1>

      <h2>Current Movements:</h2>
      {formIsActive ? <MovementForm /> : <MovementTable />}
      <MovementMap />
    </div>
  );
};

export default App;
