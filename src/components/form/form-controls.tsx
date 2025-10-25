import { useFormContext } from "./form-context";
import { Button } from "../ui/button";
import { Field } from "../ui/field";

export const FormControls = () => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Field>
      )}
    </form.Subscribe>
  );
};
