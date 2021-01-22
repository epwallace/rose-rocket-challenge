import { useSelector } from "react-redux";
import MovementForm from "./components/MovementForm";
import MovementMap from "./components/MovementMap";
import MovementTable from "./components/MovementTable";
import { getFormStatus } from "./slices/formSlice";

const App = () => {
  const formIsActive = useSelector(getFormStatus);

  return (
    <div className="flex flex-col max-h-screen overflow-y-auto xl:h-screen">
      <h1 className="text-3xl mb-5">Rose Rocket Challenge</h1>

      <div className="container flex flex-col xl:flex-row xl:items-stretch items-center mx-auto flex-grow">
        <MovementMap />
        <div className="bg-white rounded-xl w-full overflow-x-auto text-xs sm:text-sm p-3 xl:order-first mt-2 xl:mt-0 xl:mr-2 xl:h-full">
          {formIsActive ? <MovementForm /> : <MovementTable />}
        </div>
      </div>
    </div>
  );
};

export default App;
