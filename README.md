# opencode-multi-ai-review

Reusable opencode plugin for running one branch code review across multiple selected models and returning one synthesized Markdown report.

## Install from npm

After the package is published, add the plugin to your opencode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-multi-ai-review"]
}
```

opencode installs npm plugins into its own cache, not necessarily into your project's `node_modules`. Install the command template from this repository:

```sh
mkdir -p .opencode/commands
curl -fsSL https://raw.githubusercontent.com/MathieuDoyon/opencode-multi-ai-review/main/commands/multi-review.md \
  -o .opencode/commands/multi-review.md
```

Restart opencode after changing plugin or command configuration.

## Install from a local clone

For local development before publishing, build this package and point opencode at the local plugin file:

```sh
cd ~/Developer/opencode-multi-ai-review
pnpm install
pnpm build
```

Then configure the plugin with an absolute file URL:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///<path to this repo>/opencode-multi-ai-review/dist/index.js"]
}
```

From the target project where you run opencode, copy the command template from the clone:

```sh
mkdir -p .opencode/commands
cp ~/Developer/opencode-multi-ai-review/commands/multi-review.md .opencode/commands/multi-review.md
```

Restart opencode after changing plugin or command configuration.

## Use

Run the command in opencode:

```text
/multi-review
```

The command runs `opencode models`, asks which models to use through the built-in `question` tool, then calls `multi_ai_code_review`.

To override the auto-detected base ref:

```text
/multi-review origin/main
```

To add extra focus:

```text
/multi-review origin/main focus on auth, data loss, and missing tests
```

## Output

The final report includes:

- a findings table with severity, confidence, models, location, recommendation, and action;
- a `Do Not Address Yet` section for likely false positives;
- reviewer failures when a selected model fails or returns unparseable JSON;
- a partial-review notice when the diff is truncated.

## Options

Plugin options can be provided with opencode's tuple plugin config form:

```json
{
  "plugin": [
    ["opencode-multi-ai-review", {
      "maxDiffBytes": 200000,
      "maxDiffLines": 6000,
      "maxFiles": 200
    }]
  ]
}
```
