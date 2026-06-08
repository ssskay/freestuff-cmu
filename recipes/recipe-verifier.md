# Recipe: the link verifier

The weekly verifier (`agents/verify.py`) reads `agents/verify.config.json`:
- `school` — used in the verification prompt.
- `recovery_domains` — link-recovery only searches these; **set yours or recovery no-ops.**
- `user_agent` — sent on verification requests.

Needs `ANTHROPIC_API_KEY` as a GitHub secret to run in CI; it skips cleanly without one.
