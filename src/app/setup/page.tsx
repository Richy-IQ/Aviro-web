import { redirect } from "next/navigation";

import { FarmSetup } from "@/components/onboarding/farm-setup";
import { getCurrentFarm } from "@/lib/api/current-farm";

export const metadata = { title: "Set up your farm · Aviro" };

export default async function SetupPage() {
  // Someone who already has a farm has no business here.
  if (await getCurrentFarm()) redirect("/");
  return <FarmSetup suggestedName="My farm" />;
}
