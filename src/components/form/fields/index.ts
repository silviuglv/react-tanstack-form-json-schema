import { lazy } from "react";

export const fieldComponents = {
  TextField: lazy(() => import("./text-field")),
  TextareaField: lazy(() => import("./textarea-field")),
  NumberField: lazy(() => import("./number-field")),
  CheckboxField: lazy(() => import("./checkbox-field")),
  SelectField: lazy(() => import("./select-field")),
};
