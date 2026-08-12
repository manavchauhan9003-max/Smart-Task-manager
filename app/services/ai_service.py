from openai import OpenAI
from app.core.config import settings
from app.schemas import TaskBreakdownResponse

# NOTE: no client is constructed here at module level anymore. Building it
# eagerly, at import time, meant the entire app would fail to start the
# moment OPENAI_API_KEY was missing -- exactly the crash Step 3's
# "AI must be optional" requirement forbids. The client is now built
# lazily, only when an AI feature is actually invoked.
_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


class AIServiceError(Exception):
    """Raised when AI is unavailable, unconfigured, or returns something we can't trust."""
    pass


def generate_task_breakdown(title: str, description: str | None) -> TaskBreakdownResponse:
    """
    Takes a task's title/description (already validated by our existing
    TaskCreate/TaskResponse schemas upstream) and returns a structured,
    validated breakdown into concrete subtasks.
    """
    if not settings.ai_enabled:
        # Checked BEFORE touching the OpenAI SDK at all. This is the one
        # place that decides "AI isn't configured" -- every AI-powered
        # route relies on this same check, via this same function, rather
        # than each route re-implementing its own "is AI on?" logic.
        raise AIServiceError("AI features are not configured on this server.")

    prompt = f"Task title: {title}"
    if description:
        prompt += f"\nTask description: {description}"
    prompt += "\n\nBreak this task down into concrete, actionable subtasks."

    try:
        completion = _get_client().chat.completions.parse(
            model=settings.AI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You break down tasks into clear, concrete, actionable "
                        "subtasks. Be specific and practical. Only suggest "
                        "subtasks directly related to the given task -- do not "
                        "invent unrelated work."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            response_format=TaskBreakdownResponse,
            max_tokens=500,
            timeout=15,  # explicit timeout, per Step 10/13's failure-handling discussion
        )
    except Exception as exc:
        # Never include the API key or any part of settings in this message --
        # only the exception itself, which the openai SDK never populates
        # with credential values.
        raise AIServiceError(f"AI provider request failed: {exc}") from exc

    message = completion.choices[0].message

    if message.refusal:
        raise AIServiceError(f"AI provider refused the request: {message.refusal}")

    if message.parsed is None:
        raise AIServiceError("AI provider returned an unparseable response")

    return message.parsed