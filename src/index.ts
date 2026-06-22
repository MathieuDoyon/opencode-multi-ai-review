import type { Plugin, PluginInput, PluginOptions } from "@opencode-ai/plugin";
import { createMultiAiCodeReviewTool } from "./tool.js";
import type { DiffLimits, ReviewClient, ShellRunner } from "./types.js";

export { createMultiAiCodeReviewTool } from "./tool.js";

const plugin: Plugin = async (input, options = {}) => {
  const limits = readLimits(options);
  const shell = createShellRunner(input.$, input.worktree || input.directory);
  const client = createReviewClient(input.client, input.directory);

  return {
    tool: {
      multi_ai_code_review: createMultiAiCodeReviewTool({ client, shell, limits }),
    },
  };
};

export default plugin;

function readLimits(options: PluginOptions): Partial<DiffLimits> {
  return {
    ...(typeof options.maxDiffBytes === "number" ? { maxDiffBytes: options.maxDiffBytes } : {}),
    ...(typeof options.maxDiffLines === "number" ? { maxDiffLines: options.maxDiffLines } : {}),
    ...(typeof options.maxFiles === "number" ? { maxFiles: options.maxFiles } : {}),
  };
}

function createShellRunner($: PluginInput["$"], directory: string): ShellRunner {
  return async (command: string) => {
    const script = `cd ${quoteShell(directory)} && ${command}`;
    return (await $`sh -c ${script}`.text()).trim();
  };
}

function createReviewClient(client: PluginInput["client"], directory: string): ReviewClient {
  return {
    session: {
      async create(input) {
        const result = await client.session.create({ body: input.body, query: { directory } });
        if (!result.data) throw new Error("Could not create review child session");
        return { id: result.data.id };
      },
      async prompt(input) {
        const result = await client.session.prompt({
          path: input.path,
          query: { directory },
          body: input.body,
        });
        if (!result.data) throw new Error("Could not prompt review child session");
        return { parts: result.data.parts };
      },
    },
  };
}

function quoteShell(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
