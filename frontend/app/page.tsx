import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const sampleProducts = [
  {
    id: "1",
    name: "Custom 9mm Carbine",
    price: 1899,
    category: "Carbines",
    tag: "New",
  },
  {
    id: "2",
    name: "Tactical AR-15 Platform",
    price: 1499,
    category: "Rifles",
    tag: "Best Seller",
  },
  {
    id: "3",
    name: "Compact Defensive Pistol",
    price: 699,
    category: "Handguns",
    tag: "Featured",
  },
  {
    id: "4",
    name: "Precision Long-Range Rifle",
    price: 2499,
    category: "Precision",
    tag: "Pro",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="w-full bg-black text-xs text-muted-foreground py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>Secure, compliant multi-vendor firearms marketplace.</span>
          <div className="space-x-4">
            <Link href="/customer" className="hover:text-white">
              Shop
            </Link>
            <Link href="/vendor/dashboard" className="hover:text-white">
              Vendors
            </Link>
            <Link href="/admin/dashboard" className="hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <section className="border-b bg-gradient-to-b from-zinc-900 to-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Multi-vendor firearms marketplace
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Exclusive &amp; premium firearms from verified dealers.
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-xl">
              Browse a curated selection of handguns, rifles, carbines, optics, and tactical gear from
              licensed vendors. Every order flows through background checks, compliance, and secure
              dealer transfer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/customer">Shop products</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-zinc-500 text-zinc-100" asChild>
                <Link href="/register">Become a vendor</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-8 text-xs sm:text-sm text-zinc-300 pt-4">
              <div>
                <p className="font-semibold text-white">Licensed dealers only</p>
                <p>All vendors pass license &amp; background verification.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Mandatory background checks</p>
                <p>Every purchase goes through compliant checks.</p>
              </div>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
            <Image
              src="https://images.pexels.com/photos/5202336/pexels-photo-5202336.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Premium firearm on tactical background"
              fill
              priority
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/40" />
            <div className="absolute bottom-6 left-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-zinc-300">Featured platform</p>
              <p className="text-xl font-semibold">GUNPOINT Secure Exchange</p>
              <p className="text-xs text-zinc-300 max-w-xs">
                Escrow payments, licensed dealer handoff, and full audit trails for every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 lg:py-14 border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Store categories</h2>
              <p className="text-sm text-muted-foreground">
                From defensive pistols to long-range precision and tactical gear.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Handguns", "Rifles & Carbines", "Optics & Sights", "Knives & Gear"].map((name) => (
              <Link key={name} href="/customer" className="group">
                <Card className="overflow-hidden h-full">
                  <div className="relative h-32 bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900" />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {name}
                    </CardTitle>
                    <CardDescription>
                      Certified, compliant inventory from licensed vendors.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="py-10 lg:py-14 border-b bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Popular products</h2>
              <p className="text-sm text-muted-foreground">
                A snapshot of what verified customers are shopping for right now.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/customer">View all products</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sampleProducts.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <div className="relative h-40 bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {product.tag}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                  <span className="font-semibold text-lg">
                    {formatCurrency(product.price)}
                  </span>
                  <Button size="sm" asChild>
                    <Link href="/customer">View</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Range & training highlight */}
      <section className="py-10 lg:py-14 border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Tactical skills, compliant training, real confidence.
            </h2>
            <p className="text-sm text-muted-foreground">
              Partner ranges and instructors offer vetted training programs for defensive handgun,
              carbine, and long-range platforms. Every course respects local laws and best-practice
              safety protocols.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="font-semibold">Advanced training</p>
                <p className="text-muted-foreground">From fundamentals to advanced tactical work.</p>
              </div>
              <div>
                <p className="font-semibold">Weapon selection</p>
                <p className="text-muted-foreground">Choose the right platform for your use case.</p>
              </div>
              <div>
                <p className="font-semibold">Certified instructors</p>
                <p className="text-muted-foreground">Only vetted, credentialed professionals.</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/customer">Explore training-ready platforms</Link>
            </Button>
          </div>
          <div className="relative h-64 rounded-xl overflow-hidden border bg-zinc-900">
            <Image
              src="https://images.pexels.com/photos/5202342/pexels-photo-5202342.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Shooter training with rifle"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/40" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 lg:py-14 bg-muted/40 border-b">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Subscribe to compliance &amp; product updates
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Stay ahead of new inventory drops, platform updates, and regulatory changes affecting
            online firearms purchases and dealer transfers.
          </p>
          <form
            className="mt-4 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Input
              type="email"
              placeholder="you@example.com"
              className="sm:w-72"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-400 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-100">Gunpoint Marketplace</p>
            <p>Secure, compliant, multi-vendor firearms e-commerce.</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="font-semibold text-zinc-100 mb-1">Platform</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/customer" className="hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Become a vendor
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-zinc-100 mb-1">Compliance</p>
              <ul className="space-y-1">
                <li>Background checks</li>
                <li>Dealer transfer</li>
                <li>Audit logging</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

