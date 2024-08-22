import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { AppIcon } from "../../../models/interface";

export interface IForYouProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  collectionData: {
    Name: string;
    Link: string;
    Icon: string;
    iconColor: string;
    cardColor: string;
  }[];
}
