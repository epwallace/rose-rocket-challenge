import { useSelector } from "react-redux";
import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";
import { getFormStatus } from "./slices/formSlice";

const App = () => {
  const formIsActive = useSelector(getFormStatus);

  return (
    <div className="bg-gray-200 p-5">
      <h1 className="text-3xl mb-5">Rose Rocket Challenge</h1>

      <div className="flex h-screen divide-x-8">
        <div className="bg-white rounded-xl w-2/3 text-xs">
          {formIsActive ? <MovementForm /> : <MovementTable />}
        </div>
        <MovementMap />
      </div>
    </div>
  );
};

export default App;
