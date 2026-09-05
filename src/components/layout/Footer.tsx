import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';
import { formatPhone, whatsappLink } from '@/lib/format';

function TikTok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.6-1v5.9c0 3.4-2.5 5.8-5.7 5.8-3 0-5.2-2.2-5.2-5 0-3 2.4-5.1 5.6-4.8v2.5c-.5-.1-1-.1-1.4 0-1.2.2-2 1.1-1.9 2.4.1 1.2 1 2 2.2 2 1.4 0 2.3-1 2.3-2.6V3h3.7z" />
    </svg>
  );
}

export function Footer() {
  const contact = useAppSelector((s) => s.contact.data);
  const redes = contact?.redes ?? {};
  const phone = contact?.telefono;

  const socials = [
    { key: 'instagram', url: redes.instagram, icon: <Instagram size={18} />, label: 'Instagram' },
    { key: 'facebook', url: redes.facebook, icon: <Facebook size={18} />, label: 'Facebook' },
    { key: 'tiktok', url: redes.tiktok, icon: <TikTok />, label: 'TikTok' },
  ].filter((s) => s.url);

  const contactItems = [
    contact?.direccion && {
      icon: <MapPin size={17} />,
      label: contact.direccion,
      href: `https://maps.google.com/?q=${encodeURIComponent(contact.direccion)}`,
    },
    phone && {
      icon: <Phone size={17} />,
      label: formatPhone(phone),
      href: `tel:+${phone.replace(/\D/g, '').replace(/^0/, '593')}`,
    },
    contact?.email && {
      icon: <Mail size={17} />,
      label: contact.email,
      href: `mailto:${contact.email}`,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[];

  return (
    <footer id="contacto" className="grain relative scroll-mt-20 overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-volt/10 blur-[130px]"
      />

      {/* CTA */}
      <div className="container-x relative z-10 py-24 sm:py-28">
        <Reveal>
          <h2 className="max-w-[18ch] text-hero font-extrabold uppercase leading-[0.95]">
            ¿Listo para tu <span className="text-volt">próxima cumbre?</span>
          </h2>
          <p className="mt-7 max-w-[48ch] text-lg text-muted">
            Escríbenos por WhatsApp y arma tu equipo. Envíos a todo el Ecuador — el mismo día en
            Quito.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              href={whatsappLink(phone, 'Hola Zarku, quiero hacer un pedido 🏔️')}
              variant="volt"
            >
              Escribir por WhatsApp
            </MagneticButton>
            {contact?.email && (
              <MagneticButton href={`mailto:${contact.email}`} variant="ghost">
                Enviar correo
              </MagneticButton>
            )}
          </div>
        </Reveal>

        {/* Datos + redes */}
        <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ul className="grid gap-5 sm:grid-cols-3">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-start gap-3 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <span className="mt-0.5 text-volt">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex gap-3 md:justify-end">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-volt hover:text-volt"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="relative z-10 border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src="/brand/isotipo.png" alt="" className="h-8 w-8 rounded-md" />
            <span className="font-display text-sm font-bold uppercase tracking-wide">
              Zarku <span className="text-muted">· Mountain Store</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link
              to="/noticias"
              className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-volt"
            >
              Noticias
            </Link>
            <a
              href="https://zarku.ec/webmail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-volt"
            >
              <Mail size={14} />
              Webmail
            </a>
            <p className="font-mono text-xs tracking-wide text-muted/70">
              © {new Date().getFullYear()} Zarku Ecuador — El espíritu de tu pasión.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
