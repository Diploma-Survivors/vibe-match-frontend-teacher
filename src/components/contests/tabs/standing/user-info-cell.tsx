import { TableCell } from '@/components/ui/table';
import type { RankingNode } from '@/types/contest';

interface UserInfoCellProps {
  node: RankingNode;
}

export function UserInfoCell({ node }: UserInfoCellProps) {
  return (
    <>
      <TableCell className="text-center sticky left-0 bg-inherit z-10 border-r border-gray-300 py-3">
        <span className="text-gray-800 font-semibold text-sm">{node.rank}</span>
      </TableCell>
      <TableCell className="border-r border-gray-300 py-3 pl-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-base text-gray-800 font-bold">
            {node.user.email.split('@')[0]}
          </span>
          <span className="text-xs text-gray-600">
            {node.user.firstName} {node.user.lastName}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center border-r border-gray-300 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-gray-900 text-sm">
            {node.totalScore}
          </span>
          <span className="text-xs text-gray-600 font-mono">
            {node.totalTime}
          </span>
        </div>
      </TableCell>
    </>
  );
}
