# `prompts/`

Versioned LLM prompts. See [`OSS_SPEC.md` §13.5](../OSS_SPEC.md#135-llm-prompts-prompts).

If this project ever sends prompts to a language model — directly via an SDK
or indirectly via a wrapper — every prompt must live here as a versioned
`<name>/<major>_<minor>_<patch>.md` file with YAML front matter (`name`,
`description`, `version`) and `## System` / `## User` sections, rather than as
an inline string in source code. Existing versioned files are never edited;
every change is a new file at a bumped version.

This site performs no LLM calls, so the directory holds only this README.
