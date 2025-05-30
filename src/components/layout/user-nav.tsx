'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, UserCircle, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter } from 'next/navigation';


export default function UserNav() {
  const { preferences, resetPreferences } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleLogout = () => {
    resetPreferences();
    router.push('/welcome'); // Or your login page
  };

  return (
    <DropdownMenu dir={preferences.language === 'fa' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            {/* For a real app, user.avatarUrl would be used */}
            {/* <AvatarImage src={user.avatarUrl} alt={preferences.name || "User"} /> */}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(preferences.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {preferences.name || "کاربر"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {t('currency')}: {preferences.currency}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings" passHref>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('appSettings')}</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
