'use client'

import React from 'react'

interface NavButtonProps {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

export function NavButton({ label, href, variant = 'primary' }: NavButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded transition duration-200'

  const variantClasses =
    variant === 'primary'
      ? 'bg-brand-solid text-white hover:bg-brand-solid_hover shadow-sm'
      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'

  return (
    <a href={href} className={`${baseClasses} ${variantClasses}`}>
      {label}
    </a>
  )
}
