import Script from "next/script";

// Adsterra Native Banner. The invoke script injects the creative into the
// container div below, so the two must render together wherever the ad appears.
// This unit is intentionally kept OFF the tool pages to preserve the
// "no third-party trackers while you use the tools" promise — it only renders
// where it's explicitly placed (currently the homepage and guide pages).
const NATIVE_SRC = "https://bauval.org/21/6f56d7c386339f9f09f72be794874647";
const CONTAINER_ID = "container-6f56d7c386339f9f09f72be794874647";

export default function AdsterraNative({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* data-cfasync="false" stops Cloudflare Rocket Loader from deferring/rewriting the script. */}
      <Script
        id="adsterra-native-6f56d7c3"
        src={NATIVE_SRC}
        strategy="afterInteractive"
        data-cfasync="false"
      />
      <div id={CONTAINER_ID} />
    </div>
  );
}
