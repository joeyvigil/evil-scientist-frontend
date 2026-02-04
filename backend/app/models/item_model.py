from typing import Annotated, Optional

from pydantic import BaseModel, Field

# Check user_model for relevant notes

class ItemModel(BaseModel):
    id: Annotated[int, Field(gt=0)] = None
    name: Annotated[str, Field(min_length=3, max_length=50)]
    description: Annotated[str, Field(min_length=10, max_length=100)]
    # ge = greater than or equal to
    # lt = less than or equal to
    inventory: Annotated[int, Field(ge=0, le=100)]
    price: Annotated[float, Field(gt=0)]