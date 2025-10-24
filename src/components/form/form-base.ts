import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { TextField } from "../fields/text-field";
import { TextareaField } from "../fields/textarea-field";
import { NumberField } from "../fields/number-field";
import { CheckboxField } from "../fields/checkbox-field";
import { SelectField } from "../fields/select-field";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NumberField,
    CheckboxField,
    SelectField,
  },
  formComponents: {},
});
