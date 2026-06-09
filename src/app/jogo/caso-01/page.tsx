import { MissionGame } from "@/game/components/MissionGame";

export default async function Case01Page({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; load?: string }>;
}) {
  const params = await searchParams;

  return <MissionGame startMode={params.new === "1" ? "new" : "load"} />;
}
