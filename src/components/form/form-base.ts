import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { TextField } from "../fields/text-field";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
});
