import { Metadata } from 'next'
import { ActualiteDetailContent } from './actualite-detail-content'

export const metadata: Metadata = {
  title: 'Actualité - Voisilab UVCI',
  description: 'Détail de l\'actualité',
}

export default async function ActualiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ActualiteDetailContent slug={slug} />
}
