import { FC } from "react";
import { IRenderProps, JSONSchema } from "./types";
import { RenderField } from "./render-field";

interface RenderJsonPrimitiveProps extends IRenderProps {
  schema: Exclude<JSONSchema, { type?: "object" } | { type?: "array" }>;
}

export const RenderJsonPrimitive: FC<RenderJsonPrimitiveProps> = ({
  schema,
  form,
  required,
  pathPrefix,
}) => {
  return (
    <RenderField
      fieldType="TextField"
      schema={schema}
      form={form}
      required={required}
      pathPrefix={pathPrefix ?? ""}
    />
  );
};
