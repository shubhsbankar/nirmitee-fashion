'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const HoverMenu = ({ label, href, setCategory, items = [] }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const isMobile = () =>
    typeof window !== 'undefined' && window.innerWidth < 1024

  // keep category state in sync
  useEffect(() => {
    setCategory(open ? label : '')
  }, [open, label, setCategory])

  // close on outside click (mobile UX)
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => !isMobile() && setOpen(true)}
      onMouseLeave={() => !isMobile() && setOpen(false)}
    >
      {/* Trigger */}
      <Link
        href={href}
        className="block py-2 text-gray-600 hover:text-primary hover:font-semibold"
        onClick={(e) => {
          if (isMobile()) {
            // 🔥 THIS LINE IS THE FIX
            e.preventDefault()
            setOpen(prev => !prev)
          }
        }}
      >
        {label}
      </Link>

      {/* Dropdown */}
      <div
        className={`
          absolute left-0 top-full mt-2 w-56 z-50
          bg-white border rounded-lg shadow-lg
          transition-all duration-200
          ${open ? 'opacity-100 visible translate-y-0'
                 : 'opacity-0 invisible -translate-y-2'}
        `}
      >
        <ul className="py-2">
          {items.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HoverMenu
