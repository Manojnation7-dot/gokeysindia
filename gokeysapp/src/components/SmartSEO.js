export default function SmartSEO({ schema }) {
  if (!schema) return null;

  // Flatten and filter out nulls
  const rawSchemas = Array.isArray(schema) ? schema : [schema];
  const schemas = rawSchemas.flat().filter(s => s && s["@type"]);

  if (schemas.length === 0) return null;

  // Clean the schemas for the graph (remove individual @context)
  const graph = schemas.map(({ "@context": _, ...rest }) => rest);

  const consolidatedSchema = {
    "@context": "https://schema.org",
    "@graph": graph
  };

  return (
    <script
      id="schema-graph"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(consolidatedSchema) }}
    />
  );
}