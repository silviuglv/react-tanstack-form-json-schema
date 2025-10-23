import { useStore } from "@tanstack/react-form";
import { useFormContext } from "./form-context";
import { useEffect } from "react";

export const OnChangeHandler = ({
  onChange,
}: {
  onChange: (values: Record<string, unknown>) => void;
}) => {
  const form = useFormContext();
  const values = useStore(form.store, (state) => state.values);

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return null;
};
