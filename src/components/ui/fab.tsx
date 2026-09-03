import Link from "next/link";
import { Icon, type IconName } from "./icon";

/**
 * The one action a farmer came to perform, always within thumb reach and
 * always labelled. An unlabelled circle makes people guess; a label does not.
 */
export function Fab({
  href, label, icon = "plus",
}: { href: string; label: string; icon?: IconName }) {
  return (
    <Link href={href} className="av-fab">
      <Icon name={icon} size={20} stroke={2.2} />
      {label}
    </Link>
  );
}
