import { BirthdayClass, ISchedule } from "./interface";

export interface forYouState {
  holidays: any[];
  birthdays: BirthdayClass[];
  isOpen: boolean;
  clockItItems: boolean;
  selectedDay: string;
  selectedEmployees: ISchedule[];
  clockIt: any[];
  hideItem: boolean;
}
