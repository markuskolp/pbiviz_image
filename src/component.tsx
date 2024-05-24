import * as React from "react";

export interface State {
    size: number,
    imageURL: string,
    altText: string,
    imageVisible: boolean
}

export const initialState: State = {
    size: 200,
    imageURL: "",
    altText: "",
    imageVisible: true
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

    private onImageLoad(e) {
        console.log("onImageLoad");
        e.target.style.display = "block";
        document.getElementById("pbiviz_image_alttext").style.display = "none";
    }

    private onImageError(e) {
        console.log("onImageError");
        e.target.style.display = "none";
        document.getElementById("pbiviz_image_alttext").style.display = "block";
    }

    render() {
        const { imageURL, altText, size, imageVisible } = this.state;

        return (
            <React.Fragment>
                <img src={imageURL} alt={altText} onError={this.onImageError} onLoad={this.onImageLoad} />
                <p id="pbiviz_image_alttext">{altText}</p>
            </React.Fragment>
        )
    }
}

