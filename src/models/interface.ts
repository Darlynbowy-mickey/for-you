export interface IEventInterface {
  EventDate: string;
  EventType: string;
  ID: number;
  Title: string;
  Image: string;
  Attachments: boolean;
  Location: string;
  AttachmentFiles: Array<{
    ServerRelativeUrl: string;
    FileName: string;
  }>;
}

export interface IHolidayInterface {
  Title: string;
  HolidayDate: string;
  HolidayType: string;
}
export interface BirthdayClass {
  Title: string;
  Department: string;
  Birth: Date;
  Role: string;
  Email: string;
  EmpImg: string;
  ID: string;
}

export interface AppIcon {
  Name: string;
  Link: string;
  Icon: string;
}
export interface ISchedule {
  ID: string;
  Title: string;
  "Entry Time": string;
  Date: string;
}
