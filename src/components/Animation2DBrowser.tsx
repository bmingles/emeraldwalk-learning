import dynamic from 'next/dynamic'

export default dynamic(() => import('@/components/Animation2D'), {
  ssr: false,
})
