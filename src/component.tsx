import * as React from "react";

export interface State {
    size: number,
    imageURL: string,
    altText: string
}

export const initialState: State = {
    size: 200,
    imageURL: "",
    altText: ""
}

export class ReactImage extends React.Component<{}, State>{
    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if (typeof ReactImage.updateCallback === 'function') {
            ReactImage.updateCallback(newState);
        }
    }

    public state: State = initialState;

    public componentWillMount() {
        ReactImage.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        ReactImage.updateCallback = null;
    }

    render() {
        const { imageURL, altText, size } = this.state;

        return (
            imageURL ? (
                <img src={imageURL} />
            ) : (
                <p>{altText}</p>
            )
        )
    }
}

