console.log(
  JSON.stringify(
    {
      status: "foundation-skeleton",
      schemaVersion: 0,
      sqlite: "deferred",
      pendingMigrations: ["0001_foundation_metadata"],
      productSchema: "not-created",
    },
    null,
    2,
  ),
);
