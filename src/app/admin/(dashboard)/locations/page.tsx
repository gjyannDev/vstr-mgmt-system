import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function page() {
  return (
    <div>
      <div>
        <div className="flex flex-row justify-between">
          <div></div>

          <Button
            variant="default"
            className="h-10 rounded-md shadow-sm"
            size="lg"
          >
            <PlusIcon />
            New Location
          </Button>
        </div>
      </div>
    </div>
  );
}
