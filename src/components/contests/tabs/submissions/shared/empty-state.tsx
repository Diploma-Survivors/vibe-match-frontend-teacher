interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="h-full flex items-center justify-center">
    <p className="text-slate-500">{message}</p>
  </div>
);
