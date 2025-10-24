import { useStore } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import type { IFieldProps } from "./field-base";
import { useFieldContext } from "../form/form-context";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { ComponentProps } from "react";

interface TextareaFieldProps extends IFieldProps, ComponentProps<"textarea"> {}

export function TextareaField(props: TextareaFieldProps) {
  const { label, description, placeholder, maxLength, ...rest } = props;

  const field = useFieldContext<string>();
  const meta = useStore(field.store, (state) => state.meta);

  const isInvalid = meta.isTouched && !meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupTextarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="min-h-24 resize-none"
          aria-invalid={isInvalid}
          maxLength={maxLength}
          {...rest}
        />
        {maxLength ? (
          <InputGroupAddon align="block-end">
            <InputGroupText className="tabular-nums">
              {field.state.value?.length ?? 0}/{maxLength} characters
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
