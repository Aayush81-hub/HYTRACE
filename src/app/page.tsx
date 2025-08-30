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
    <div className="flex flex-col gap-8">
      <div className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border bg-card p-8 shadow-lg lg:grid-cols-2">
        <div className="absolute -right-40 -top-40 z-0 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 z-0 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl delay-500"></div>

        <div className="z-10 flex flex-col justify-center gap-4">
          <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
            The Future of Green Energy is Here.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Hytrace provides a transparent, immutable, and auditable platform for
            trading Green Hydrogen Credits (GHCs), empowering a sustainable
            future.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/buyer">Explore Marketplace</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/producer">Become a Producer</Link>
            </Button>
          </div>
        </div>
        <div className="relative z-10 hidden aspect-video h-full w-full items-center justify-center lg:flex">
          <Image
            src="https://picsum.photos/800/600"
            alt="Green energy infrastructure"
            width={800}
            height={600}
            className="rounded-lg object-cover shadow-2xl"
            data-ai-hint="green energy"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RoleCard
          icon={<Factory className="h-10 w-10 text-primary" />}
          title="Producer Hub"
          description="Mint, manage, and sell your Green Hydrogen Credits on our secure marketplace. Turn your green production into a valuable asset."
          href="/producer"
          cta="Mint a Credit"
        />
        <RoleCard
          icon={<ShoppingCart className="h-10 w-10 text-primary" />}
          title="GHC Marketplace"
          description="Purchase GHCs to meet your compliance goals and support the green energy transition. Browse a transparent and liquid market."
          href="/buyer"
          cta="Buy Credits"
        />
        <RoleCard
          icon={<Gavel className="h-10 w-10 text-primary" />}
          title="Regulatory Auditing"
          description="Access a permissioned, real-time ledger of all market activity. Monitor transactions and ensure compliance with unparalleled efficiency."
          href="/regulator"
          cta="View Ledger"
        />
      </div>
    </div>
  )
}

function RoleCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  cta: string
}) {
  return (
    <Card className="flex h-full transform-gpu flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <CardDescription className="text-base">{description}</CardDescription>
        <Button variant="link" className="mt-4 p-0" asChild>
          <Link href={href} className="justify-start text-accent">
            {cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
