import enum


class UnitType(str, enum.Enum):
    COUNT = "COUNT"
    WEIGHT = "WEIGHT"
    VOLUME = "VOLUME"


class UnitLabel(str, enum.Enum):
    PIECE = "PIECE"
    GRAM = "GRAM"
    LITER = "LITER"
    KILOGRAM = "KILOGRAM"
    MILLILITER = "MILLILITER"
