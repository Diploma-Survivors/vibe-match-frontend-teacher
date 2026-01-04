import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { SelectProblemsModal } from '@/components/related-problems-modal';
import { Problem } from '@/types/problems';
import { FieldErrors } from 'react-hook-form';
import { ContestFormValues } from './schema';
import { SortableRow } from './sortable-row';

interface ProblemSelectionSectionProps {
    selectedProblems: Problem[];
    onProblemsChange: (problems: Problem[]) => void;
    errors: FieldErrors<ContestFormValues>;
}

export function ProblemSelectionSection({
    selectedProblems,
    onProblemsChange,
    errors,
}: ProblemSelectionSectionProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleProblemsSelect = (problems: Problem[]) => {
        const newProblems = [...selectedProblems];
        problems.forEach((p) => {
            if (!newProblems.find((existing) => existing.id === p.id)) {
                newProblems.push(p);
            }
        });
        onProblemsChange(newProblems);
    };

    const handleRemoveProblem = (problemId: number) => {
        const newProblems = selectedProblems.filter((p) => p.id !== problemId);
        onProblemsChange(newProblems);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = selectedProblems.findIndex((p) => p.id === active.id);
            const newIndex = selectedProblems.findIndex((p) => p.id === over.id);

            const newProblems = arrayMove(selectedProblems, oldIndex, newIndex);
            onProblemsChange(newProblems);
        }
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Select Problems</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <SelectProblemsModal
                    title="Select Problems"
                    selectedProblemIds={selectedProblems.map((p) => p.id)}
                    onProblemsSelect={handleProblemsSelect}
                />

                <div className="rounded-md border overflow-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Problem</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={selectedProblems.map((p) => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {selectedProblems.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center text-slate-500"
                                            >
                                                No problems selected.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        selectedProblems.map((problem) => (
                                            <SortableRow
                                                key={problem.id}
                                                problem={problem}
                                                onRemove={handleRemoveProblem}
                                            />
                                        ))
                                    )}
                                </SortableContext>
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                {errors.problems && (
                    <p className="text-sm text-red-500">
                        {errors.problems.message}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
