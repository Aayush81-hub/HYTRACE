import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Factory, Gavel, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <div className="z-10 flex max-w-4xl flex-col justify-center gap-6">
        <h1 className="font-headline text-5xl font-black md:text-6xl lg:text-7xl">
          The Future of <span className="highlight-yellow">Green Energy</span> is Here.
        </h1>
        <div className="mx-auto max-w-2xl bg-secondary-accent p-4">
            <p className="text-lg text-black md:text-xl">
                Hytrace provides a transparent, immutable, and auditable platform for
                trading Green Hydrogen Credits (GHCs), empowering a sustainable
                future.
            </p>
        </div>
      </div>
      <div className="flex gap-4">
            <Button size="lg" asChild className="btn-sharp text-lg">
              <Link href="/producer">Become a Producer</Link>
            </Button>
            <Button size="lg" asChild className="btn-sharp text-lg" variant="secondary">
              <Link href="/buyer">Explore Marketplace</Link>
            </Button>
            <Button size="lg" asChild className="btn-sharp text-lg" variant="secondary">
                <Link href="/portfolio">My Portfolio</Link>
            </Button>
        </div>
    </div>
  )
}
