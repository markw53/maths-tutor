import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ManagementBaseProps } from "@/types/admin";

export default function ManagementBase({
  title,
  description,
  addButtonLabel,
  addButtonIcon,
  onAddButtonClick,
  loading,
  error,
  children,
}: ManagementBaseProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <Button className="cursor-pointer" onClick={onAddButtonClick}>
          {addButtonIcon}
          {addButtonLabel}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6 text-center text-destructive">
            {typeof error === "string"
              ? error
              : "An error occurred. Please try again."}
          </CardContent>
        </Card>
      ) : (
        children
      )}
    </div>
  );
}