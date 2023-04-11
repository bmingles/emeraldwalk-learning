import React from 'react'
import cl from 'classnames'
import { Meta } from '../models/page'
import styles from './Menu.module.scss'
import Link from 'next/link'

export interface MenuProps {
  className?: string
  metaList: Meta[]
}

const Menu: React.FC<MenuProps> = ({ className, metaList }) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const firstItemRef = React.useRef<HTMLAnchorElement>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const onToggleClick = React.useCallback(() => {
    buttonRef.current?.focus()
    setIsExpanded((isExpanded) => !isExpanded)
  }, [])

  const onToggleKey = React.useCallback(
    (
      event: React.KeyboardEvent<HTMLButtonElement> & { target: HTMLElement },
    ) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          firstItemRef.current?.focus()
      }
    },
    [],
  )

  const onItemKey = React.useCallback(
    (
      event: React.KeyboardEvent<HTMLAnchorElement> & { target: HTMLElement },
    ) => {
      switch (event.key) {
        case 'Escape':
          buttonRef.current?.focus()
          onToggleClick()
          break

        case 'ArrowUp':
        case 'ArrowLeft': {
          const next = event.target.previousElementSibling
          if (next instanceof HTMLElement) {
            next.focus()
          } else {
            buttonRef.current?.focus()
          }
          break
        }

        case 'ArrowDown':
        case 'ArrowRight': {
          const next = event.target.nextElementSibling
          if (next instanceof HTMLElement) {
            next.focus()
          }
          break
        }
      }
    },
    [onToggleClick],
  )

  const pageLinks = React.useMemo(
    () =>
      metaList
        ?.filter((m) => m.slug)
        .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
    [metaList],
  )

  return (
    <nav
      className={cl(styles.component, className)}
      role="navigation"
      aria-label="Main Menu">
      <button
        ref={buttonRef}
        className={styles.button}
        aria-expanded={isExpanded}
        onClick={onToggleClick}
        onKeyDown={onToggleKey}>
        ☰
        {/* <svg
          viewBox="1 1 9 9"
          className={styles.svg}
          aria-hidden
          focusable={false}>
          {[3, 5, 7].map((i) => (
            <rect key={i} x={2} y={i} width={5} height={1} rx={0.5} />
          ))}
        </svg> */}
        {/* <label className={styles.label}>Menu</label> */}
      </button>
      {
        <div
          className={cl(
            styles.items,
            isExpanded ? styles['is-expanded'] : styles['is-collapsed'],
          )}
          onClick={onToggleClick}>
          {pageLinks?.map(({ slug, title }, i) => (
            <Link
              ref={i === 0 ? firstItemRef : undefined}
              key={slug}
              href={`/${slug}`}
              onKeyDown={onItemKey}>
              {title}
            </Link>
          ))}
        </div>
      }
    </nav>
  )
}

export default Menu
