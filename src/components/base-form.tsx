import type { FC, PropsWithChildren } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup } from "./ui/field";
import { Button } from "./ui/button";
import { useAppForm } from "./form/form-base";
import { RenderJsonSchema } from "./form/render-json-schema";
import type { JSONSchema } from "./form/form-utils";
import { OnChangeHandler } from "./form/on-change-handler";

export const BaseForm: FC<
  PropsWithChildren<{
    schema: JSONSchema;
    onChange: (values: Record<string, unknown>) => void;
  }>
> = ({ schema, onChange }) => {
  const form = useAppForm({
    defaultValues: {},
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        {schema?.title ? <CardTitle>{schema?.title}</CardTitle> : null}
        {schema?.description ? <CardDescription>{schema.description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <form
          id="bug-report-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <RenderJsonSchema form={form} schema={schema} />
          </FieldGroup>
          <form.AppForm>
            <OnChangeHandler onChange={onChange} />
          </form.AppForm>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="bug-report-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
