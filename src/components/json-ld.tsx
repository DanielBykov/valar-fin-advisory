/**
 * Renders a JSON-LD structured-data script tag.
 *
 * Server component — no client interactivity needed.
 * Use one component per schema object, or pass an array via the `data` prop
 * to emit multiple objects in a single script tag.
 */

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
