export function normalize(text: string) {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, "");
}