import type { FC, PropsWithChildren } from "react";
import z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup } from "./ui/field";
import { Button } from "./ui/button";
import { useAppForm } from "./form/form-base";
import { RenderJsonSchema } from "./form/render-json-schema";

export const BaseForm: FC<PropsWithChildren<{ schema: z.ZodObject }>> = ({ schema }) => {
  const form = useAppForm({
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
    validators: {
      onSubmit: schema,
    },
  });
  const meta = schema.meta();
  const jsonSchema = z.toJSONSchema(schema);

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        {meta?.title ? <CardTitle>{meta?.title}</CardTitle> : null}
        {meta?.description ? (
          <CardDescription>Help us improve by reporting bugs you encounter.</CardDescription>
        ) : null}
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
            <RenderJsonSchema form={form} schema={jsonSchema} />
          </FieldGroup>
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
