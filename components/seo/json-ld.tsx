/**
 * Renders a JSON-LD graph. Server component, so the markup is in the initial
 * HTML where crawlers that do not execute JS can still read it.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built server-side from CMS fields; JSON.stringify escapes
      // quotes, and `<` is escaped below so a stray `</script>` in prose cannot
      // break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
