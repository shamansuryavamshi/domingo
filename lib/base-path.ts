export const basePath = "/domingo";

export function asset(path: string): string {
  return `${basePath}${path}`;
}