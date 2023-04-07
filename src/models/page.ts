export interface Meta {
  title?: string
  author?: string
  slug?: string
  ext?: string
  tags?: string[]
  createdAt?: string
}

export interface PageProps {
  meta?: Meta
}
