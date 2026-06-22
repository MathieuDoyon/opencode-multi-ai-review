import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

describe("package docs", () => {
  it("ships a copyable multi-review command template", () => {
    const command = readFileSync(resolve(root, "commands/multi-review.md"), "utf8");

    expect(command).toContain("opencode models");
    expect(command).toContain("multi_ai_code_review");
    expect(command).toContain("question");
  });

  it("documents installation and command setup", () => {
    const readme = readFileSync(resolve(root, "README.md"), "utf8");

    expect(readme).toContain("opencode-multi-ai-review");
    expect(readme).toContain("plugin");
    expect(readme).toContain("commands/multi-review.md");
  });
});
