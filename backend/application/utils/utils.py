import re 

def clean_cpf(cpf: str) -> str:
    """Clean CPF string removing all non-numeric characters."""
    return re.sub(r"[^0-9]", "", cpf)