import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";

const App = () => {
  return (
    <div className="App">
      <h1>Rose Rocket Challenge</h1>

      <h2>Current Movements:</h2>
      <div className="container w-1/2 mx-auto">
        <MovementForm />
      </div>
      <MovementTable />
      <MovementMap />
    </div>
  );
};

export default App;
