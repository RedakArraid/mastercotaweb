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
  const status = url.searchParams.get("status") ?? "";
  const search = url.searchParams.get("search") ?? "";

  let query = supabaseAdmin
    .from("cotisations")
    .select("id, slug, title, target_amount, current_amount, deadline, owner_id, status, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const [
    { data: cotisations },
    { data: contributions },
    { data: { users } },
  ] = await Promise.all([
    query,
    supabaseAdmin.from("contributions").select("cotisation_id, status, amount"),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 2000 }),
  ]);

  // Build lookup maps
  const contribStats: Record<string, { count: number; pending: number }> = {};
  for (const c of contributions ?? []) {
    const id = c.cotisation_id as string;
    if (!contribStats[id]) contribStats[id] = { count: 0, pending: 0 };
    if (c.status === "paid") contribStats[id].count++;
    else if (c.status === "pending") contribStats[id].pending++;
  }

  const phonesById: Record<string, string> = {};
  for (const u of users ?? []) {
    phonesById[u.id] = u.phone ?? u.email ?? u.id.slice(0, 8);
  }

  let mapped = (cotisations ?? []).map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    target_amount: c.target_amount,
    current_amount: c.current_amount || 0,
    deadline: c.deadline,
    owner_id: c.owner_id,
    owner_phone: phonesById[c.owner_id as string] ?? "—",
    status: c.status,
    created_at: c.created_at,
    contributions_paid: contribStats[c.id as string]?.count ?? 0,
    contributions_pending: contribStats[c.id as string]?.pending ?? 0,
    progress: (c.target_amount as number) > 0
      ? Math.round(((c.current_amount as number) / (c.target_amount as number)) * 100)
      : 0,
  }));

  if (search) {
    const q = search.toLowerCase();
    mapped = mapped.filter(
      c => c.title.toLowerCase().includes(q) || c.owner_phone.includes(q) || c.slug.toLowerCase().includes(q)
    );
  }

  const total = mapped.length;
  const offset = (page - 1) * limit;

  return NextResponse.json({
    cotisations: mapped.slice(offset, offset + limit),
    total,
    page,
    limit,
  });
}
