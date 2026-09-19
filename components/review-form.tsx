"use client";

import { useState, type FormEvent } from "react";
import { submitReview, type Review } from "@/lib/reviews";

interface FieldErrors {
  name?: string;
  product?: string;
  text?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const MAX_CHARS = 500;

const INPUT_CLASS =
  "w-full rounded-md border-2 border-black bg-white px-4 py-3 text-base font-semibold text-black placeholder:text-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const LABEL_CLASS = "mb-2 block text-xs font-black uppercase tracking-[0.18em]";

export default function ReviewForm({ onPublished }: { onPublished: (review: Review) => void }) {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [storedServerSide, setStoredServerSide] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const cleanName = name.trim();
    const cleanText = text.trim();

    if (!cleanName) {
      next.name = "Tell us who ate with Domingo.";
    } else if (cleanName.length > 60) {
      next.name = "Keep the name under 60 characters.";
    }

    if (product.trim().length > 80) {
      next.product = "Keep the dessert name under 80 characters.";
    }

    if (!cleanText) {
      next.text = "Say what the dessert was like.";
    } else if (cleanText.length > MAX_CHARS) {
      next.text = `Keep it under ${MAX_CHARS} characters.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitReview({
        name: name.trim(),
        product: product.trim() || undefined,
        text: text.trim(),
      });
      setStoredServerSide(result.storedServerSide);
      setName("");
      setProduct("");
      setText("");
      setErrors({});
      onPublished(result.review);
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Try again.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="rounded-lg border-[3px] border-black bg-white p-6 text-black shadow-[4px_4px_0_0_#000] md:p-10">
      {status === "success" ? (
        <div role="status" className="rounded-md border-2 border-black bg-white p-6">
          <p className="text-2xl font-black uppercase tracking-tight">
            Review received.
          </p>
          <p className="mt-3 text-sm font-semibold leading-relaxed opacity-80">
            {storedServerSide
              ? "Your review has been recorded with the studio and is now on display."
              : "No review service is connected yet, so this was only shown on this device. Connect a review endpoint for server-side storage."}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 inline-block rounded-md border-2 border-black bg-white px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Write another review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-8">
            <p className="text-xl font-black uppercase tracking-tight">Leave a review</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed opacity-70">
              Ate one of the five pieces? Tell us what it was like.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="review-name" className={LABEL_CLASS}>
                Name
              </label>
              <input
                id="review-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "review-name-error" : undefined}
                className={INPUT_CLASS}
              />
              {errors.name && (
                <p id="review-name-error" role="alert" className="mt-2 text-xs font-bold text-brand">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="review-product" className={LABEL_CLASS}>
                Dessert <span className="opacity-60">(optional)</span>
              </label>
              <input
                id="review-product"
                type="text"
                placeholder="e.g. Crème Brûlée"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                aria-invalid={Boolean(errors.product)}
                aria-describedby={errors.product ? "review-product-error" : undefined}
                className={INPUT_CLASS}
              />
              {errors.product && (
                <p id="review-product-error" role="alert" className="mt-2 text-xs font-bold text-brand">
                  {errors.product}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="review-text" className={LABEL_CLASS}>
                Review
              </label>
              <textarea
                id="review-text"
                rows={5}
                placeholder="How did it taste? What stood out? Keep it short, personal and specific."
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-invalid={Boolean(errors.text)}
                aria-describedby={errors.text ? "review-text-error" : undefined}
                className={`${INPUT_CLASS} resize-none`}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                {errors.text ? (
                  <p id="review-text-error" role="alert" className="text-xs font-bold text-brand">
                    {errors.text}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs font-semibold opacity-60 tabular-nums">
                  {text.length} / {MAX_CHARS}
                </span>
              </div>
            </div>
          </div>

          {status === "error" && (
            <p role="alert" className="mt-6 rounded-md border-2 border-black bg-white px-4 py-3 text-sm font-bold">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-8 block w-full rounded-md border-2 border-black bg-white px-8 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-black shadow-neubrutal transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neubrutal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:inline-block md:w-auto"
          >
            {status === "submitting" ? "Posting…" : "Post review"}
          </button>
        </form>
      )}
    </div>
  );
}