import re

COUNTRY_CODE = "+254"
SPECIAL_CHAR = re.compile(r"[^A-Za-z0-9]")


def clean_name(name):
    """Strip leading/trailing whitespace. Name must be a non-empty string <= 50 chars."""
    if not isinstance(name, str) or not name.strip():
        raise ValueError("Name is required.")
    name = name.strip()
    if len(name) > 50:
        raise ValueError("Name must not exceed 50 characters.")
    return name


def normalize_phone_number(phone):
    """
    Normalise a Kenyan phone number to +254XXXXXXXXX (13 characters).
      - starts with 0 -> next digit must be 7 or 1, replace the 0 with +254
      - starts with +254 -> must already be 13 characters (next digit 7 or 1)
    Spaces, dashes and brackets are ignored.
    """
    if not isinstance(phone, str) or not phone.strip():
        raise ValueError("Phone number is required.")

    phone = re.sub(r"[\s\-()]", "", phone)

    if phone.startswith("0"):
        if len(phone) < 2 or phone[1] not in ("7", "1"):
            raise ValueError("Phone numbers starting with 0 must be followed by 7 or 1.")
        phone = COUNTRY_CODE + phone[1:]
    elif not phone.startswith(COUNTRY_CODE):
        raise ValueError("Phone number must start with 0 or +254.")

    # Final check: +254, then 7 or 1, then 8 digits = 13 characters in total
    if not re.fullmatch(r"\+254[17][0-9]{8}", phone):
        raise ValueError("Invalid phone number. Expected a 13-character number like +254712345678.")
    return phone


def validate_password(password):
    """Minimum 8 characters containing letters, digits and special characters."""
    if not isinstance(password, str) or not password:
        raise ValueError("Password is required.")
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not re.search(r"[A-Za-z]", password):
        raise ValueError("Password must contain at least one letter.")
    if not re.search(r"[0-9]", password):
        raise ValueError("Password must contain at least one digit.")
    if not SPECIAL_CHAR.search(password):
        raise ValueError("Password must contain at least one special character.")
    return password


def parse_bool(value):
    """Accept real booleans as well as 'true'/'false' strings (form submissions)."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str) and value.strip().lower() in ("true", "false"):
        return value.strip().lower() == "true"
    raise ValueError("Value must be true or false.")

def clean_category_name(name):
    """Strip whitespace. Must be a non-empty string <= 50 chars."""
    if not isinstance(name, str) or not name.strip():
        raise ValueError("Category name is required.")
    name = name.strip()
    if len(name) > 50:
        raise ValueError("Category name must not exceed 50 characters.")
    return name