import Link from "next/link"
import {
  Home,
  FileText,
  Tag,
  Zap,
} from "lucide-react"

export function Sidebar() {
  return (
    <div className="hidden border-r bg-orange-500 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-orange-600 px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
            <Zap className="h-6 w-6 text-white" />
            <span className="text-white">PromptForge</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-orange-100 transition-all hover:text-white hover:bg-orange-600"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/prompts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-orange-100 transition-all hover:text-white hover:bg-orange-600"
            >
              <FileText className="h-4 w-4" />
              Prompts
            </Link>
            <Link
              href="/tags"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-orange-100 transition-all hover:text-white hover:bg-orange-600"
            >
              <Tag className="h-4 w-4" />
              Tags
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}