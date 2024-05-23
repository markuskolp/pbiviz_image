"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

// Import React dependencies and the added component
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactCircleCard, initialState } from "./component";
import IViewport = powerbi.IViewport;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";

import "./../style/visual.less";

export class Visual implements IVisual {

    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private viewport: IViewport;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ReactCircleCard, {});
        this.target = options.element;
        this.formattingSettingsService = new FormattingSettingsService();

        ReactDOM.render(this.reactRoot, this.target);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    public update(options: VisualUpdateOptions) {
        if (options.dataViews && options.dataViews[0]) {
            const dataView: DataView = options.dataViews[0];

            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            const size = Math.min(width, height);
            console.log("size: " + size);

            var imageURL = "";
            var altText = "";
            console.log("imageURL: " + imageURL);
            console.log("altText: " + altText);

            // get positions of attributes in dataView columns
            var indexImageURL = -1;
            var indexAltText = -1;
            for (var i = 0; i < dataView.categorical.categories.length; i++) {
                console.log(dataView.categorical.categories[i].source.roles);
                dataView.categorical.categories[i].source.roles["imageurl"] ? indexImageURL = i : "";
                dataView.categorical.categories[i].source.roles["alttext"] ? indexAltText = i : "";
            }
            console.log("indexImageURL: " + indexImageURL);
            console.log("indexAltText: " + indexAltText);

            // get value for attributes if they are populated
            if (indexImageURL >= 0 ) {
                console.log("has indexImageURL");
                imageURL = dataView.categorical.categories[indexImageURL].values[0].valueOf().toString();
            }
            if (indexAltText >= 0) {
                console.log("has indexAltText");
                altText = dataView.categorical.categories[indexAltText].values[0].valueOf().toString();
            }
            
            //const imageURL = dataView.categorical.values[0].values[0].valueOf().toString();
            //try { imageURL = dataView.categorical.categories[0].values[0].valueOf().toString(); } catch(ex) {}
            //try { altText = dataView.categorical.categories[1].values[0].valueOf().toString(); } catch(ex) {}

            console.log("imageURL: " + imageURL);
            console.log("altText: " + altText);

            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
            const circleSettings = this.formattingSettings.circleCard;

            ReactCircleCard.update({
                //imageURL: dataView.single.value.toString(), // dataView.metadata.columns[0].displayName // label of selected item
                imageURL,
                altText,
                size
                //borderWidth: circleSettings.circleThickness.value,
                //background: circleSettings.circleColor.value.value
            });
        } else {
            this.clear();
        }
    }
    private clear() {
        ReactCircleCard.update(initialState);
    }
}