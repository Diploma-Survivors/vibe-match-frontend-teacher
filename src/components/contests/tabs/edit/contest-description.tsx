import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ContestDescriptionProps {
  name: string;
  description: string;
  onEditClick: () => void;
}

export default function ContestDescription({
  name,
  description,
  onEditClick,
}: ContestDescriptionProps) {
  return (
    <div className="bg-white border border-gray-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
        <Button
          onClick={onEditClick}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
