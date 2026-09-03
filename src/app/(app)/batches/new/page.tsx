import { NewBatchFlow } from "@/components/batch/new-batch-flow";
import { TopBar } from "@/components/ui/top-bar";

export const metadata = { title: "New batch · Aviro" };

export default function NewBatchPage() {
  return (
    <div>
      <TopBar title="New batch" backHref="/batches" />
      <NewBatchFlow />
    </div>
  );
}
