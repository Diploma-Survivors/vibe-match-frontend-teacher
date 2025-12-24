'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { LanguageStat } from '@/types/problem-statistics';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface LanguageTableProps {
    languages: LanguageStat[];
}

export function LanguageTable({ languages }: LanguageTableProps) {
    const [search, setSearch] = useState('');

    const filteredLanguages = languages.filter((lang) =>
        lang.language.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-medium">Language Statistics</CardTitle>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search language..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Language</TableHead>
                            <TableHead className="text-right">Submissions</TableHead>
                            <TableHead className="w-[200px]">AC Rate</TableHead>
                            <TableHead className="text-right">Avg Runtime</TableHead>
                            <TableHead className="text-right">Avg Memory</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLanguages.map((lang) => (
                            <TableRow key={lang.language}>
                                <TableCell className="font-bold">{lang.language}</TableCell>
                                <TableCell className="text-right">{lang.submissions.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Progress value={lang.acceptanceRate} className="h-2" />
                                        <span className="text-xs text-muted-foreground w-12 text-right">
                                            {lang.acceptanceRate.toFixed(1)}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{lang.averageRuntime.toFixed(0)} ms</TableCell>
                                <TableCell className="text-right">{lang.averageMemory.toFixed(1)} MB</TableCell>
                            </TableRow>
                        ))}
                        {filteredLanguages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No languages found matching "{search}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-xs text-muted-foreground">
                        Showing {filteredLanguages.length} languages
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
