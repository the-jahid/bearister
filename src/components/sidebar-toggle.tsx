"use client"

import { Menu, X } from "lucide-react"

interface SidebarToggleProps {
  isOpen: boolean
  onClick: () => void
}

export function SidebarToggle({ isOpen, onClick }: SidebarToggleProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-slate-300 transition-colors"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  )
}
