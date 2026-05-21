import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 503 });
  }
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(url.searchParams.get("limit") ?? "20"));
  const search = url.searchParams.get("search") ?? "";

  const [
    { data: { users } },
    { data: cotisations },
  ] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 2000 }),
    supabaseAdmin.from("cotisations").select("owner_id, current_amount, status"),
  ]);

  // Build per-user stats
  const userStats: Record<string, { count: number; total: number; active: number }> = {};
  for (const c of cotisations ?? []) {
    const uid = c.owner_id as string;
    if (!userStats[uid]) userStats[uid] = { count: 0, total: 0, active: 0 };
    userStats[uid].count++;
    userStats[uid].total += (c.current_amount as number) || 0;
    if (c.status === "active") userStats[uid].active++;
  }

  let mapped = (users ?? []).map(u => ({
    id: u.id,
    phone: u.phone ?? "",
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    cotisations_count: userStats[u.id]?.count ?? 0,
    active_cotisations: userStats[u.id]?.active ?? 0,
    total_collected: userStats[u.id]?.total ?? 0,
  }));

  if (search) {
    const q = search.toLowerCase();
    mapped = mapped.filter(
      u => u.phone.includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = mapped.length;
  const offset = (page - 1) * limit;

  return NextResponse.json({
    users: mapped.slice(offset, offset + limit),
    total,
    page,
    limit,
  });
}
