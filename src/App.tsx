import "./index.css";
import { BaseForm } from "./components/base-form";
import { bugReport } from "./lib/schemas";

function App() {
  return (
    <div className="h-dvh w-dvw flex items-center justify-center">
      <BaseForm schema={bugReport} />
    </div>
  );
}

export default App;
