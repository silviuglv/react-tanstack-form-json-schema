import type { HTMLInputTypeAttribute } from "react";
import { useStore } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/components/form/form-context";
import type { IFieldProps } from "./field-base";

interface TextFieldProps extends IFieldProps {
  type?: HTMLInputTypeAttribute;
}

export default function TextField(props: TextFieldProps) {
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
