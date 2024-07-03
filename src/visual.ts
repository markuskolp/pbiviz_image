"use strict";
import powerbi from "powerbi-visuals-api";
import { select, Selection } from "d3-selection";


import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactImage, initialState } from "./component";
import IViewport = powerbi.IViewport;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import "./../style/visual.less";

export class Visual implements IVisual {

    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private viewport: IViewport;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private localizationManager: ILocalizationManager;
    private selectionManager: ISelectionManager;

    private isLandingPageOn: boolean;
    private landingPage: Selection<any, any, any, any>;
    //private root: Selection<any>;

    private events: IVisualEventService;

    constructor(options: VisualConstructorOptions) {

        this.events = options.host.eventService;
        this.selectionManager = options.host.createSelectionManager();

        this.reactRoot = React.createElement(ReactImage, {});
        this.target = options.element;
        this.formattingSettingsService = new FormattingSettingsService();

        this.localizationManager = options.host.createLocalizationManager();
        //this.formattingSettingsService = new FormattingSettingsService(this.localizationManager);

        this.handleContextMenu();

        ReactDOM.render(this.reactRoot, this.target);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    private handleContextMenu() {
        /*this.target.on('contextmenu', (event: PointerEvent, dataPoint) => {
            const mouseEvent: MouseEvent = event;
            this.selectionManager.showContextMenu(dataPoint ? dataPoint: {}, {
                x: mouseEvent.clientX,
                y: mouseEvent.clientY
            });
            mouseEvent.preventDefault();
        });
        */
        this.target.addEventListener('contextmenu', (event) => {
            const mouseEvent: MouseEvent = event;
            this.selectionManager.showContextMenu(
                {},
                { x: event.x, y: event.y }
            );
            //,"values" // Not sure what this should be, does not seem to make a difference
            // Prevent the browser context-menu from showing
            mouseEvent.preventDefault();
            //return false;
        })
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
        //const contentHTML = "<span style=\"font-size:12px;\">Please select fields to fill this visual.</span>";
        const contentHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\" viewBox=\"0 0 180.119 139.794\"><g transform=\"translate(-13.59 -66.639)\" paint-order=\"fill markers stroke\"><path fill=\"#d0d0d0\" d=\"M13.591 66.639H193.71v139.794H13.591z\"/><path d=\"m118.507 133.514-34.249 34.249-15.968-15.968-41.938 41.937H178.726z\" opacity=\".675\" fill=\"#fff\"/><circle cx=\"58.217\" cy=\"108.555\" r=\"11.773\" opacity=\".675\" fill=\"#fff\"/><path fill=\"none\" d=\"M26.111 77.634h152.614v116.099H26.111z\"/></g></svg>";
        div.innerHTML = contentHTML;
        //div.classList.add("watermark");
        return div;
    }

    public update(options: VisualUpdateOptions) {

        //console.log("update");
        this.events.renderingStarted(options);
        this.handleLandingPage(options);

        if (options.dataViews && options.dataViews[0]) {
            //console.log("has dataView");
            const dataView: DataView = options.dataViews[0];

            //this.viewport = options.viewport;
            //const { width, height } = this.viewport;
            //const size = Math.min(width, height);
            //console.log("size: " + size);

            // for every update reset the values
            let imageURL = "";
            let altText = "";
            //console.log("imageURL: " + imageURL);
            //console.log("altText: " + altText);

            let indexImageURL = -1;
            let indexAltText = -1;

            if (dataView.categorical?.categories) {
                // get positions of attributes in dataView columns
                for (let i = 0; i < dataView.categorical.categories.length; i++) {
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
            }

            if( indexImageURL >= 0 || indexAltText >= 0) {
                //console.log("update image with imageURL and altText");
                ReactImage.update({
                    imageURL,
                    altText
                });
            } else  {
                //console.log("reset image because imageURL and altText are empty");
                ReactImage.update({
                    imageURL: "",
                    altText: ""
                });
            }

        } else {
            console.log("clear");
            this.clear();
        }
        
        this.events.renderingFinished(options);
    }

    private clear() {
        ReactImage.update(initialState);
    }
}