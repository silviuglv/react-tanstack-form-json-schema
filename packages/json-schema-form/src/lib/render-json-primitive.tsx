import { JSONSchema, SchemaRenderer } from "./types";
import { RenderField } from "./render-field";

export const RenderJsonPrimitive: SchemaRenderer<
  { required?: boolean; pathPrefix?: string },
  Exclude<JSONSchema, { type?: "object" } | { type?: "array" }>
> = ({ schema, form, required, pathPrefix }) => {
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
