import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Image
                src="/globe.svg"
                alt="Glorious Events"
                width={200}
                height={60}
                className="h-16 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-sm text-primary-foreground/80">Where Innovation Meets Inspiration</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:info@gloriousevents.co.zw"
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@gloriousevents.co.zw
                </a>
                <a href="tel:+263781565612" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4" />
                  +263 78 156 5612
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/gloriousevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/gloriousevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com/gloriousevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com/company/gloriousevents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-6 text-center">
            <p className="text-sm text-primary-foreground/80">© 2026 Glorious Events. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
