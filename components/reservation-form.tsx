"use client";

import { useState, type FormEvent } from "react";
import { MAX_PIECES, remainingPieces, submitReservation } from "@/lib/reservations";

interface FieldErrors {
  name?: string;
  phone?: string;
  quantity?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const INPUT_CLASS =
  "w-full rounded-md border-2 border-black bg-white px-4 py-3 text-base font-semibold text-black placeholder:text-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const LABEL_CLASS = "mb-2 block text-xs font-black uppercase tracking-[0.18em]";

export default function ReservationForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [storedServerSide, setStoredServerSide] = useState(false);
  const [remaining, setRemaining] = useState(remainingPieces());

  const soldOut = remaining <= 0;

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      next.name = "Tell us who this reservation is for.";
    } else if (cleanName.length > 60) {
      next.name = "Keep the name under 60 characters.";
    }

    if (!cleanPhone) {
      next.phone = "We need a number to confirm on Sunday.";
    } else if (!/^[+\d][\d\s\-()]*$/.test(cleanPhone) || cleanPhone.length < 7) {
      next.phone = "Enter a valid phone number.";
    }

    if (Number.isInteger(quantity) && (quantity < 1 || quantity > remaining)) {
      next.quantity = `Only ${remaining} piece${remaining === 1 ? "" : "s"} left.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(remaining, q + 1));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (soldOut) return;
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitReservation({
        name: name.trim(),
        phone: phone.trim(),
        quantity,
        note: note.trim() || undefined,
      });
      setStoredServerSide(result.storedServerSide);
      setRemaining(remainingPieces());
      setName("");
      setPhone("");
      setNote("");
      setQuantity(Math.min(1, remainingPieces()));
      setErrors({});
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="rounded-lg border-[3px] border-black bg-cream p-6 text-black shadow-[4px_4px_0_0_#000] md:p-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-[0.18em]">
          <span className="text-brand">{remaining}</span> / {MAX_PIECES} pieces
          remaining this Sunday
        </p>
        {soldOut && (
          <p className="rounded-md border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wide shadow-neubrutal">
            Sold out
          </p>
        )}
      </div>

      {status === "success" ? (
        <div
          role="status"
          className="rounded-md border-2 border-black bg-white p-6"
        >
          <p className="text-2xl font-black uppercase tracking-tight">
            Reserved. See you Sunday.
          </p>
          <p className="mt-3 text-sm font-semibold leading-relaxed opacity-80">
            {storedServerSide
              ? "Your reservation has been recorded with the studio."
              : "No reservation service is connected yet, so this was only recorded on this device. Connect a reservation endpoint for server-side storage."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 inline-block rounded-md border-2 border-black bg-white px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Make another reservation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="res-name" className={LABEL_CLASS}>
                Name
              </label>
              <input
                id="res-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "res-name-error" : undefined}
                className={INPUT_CLASS}
              />
              {errors.name && (
                <p
                  id="res-name-error"
                  role="alert"
                  className="mt-2 text-xs font-bold text-brand"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="res-phone" className={LABEL_CLASS}>
                Phone number
              </label>
              <input
                id="res-phone"
                type="tel"
                autoComplete="tel"
                placeholder="+91 00000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "res-phone-error" : undefined}
                className={INPUT_CLASS}
              />
              {errors.phone && (
                <p
                  id="res-phone-error"
                  role="alert"
                  className="mt-2 text-xs font-bold text-brand"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label id="res-qty-label" className={LABEL_CLASS}>
                Quantity — {MAX_PIECES} pieces max
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || soldOut}
                  onClick={dec}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-black bg-white text-xl font-black text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neubrutal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  &minus;
                </button>
                <span
                  id="res-qty-value"
                  aria-live="polite"
                  className="min-w-12 text-center text-2xl font-black tabular-nums"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= remaining || soldOut}
                  onClick={inc}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-black bg-white text-xl font-black text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neubrutal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <p role="alert" className="mt-2 text-xs font-bold text-brand">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div className="md:col-start-1 md:row-start-2">
              <label htmlFor="res-note" className={LABEL_CLASS}>
                Note <span className="opacity-60">(optional)</span>
              </label>
              <textarea
                id="res-note"
                rows={4}
                placeholder="Allergies, a birthday, a message for the studio…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>
          </div>

          {status === "error" && (
            <p
              role="alert"
              className="mt-6 rounded-md border-2 border-black bg-white px-4 py-3 text-sm font-bold"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={soldOut || status === "submitting"}
            className="mt-8 block w-full rounded-md border-2 border-black bg-white px-8 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neubrutal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:inline-block md:w-auto"
          >
            {soldOut
              ? "Sold out this Sunday"
              : status === "submitting"
                ? "Reserving…"
                : "Reserve my piece"}
          </button>
        </form>
      )}
    </div>
  );
}