import type { FC, PropsWithChildren } from "react";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext, useFormContext } from "./context/form-context";
import z from "zod";
import { RenderJsonSchema, type JSONSchema } from "@repo/json-schema-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup } from "./ui/field";
import { Button } from "./ui/button";
import { TextField } from "./fields/text-field";

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button type="submit" disabled={isSubmitting}>
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
});

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
  const jsonSchema = z.toJSONSchema(schema) as JSONSchema;

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
