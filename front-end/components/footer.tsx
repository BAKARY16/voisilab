import { MapPin, Mail, Phone, Facebook, Linkedin, Youtube, Instagram, Twitter } from "lucide-react"
import Logo from "@/public/logos.png"
import Image from "next/image"
import { getSiteSettings } from "@/lib/api"

export async function Footer() {
  const s = await getSiteSettings()

  // Fallbacks sur les valeurs initiales du site
  const description  = s.footer_description || "Depuis 2019, Voisilab démocratise la fabrication numérique pour tous. Un espace d'innovation et de créativité ouvert à tous."
  const address      = s.footer_address     || "Abidjan Cocody Deux-Plateaux, rue K4"
  const email        = s.footer_email       || "Fablab@uvci.edu.ci"
  const phone        = s.footer_phone       || "07 59 13 69 05"
  const copyright    = s.footer_copyright   || "Voisilab. Tous droits réservés."
  const facebookUrl  = s.facebook_url       || "https://www.facebook.com/share/1C59Vp8K67/"
  const linkedinUrl  = s.linkedin_url       || "http://linkedin.com/school/universit%C3%A9-virtuelle-de-c%C3%B4te-d-ivoire"
  const youtubeUrl   = s.youtube_url        || "https://www.youtube.com/@uvcitv8053"
  const instagramUrl = s.instagram_url      || ""
  const twitterUrl   = s.twitter_url        || ""

  return (
    <footer className="bg-[#800080] border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* À propos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-white p-1 flex items-center justify-center">
                <Image src={Logo} alt="Voisilab Logo" width={100} height={100} />
              </div>
            </div>
            <p className="text-muted-foreground text-white text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground text-white mb-4">Liens Utiles</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://scolarite.uvci.online/main/public/" target="_blank" className="text-muted-foreground text-white hover:text-green-400 transition-colors">Scolarité</a></li>
              <li><a href="https://campus.uvci.online/main/" target="_blank" className="text-muted-foreground text-white hover:text-green-400 transition-colors">Campus</a></li>
              <li><a href="https://biblio.uvci.edu.ci/" target="_blank" className="text-muted-foreground text-white hover:text-green-400 transition-colors">Bibliothèque Virtuelle</a></li>
              <li><a href="https://www.enseignement.gouv.ci/" target="_blank" className="text-muted-foreground text-white hover:text-green-400 transition-colors">Site du Ministère (MESRS)</a></li>
              <li><a href="http://www.bourses.enseignement.gouv.ci/public/" target="_blank" className="text-muted-foreground text-white hover:text-green-400 transition-colors">Demande de bourse</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground text-white">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-white" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-white">
                <Mail size={16} className="flex-shrink-0 text-white" />
                <a href={`mailto:${email}`} className="hover:text-green-400 transition-colors">{email}</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-white">
                <Phone size={16} className="flex-shrink-0 text-white" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-green-400 transition-colors">{phone}</a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
            <div className="flex gap-3 flex-wrap">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-105 transition-all duration-300 w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold"
                  aria-label="Facebook">
                  <Facebook size={20} fill="currentColor" />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-105 transition-all duration-300 w-10 h-10 bg-pink-700 rounded-lg flex items-center justify-center text-white"
                  aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-105 transition-all duration-300 w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white"
                  aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-105 transition-all duration-300 w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white"
                  aria-label="Twitter / X">
                  <Twitter size={20} />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="hover:scale-105 transition-all duration-300 w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-white"
                  aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground text-white">
          <p>&copy; {new Date().getFullYear()} {copyright}</p>
        </div>
      </div>
    </footer>
  )
}
   
