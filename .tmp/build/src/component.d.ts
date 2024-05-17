import * as React from "react";
export interface State {
    background?: string;
    borderWidth?: number;
    size: number;
    textLabel: string;
    textValue: string;
}
export declare const initialState: State;
export declare class ReactCircleCard extends React.Component<{}, State> {
    constructor(props: any);
    private static updateCallback;
    static update(newState: State): void;
    state: State;
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
