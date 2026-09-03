import { Icon, type IconName } from "./icon";

interface EmptyProps {
  icon?: IconName;
  title: string;
  body?: string;
  action?: { label: string; onClick?: () => void };
  secondary?: { label: string; onClick?: () => void };
}

export function Empty({ icon = "info", title, body, action, secondary }: EmptyProps) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[18px] bg-teal-tint text-teal">
        <Icon name={icon} size={28} />
      </div>
      <div className="h3 mb-1.5">{title}</div>
      {body && <p className="caption mx-auto mb-4.5 max-w-[280px] leading-[1.55]">{body}</p>}
      {action && (
        <button className="av-btn primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {secondary && (
        <div className="mt-3">
          <button className="av-link" onClick={secondary.onClick}>
            {secondary.label}
          </button>
        </div>
      )}
    </div>
  );
}
