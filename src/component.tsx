import * as React from "react";

export interface State {
    //background?: string,
    //borderWidth?: number,
    size: number,
    imageURL: string,
    altText: string
}

export const initialState: State = {
    size: 200,
    imageURL: "",
    altText: ""
}

export class ReactCircleCard extends React.Component<{}, State>{
    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if (typeof ReactCircleCard.updateCallback === 'function') {
            ReactCircleCard.updateCallback(newState);
        }
    }

    public state: State = initialState;

    public componentWillMount() {
        ReactCircleCard.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }

    render() {
        //const { imageURL, altText, size, background, borderWidth } = this.state;
        const { imageURL, altText, size } = this.state;
        //const style: React.CSSProperties = { width: size, height: size, background, borderWidth };
        const style: React.CSSProperties = { width: size, height: size };

        return (
            <React.Fragment>
                <img src={imageURL} alt={altText} style={style} />
                <p>{altText}</p>
            </React.Fragment>
        )
    }
}

//className="circleCard" style={style}>