'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Settings,
  LineChart,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function MainNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/income', label: t('incomeManagement'), icon: TrendingUp },
    { href: '/expenses', label: t('expenseManagement'), icon: TrendingDown },
    // { href: '/reports', label: t('financialReports'), icon: LineChart }, // Reports page may be merged with dashboard or added later
    { href: '/settings', label: t('appSettings'), icon: Settings },
  ];

  return (
    <SidebarMenu>
      {menuItems.map(item => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
              tooltip={{ children: item.label, className: "capitalize" }}
              aria-label={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
