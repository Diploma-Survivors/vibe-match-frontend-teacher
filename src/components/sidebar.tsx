'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Bot,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Code,
  FileCode,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorPlay,
  Plus,
  PlusCircle,
  Settings,
  Sparkles,
  Tag,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SideBarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SideBarProps) {
  const { isOpen, setIsOpen, toggle, isMobile } = useSidebar();
  const pathname = usePathname();

  const { user } = useApp();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
    },
    {
      title: 'PROBLEM MANAGEMENT',
      items: [
        { name: 'Problem List', href: '/problems', icon: FileCode },
        {
          name: 'Create New Problem',
          href: '/problems/create',
          icon: PlusCircle,
        },
        { name: 'Manage Tags/Topics', href: '/tags', icon: Tag },
        { name: 'Manage Submissions', href: '/submissions', icon: CheckSquare },
      ],
    },
    {
      title: 'CONTEST MANAGEMENT',
      items: [
        { name: 'Contest List', href: '/contests', icon: Trophy },
        { name: 'Create New Contest', href: '/contests/create', icon: Plus },
        { name: 'Live Dashboard', href: '/contests/live', icon: MonitorPlay },
        {
          name: 'Manage Submissions',
          href: '/contests/submissions',
          icon: CheckSquare,
        },
      ],
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { name: 'User List', href: '/users', icon: Users },
        { name: 'Feedback & Reports', href: '/reports', icon: Flag },
      ],
    },
    {
      title: 'SYSTEM & AI',
      items: [
        { name: 'Manage AI Prompts', href: '/ai-prompts', icon: Sparkles },
        { name: 'General Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' },
    mobileOpen: { width: '240px', x: 0 },
    mobileClosed: { width: '240px', x: '-100%' },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.aside
        initial={isMobile ? 'mobileClosed' : 'expanded'}
        animate={
          isMobile
            ? isOpen
              ? 'mobileOpen'
              : 'mobileClosed'
            : isOpen
              ? 'expanded'
              : 'collapsed'
        }
        variants={sidebarVariants}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
        className={cn(
          'fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-xl',
          isMobile ? 'w-64' : ''
        )}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0 justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 min-w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              {/* Placeholder logo icon if image fails or for design consistency */}
              <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
            </div>
            <motion.span
              animate={{
                opacity: isOpen ? 1 : 0,
                display: isOpen ? 'block' : 'none',
              }}
              className="text-xl font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap"
            >
              SolVibe
            </motion.span>
          </Link>

          {/* Desktop Collapse Toggle */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-600"
              onClick={toggle}
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {navSections.map((section, index) => (
            <div key={index}>
              {/* Section Header */}
              <motion.div
                animate={{
                  opacity: isOpen ? 1 : 0,
                  display: isOpen ? 'block' : 'none',
                }}
                className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap"
              >
                {section.title}
              </motion.div>

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group',
                        isActive
                          ? 'bg-emerald-50 text-green-600 dark:bg-emerald-900/20 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5 min-w-5',
                          isActive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-500'
                        )}
                      />
                      <motion.span
                        animate={{
                          opacity: isOpen ? 1 : 0,
                          display: isOpen ? 'block' : 'none',
                        }}
                        className="whitespace-nowrap text-sm"
                      >
                        {item.name}
                      </motion.span>

                      {/* Tooltip for collapsed state */}
                      {!isOpen && !isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div
            className={cn(
              'flex items-center gap-3',
              !isOpen && !isMobile ? 'justify-center' : ''
            )}
          >
            <div className="w-10 h-10 min-w-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
              {user?.fullName?.[0] || user?.username?.[0] || 'U'}
            </div>

            <motion.div
              animate={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? 'auto' : 0,
                display: isOpen ? 'block' : 'none',
              }}
              className="flex-1 overflow-hidden"
            >
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.fullName || user?.username || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email || 'No email'}
              </p>
            </motion.div>
          </div>

          <motion.div
            animate={{
              opacity: isOpen ? 1 : 0,
              height: isOpen ? 'auto' : 0,
              marginTop: isOpen ? 12 : 0,
              display: isOpen ? 'block' : 'none',
            }}
          >
            <Button
              variant="outline"
              className="w-full justify-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
              onClick={onLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
