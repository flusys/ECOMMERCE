import { ICommonData } from "flusysng/shared/interfaces";
import { IAttributeValue } from "./attribute-value-data.interface";

export interface IAttribute extends ICommonData {
    id: number;
    name: string;

    // Attribute Value
    values?: IAttributeValue[];
}
