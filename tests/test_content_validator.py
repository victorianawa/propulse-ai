
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from content_validator import (
    find_unsupported_numbers,
    validate_structure
)  # noqa: E402


SOURCE = (
    "Suku bunga KPR turun menjadi 7,5% pada 2026. "
    "Program FLPP menargetkan 220.000 unit."
)


def test_supported_numbers_pass():
    assert find_unsupported_numbers(
        "KPR 7,5% tahun 2026 dengan 220.000 unit FLPP",
        SOURCE
    ) == []


def test_fabricated_number_detected():
    assert "45" in find_unsupported_numbers(
        "Harga rumah naik 45% setahun",
        SOURCE
    )


def test_rumah123_is_not_a_number():
    assert find_unsupported_numbers(
        "Cek di Rumah123 sekarang",
        SOURCE
    ) == []


def test_single_digit_percent_is_checked():
    assert "5" in find_unsupported_numbers(
        "Cicilan turun 5%",
        SOURCE
    )


def test_missing_hashtag_is_blocker():
    issues = validate_structure(
        "Halo \U0001F3E0",
        ["#properti"],
        [{}] * 6
    )
    assert any(i["severity"] == "blocker" for i in issues)


def test_good_structure_has_no_issues():
    assert validate_structure(
        "Halo \U0001F3E0",
        ["#Rumah123"],
        [{}] * 6
    ) == []
