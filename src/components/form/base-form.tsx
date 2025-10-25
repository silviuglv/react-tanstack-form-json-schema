import type { FC, PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "./form-context";
import { RenderJsonSchema } from "./json-schema";
import type { JSONSchema } from "./json-schema";

export const BaseForm: FC<
  PropsWithChildren<{
    schema: JSONSchema;
    onChange: (values: Record<string, unknown>) => void;
    onSubmit?: (values: Record<string, unknown>) => void;
  }>
> = ({ schema, onChange, onSubmit }) => {
  const form = useAppForm({
    defaultValues: {},
    onSubmit: ({ value }) => {
      onSubmit?.(value);
    },
  });

  return (
    <form
      id="base-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full sm:max-w-md"
    >
      <Card>
        <CardHeader>
          {schema?.title ? <CardTitle>{schema?.title}</CardTitle> : null}
          {schema?.description ? <CardDescription>{schema.description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <RenderJsonSchema form={form} schema={schema} />
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <form.AppForm>
            <form.FormControls />
          </form.AppForm>
        </CardFooter>
      </Card>
      <form.AppForm>
        <form.OnChangeHandler onChange={onChange} />
      </form.AppForm>
    </form>
  );
};
