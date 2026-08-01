import Image from "next/image";
import { SITE_URL } from "@/lib/site";

/*
 * Website QR code.
 *
 * The artwork is a supplied asset, not something this component generates. It
 * encodes exactly "https://www.lionrms.uk" — verified with three independent
 * decoders (ZBar CLI, pyzbar and OpenCV) before it entered the repository, and
 * re-verified after lossless optimisation. Nothing here may redraw, recolour or
 * regenerate the pattern; if the destination ever needs to change, the artwork
 * is replaced and re-decoded, not edited.
 *
 * Three details in the markup below exist to keep it scannable:
 *
 * 1. `unoptimized`. Next.js would otherwise re-encode the PNG to WebP or AVIF.
 *    Those are lossy by default, and lossy compression on a 29x29 module grid
 *    softens the module edges a scanner relies on. This flag serves the exact
 *    473 bytes committed to the repo.
 *
 * 2. The white padding is NOT decoration. ISO/IEC 18004 requires a light quiet
 *    zone of at least four modules on every side. The supplied artwork already
 *    contains exactly four, so the white card behind it only ever adds to that
 *    margin. Never crop the image to "tighten" the whitespace.
 *
 * 3. No `image-rendering: pixelated`. It sounds right for a QR code, but the
 *    displayed width is not an integer divisor of the 592px source, so nearest
 *    neighbour sampling would drop or double module columns unevenly. Smooth
 *    downscaling keeps every module the same apparent width, which is what a
 *    scanner's binarisation step wants.
 *
 * The visible link below the code is a real anchor rather than plain text, so
 * a desktop visitor who cannot scan anything still has a way through, and a
 * screen reader user gets a destination rather than a decorative graphic.
 */

const QR_SRC = "/images/website-qr-code.png";
const QR_INTRINSIC = 592;

export default function WebsiteQRCode({ className = "" }: { className?: string }) {
  const displayUrl = SITE_URL.replace(/^https:\/\//, "");

  return (
    <div className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 ${className}`}>
      <h2 className="text-sm font-bold text-navy-900">Scan for our services &amp; contact details</h2>

      <div className="mt-4 flex flex-col items-center">
        {/*
         * Fixed, explicitly sized box. Width and height are both pinned at each
         * breakpoint so the space is reserved before the image loads — no
         * layout shift — and the square can never be stretched into a rectangle
         * that would distort the module grid.
         */}
        <div className="h-[180px] w-[180px] rounded-xl bg-white p-3 shadow-sm sm:h-[212px] sm:w-[212px]">
          <Image
            src={QR_SRC}
            alt={`QR code that opens the Lion Risk Management Solutions website, ${displayUrl}`}
            width={QR_INTRINSIC}
            height={QR_INTRINSIC}
            sizes="212px"
            loading="lazy"
            unoptimized
            className="h-full w-full"
          />
        </div>

        <a
          href={SITE_URL}
          className="mt-4 text-sm font-semibold text-teal-700 hover:underline"
        >
          {displayUrl}
        </a>
      </div>
    </div>
  );
}
