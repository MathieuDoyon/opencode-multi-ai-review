import { describe, expect, it } from "vitest";
import { renderReport } from "./report.js";
import type { FindingGroup, ReviewerFailure } from "./types.js";

const group: FindingGroup = {
  title: "Missing null guard",
  severity: "high",
  confidence: "high",
  category: "bug",
  file: "src/user.ts",
  line: 42,
  models: ["openai/gpt-5.5", "anthropic/claude"],
  findings: [
    {
      title: "Missing null guard",
      severity: "high",
      confidence: "high",
      file: "src/user.ts",
      line: 42,
      category: "bug",
      evidence: "value can be null",
      recommendation: "Add a guard",
      falsePositiveRisk: "Caller may validate it",
    },
  ],
  action: "address",
};

describe("renderReport", () => {
  it("renders a table row for grouped findings", () => {
    const report = renderReport({ groups: [group], failures: [], partial: false });

    expect(report).toContain(
      "| Severity | Confidence | Finding | Models | Location | Recommendation | Action |",
    );
    expect(report).toContain(
      "| high | high | Missing null guard | openai/gpt-5.5, anthropic/claude | src/user.ts:42 | Add a guard | address |",
    );
  });

  it("renders reviewer failures and partial review notices", () => {
    const failures: ReviewerFailure[] = [{ model: "bad/model", reason: "timeout" }];
    const report = renderReport({
      groups: [],
      failures,
      partial: true,
      truncationReason: "Diff context exceeded maxDiffLines=2.",
    });

    expect(report).toContain("Partial review: Diff context exceeded maxDiffLines=2.");
    expect(report).toContain("## Reviewer Failures");
    expect(report).toContain("- `bad/model`: timeout");
  });

  it("renders likely false positives separately", () => {
    const report = renderReport({
      groups: [{ ...group, action: "likely false positive", confidence: "low", severity: "low" }],
      failures: [],
      partial: false,
    });

    expect(report).toContain("## Do Not Address Yet");
    expect(report).toContain("Missing null guard");
  });
});
