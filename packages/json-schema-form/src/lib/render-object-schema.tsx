import { JSONSchemaObject, SchemaRenderer } from "./types";
import { getPathPrefix } from "./utils";
import { RenderJsonSchema } from "./render-json-schema";

export const RenderJsonObject: SchemaRenderer<{ pathPrefix?: string }, JSONSchemaObject> = ({
  form,
  schema,
  pathPrefix,
}) => {
  const { properties = {}, required = [] } = schema;

  if (!properties) {
    return null;
  }

  return Object.entries(properties).map(([fieldName, fieldSchema]) => {
    if (typeof fieldSchema === "boolean") return null;

    const path = getPathPrefix(fieldName, pathPrefix);
    return (
      <RenderJsonSchema
        key={path}
        form={form}
        schema={fieldSchema}
        pathPrefix={path}
        required={required.includes(fieldName)}
      />
    );
  });
};
