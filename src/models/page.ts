export interface Meta {
  title?: string
  date?: string
  author?: string
  slug?: string
  ext?: string
  tags?: string[]
}

export interface PageProps {
  meta?: Meta
}
