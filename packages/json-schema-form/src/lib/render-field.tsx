import { SchemaRenderer } from "./types";
import { getFieldProps } from "./utils";

export const RenderField: SchemaRenderer<{
  pathPrefix: string;
  fieldType: string;
  required?: boolean;
}> = ({ fieldType, form, schema, pathPrefix, required }) => {
  const fieldProps = getFieldProps(schema, required);

  return (
    <form.AppField
      name={pathPrefix}
      children={(field) => {
        const Component = field[fieldType];

        if (!fieldType) {
          console.warn(`Field component "${fieldType}" not found for path "${pathPrefix}".`);
          return <></>;
        }

        return <Component {...fieldProps} />;
      }}
    />
  );
};
