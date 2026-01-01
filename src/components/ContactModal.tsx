import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loading = isOpen && !screenshotUrl && !error;

  useEffect(() => {
    if (isOpen && !screenshotUrl) {
      const token = import.meta.env.VITE_SCREENSHOT_API_KEY;
      const encodedUrl = encodeURIComponent('https://nishantdev.space');
      const apiUrl = `https://shot.screenshotapi.net/screenshot?token=${token}&url=${encodedUrl}&output=json&file_type=png&wait_for_event=load`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch screenshot');
          }
          return response.json();
        })
        .then(data => {
          if (data.screenshot) {
            setScreenshotUrl(data.screenshot);
          } else {
            throw new Error('Screenshot URL not found in response');
          }
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, [isOpen, screenshotUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-1">Contact</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Website interface preview
          </p>
        </div>

        <div className="flex justify-center">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--foreground))]"></div>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Loading screenshot...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
              <a
                href="https://nishantdev.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Visit website directly
              </a>
            </div>
          )}
          {screenshotUrl && (
            <a
              href="https://nishantdev.space"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={screenshotUrl}
                alt="Website screenshot"
                className="max-w-full h-auto rounded-lg border border-[hsl(var(--border))] cursor-pointer hover:opacity-80 transition-opacity"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}