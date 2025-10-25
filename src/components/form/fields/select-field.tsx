import { useStore } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/components/form/form-context";
import type { IFieldProps } from "./field-base";

interface SelectFieldProps extends IFieldProps {
  options: {
    value: string;
    label: string;
  }[];
}

export default function SelectField(props: SelectFieldProps) {
  const { label, description, placeholder, options } = props;

  const field = useFieldContext<string>();
  const meta = useStore(field.store, (state) => state.meta);
  const isInvalid = meta.isTouched && !meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
