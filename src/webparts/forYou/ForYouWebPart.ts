import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import {
  PropertyFieldCollectionData,
  CustomCollectionFieldType,
} from "@pnp/spfx-property-controls/lib/PropertyFieldCollectionData";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "ForYouWebPartStrings";
import ForYou from "./components/ForYou";
import { IForYouProps } from "./components/IForYouProps";
// import { AppIcon } from "../../models/interface";

export interface IForYouWebPartProps {
  description: string;
  collectionData: {
    Name: string;
    Link: string;
    Icon: string;
    iconColor: string;
    cardColor: string;
  }[];
}

export default class ForYouWebPart extends BaseClientSideWebPart<IForYouWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IForYouProps> = React.createElement(
      ForYou,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        collectionData: this.properties.collectionData,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error("Unknown host");
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "Application",
                  panelHeader: "Add an Application",
                  manageBtnLabel: "Add Application",

                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: "Name",
                      title: "Application Name",
                      type: CustomCollectionFieldType.string,
                      required: true,
                    },
                    {
                      id: "Link",
                      title: "Application Link",
                      type: CustomCollectionFieldType.url,
                      required: true,
                    },
                    {
                      id: "Icon",
                      title: "Icons",
                      type: CustomCollectionFieldType.fabricIcon,
                      iconFieldRenderMode: "picker",
                      required: true,
                    },
                    {
                      id: "iconColor",
                      title: "Color",
                      type: CustomCollectionFieldType.color,
                    },
                    {
                      id: "cardColor",
                      title: "Card Color",
                      type: CustomCollectionFieldType.color,
                    },
                  ],

                  disabled: false,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
