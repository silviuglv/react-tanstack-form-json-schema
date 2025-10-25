import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { fieldComponents } from "./fields";
import { OnChangeHandler } from "./on-change-handler";
import { FormControls } from "./form-controls";

const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();

const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents,
  formComponents: {
    OnChangeHandler,
    FormControls,
  },
});

export { useAppForm, withFieldGroup, withForm, useFieldContext, useFormContext };
