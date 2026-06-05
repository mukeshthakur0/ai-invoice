from pydantic import BaseModel
from typing import Optional


class CompanySettingsBase(BaseModel):
    company_name: str
    company_email: str
    company_phone: str
    company_address: str

    company_logo: Optional[str] = None

    website: Optional[str] = None

    gst_number: Optional[str] = None

    bank_name: Optional[str] = None

    account_number: Optional[str] = None

    ifsc_code: Optional[str] = None


class CompanySettingsCreate(CompanySettingsBase):
    pass


class CompanySettingsResponse(CompanySettingsBase):
    id: int

    class Config:
        from_attributes = True