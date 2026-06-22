import { describe, expect, it, vi } from "vitest";
import plugin, { createMultiAiCodeReviewTool } from "./index.js";
import type { ReviewClient, ShellRunner } from "./types.js";

describe("createMultiAiCodeReviewTool", () => {
  it("passes tool args and session context to the review runner", async () => {
    const client = { session: { create: vi.fn(), prompt: vi.fn() } } as unknown as ReviewClient;
    const shell: ShellRunner = vi.fn();
    const runReview = vi.fn().mockResolvedValue("# report");
    const reviewTool = createMultiAiCodeReviewTool({ client, shell, runReview });

    const result = await reviewTool.execute(
      { models: ["openai/gpt-5.5"], baseRef: "origin/main", instructions: "focus" },
      { sessionID: "session-1" } as never,
    );

    expect(result).toBe("# report");
    expect(runReview).toHaveBeenCalledWith({
      client,
      shell,
      sessionID: "session-1",
      models: ["openai/gpt-5.5"],
      baseRef: "origin/main",
      instructions: "focus",
      limits: { maxDiffBytes: 200000, maxDiffLines: 6000, maxFiles: 200 },
    });
  });
});

describe("plugin", () => {
  it("registers the multi_ai_code_review tool", async () => {
    const hooks = await plugin({
      client: { session: { create: vi.fn(), prompt: vi.fn() } },
      directory: "/repo",
      worktree: "/repo",
      $: vi.fn(),
    } as never);

    expect(hooks.tool?.multi_ai_code_review).toBeDefined();
  });
});
