import { useStore } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../../ui/field";
import type { IFieldProps } from "./field-base";
import { useFieldContext } from "../../form/form-context";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRef, type ComponentProps } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

interface NumberFieldProps extends IFieldProps, ComponentProps<"input"> {
  type: "numeric" | "decimal";
}

export default function NumberField(props: NumberFieldProps) {
  const { label, description, placeholder, type, ...rest } = props;

  const field = useFieldContext<number>();
  const meta = useStore(field.store, (state) => state.meta);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isInvalid = meta.isTouched && !meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
          placeholder={placeholder}
          type={type}
          inputMode={type}
          aria-invalid={isInvalid}
          ref={inputRef}
          {...rest}
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            type="button"
            onClick={() => inputRef.current?.stepDown()}
            aria-label="Step down"
          >
            <MinusIcon />
          </InputGroupButton>
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => inputRef.current?.stepUp()}
            aria-label="Step up"
          >
            <PlusIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
