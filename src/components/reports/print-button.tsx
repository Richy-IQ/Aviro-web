"use client";

import { Icon } from "@/components/ui/icon";

/**
 * Print is the PDF export. The browser's own "Save as PDF" produces a real,
 * shareable file with no library in the bundle and no server round-trip —
 * which also means it works on a phone with no connection.
 */
export function PrintButton() {
  return (
    <button type="button" className="av-btn primary sm" onClick={() => window.print()}>
      <Icon name="download" size={14} /> Save as PDF
    </button>
  );
}
