import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MarkdownEditor from '@/components/markdown-editor/markdown-editor';
import { cn } from '@/lib/utils';
import { ContestFormValues } from './schema';

interface GeneralInfoSectionProps {
    register: UseFormRegister<ContestFormValues>;
    control: Control<ContestFormValues>;
    errors: FieldErrors<ContestFormValues>;
}

export function GeneralInfoSection({ register, control, errors }: GeneralInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Contest Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter contest name"
                        {...register('name')}
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <div className="h-[400px]">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MarkdownEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                    className={cn(
                                        'h-full',
                                        errors.description && 'border-red-500'
                                    )}
                                />
                            )}
                        />
                    </div>
                    {errors.description && (
                        <p className="text-sm text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            type="datetime-local"
                            {...register('startTime')}
                            className={errors.startTime ? 'border-red-500' : ''}
                        />
                        {errors.startTime && (
                            <p className="text-sm text-red-500">
                                {errors.startTime.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                        <Input
                            id="durationMinutes"
                            type="number"
                            min="1"
                            {...register('durationMinutes')}
                            className={errors.durationMinutes ? 'border-red-500' : ''}
                        />
                        {errors.durationMinutes && (
                            <p className="text-sm text-red-500">
                                {errors.durationMinutes.message}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
