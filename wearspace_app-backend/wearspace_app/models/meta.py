from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import MetaData
from sqlalchemy.types import TypeDecorator, CHAR
import uuid

# Recommended naming convention used by Alembic, as various different database
# providers will autogenerate vastly different names making migrations more
# difficult. See: http://alembic.zzzcomputing.com/en/latest/naming.html
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=NAMING_CONVENTION)
Base = declarative_base(metadata=metadata)

class UUIDColumn(TypeDecorator):
    """
    UUIDType for SQLAlchemy, stores UUIDs as CHAR(32) and converts them to/from uuid.UUID objects.
    """
    impl = CHAR(36) # UUID string format is 36 characters (e.g., 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return str(value) # Convert UUID object to string

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return uuid.UUID(value) # Convert string to UUID object
