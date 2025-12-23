'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ArrowUpDown, ArrowDown, ArrowUp, RotateCcw, Tag as TagIcon, Layers } from 'lucide-react';
import { TagsTable } from '@/components/tags-topics/tags-table';
import { CreateTagDialog } from '@/components/tags-topics/create-tag-dialog';
import { EditTagDialog } from '@/components/tags-topics/edit-tag-dialog';
import { EditTopicDialog } from '@/components/tags-topics/edit-topic-dialog';
import { CreateTopicDialog } from '@/components/tags-topics/create-topic-dialog';
import { Tag, TagSortBy } from '@/types/tags';
import { TagsService } from '@/services/tags-service';
import { toastService } from '@/services/toasts-service';
import { useDialog } from '@/components/providers/dialog-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopicsTable } from '@/components/tags-topics/topics-table';
import { TopicsService } from '@/services/topics-service';
import { Topic, TopicSortBy } from '@/types/topics';
import useTags from '@/hooks/use-tags';
import useTopics from '@/hooks/use-topics';

export default function TagsPage() {
    // Tags Hook
    const {
        tags,
        totalCount: tagsCount,
        isLoading: tagsLoading,
        filters: tagFilters,
        keyword: tagKeyword,
        sortBy: tagSortBy,
        sortOrder: tagSortOrder,
        handleFiltersChange: handleTagFiltersChange,
        handleKeywordChange: handleTagKeywordChange,
        handleSortByChange: handleTagSortByChange,
        handleSortOrderChange: handleTagSortOrderChange,
        handleReset: handleResetTags,
        handlePageChange: setTagPage,
        refresh: handleTagRefresh,
        meta: tagMeta,
    } = useTags();

    // Topics Hook
    const {
        topics,
        totalCount: topicsCount,
        isLoading: topicsLoading,
        filters: topicFilters,
        keyword: topicKeyword,
        sortBy: topicSortBy,
        sortOrder: topicSortOrder,
        handleFiltersChange: handleTopicFiltersChange,
        handleKeywordChange: handleTopicKeywordChange,
        handleSortByChange: handleTopicSortByChange,
        handleSortOrderChange: handleTopicSortOrderChange,
        handleReset: handleResetTopics,
        handlePageChange: setTopicPage,
        refresh: handleTopicRefresh,
        meta: topicMeta,
    } = useTopics();

    // Edit State
    const [editTag, setEditTag] = useState<Tag | null>(null);
    const [isEditTagOpen, setIsEditTagOpen] = useState(false);
    const [editTopic, setEditTopic] = useState<Topic | null>(null);
    const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);

    const { confirm } = useDialog();

    const handleEditTag = (tag: Tag) => {
        setEditTag(tag);
        setIsEditTagOpen(true);
    };

    const handleDeleteTagClick = async (tag: Tag) => {
        const confirmed = await confirm({
            title: 'Are you sure?',
            message: (
                <span>
                    This action cannot be undone. This will permanently delete the tag
                    <span className="font-semibold text-foreground"> "{tag.name}" </span>
                    and remove it from all associated problems.
                </span>
            ),
            confirmText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
        });

        if (confirmed) {
            try {
                await TagsService.deleteTag(tag.id);
                toastService.success('Tag deleted successfully');
                handleTagRefresh();
            } catch (error) {
                console.error('Failed to delete tag:', error);
                toastService.error('Failed to delete tag');
            }
        }
    };

    // Placeholder handlers for Topics
    const handleEditTopic = (topic: Topic) => {
        setEditTopic(topic);
        setIsEditTopicOpen(true);
    };

    const handleDeleteTopicClick = async (topic: Topic) => {
        const confirmed = await confirm({
            title: 'Are you sure?',
            message: (
                <span>
                    This action cannot be undone. This will permanently delete the topic
                    <span className="font-semibold text-foreground"> "{topic.name}" </span>
                    and remove it from all associated problems.
                </span>
            ),
            confirmText: 'Delete',
            cancelText: 'Cancel',
            color: 'red',
        });

        if (confirmed) {
            // Mock delete for now as service doesn't have delete
            toastService.success('Topic deleted successfully (mock)');
            handleTopicRefresh();
        }
    };


    const handleTagStatusChange = async (tag: Tag) => {
        const newStatus = tag.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? 'activate' : 'deactivate';

        const confirmed = await confirm({
            title: `Confirm ${action}`,
            message: (
                <span>
                    Are you sure you want to {action} the tag
                    <span className="font-semibold text-foreground"> "{tag.name}"</span>?
                </span>
            ),
            confirmText: newStatus === 'active' ? 'Activate' : 'Deactivate',
            cancelText: 'Cancel',
            color: newStatus === 'active' ? 'green' : 'red',
        });

        if (confirmed) {
            try {
                await TagsService.updateTag(tag.id, { status: newStatus });
                toastService.success(`Tag ${action}d successfully`);
                handleTagRefresh();
            } catch (error) {
                console.error(`Failed to ${action} tag:`, error);
                toastService.error(`Failed to ${action} tag`);
            }
        }
    };

    const handleTopicStatusChange = async (topic: Topic) => {
        const newStatus = !topic.isActive;
        const action = newStatus ? 'activate' : 'deactivate';

        const confirmed = await confirm({
            title: `Confirm ${action}`,
            message: (
                <span>
                    Are you sure you want to {action} the topic
                    <span className="font-semibold text-foreground"> "{topic.name}"</span>?
                </span>
            ),
            confirmText: newStatus ? 'Activate' : 'Deactivate',
            cancelText: 'Cancel',
            color: newStatus ? 'green' : 'red',
        });

        if (confirmed) {
            try {
                await TopicsService.updateTopic(topic.id, { isActive: newStatus });
                toastService.success(`Topic ${action}d successfully`);
                handleTopicRefresh();
            } catch (error) {
                console.error(`Failed to ${action} topic:`, error);
                toastService.error(`Failed to ${action} topic`);
            }
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Tabs defaultValue="tags" className="w-full space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-2 h-auto">
                        <TabsTrigger
                            value="tags"
                            className="cursor-pointer data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:text-green-600 data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-all"
                        >
                            <TagIcon className="w-4 h-4 mr-2" />
                            <span>Tags List</span>
                            <span className="ml-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {tagsCount}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="topics"
                            className="cursor-pointer data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:text-green-600 data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-all"
                        >
                            <Layers className="w-4 h-4 mr-2" />
                            <span>Topics List</span>
                            <span className="ml-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {topicsCount}
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="tags" className="space-y-6">
                    {/* Filters and Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, slug..."
                                className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={tagKeyword}
                                onChange={(e) => handleTagKeywordChange(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <Select
                                value={tagFilters.status || 'all'}
                                onValueChange={(value: any) => handleTagFiltersChange({ ...tagFilters, status: value === 'all' ? undefined : value })}
                            >
                                <SelectTrigger className="w-full sm:w-[140px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                                    <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
                                    <SelectItem value="inactive" className="cursor-pointer">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <div>Sort by:</div>
                                <Select
                                    value={tagSortBy}
                                    onValueChange={(value) => handleTagSortByChange(value as TagSortBy)}
                                >
                                    <SelectTrigger className="w-[180px] h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={TagSortBy.ID} className="cursor-pointer">ID</SelectItem>
                                        <SelectItem value={TagSortBy.POST_COUNT} className="cursor-pointer">Post Count</SelectItem>
                                        <SelectItem value={TagSortBy.CREATED_AT} className="cursor-pointer">Created At</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        handleTagSortOrderChange(
                                            tagSortOrder === 'asc' ? 'desc' : 'asc'
                                        )
                                    }
                                    className="h-10 w-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                                >
                                    {tagSortOrder === 'asc' ? (
                                        <ArrowDown className="h-4 w-4" />
                                    ) : (
                                        <ArrowUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleResetTags}
                                className="h-10 w-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                                title="Reset Filters"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <CreateTagDialog onSuccess={handleTagRefresh} />
                        </div>
                    </div>

                    <TagsTable
                        tags={tags}
                        loading={tagsLoading}
                        page={tagMeta?.page || 1}
                        totalPages={tagMeta?.totalPages || 1}
                        onPageChange={setTagPage}
                        onEdit={handleEditTag}
                        onDelete={handleDeleteTagClick}
                        onStatusChange={handleTagStatusChange}
                    />
                </TabsContent>

                <TabsContent value="topics" className="space-y-6">
                    {/* Filters and Controls for Topics */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, slug..."
                                className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={topicKeyword}
                                onChange={(e) => handleTopicKeywordChange(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <Select
                                value={topicFilters.isActive === undefined ? 'all' : topicFilters.isActive ? 'active' : 'inactive'}
                                onValueChange={(value: any) => handleTopicFiltersChange({ ...topicFilters, isActive: value === 'all' ? undefined : value === 'active' })}
                            >
                                <SelectTrigger className="w-full sm:w-[140px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                                    <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
                                    <SelectItem value="inactive" className="cursor-pointer">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <div>Sort by:</div>
                                <Select
                                    value={topicSortBy}
                                    onValueChange={(value) => handleTopicSortByChange(value as TopicSortBy)}
                                >
                                    <SelectTrigger className="w-[180px] h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={TopicSortBy.ID} className="cursor-pointer">ID</SelectItem>
                                        <SelectItem value={TopicSortBy.POST_COUNT} className="cursor-pointer">Post Count</SelectItem>
                                        <SelectItem value={TopicSortBy.CREATED_AT} className="cursor-pointer">Created At</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        handleTopicSortOrderChange(
                                            topicSortOrder === 'asc' ? 'desc' : 'asc'
                                        )
                                    }
                                    className="h-10 w-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                                >
                                    {topicSortOrder === 'asc' ? (
                                        <ArrowDown className="h-4 w-4" />
                                    ) : (
                                        <ArrowUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleResetTopics}
                            className="h-10 w-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                            title="Reset Filters"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                        <CreateTopicDialog onSuccess={handleTopicRefresh} />
                    </div>

                    <TopicsTable
                        topics={topics}
                        loading={topicsLoading}
                        page={topicMeta?.page || 1}
                        totalPages={topicMeta?.totalPages || 1}
                        onPageChange={setTopicPage}
                        onEdit={handleEditTopic}
                        onDelete={handleDeleteTopicClick}
                        onStatusChange={handleTopicStatusChange}
                    />
                </TabsContent>
            </Tabs>

            {/* Edit Dialogs */}
            <EditTagDialog
                tag={editTag}
                open={isEditTagOpen}
                onOpenChange={setIsEditTagOpen}
                onSuccess={handleTagRefresh}
            />
            <EditTopicDialog
                topic={editTopic}
                open={isEditTopicOpen}
                onOpenChange={setIsEditTopicOpen}
                onSuccess={handleTopicRefresh}
            />
        </div>
    );
}
