import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-130px)] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
