import { IRenderProps } from "./types";
import { RenderField } from "./render-field";
import { RenderJsonObject } from "./render-object-schema";
import { RenderJsonPrimitive } from "./render-json-primitive";
import { RenderArrayObject } from "./render-array-schema";

export function RenderJsonSchema(props: NoInfer<IRenderProps>) {
  const { form, schema, ...options } = props;

  if (schema["x-field-type"] && options.pathPrefix) {
    return (
      <RenderField
        form={form}
        schema={schema}
        fieldType={schema["x-field-type"]}
        pathPrefix={options.pathPrefix}
        required={options.required}
      />
    );
  }

  if (!schema.type) {
    console.error("Unsupported. Schema `type` is required");
    return null;
  }

  switch (schema.type) {
    case "object":
      return <RenderJsonObject form={form} schema={schema} {...options} />;
    case "array":
      return <RenderArrayObject form={form} schema={schema} {...options} />;
    case "string":
    case "number":
    case "boolean":
    case "null":
      return <RenderJsonPrimitive form={form} schema={schema} {...options} />;
    default:
      return null;
  }
}
