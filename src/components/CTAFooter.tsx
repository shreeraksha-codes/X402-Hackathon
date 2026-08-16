import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Hls from "hls.js";
import { Link } from "react-router-dom";

const HLS_SRC =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export default function CTAFooter() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
    }
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-32 text-center md:px-16 lg:px-24">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-30"
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1]"
        style={{ height: "200px", background: "linear-gradient(to bottom, #0A0A0B, transparent)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1]"
        style={{ height: "200px", background: "linear-gradient(to top, #0A0A0B, transparent)" }}
      />

      <div className="relative z-10">
        <h2 className="mx-auto mb-4 max-w-3xl font-heading text-5xl italic leading-[0.9] tracking-tight text-paper md:text-6xl lg:text-7xl">
          See it verify itself.
        </h2>
        <p className="mx-auto mb-8 max-w-xl font-body text-sm font-light text-paper/60 md:text-base">
          Scan a real product, break its certificate on purpose, then watch an AI
          agent pay a cent to catch it. No signup, no wallet required.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/demo"
            className="liquid-glass flex items-center gap-2 rounded-full px-6 py-3 font-body text-sm font-medium text-paper hover:bg-white/10"
          >
            Try the Demo
            <ArrowUpRight className="h-5 w-5" />
          </Link>
          <Link
            to="/products/new"
            className="flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-body text-sm font-medium text-ink transition-colors hover:bg-paper/90"
          >
            Issue a Passport
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-32 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row">
          <p className="font-body text-xs font-light text-paper/40">
            &copy; 2026 DDP&#8209;X. Verification results are anchored, not legal
            certification.
          </p>
          <div className="flex items-center gap-6">
            {["API Docs", "GitHub", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-body text-xs font-light text-paper/40 transition-colors hover:text-paper/70"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
