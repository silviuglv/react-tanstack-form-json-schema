import "./index.css";
import { Suspense, useState } from "react";
import z from "zod";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { bugReport } from "./lib/schemas";
import { FormStatePanel } from "./components/form-state-panel";
import { SchemaPanel } from "./components/schema-panel";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { BaseForm } from "./components/form/base-form";

function App() {
  const [jsonInput, setJsonInput] = useState(() =>
    JSON.stringify(z.toJSONSchema(bugReport), null, 2)
  );
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  let schema;

  try {
    schema = JSON.parse(jsonInput);
  } catch (error) {
    schema = error as Error;
  }

  return (
    <div className="h-screen w-full bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <SchemaPanel schema={jsonInput} onChange={setJsonInput} />
        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel id="form-panel" minSize={30}>
              <div className="flex h-full flex-col">
                <div className="border-b border-border bg-card px-4 py-3">
                  <h2 className="text-sm font-semibold text-foreground">Form Preview</h2>
                </div>
                <div className="flex-1 flex overflow-auto items-center justify-center">
                  {schema instanceof Error ? (
                    <div className="flex ">
                      <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Unable to parse schema.</AlertTitle>
                        <AlertDescription>
                          <p>{schema.message}</p>
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="my-10 w-full flex items-center justify-center">
                      <Suspense>
                        <BaseForm schema={schema} onChange={setFormValues} />
                      </Suspense>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <FormStatePanel state={formValues} />
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;
