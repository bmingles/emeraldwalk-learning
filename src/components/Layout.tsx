import Head from 'next/head'
import Link from 'next/link'

import React from 'react'
import { PageProps } from '../models/page'
import { metaList } from '../models/metaList'
import styles from './Layout.module.css'
import cl from 'classnames'
import Menu from './Menu'

export interface LayoutProps extends PageProps {}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  meta,
}) => {
  const pageLinks = React.useMemo(
    () =>
      metaList
        ?.filter((m) => m.slug)
        .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '')),
    [],
  )

  return (
    <>
      <Head>
        <title>{`${meta?.title} | Emeraldwalk Learning`}</title>
      </Head>
      <div className={cl(styles.container, styles.areaGrid)}>
        <header className={cl(styles.itemHeader, styles.content)}>
          <Menu className={styles.menu} metaList={metaList} />
          <Link href="/">🏡 Emeraldwalk Learning</Link>
        </header>
        <main className={cl(styles.itemMain, styles.content)}>
          <h1>{meta?.title}</h1>
          {children}
        </main>
        <aside className={styles.itemRight}>
          {pageLinks?.map(({ slug, title }) => (
            <Link key={slug} href={`/${slug}`}>
              {title}
            </Link>
          ))}
        </aside>
        <footer className={cl(styles.itemFooter, styles.content)}>
          &copy; 2023 emeraldwalk
        </footer>
      </div>
    </>
  )
}

export default Layout
