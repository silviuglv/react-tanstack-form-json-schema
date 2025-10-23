import Editor from "@monaco-editor/react";

interface JSONEditorProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  readOnly?: boolean;
}

export function JSONEditor({ value, onChange, readOnly = false }: JSONEditorProps) {
  return (
    <div className="relative w-full h-full">
      <Editor
        className="w-full h-full"
        onChange={(value) => onChange?.(value ?? "{}")}
        language="json"
        theme="vs-dark"
        value={value}
        options={{
          minimap: {
            enabled: false,
          },
          readOnly,
        }}
      />
    </div>
  );
}
