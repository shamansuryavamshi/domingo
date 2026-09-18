"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { scrollToId } from "@/lib/smooth-scroll-client";

interface ScrollLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  id: string;
  children: ReactNode;
}

export default function ScrollLink({
  id,
  children,
  onClick,
  ...rest
}: ScrollLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick?.(event);
    scrollToId(id);
  };

  return (
    <a href={`#${id}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}