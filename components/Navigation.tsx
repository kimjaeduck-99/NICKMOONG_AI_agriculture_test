import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Heart,
  Menu,
  X,
  User,
  Home,
  TrendingUp,
  Stethoscope,
  Info,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface NavigationProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  notifications: number;
  onClearNotifications: () => void;
}

const navItems = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'prices', label: '시세 정보', icon: TrendingUp },
  { id: 'diagnosis', label: 'AI 진단', icon: Stethoscope },
  { id: 'map', label: '병충해 지도', icon: MapPin },
  { id: 'info', label: '농업 정보', icon: Info },
];

export function Navigation({ 
  isDarkMode, 
  onToggleDarkMode, 
  searchValue, 
  onSearchChange,
  notifications,
  onClearNotifications
}: NavigationProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌾</span>
              </div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
                농업 AI
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === item.id
                        ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="농산물, 병해충, 재배법 검색..."
                className={`pl-10 transition-all duration-200 ${
                  isSearchFocused ? 'ring-2 ring-green-500' : ''
                }`}
              />
              <AnimatePresence>
                {searchValue && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 text-xs flex items-center justify-center"
                    >
                      {notifications > 99 ? '99+' : notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>알림</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications > 0 ? (
                  <>
                    <DropdownMenuItem>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">🌡️ 날씨 알림</p>
                        <p className="text-sm text-gray-600">내일 비 예보가 있습니다. 병해 주의하세요.</p>
                        <p className="text-xs text-gray-400">2분 전</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">📈 시세 알림</p>
                        <p className="text-sm text-gray-600">고추 가격이 5% 상승했습니다.</p>
                        <p className="text-xs text-gray-400">1시간 전</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onClearNotifications}>
                      <span className="text-sm text-blue-600">모든 알림 지우기</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-gray-500">새로운 알림이 없습니다</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites */}
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="sm" onClick={onToggleDarkMode}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>설정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  프로필 설정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  알림 설정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  일반 설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-6">
                  <h2 className="font-semibold text-lg">메뉴</h2>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}