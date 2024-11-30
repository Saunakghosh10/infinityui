'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  sortable?: boolean;
  compact?: boolean;
  bordered?: boolean;
  onSort?: (column: string) => void;
}

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Table({
  striped,
  hoverable = true,
  sortable,
  compact,
  bordered,
  className,
  onSort,
  ...props
}: TableProps) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-zinc-800">
      <motion.table 
        initial="hidden"
        animate="show"
        variants={tableVariants}
        className={cn(
          "w-full border-collapse text-sm",
          compact ? "p-2" : "p-4",
          bordered && "border-zinc-800",
          className
        )} 
        {...props} 
      >
        <thead className="bg-zinc-900/50 text-zinc-400">
          <tr>
            {React.Children.map(props.children?.[0]?.props.children, (th, i) => (
              <motion.th
                variants={rowVariants}
                className={cn(
                  "px-4 py-3 text-left font-medium",
                  sortable && "cursor-pointer hover:text-zinc-100 transition-colors"
                )}
                onClick={() => sortable && onSort?.(th.props.children)}
              >
                <div className="flex items-center gap-2">
                  {th.props.children}
                  {sortable && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                </div>
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody>
          {React.Children.map(props.children?.[1]?.props.children, (tr, i) => (
            <motion.tr
              variants={rowVariants}
              className={cn(
                striped && i % 2 === 0 && "bg-zinc-900/30",
                hoverable && "hover:bg-zinc-800/50 transition-colors",
                bordered && "border-b border-zinc-800 last:border-0"
              )}
            >
              {React.Children.map(tr.props.children, (td) => (
                <motion.td className="px-4 py-3">
                  {td.props.children}
                </motion.td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
