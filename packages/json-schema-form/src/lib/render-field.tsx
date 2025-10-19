import { FC } from "react";
import { IRenderProps } from "./types";
import { getFieldProps } from "./utils";

interface RenderFieldProps extends IRenderProps {
  pathPrefix: string;
  fieldType: string;
}

export const RenderField: FC<RenderFieldProps> = ({
  fieldType,
  form,
  schema,
  pathPrefix,
  required,
}) => {
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
