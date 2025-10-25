import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../form-context";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../../ui/field";
import type { IFieldProps } from "./field-base";
import { Checkbox } from "../../ui/checkbox";

interface CheckboxFieldSingleProps extends IFieldProps {
  type: "single";
}

function CheckboxFieldSingle(props: CheckboxFieldSingleProps) {
  const { label, description } = props;

  const field = useFieldContext<boolean>();
  const meta = useStore(field.store, (state) => state.meta);
  const isInvalid = meta.isTouched && !meta.isValid;
  return (
    <FieldGroup data-invalid={isInvalid}>
      <Field orientation="horizontal">
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked === true)}
        />
        <FieldContent>
          {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
          {description ? <FieldDescription>{description}</FieldDescription> : null}
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}

interface CheckboxFieldMultipleProps extends IFieldProps {
  type: "multiple";
  options: {
    label: string;
    value: string;
  }[];
}

function CheckboxFieldMultiple(props: CheckboxFieldMultipleProps) {
  const { label, description, options } = props;

  const field = useFieldContext<string[]>();
  const meta = useStore(field.store, (state) => state.meta);
  const isInvalid = meta.isTouched && !meta.isValid;

  return (
    <>
      {label ? <FieldLegend variant="label">{label}</FieldLegend> : null}
      <FieldGroup data-invalid={isInvalid}>
        {options?.map((option, i) => (
          <Field key={option.value} orientation="horizontal">
            <Checkbox
              id={`${field.name}[${i}]`}
              name={`${field.name}[${i}]`}
              value={option.value}
            />
            <FieldLabel htmlFor={`${field.name}[${i}]`} className="font-normal">
              {option.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </>
  );
}

export default function CheckboxField(
  props: CheckboxFieldSingleProps | CheckboxFieldMultipleProps
) {
  const { type } = props;

  const field = useFieldContext<unknown>();
  const meta = useStore(field.store, (state) => state.meta);
  const isInvalid = meta.isTouched && !meta.isValid;

  return (
    <FieldSet>
      {type === "single" ? (
        <CheckboxFieldSingle {...props} />
      ) : (
        <CheckboxFieldMultiple {...props} />
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
