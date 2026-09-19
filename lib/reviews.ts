export interface Review {
  id: string;
  text: string;
  name: string;
  date: string;
  product: string;
  featured?: boolean;
}

export interface ReviewPayload {
  name: string;
  product?: string;
  text: string;
}

export const MAX_SHOWN = 4;

const endpoint = process.env.NEXT_PUBLIC_REVIEW_ENDPOINT;

const staticReviews: Review[] = [];

let sessionReviews: Review[] = [];

export function getReviews(): Review[] {
  return [...staticReviews, ...sessionReviews];
}

export async function submitReview(
  payload: ReviewPayload,
): Promise<{ review: Review; storedServerSide: boolean }> {
  const review: Review = {
    id: `customer-${Date.now()}`,
    text: payload.text.trim(),
    name: payload.name.trim(),
    date: "Sunday",
    product: payload.product?.trim() || "This Sunday's dessert",
  };

  if (endpoint) {
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Could not reach the reviews service.");
    }

    if (!response.ok) {
      throw new Error("The reviews service rejected this request.");
    }

    sessionReviews = [review, ...sessionReviews];
    return { review, storedServerSide: true };
  }

  await new Promise((resolve) => setTimeout(resolve, 900));
  sessionReviews = [review, ...sessionReviews];
  return { review, storedServerSide: false };
}