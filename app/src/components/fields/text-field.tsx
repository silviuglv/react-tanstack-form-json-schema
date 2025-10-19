import type { HTMLInputTypeAttribute } from "react";
import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../context/form-context";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { IFieldProps } from "./field-base";

interface TextFieldProps extends IFieldProps {
  type?: HTMLInputTypeAttribute;
}

export function TextField(props: TextFieldProps) {
  const { label, description, type, placeholder } = props;

  const field = useFieldContext<string>();
  const meta = useStore(field.store, (state) => state.meta);

  const isInvalid = meta.isTouched && !meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Input
        id={field.name}
        name={field.name}
        type={type}
        defaultValue={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
