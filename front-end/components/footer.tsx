import { MapPin, Mail, Phone, Facebook, Linkedin, Youtube } from "lucide-react"
import Logo from "@/public/logos.png"
import Image from "next/image"
export function Footer() {
  return (
    <footer className="bg-[#800080] border-t border-border">{/**bg-card */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* À propos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-white p-1 flex items-center justify-center">
                  <Image src={Logo} alt="Voisilab Logo" width={100} height={100} />
              </div>
              <span className="text-xl font-bold text-foreground"> </span>
            </div>
            <p className="text-muted-foreground text-white text-white text-sm leading-relaxed">
              Depuis 2019, Voisilab démocratise la fabrication numérique pour tous. Un espace d'innovation et de
              créativité ouvert à tous.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#accueil" className="text-muted-foreground text-white hover:text-green-400 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#equipements" className="text-muted-foreground text-white hover:text-green-400 transition-colors">
                  Équipements
                </a>
              </li>
              <li>
                <a href="#ateliers" className="text-muted-foreground text-white hover:text-green-400 transition-colors">
                  Ateliers
                </a>
              </li>
              <li>
                <a href="#innovations" className="text-muted-foreground text-white hover:text-green-400 transition-colors">
                  Innovations
                </a>
              </li>
              <li>
                <a href="/equipe" className="text-muted-foreground text-white hover:text-green-400 transition-colors">
                  Équipe
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground text-white">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-white" />
                <span>Abidjan Cocody Deux-Plateaux, rue K4</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-white">
                <Mail size={16} className="flex-shrink-0 text-white" />
                <a href="mailto:fablab@uvci.edu.ci" className="hover:text-green-400 transition-colors">
                  Fablab@uvci.edu.ci
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-white">
                <Phone size={16} className="flex-shrink-0 text-white" />
                <a href="tel:+2250759136905" className="hover:text-green-400 transition-colors">
                07 59 13 69 05
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
            <div className="flex gap-3">
                <a
                href="https://www.facebook.com/share/1C59Vp8K67/"
                target='_blank'
                rel="noopener noreferrer"
                className="hover:scale-105 transition-all duration-300 shadow-sm w-10 h-10 bg-blue-900 rounded-lg flex 
                items-center justify-center text-white transition-colors font-bold"
                aria-label="Facebook"
                >
                <Facebook size={20} fill="currentColor" />
                </a>
              <a
                href="http://linkedin.com/school/universit%C3%A9-virtuelle-de-c%C3%B4te-d-ivoire"
                target='_blank'
                className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-muted-foreground text-white transition-colors hover:scale-105 transition-all duration-300 shadow-lg transition-colors"
                aria-label="Linkedin"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.youtube.com/@uvcitv8053"
                target='_blank'
                className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-muted-foreground text-white 
                hover:text-green-400-foreground transition-colors hover:scale-105 transition-all duration-300 shadow-lg"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground text-white">
          <p>&copy; {new Date().getFullYear()} Voisilab. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
