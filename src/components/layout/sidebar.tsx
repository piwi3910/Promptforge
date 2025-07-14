"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Tag,
  Zap,
  Users,
  Tags,
  ChevronRight,
} from "lucide-react"
import { dellNavItem } from "@/lib/styles"

const navigationItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    description: "Overview and analytics"
  },
  {
    href: "/prompts",
    icon: FileText,
    label: "My Prompts",
    description: "Manage your prompts"
  },
  {
    href: "/shared-prompts",
    icon: Users,
    label: "Shared Prompts",
    description: "Collaborative workspace"
  },
  {
    href: "/tags",
    icon: Tag,
    label: "Tags",
    description: "Organize by categories"
  },
  {
    href: "/group-by-tags",
    icon: Tags,
    label: "Group by Tags",
    description: "Tag-based view"
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-800 shadow-xl md:block overflow-hidden" style={{ width: 'calc(16rem + 10px)' }}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Enhanced Header with gradient and glow effect */}
        <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6 bg-gradient-to-r from-gray-800 to-gray-900 relative">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-white group transition-colors duration-200"
          >
            <div className="p-1 rounded-md bg-white/10 group-hover:bg-white/20 transition-colors duration-200">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-white tracking-wide">PromptForge</span>
          </Link>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
        
        {/* Enhanced Navigation */}
        <div className="flex-1 py-4 overflow-hidden">
          <nav className="grid items-start px-3 text-sm font-medium space-y-1 overflow-hidden">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${dellNavItem(isActive, true)} !text-white`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`
                      p-1.5 rounded-md transition-all duration-200
                      ${isActive
                        ? 'bg-white/20 shadow-sm'
                        : 'bg-white/10 group-hover:bg-white/15'
                      }
                    `}>
                      <Icon className="h-4 w-4 flex-shrink-0 !text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate !text-white" style={{ color: '#ffffff', fontWeight: 'bold' }}>{item.label}</div>
                      <div className={`
                        text-xs opacity-70 truncate transition-opacity duration-200 !text-white
                        ${isActive ? 'opacity-90' : 'group-hover:opacity-80'}
                      `} style={{ color: '#ffffff', opacity: '0.9' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active indicator with smooth animation */}
                  <ChevronRight className={`
                    h-3 w-3 flex-shrink-0 transition-all duration-200 !text-white
                    ${isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                    }
                  `} />
                </Link>
              )
            })}
          </nav>
          
          {/* Professional divider with subtle animation */}
          <div className="mx-6 my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Status indicator */}
          <div className="px-6">
            <div className="flex items-center gap-2 text-dell-blue-100 text-xs">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50" />
              <span className="opacity-75">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}