
"""Offline mirror of the deterministic checks used in the n8n workflow."""
import re

_NUM = re.compile(r"(\d[\d.,]*)(\s*%)?")
_EMOJI = re.compile("[\U0001F300-\U0001FAFF\u2600-\u27BF]")


def extract_numbers(text: str, keep_singles: bool = False) -> set:
    cleaned = re.sub(r"rumah123", " ", text or "", flags=re.I)
    found = set()
    for m in _NUM.finditer(cleaned):
        digits = re.sub(r"[.,]", "", m.group(1))
        if not digits:
            continue
        if len(digits) == 1 and not m.group(2) and not keep_singles:
            continue
        found.add(digits)
    return found


def find_unsupported_numbers(content: str, source: str) -> list:
    return sorted(
        extract_numbers(content) - extract_numbers(source, keep_singles=True)
    )


def validate_structure(caption: str, hashtags: list, slides: list) -> list:
    issues = []

    if len(caption) > 2200:
        issues.append({
            "severity": "blocker",
            "msg": "Caption exceeds 2200 characters"
        })

    if not any(t.lower() == "#rumah123" for t in hashtags):
        issues.append({
            "severity": "blocker",
            "msg": "Missing #Rumah123"
        })

    if not _EMOJI.search(caption):
        issues.append({
            "severity": "warning",
            "msg": "Caption has no emoji"
        })

    if not 5 <= len(slides) <= 7:
        issues.append({
            "severity": "warning",
            "msg": f"{len(slides)} slides (expected 5-7)"
        })

    return issues
