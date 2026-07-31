class EmailAlreadyRegisteredError(Exception):
    def __init__(self, email: str):
        self.email = email
        super().__init__(f"Email '{email}' is already registered")


class InvalidCredentialsError(Exception):
    def __init__(self):
        super().__init__("Invalid email or password")
