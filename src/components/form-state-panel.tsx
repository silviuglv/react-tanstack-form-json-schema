import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { JSONEditor } from "./json-editor";

const FormStatePanelHeader = ({
  collapsed,
  toggleCollapsed,
}: {
  collapsed: boolean;
  toggleCollapsed: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-between border-b border-border bg-card pl-4 pr-2 py-1"
      onClick={toggleCollapsed}
    >
      <h2 className={cn("text-xs font-medium font-mono", collapsed && "text-muted-foreground")}>
        Form State
      </h2>
      <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
        {collapsed ? <ChevronsUpDownIcon /> : <ChevronsDownUpIcon />}
      </Button>
    </div>
  );
};

export const FormStatePanel = ({ state }: { state: Record<string, unknown> }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = () => setCollapsed((state) => !state);

  return collapsed ? (
    <div className="flex flex-col border-t border-border">
      <FormStatePanelHeader collapsed={collapsed} toggleCollapsed={toggle} />
    </div>
  ) : (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel
        id="state-panel"
        order={2}
        collapsible
        onCollapse={() => setCollapsed(true)}
        defaultSize={25}
        minSize={15}
      >
        <div className="flex h-full flex-col border-t border-border">
          <FormStatePanelHeader collapsed={collapsed} toggleCollapsed={toggle} />
          <div className="flex-1 relative">
            <JSONEditor value={JSON.stringify(state, null, 2)} readOnly />
          </div>
        </div>
      </ResizablePanel>
    </>
  );
};
