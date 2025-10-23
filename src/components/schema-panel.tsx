import { JSONEditor } from "./json-editor";
import { ResizablePanel } from "./ui/resizable";

export const SchemaPanel = ({
  schema,
  onChange,
}: {
  schema: string;
  onChange: (value: string) => void;
}) => {
  return (
    <ResizablePanel id="schema-panel" defaultSize={50} minSize={30}>
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-card px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">JSON Schema</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <JSONEditor value={schema} onChange={onChange} readOnly={false} />
        </div>
      </div>
    </ResizablePanel>
  );
};
