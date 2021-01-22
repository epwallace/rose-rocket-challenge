import { useSelector } from "react-redux";
import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";
import { getFormStatus } from "./slices/formSlice";

const App = () => {
  const formIsActive = useSelector(getFormStatus);

  return (
    <div className="bg-gray-200 p-5 h-screen">
      <h1 className="text-3xl mb-5">Rose Rocket Challenge</h1>

      <div className="container max-w-screen-lg flex flex-col divide-y-8 items-center mx-auto">
        <MovementMap />
        <div className="bg-white rounded-xl w-full text-xs">
          {formIsActive ? <MovementForm /> : <MovementTable />}
        </div>
      </div>
    </div>
  );
};

export default App;
