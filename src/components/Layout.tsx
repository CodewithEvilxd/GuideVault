import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { Moon, Sun, Keyboard } from 'lucide-react';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { ContactModal } from './ContactModal';
import ImageTrail from './ImageTrail';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface LayoutProps {
  children: ReactNode;
}


export function Layout({ children }: LayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isHoveringContact, setIsHoveringContact] = useState(false);

  const contactImages = [
    '/images/screenshot-1.png',
    '/images/screenshot-2.png',
    '/images/screenshot-3.png',
    '/images/screenshot-4.png',
    '/images/screenshot-5.png',
    '/images/screenshot-6.png',
    '/images/screenshot-7.png',
    '/images/screenshot-8.png',
    '/images/screenshot-9.png',
    '/images/screenshot-10.png'
  ];
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize Locomotive Scroll
  useEffect(() => {
    if (!scrollRef.current) return;

    locomotiveScrollRef.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smoothMobile: false,
      multiplier: 0.8,
      lerp: 0.08,
    });

    return () => {
      locomotiveScrollRef.current?.destroy();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.scrollTo(0, { duration: 0, disableLerp: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);


  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // ? for keyboard shortcuts help
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }

      // H for home (when not in input)
      if (e.key === 'h' && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        if (location.pathname !== '/') {
          navigate({ to: '/' });
        }
      }

      // Escape to close modals or go back
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname, showShortcuts]);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col"
    >
      {/* Header */}
      <header className="w-full print:hidden" data-scroll-section>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-medium hover:opacity-70 transition-opacity">GuideVault</Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors hidden sm:flex"
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6" data-scroll-section>
        {children}
      </main>


      {/* Footer */}
      <footer className="mt-auto print:hidden relative" data-scroll-section>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
            <span
              className="hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
              onMouseEnter={() => setIsHoveringContact(true)}
              onMouseLeave={() => setIsHoveringContact(false)}
              onClick={() => setIsContactModalOpen(true)}
            >
              Contact
            </span>
          </p>
          {isHoveringContact && (
            <div className="fixed inset-0 pointer-events-none z-50">
              <ImageTrail items={contactImages} variant={1} />
            </div>
          )}
        </div>
      </footer>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Contact modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

    </div>
  );
}





