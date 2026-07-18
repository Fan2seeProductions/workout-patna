// Global 404. Covers mistyped URLs and every notFound() call in the app
// (e.g. an unknown /exercises/[slug]). Branded to match the marketing site.
import Link from 'next/link'

export const metadata = { title: 'Page not found', robots: { index: false, follow: false } }

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-[#0d0d0d] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p
          className="text-[72px] sm:text-[96px] font-black leading-none"
          style={{
            background: 'linear-gradient(135deg, #dc1616 0%, #ff5555 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </p>
        <h1 className="mt-4 text-[24px] sm:text-[28px] font-extrabold tracking-tight">
          This page took a rest day.
        </h1>
        <p className="mt-3 text-[15px] text-white/60 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="h-12 px-7 rounded-full text-white font-bold text-[15px] inline-flex items-center"
            style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
          >
            Back to home
          </Link>
          <Link
            href="/exercises"
            className="h-12 px-7 rounded-full border border-white/15 bg-white/[0.04] text-white font-bold text-[15px] inline-flex items-center hover:bg-white/[0.08] transition"
          >
            Browse exercises
          </Link>
        </div>
      </div>
    </main>
  )
}
