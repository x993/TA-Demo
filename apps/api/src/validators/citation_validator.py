"""
Citation grounding validator.

Rules:
1. Every fact in memo key_details must have a citation
2. If quote_text is provided, it must be a substring of stored evidence excerpt
3. SEC-type events require SEC filing evidence (tier 1)
4. Evidence must belong to the same event
"""

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.models import Event, EvidenceSource


@dataclass
class CitationValidationResult:
    """Result of citation validation."""
    valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def validate_citations(event: "Event") -> CitationValidationResult:
    """
    Validate that event citations are properly grounded in evidence.

    Args:
        event: Event with evidence_sources loaded

    Returns:
        CitationValidationResult with valid flag and any errors/warnings
    """
    errors: list[str] = []
    warnings: list[str] = []

    # Build evidence lookup
    evidence_map: dict[str, "EvidenceSource"] = {}
    if event.evidence_sources:
        for ev in event.evidence_sources:
            evidence_map[str(ev.id)] = ev

    # Rule 1: Event must have at least one evidence source
    if not event.evidence_sources or len(event.evidence_sources) == 0:
        errors.append("No evidence sources attached to event")
        return CitationValidationResult(valid=False, errors=errors, warnings=warnings)

    # Rule 2: SEC-type events require SEC filing evidence (tier 1)
    if event.event_type == "sec_filing":
        has_sec_evidence = any(
            ev.source_type == "sec_filing" and ev.tier == 1
            for ev in event.evidence_sources
        )
        if not has_sec_evidence:
            errors.append("SEC filing event requires tier-1 SEC filing evidence")

    # Rule 3: Validate key_details citations
    if event.memo_key_details:
        for i, detail in enumerate(event.memo_key_details):
            if not isinstance(detail, dict):
                continue

            citation = detail.get("citation")
            if not citation:
                warnings.append(f"Key detail {i+1} missing citation")
                continue

            # If citation references an evidence_id, validate it exists
            evidence_id = detail.get("evidence_id")
            if evidence_id:
                if evidence_id not in evidence_map:
                    errors.append(f"Key detail {i+1} references non-existent evidence_id: {evidence_id}")
                    continue

                # Rule 4: Validate quote_text if present
                quote_text = detail.get("quote_text")
                if quote_text:
                    evidence = evidence_map[evidence_id]
                    searchable_text = _get_searchable_text(evidence)

                    if not _quote_exists_in_text(quote_text, searchable_text):
                        errors.append(
                            f"Key detail {i+1} quote_text not found in evidence: "
                            f"'{quote_text[:50]}...'"
                        )

    # Rule 5: Check evidence tier constraints for severity
    # Tier 3-only evidence cannot generate critical status (warning only)
    tier_1_or_2_exists = any(
        ev.tier in (1, 2) for ev in event.evidence_sources
    )
    if not tier_1_or_2_exists:
        warnings.append("Event only has tier-3 evidence; severity may be limited")

    return CitationValidationResult(
        valid=len(errors) == 0,
        errors=errors,
        warnings=warnings,
    )


def _get_searchable_text(evidence: "EvidenceSource") -> str:
    """Get all searchable text from an evidence source."""
    parts = []
    if evidence.excerpt:
        parts.append(evidence.excerpt)
    if evidence.raw_text:
        parts.append(evidence.raw_text)
    if evidence.title:
        parts.append(evidence.title)
    return " ".join(parts).lower()


def _quote_exists_in_text(quote: str, text: str) -> bool:
    """Check if a quote exists in the text (case-insensitive, whitespace-normalized)."""
    if not quote or not text:
        return False

    # Normalize whitespace and case
    normalized_quote = " ".join(quote.lower().split())
    normalized_text = " ".join(text.lower().split())

    return normalized_quote in normalized_text
