import { describe, expect, it } from "vitest";
import { ContextBuilder } from "./context-builder";

describe("ContextBuilder", () => {
  it("normalizes only explicitly supplied context in a stable order", () => {
    const context = new ContextBuilder().build({
      locale: "  en-MY  ",
      facts: {
        " industry ": "  clinic  ",
        active: true,
        employees: 12,
      },
    });

    expect(context).toEqual({
      locale: "en-MY",
      facts: {
        active: true,
        employees: 12,
        industry: "clinic",
      },
    });
    expect(Object.keys(context.facts)).toEqual(["active", "employees", "industry"]);
  });

  it("rejects context keys that collide after normalization", () => {
    expect(() =>
      new ContextBuilder().build({
        facts: {
          name: "Atlas",
          " name ": "Duplicate",
        },
      }),
    ).toThrowError("The supplied AI context could not be normalized.");
  });
});
