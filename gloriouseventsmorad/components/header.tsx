import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/globe.svg"
              alt="Glorious Events"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#schedule" className="text-sm font-medium hover:text-primary transition-colors">
              Schedule
            </Link>
            <Link href="#location" className="text-sm font-medium hover:text-primary transition-colors">
              Location
            </Link>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="#signup">Sign Up</Link>
            </Button>
          </nav>

          <Button asChild size="sm" className="md:hidden bg-primary text-primary-foreground">
            <Link href="#signup">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
