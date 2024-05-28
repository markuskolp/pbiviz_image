"use strict";
import powerbi from "powerbi-visuals-api";
import { select, Selection } from "d3-selection";


import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactImage, initialState } from "./component";
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
    private localizationManager: ILocalizationManager;

    private isLandingPageOn: boolean;
    private landingPage: Selection<any, any, any, any>;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ReactImage, {});
        this.target = options.element;
        this.formattingSettingsService = new FormattingSettingsService();

        this.localizationManager = options.host.createLocalizationManager();
        //this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);

        ReactDOM.render(this.reactRoot, this.target);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    private handleLandingPage(options: VisualUpdateOptions) {
        console.log("handleLandingPage");
        //if(!options.dataViews || !options.dataViews.length) { // !options.dataViews[0]?.metadata?.columns?.length){
        if(!options.dataViews || !options.dataViews[0]?.metadata?.columns?.length){
            console.log("truning landing page ... if ...");
            if(!this.isLandingPageOn) {
                console.log("truning landing page ON");
                this.isLandingPageOn = true;
                const landingPage: Element = this.createLandingPage();
                this.target.appendChild(landingPage);
                this.landingPage = select(landingPage);
            }

        } else {
            console.log("truning landing page ... else ...");
            if(this.isLandingPageOn){
                    console.log("truning landing page OFF");
                    this.isLandingPageOn = false;
                    this.landingPage.remove();
                }
        }
    }

    private createLandingPage(): Element {
        console.log("createLandingPage");
        const div = document.createElement("div");
        const contentHTML = "<h3>Image visual</h3>"+
        "<h5>Please select fields to fill this visual.</h5>";
        div.innerHTML = contentHTML;
        //div.classList.add("watermark");
        return div;
    }

    public update(options: VisualUpdateOptions) {

        console.log("update");

        this.handleLandingPage(options);

        //console.log("update");
        if (options.dataViews && options.dataViews[0]) {
            //console.log("has dataView");
            const dataView: DataView = options.dataViews[0];

            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            const size = Math.min(width, height);
            //console.log("size: " + size);

            // for every update reset the values
            var imageURL = "";
            var altText = "";
            //console.log("imageURL: " + imageURL);
            //console.log("altText: " + altText);

            // get positions of attributes in dataView columns
            var indexImageURL = -1;
            var indexAltText = -1;
            for (var i = 0; i < dataView.categorical.categories.length; i++) {
                //console.log(dataView.categorical.categories[i].source.roles);
                dataView.categorical.categories[i].source.roles["imageurl"] ? indexImageURL = i : "";
                dataView.categorical.categories[i].source.roles["alttext"] ? indexAltText = i : "";
            }
            //console.log("indexImageURL: " + indexImageURL);
            //console.log("indexAltText: " + indexAltText);

            // get value for attributes if they are populated
            if (indexImageURL >= 0) {
                //console.log("has indexImageURL");
                imageURL = dataView.categorical.categories[indexImageURL].values[0].valueOf().toString();
            }
            if (indexAltText >= 0) {
                //console.log("has indexAltText");
                altText = dataView.categorical.categories[indexAltText].values[0].valueOf().toString();
            }
            //console.log("imageURL: " + imageURL);
            //console.log("altText: " + altText);

            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
            //this.formattingSettings.setLocalizedOptions(this.localizationManager);

            const imageVisible = true;

            ReactImage.update({
                imageURL,
                altText,
                size,
                imageVisible
            });
        } else {
            //console.log("clear");
            this.clear();
        }
    }
    private clear() {
        ReactImage.update(initialState);
    }
}