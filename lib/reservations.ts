export const MAX_PIECES = 5;

export interface ReservationPayload {
  name: string;
  phone: string;
  quantity: number;
  note?: string;
}

const endpoint = process.env.NEXT_PUBLIC_RESERVATION_ENDPOINT;

let sessionReserved = 0;

export function remainingPieces(): number {
  return Math.max(0, MAX_PIECES - sessionReserved);
}

export async function submitReservation(
  payload: ReservationPayload,
): Promise<{ storedServerSide: boolean }> {
  if (endpoint) {
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Could not reach the reservation service.");
    }

    if (!response.ok) {
      throw new Error("The reservation service rejected this request.");
    }

    sessionReserved += payload.quantity;
    return { storedServerSide: true };
  }

  await new Promise((resolve) => setTimeout(resolve, 900));
  sessionReserved += payload.quantity;
  return { storedServerSide: false };
}