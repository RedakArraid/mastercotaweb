import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function verifyRequest(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  return user ?? null;
}

export async function GET(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not configured" }, { status: 503 });
  }
  const user = await verifyRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    { data: { users } },
    { data: cotisations },
    { data: contributions },
  ] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 2000 }),
    supabaseAdmin.from("cotisations").select("id, status, current_amount, created_at"),
    supabaseAdmin.from("contributions").select("id, amount, status, created_at"),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Users
  const allUsers = users ?? [];
  const usersThisMonth = allUsers.filter(u => new Date(u.created_at) >= monthStart).length;
  const usersPrevMonth = allUsers.filter(u => {
    const d = new Date(u.created_at);
    return d >= prevMonthStart && d < monthStart;
  }).length;

  // Cotisations
  const allCots = cotisations ?? [];
  const cotStatus = { active: 0, completed: 0, closed: 0 };
  let totalCollected = 0;
  for (const c of allCots) {
    if (c.status === "active") cotStatus.active++;
    else if (c.status === "completed") cotStatus.completed++;
    else cotStatus.closed++;
    totalCollected += (c.current_amount as number) || 0;
  }

  // Contributions
  const allContribs = contributions ?? [];
  const paid = allContribs.filter(c => c.status === "paid");
  const totalPaid = paid.reduce((s, c) => s + ((c.amount as number) || 0), 0);
  const paidThisMonth = paid.filter(c => new Date(c.created_at) >= monthStart);
  const paidPrevMonth = paid.filter(c => {
    const d = new Date(c.created_at);
    return d >= prevMonthStart && d < monthStart;
  });
  const thisMonthAmount = paidThisMonth.reduce((s, c) => s + (c.amount as number), 0);
  const prevMonthAmount = paidPrevMonth.reduce((s, c) => s + (c.amount as number), 0);

  // Daily (last 30 days)
  const daily: { date: string; amount: number; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    daily.push({ date: d.toISOString().split("T")[0], amount: 0, count: 0 });
  }
  for (const c of paid) {
    const key = new Date(c.created_at).toISOString().split("T")[0];
    const item = daily.find(d => d.date === key);
    if (item) { item.amount += c.amount as number; item.count++; }
  }

  // Recent activity (last 8 paid contributions)
  const recent = paid
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  // Recent cotisations (last 6)
  const recentCots = allCots
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return NextResponse.json({
    users: { total: allUsers.length, thisMonth: usersThisMonth, prevMonth: usersPrevMonth },
    cotisations: { total: allCots.length, ...cotStatus, totalCollected },
    contributions: {
      total: allContribs.length,
      paid: paid.length,
      totalAmount: totalPaid,
      thisMonth: paidThisMonth.length,
      thisMonthAmount,
      prevMonthAmount,
      daily,
      recent,
    },
    recentCotisations: recentCots,
  });
}
