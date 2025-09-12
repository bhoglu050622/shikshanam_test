import { GraphyPackageDetail } from '@/components/packages/GraphyPackageDetail'
import { dummyPackages } from '@/lib/fixtures/packages-data'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    sku: string
  }
}

export default function GraphyPackagePage({ params }: PageProps) {
  const packageData = dummyPackages.find(pkg => pkg.sku === params.sku)

  if (!packageData) {
    notFound()
  }

  return (
    <GraphyPackageDetail 
      package={packageData}
      onBuy={(sku) => {
        console.log('Buy package:', sku)
        // Handle purchase logic
      }}
      onClaimSeat={(sessionId) => {
        console.log('Claim seat for session:', sessionId)
        // Handle seat claiming logic
      }}
    />
  )
}
