import { Icon, Modal } from "@fluentui/react";
import * as React from "react";
import { ISchedule } from "../../../models/interface";

interface Props {
  onDismiss: () => void;
  clockItItems: boolean;
  selectedDay: string;
  selectedEmployees: ISchedule[];
}

const ClockItRecords = ({
  clockItItems,
  onDismiss,
  selectedDay,
  selectedEmployees,
}: Props) => {
  return (
    <Modal isOpen={clockItItems} onDismiss={onDismiss}>
      <div className="p-[1.25rem] h-[600px] w-[700px] rounded-md">
        <div className="flex flex-row justify-between mb-4">
          <h2 className="font-bold text-lg">{selectedDay}</h2>
          <Icon
            className="text-red-600 text-xl cursor-pointer"
            onClick={onDismiss}
            iconName="ChromeClose"
          />
        </div>
        {selectedEmployees.length > 0 ? (
          <div className="divide-y divide-gray-300 overflow-y-auto cal-scroll">
            {selectedEmployees.map((item) => {
              const initial = item.Title.charAt(0);
              return (
                <div
                  key={item.ID}
                  className="flex flex-row justify-between p-[1.25rem]">
                  <div className="flex flex-row gap-4">
                    <div className="relative flex items-center justify-center">
                      <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <p className="text-pink-500 font-bold">{initial}</p>
                      </div>
                    </div>
                    <div className="flex flex-col ">
                      <p className="font-bold text-base">{item.Title}</p>
                    </div>
                  </div>
                  <p>{item.EntryTime}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm font-normal text-gray-500">
            No records for {selectedDay}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ClockItRecords;
