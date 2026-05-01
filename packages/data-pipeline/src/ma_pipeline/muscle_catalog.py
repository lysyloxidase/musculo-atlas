from dataclasses import dataclass


@dataclass(frozen=True)
class MuscleRecord:
    id: str
    name: str
    fiber_length_cm: float
    pennation_deg: float
    pcsa_cm2: float
    innervation: str


def validate_muscle_record(record: MuscleRecord) -> None:
    if record.fiber_length_cm <= 0:
        raise ValueError("fiber_length_cm must be positive")
    if record.pcsa_cm2 <= 0:
        raise ValueError("pcsa_cm2 must be positive")
    if not record.innervation:
        raise ValueError("innervation is required")
