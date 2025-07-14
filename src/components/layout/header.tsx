"use client";

import Link from "next/link"
import {
  FileText,
  Home,
  Menu,
  Search,
  Tag,
  Zap,
  Plus,
  Command,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AuthUserButton } from "../auth/user-button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { dellButton } from "@/lib/styles"

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/prompts/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 shadow-sm sticky top-0 z-40">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden hover:scale-[1.02] transition-transform duration-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-white shadow-2xl">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-dell-blue-600 hover:text-dell-blue-700 transition-colors duration-200"
            >
              <div className="p-1 rounded-md bg-dell-blue-100">
                <Zap className="h-5 w-5" />
              </div>
              <span>PromptForge</span>
            </Link>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-dell-gray-300 to-transparent" />
            
            <Link
              href="/dashboard"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-dell-gray-600 hover:text-dell-blue-600 hover:bg-dell-blue-50 transition-all duration-200"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/prompts"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-dell-gray-600 hover:text-dell-blue-600 hover:bg-dell-blue-50 transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
              Prompts
            </Link>
            <Link
              href="/tags"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-dell-gray-600 hover:text-dell-blue-600 hover:bg-dell-blue-50 transition-all duration-200"
            >
              <Tag className="h-5 w-5" />
              Tags
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Enhanced search with professional styling */}
      <div className="w-full flex-1 max-w-2xl">
        <form onSubmit={handleSearch}>
          <div className="relative group">
            <Search className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200
              ${isSearchFocused ? 'text-dell-blue-500' : 'text-dell-gray-400'}
            `} />
            <Input
              id="global-search"
              type="search"
              placeholder="Search prompts..."
              className={`
                w-full pl-10 pr-20 py-2.5 bg-dell-gray-50 border-dell-gray-200 rounded-lg
                transition-all duration-200 hover:bg-white hover:border-dell-blue-300
                focus:bg-white focus:border-dell-blue-500 focus:ring-2 focus:ring-dell-blue-200
                md:w-2/3 lg:w-full
              `}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            
            {/* Keyboard shortcut indicator */}
            <div className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1
              transition-opacity duration-200
              ${isSearchFocused || search ? 'opacity-0' : 'opacity-60'}
            `}>
              <Command className="h-3 w-3" />
              <span className="text-xs font-medium">K</span>
            </div>
            
            {/* Search button when typing */}
            {search && (
              <Button
                type="submit"
                size="sm"
                className={`
                  absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3
                  ${dellButton('primary')} opacity-0 animate-in slide-in-from-right-2 duration-200
                  ${search ? 'opacity-100' : 'opacity-0'}
                `}
              >
                Search
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push('/prompts/new')}
          className={dellButton('gradient') + " hidden sm:flex items-center gap-2"}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden lg:inline">New Prompt</span>
        </Button>
        
        {/* Mobile create button */}
        <Button
          onClick={() => router.push('/prompts/new')}
          size="icon"
          className={dellButton('primary') + " sm:hidden"}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <AuthUserButton />
      </div>
    </header>
  )
}