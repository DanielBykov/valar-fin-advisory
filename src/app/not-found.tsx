import Link from "next/link";

export default function NotFound() {
  return (
    <div data-cmp="NotFoundPage" className="min-h-screen w-full flex items-center justify-center bg-valar-fog">
      <div className="max-w-lg mx-4 text-center">
        <span className="text-valar-amber font-bold tracking-widest text-sm uppercase">404</span>
        <h1 className="text-4xl md:text-5xl font-bold text-valar-navy mt-4 mb-6">
          Sorry, this page does not exist.
        </h1>
        <p className="text-lg text-valar-indigo leading-relaxed mb-10">
          We may have moved it, renamed it, or we are still building this part of the website.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/" className="bg-valar-amber hover:bg-valar-amber-hover text-valar-navy px-8 py-4 rounded-sm font-bold text-center transition-colors">
            Go to Homepage
          </Link>
          <Link href="/services" className="bg-transparent border-2 border-valar-navy hover:bg-valar-navy hover:text-white text-valar-navy px-8 py-4 rounded-sm font-bold text-center transition-colors">
            View Our Services
          </Link>
        </div>
        <Link href="/contact" className="text-valar-indigo hover:text-valar-amber transition-colors font-medium underline underline-offset-4">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
