"""
Memo grounding validator.

Rules:
1. Memo must reference at least one evidence source
2. Memo must not contain hallucination markers
3. Memo must be under length limit
4. Combined with citation validation for full grounding check
"""

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from src.validators.citation_validator import validate_citations

if TYPE_CHECKING:
    from src.models import Event


# Phrases that indicate speculation or ungrounded claims
HALLUCINATION_MARKERS = [
    "i think",
    "probably",
    "might be",
    "it seems",
    "appears to",
    "reportedly",  # unless citing a source
    "sources say",  # too vague
    "likely to",
    "may have",
    "could be",
    "possibly",
    "perhaps",
    "we believe",
    "in our opinion",
]

MAX_MEMO_LENGTH = 2000  # characters


@dataclass
class MemoValidationResult:
    """Result of memo validation."""
    valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def validate_memo(event: "Event") -> MemoValidationResult:
    """
    Validate that an event memo is properly grounded.

    Args:
        event: Event with memo fields and evidence_sources loaded

    Returns:
        MemoValidationResult with valid flag and any errors/warnings
    """
    errors: list[str] = []
    warnings: list[str] = []

    # If no memo content, consider it valid (empty is okay)
    if not event.memo_what_disclosed:
        return MemoValidationResult(valid=True, errors=errors, warnings=warnings)

    memo_text = event.memo_what_disclosed.lower()

    # Rule 1: Check for hallucination markers
    for marker in HALLUCINATION_MARKERS:
        if marker in memo_text:
            errors.append(f"Contains hallucination marker: '{marker}'")

    # Rule 2: Check length
    if len(event.memo_what_disclosed) > MAX_MEMO_LENGTH:
        errors.append(f"Memo exceeds {MAX_MEMO_LENGTH} characters")

    # Rule 3: Run citation validation
    citation_result = validate_citations(event)
    errors.extend(citation_result.errors)
    warnings.extend(citation_result.warnings)

    # Rule 4: Check context entries don't contain speculation
    if event.memo_context:
        for i, context_item in enumerate(event.memo_context):
            if not isinstance(context_item, str):
                continue
            context_lower = context_item.lower()
            for marker in HALLUCINATION_MARKERS:
                if marker in context_lower:
                    warnings.append(f"Context item {i+1} contains uncertain language: '{marker}'")
                    break

    return MemoValidationResult(
        valid=len(errors) == 0,
        errors=errors,
        warnings=warnings,
    )


def is_event_valid_for_display(event: "Event") -> bool:
    """
    Quick check if an event should be displayed.

    Returns False if event fails validation and should be hidden.
    """
    # Must have evidence
    if not event.evidence_sources or len(event.evidence_sources) == 0:
        return False

    # SEC events must have SEC evidence
    if event.event_type == "sec_filing":
        has_sec_evidence = any(
            ev.source_type == "sec_filing" for ev in event.evidence_sources
        )
        if not has_sec_evidence:
            return False

    # If already validated, use stored result
    if event.memo_validated is not None:
        return event.memo_validated

    # Run validation
    result = validate_memo(event)
    return result.valid
