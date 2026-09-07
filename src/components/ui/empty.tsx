import Link from "next/link";

import { Icon, type IconName } from "./icon";

/**
 * An empty state that always offers the way out.
 *
 * The action may be a link as well as a handler: the screens that have nothing
 * to show are usually server components, and telling a farmer "start a batch"
 * without a button to do it is where people get stuck.
 */
interface Action {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyProps {
  icon?: IconName;
  title: string;
  body?: string;
  action?: Action;
  secondary?: Action;
}

function Button({ action, className }: { action: Action; className: string }) {
  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }
  return (
    <button className={className} onClick={action.onClick}>
      {action.label}
    </button>
  );
}

export function Empty({ icon = "info", title, body, action, secondary }: EmptyProps) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-teal-tint text-teal">
        <Icon name={icon} size={28} />
      </div>
      <div className="h3 mb-1.5">{title}</div>
      {body && <p className="caption mx-auto mb-4.5 max-w-[280px] leading-[1.55]">{body}</p>}
      {action && <Button action={action} className="av-btn primary" />}
      {secondary && (
        <div className="mt-3">
          <Button action={secondary} className="av-link" />
        </div>
      )}
    </div>
  );
}
