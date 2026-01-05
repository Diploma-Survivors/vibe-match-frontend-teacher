import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Trash2 } from 'lucide-react';
import { Problem, DIFFICULTY_COLORS } from '@/types/problems';
import { Input } from '@/components/ui/input';

interface SortableRowProps {
    problem: Problem;
    score: number;
    onRemove: (id: number) => void;
    onScoreChange: (id: number, score: number) => void;
}

export function SortableRow({ problem, score, onRemove, onScoreChange }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: problem.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-[50px]">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="cursor-move"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4 text-slate-400" />
                </Button>
            </TableCell>
            <TableCell className="font-medium">
                {problem.title}
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className={`${DIFFICULTY_COLORS.get(problem.difficulty)
                        } border-0`}
                >
                    {problem.difficulty}
                </Badge>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    min="0"
                    value={score}
                    onChange={(e) => onScoreChange(problem.id, Number(e.target.value))}
                    className="w-20"
                />
            </TableCell>
            <TableCell>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onRemove(problem.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
