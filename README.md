# opencode-multi-ai-review

Reusable opencode plugin for running one branch code review across multiple selected models and returning one synthesized Markdown report.

## Install

Add the plugin to your opencode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-multi-ai-review"]
}
```

Then copy the command template into your project or global commands directory:

```sh
mkdir -p .opencode/commands
cp node_modules/opencode-multi-ai-review/commands/multi-review.md .opencode/commands/multi-review.md
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
