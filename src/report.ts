import type { FindingGroup, ReportInput } from "./types.js";

export function renderReport(input: ReportInput): string {
  const lines = ["# Multi-AI Code Review", ""];

  if (input.partial) {
    lines.push(`Partial review: ${input.truncationReason ?? "diff context was truncated."}`, "");
  }

  const actionable = input.groups.filter((group) => group.action !== "likely false positive");
  lines.push("## Findings", "");
  lines.push("| Severity | Confidence | Finding | Models | Location | Recommendation | Action |");
  lines.push("| -------- | ---------- | ------- | ------ | -------- | -------------- | ------ |");

  if (actionable.length === 0) {
    lines.push("| - | - | No actionable findings | - | - | - | - |");
  } else {
    for (const group of actionable) lines.push(renderFindingRow(group));
  }

  const likelyFalsePositives = input.groups.filter(
    (group) => group.action === "likely false positive",
  );
  if (likelyFalsePositives.length > 0) {
    lines.push("", "## Do Not Address Yet", "");
    for (const group of likelyFalsePositives) {
      lines.push(
        `- **${group.title}** (${locationFor(group)}): ${group.findings[0]?.falsePositiveRisk ?? "Evidence is weak."}`,
      );
    }
  }

  if (input.failures.length > 0) {
    lines.push("", "## Reviewer Failures", "");
    for (const failure of input.failures) lines.push(`- \`${failure.model}\`: ${failure.reason}`);
  }

  return lines.join("\n");
}

function renderFindingRow(group: FindingGroup): string {
  const recommendation = group.findings[0]?.recommendation ?? "Investigate the cited evidence.";
  return `| ${escapeCell(group.severity)} | ${escapeCell(group.confidence)} | ${escapeCell(group.title)} | ${escapeCell(group.models.join(", "))} | ${escapeCell(locationFor(group))} | ${escapeCell(recommendation)} | ${escapeCell(group.action)} |`;
}

function locationFor(group: FindingGroup): string {
  return group.line === undefined ? group.file : `${group.file}:${group.line}`;
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}
