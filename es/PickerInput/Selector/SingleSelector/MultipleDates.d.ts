import * as React from 'react';
import type { PickerProps } from '../../SinglePicker';
export interface MultipleDatesProps<DateType extends object = any> extends Pick<PickerProps, 'maxTagCount'> {
    prefixCls: string;
    value: DateType[];
    onRemove: (value: DateType) => void;
    removeIcon?: React.ReactNode;
    formatDate: (date: DateType) => string;
    disabled?: boolean;
    placeholder?: React.ReactNode;
}
export default function MultipleDates<DateType extends object = any>(props: MultipleDatesProps<DateType>): React.JSX.Element;
