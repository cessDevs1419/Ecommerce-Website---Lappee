export interface AttributeList{
    success: string,
    message: string,
    data: Attributes[];
}

export interface Attributes{
    id: string,
    name: string
}

export interface AttributeDetailList{
    success: string,
    message: string,
    data: AttributesDetails;
}

export interface AttributesDetails{
    attribute_id: string,
    value: []
}