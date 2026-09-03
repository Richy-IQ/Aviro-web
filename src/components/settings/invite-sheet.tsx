"use client";

import { useState } from "react";
import { FieldLabel } from "@/components/form/fields";
import { Sheet } from "@/components/overlay/sheet";
import { useToast } from "@/components/overlay/toast";
import { Icon } from "@/components/ui/icon";

const ROLES = [
  { v: "manager", label: "Farm manager", sub: "Can log, edit and see all numbers" },
  { v: "attendant", label: "Pen attendant", sub: "Can log only, for assigned pens" },
  { v: "viewer", label: "Viewer", sub: "Can see numbers, cannot change them" },
];

export function InviteButton() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("manager");
  const ping = useToast();

  const valid = /^[789]\d{9}$/.test(phone.replace(/\s/g, ""));

  const send = () => {
    setOpen(false);
    ping(`Invite sent to +234 ${phone}`);
    setPhone("");
  };

  return (
    <>
      <button type="button" className="av-btn ghost sm" onClick={() => setOpen(true)}>
        <Icon name="plus" size={14} /> Invite
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Invite someone"
        subtitle="They'll get an SMS with a link to join this farm."
        footer={
          <>
            <button type="button" className="av-btn ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button" className="av-btn primary" disabled={!valid} onClick={send}>
              Send invite
            </button>
          </>
        }
      >
        <FieldLabel htmlFor="invite-phone">Phone number</FieldLabel>
        <div className="flex gap-2">
          <div className="av-input lg flex w-[110px] items-center gap-1.5 px-3">
            <span className="text-lg">🇳🇬</span>
            <span className="num">+234</span>
          </div>
          <input
            id="invite-phone"
            className="av-input lg num flex-1"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, "").slice(0, 11))}
            placeholder="803 412 9087"
          />
        </div>
        <div className="av-help">10 digits, no leading zero</div>

        <div className="h-5" />
        <FieldLabel>Role</FieldLabel>
        <div className="overflow-hidden rounded-card border border-border" role="radiogroup" aria-label="Role">
          {ROLES.map((r, i) => (
            <button
              key={r.v}
              type="button"
              role="radio"
              aria-checked={role === r.v}
              onClick={() => setRole(r.v)}
              className="flex w-full items-center gap-3 bg-surface p-3.5 text-left"
              style={{ borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <span
                className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full"
                style={{ border: `2px solid ${role === r.v ? "var(--av-teal)" : "var(--border-strong)"}` }}
              >
                {role === r.v && <span className="h-2.5 w-2.5 rounded-full bg-teal" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{r.label}</span>
                <span className="caption block text-xs">{r.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>
    </>
  );
}
