import { type ClassValue } from "clsx"
import { cn } from "./utils"

// =============================================================================
// DELL TECHNOLOGIES DESIGN SYSTEM - STANDARDIZED TAILWIND PATTERNS
// =============================================================================

/**
 * STANDARDIZED COLOR PATTERNS WITH PROFESSIONAL INTERACTIONS
 * Use these instead of hardcoded colors
 */
export const dellColors = {
  // Primary Dell Blue with enhanced interactions
  primary: {
    bg: "bg-dell-blue-500",
    text: "text-dell-blue-500",
    border: "border-dell-blue-500",
    hover: "hover:bg-dell-blue-50 hover:shadow-sm transition-all duration-200",
    selected: "bg-dell-blue-100 border-l-4 border-dell-blue-500 shadow-sm",
    gradient: "bg-gradient-to-r from-dell-blue-500 to-dell-blue-600",
  },
  // Secondary/Neutral with subtle interactions
  neutral: {
    bg: "bg-dell-gray-100",
    text: "text-dell-gray-600",
    border: "border-dell-gray-300",
    hover: "hover:bg-dell-gray-50 hover:shadow-sm transition-all duration-150",
  },
  // Interactive states with professional polish
  interactive: {
    hover: "hover:bg-dell-blue-50 hover:text-dell-blue-600 hover:shadow-md hover:scale-[1.02] transition-all duration-200",
    focus: "focus:ring-2 focus:ring-dell-blue-500 focus:ring-offset-2 focus:ring-opacity-50 focus:outline-none",
    active: "active:bg-dell-blue-600 active:text-white active:scale-[0.98] transition-all duration-100",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
  },
  // Professional shadow system
  shadows: {
    soft: "shadow-sm hover:shadow-md transition-shadow duration-200",
    medium: "shadow-md hover:shadow-lg transition-shadow duration-200",
    large: "shadow-lg hover:shadow-xl transition-shadow duration-200",
    glow: "hover:shadow-dell-blue-500/25 hover:shadow-lg transition-all duration-200",
  }
} as const

/**
 * PROFESSIONAL COMPONENT PATTERNS WITH ENHANCED INTERACTIONS
 * All components should use these patterns for consistent professional appearance
 */
export const dellComponents = {
  // Enhanced Cards with sophisticated hover effects
  card: {
    base: "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
    interactive: "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-dell-blue-200 transition-all duration-200 group",
    selected: "ring-2 ring-dell-blue-500 ring-offset-2 shadow-lg scale-[1.01]",
    premium: "bg-gradient-to-br from-white to-dell-blue-50 border-dell-blue-200 hover:shadow-xl",
  },
  
  // Professional Navigation with smooth animations
  navItem: {
    base: "flex items-center gap-1.5 rounded pl-0.5 pr-1 py-0.5 mr-3 transition-all duration-200 group relative",
    default: "!text-white hover:bg-white/10 hover:!text-white",
    active: "bg-white/20 !text-white before:absolute before:left-0 before:w-0.5 before:h-full before:bg-white before:rounded-r",
    indicator: "after:absolute after:right-1 after:w-0 after:h-0 after:transition-all after:duration-200 group-hover:after:w-0.5 group-hover:after:h-0.5 group-hover:after:bg-white group-hover:after:rounded-full",
  },
  
  // Enhanced Buttons with professional interactions
  button: {
    primary: "bg-dell-blue-500 hover:bg-dell-blue-600 hover:shadow-lg hover:scale-[1.02] text-white transition-all duration-200 active:scale-[0.98]",
    secondary: "bg-dell-gray-100 hover:bg-dell-gray-200 hover:shadow-md hover:scale-[1.02] text-dell-gray-900 transition-all duration-200",
    ghost: "hover:bg-dell-blue-50 hover:text-dell-blue-600 hover:shadow-sm hover:scale-[1.02] transition-all duration-200",
    gradient: "bg-gradient-to-r from-dell-blue-500 to-dell-blue-600 hover:from-dell-blue-600 hover:to-dell-blue-700 hover:shadow-lg hover:scale-[1.02] text-white transition-all duration-200",
  },
  
  // Professional Form elements with enhanced feedback
  input: {
    base: "border border-dell-gray-300 rounded-md px-3 py-2 transition-all duration-200 hover:border-dell-blue-300",
    focus: "focus:ring-2 focus:ring-dell-blue-500 focus:border-dell-blue-500 focus:ring-opacity-50 focus:outline-none focus:shadow-lg",
    error: "border-red-500 focus:ring-red-500 focus:ring-opacity-50 hover:border-red-400",
    success: "border-green-500 focus:ring-green-500 focus:ring-opacity-50 hover:border-green-400",
  },
  
  // Enhanced Layout with professional spacing
  layout: {
    container: "px-4 py-4 transition-all duration-200",
    section: "space-y-6 animate-in fade-in duration-300",
    pageHeader: "flex items-center justify-between mb-6 pb-4 border-b border-dell-gray-200",
    sidebar: "w-64 bg-dell-blue-500 text-white shadow-xl",
  },
  
  // Professional Status indicators with animations
  status: {
    dot: "w-2 h-2 rounded-full bg-dell-blue-500 animate-pulse",
    badge: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-dell-blue-100 text-dell-blue-800 hover:bg-dell-blue-200 transition-colors duration-200",
    progress: "h-2 bg-dell-gray-200 rounded-full overflow-hidden",
    progressBar: "h-full bg-gradient-to-r from-dell-blue-500 to-dell-blue-600 transition-all duration-500 ease-out",
  },
  
  // Loading states for professional feedback
  loading: {
    spinner: "animate-spin h-4 w-4 border-2 border-dell-blue-500 border-t-transparent rounded-full",
    skeleton: "animate-pulse bg-dell-gray-200 rounded",
    overlay: "absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center backdrop-blur-sm",
  },
  
  // Tooltips and feedback
  tooltip: {
    base: "absolute z-50 px-2 py-1 text-xs text-white bg-dell-gray-900 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200",
    arrow: "absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dell-gray-900",
  }
} as const

/**
 * COMPONENT BUILDERS - Use these to ensure consistency
 */

/**
 * Enhanced Dell card pattern with professional interactions
 */
export function dellCard(variant: 'static' | 'interactive' | 'selected' | 'premium' = 'static', className?: ClassValue) {
  return cn(
    dellComponents.card.base,
    variant === 'interactive' && dellComponents.card.interactive,
    variant === 'selected' && dellComponents.card.selected,
    variant === 'premium' && dellComponents.card.premium,
    className
  )
}

/**
 * Professional Dell navigation item with smooth animations
 */
export function dellNavItem(isActive: boolean = false, withIndicator: boolean = true, className?: ClassValue) {
  return cn(
    dellComponents.navItem.base,
    isActive ? dellComponents.navItem.active : dellComponents.navItem.default,
    withIndicator && dellComponents.navItem.indicator,
    className
  )
}

/**
 * Enhanced Dell button variants with professional interactions
 */
export function dellButton(variant: 'primary' | 'secondary' | 'ghost' | 'gradient' = 'primary', className?: ClassValue) {
  return cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dell-blue-500",
    dellComponents.button[variant],
    dellColors.interactive.disabled,
    className
  )
}

/**
 * Professional Dell input with enhanced focus states
 */
export function dellInput(state: 'default' | 'error' | 'success' = 'default', className?: ClassValue) {
  return cn(
    dellComponents.input.base,
    state === 'error' && dellComponents.input.error,
    state === 'success' && dellComponents.input.success,
    state === 'default' && dellComponents.input.focus,
    className
  )
}

/**
 * Enhanced folder item with professional hover effects
 */
export function dellFolderItem(isSelected: boolean, isDefault?: boolean, className?: ClassValue) {
  return cn(
    "flex items-center py-2 px-3 rounded-md cursor-pointer group relative",
    // Base text color for good contrast
    "text-gray-700",
    isSelected
      ? "bg-dell-blue-100 border-l-4 border-dell-blue-500 shadow-sm scale-[1.01] text-dell-blue-800"
      : "hover:bg-dell-blue-50 hover:shadow-sm hover:scale-[1.02] hover:text-dell-blue-700 transition-all duration-200",
    isDefault && "font-medium text-dell-blue-600",
    className
  )
}

/**
 * Professional loading spinner
 */
export function dellSpinner(size: 'sm' | 'md' | 'lg' = 'md', className?: ClassValue) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  }
  
  return cn(
    dellComponents.loading.spinner,
    sizeClasses[size],
    className
  )
}

/**
 * Professional status badge with hover effects
 */
export function dellBadge(variant: 'default' | 'success' | 'warning' | 'error' = 'default', className?: ClassValue) {
  const variants = {
    default: 'bg-dell-blue-100 text-dell-blue-800 hover:bg-dell-blue-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
  
  return cn(
    "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200",
    variants[variant],
    className
  )
}

/**
 * Professional tooltip component
 */
export function dellTooltip(position: 'top' | 'bottom' | 'left' | 'right' = 'top', className?: ClassValue) {
  const positions = {
    top: '-top-8 left-1/2 transform -translate-x-1/2',
    bottom: '-bottom-8 left-1/2 transform -translate-x-1/2',
    left: 'top-1/2 -left-20 transform -translate-y-1/2',
    right: 'top-1/2 -right-20 transform -translate-y-1/2'
  }
  
  return cn(
    dellComponents.tooltip.base,
    positions[position],
    className
  )
}

/**
 * LEGACY FUNCTIONS - For backward compatibility
 * TODO: Migrate all components to use dellComponents patterns
 */
export function cardHover(className?: ClassValue) {
  return dellCard('interactive', className)
}

export function folderItem(isSelected: boolean, isDefault?: boolean, className?: ClassValue) {
  return dellFolderItem(isSelected, isDefault, className)
}

export function containerPadding(className?: ClassValue) {
  return cn(dellComponents.layout.container, className)
}

export function pageLayout(className?: ClassValue) {
  return cn("-m-6 lg:-m-8", className)
}

export function sectionSpacing(className?: ClassValue) {
  return cn(dellComponents.layout.section, className)
}

/**
 * USAGE EXAMPLES:
 *
 * // Cards
 * <div className={dellCard('interactive', "mb-4")}>
 *
 * // Navigation
 * <nav className={dellNavItem(isActive)}>
 *
 * // Buttons
 * <button className={dellButton('primary')}>
 *
 * // Direct color usage
 * <div className={dellColors.primary.bg}>
 *
 * // Status indicators
 * <span className={dellComponents.status.dot} />
 */