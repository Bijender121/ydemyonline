import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string };

// Target for a Sanity GROQ webhook (projection `{_type}`), signed with SANITY_REVALIDATE_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag("sanity", "max");
  if (body?._type) revalidateTag(body._type, "max");

  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
