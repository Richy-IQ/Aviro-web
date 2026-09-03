import Script from "next/script";

// Applies the saved theme before hydration so a dark-mode user never sees a
// white flash. Uses next/script with beforeInteractive rather than a raw
// <script>: React flattens an explicit <head> in the App Router, which would
// leave a bare <script> as a child of <html> — invalid HTML and a hydration
// error. The storage key is written literally so this server component never
// imports the "use client" preferences module (doing so silently drops the
// script from the server HTML).
const SCRIPT = `try{var t=localStorage.getItem("aviro:theme")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}`;

export function ThemeScript() {
  return (
    <Script id="aviro-theme" strategy="beforeInteractive">
      {SCRIPT}
    </Script>
  );
}
