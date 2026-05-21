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
    .from("contributions")
    .select("id, cotisation_id, contributor_name, contributor_phone, amount, status, paystack_reference, payment_method, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: contributions } = await query;

  // Get cotisation titles
  const cotisationIds = [...new Set((contributions ?? []).map(c => c.cotisation_id as string))];
  const { data: cotisations } = cotisationIds.length > 0
    ? await supabaseAdmin.from("cotisations").select("id, title, slug").in("id", cotisationIds)
    : { data: [] };

  const titlesById: Record<string, string> = {};
  const slugsById: Record<string, string> = {};
  for (const c of cotisations ?? []) {
    titlesById[c.id as string] = c.title as string;
    slugsById[c.id as string] = c.slug as string;
  }

  let mapped = (contributions ?? []).map(c => ({
    id: c.id,
    cotisation_id: c.cotisation_id,
    cotisation_title: titlesById[c.cotisation_id as string] ?? "—",
    cotisation_slug: slugsById[c.cotisation_id as string] ?? "",
    contributor_name: c.contributor_name,
    contributor_phone: c.contributor_phone,
    amount: c.amount,
    status: c.status,
    paystack_reference: c.paystack_reference ?? "",
    payment_method: c.payment_method ?? "",
    created_at: c.created_at,
  }));

  if (search) {
    const q = search.toLowerCase();
    mapped = mapped.filter(
      c =>
        (c.contributor_name as string).toLowerCase().includes(q) ||
        (c.contributor_phone as string).includes(q) ||
        c.cotisation_title.toLowerCase().includes(q)
    );
  }

  const total = mapped.length;
  const offset = (page - 1) * limit;

  return NextResponse.json({
    contributions: mapped.slice(offset, offset + limit),
    total,
    page,
    limit,
  });
}
