import * as React from "react";
import { IForYouProps } from "./IForYouProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import "./styles.css";
import { BirthdayClass, ISchedule } from "../../../models/interface";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { forYouState } from "../../../models/stateItems";
import { Icon, Modal } from "@fluentui/react";
import "hover.css/css/hover.css";
import toast, { Toaster } from "react-hot-toast";
import ClockItRecords from "./ClockItRecords";
import "@fontsource/dancing-script"; // Defaults to weight 400

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  fade: true,
};
export default class ForYou extends React.Component<IForYouProps, forYouState> {
  constructor(props: IForYouProps, state: forYouState) {
    super(props);
    this.state = {
      birthdays: [],
      holidays: [],
      clockItItems: false,
      isOpen: false,
      clockIt: [],
      selectedEmployees: [],
      selectedDay: "",
      hideItem: false,
    };
  }
  openModal = (): void => {
    this.setState({
      isOpen: true,
    });
  };
  closeModal = (): void => {
    this.setState({ isOpen: false });
  };
  openClockitRecords = (day: string, employees: ISchedule[]) => {
    this.setState({
      clockItItems: true,
      selectedDay: day,
      selectedEmployees: employees,
    });
  };
  closeClockitRecords = (): void => {
    this.setState({ clockItItems: false });
  };
  showClockIt = (): void => {
    this.setState({ hideItem: true });
  };
  hideClockIt = (): void => {
    this.setState({ hideItem: false });
  };

  triggerFlow = async (name: string, email: string): Promise<void> => {
    // const userId =
    //   this.props.context.pageContext.legacyPageContext.userId.toString();
    const flowUrl =
      "https://prod-00.westeurope.logic.azure.com:443/workflows/b8813d8eb3b847e4922c1d5930e83f2d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4eH8UJAp_yLZ-yjDxTb85HdS8EXTPYGS9puK1mJmtZc";

    try {
      const userResponse = await fetch("/_api/web/currentUser", {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const fullName = userData.d.Title;
        const message = (
          document.getElementById("birthday-wish") as HTMLInputElement
        ).value;
        const payload = {
          fullName: fullName,
          cardName: name,
          celebrantEmail: email,
          message: message,
        };

        const response = await fetch(flowUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success(`You've successfully wished ${name} a happy birthday`);
        } else {
          console.error("Error triggering Power Automate Flow");
        }
      } else {
        toast.error("Error fetching user information from SharePoint");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  public getHolidays = async (): Promise<void> => {
    this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Holiday')/items`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
        return response.json();
      })
      .then((response: { value: any[] }) => {
        let _holidays: any[] = [];
        _holidays = _holidays.concat(response.value);
        this.setState({
          holidays: _holidays,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  private fetchBirthdays = async (): Promise<void> => {
    await this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Birthdays')/items?$expand=AttachmentFiles `,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse): Promise<{ value: unknown[] }> => {
        return response.json();
      })
      .then((response: { value: BirthdayClass[] }) => {
        let _birthdays: BirthdayClass[] = [];
        _birthdays = _birthdays.concat(response.value);
        this.setState({
          birthdays: _birthdays,
        });
        console.log("Birthdays: ", response.value);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  public getWorkSchedule() {
    const currentDate = new Date();
    const weekStart = new Date(currentDate.toISOString());
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the start of the week (Sunday)

    const weekEnd = new Date(currentDate.toISOString());
    weekEnd.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Set to the end of the week (Saturday)

    // Format the dates
    const formattedWeekStart = weekStart
      .toISOString()
      .replace(/\.\d{3}Z$/, "Z");
    const formattedWeekEnd = weekEnd.toISOString().replace(/\.\d{3}Z$/, "Z");

    this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('ClockIt Records')/items?$filter= Date ge '${formattedWeekStart}' and Date le '${formattedWeekEnd}'`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
        return response.json();
      })
      .then((response: { value: any[] }) => {
        console.log("Fetched data:", response.value);
        let _items: any[] = [];
        _items = _items.concat(response.value);
        this.setState({
          clockIt: _items,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount = async (): Promise<void> => {
    await this.getHolidays();
    await this.fetchBirthdays();
    await this.getWorkSchedule();
  };
  componentDidUpdate = async (preProps: IForYouProps) => {
    if (preProps.collectionData !== this.props.collectionData) {
    }
  };
  public render(): React.ReactElement<IForYouProps> {
    //Birthday
    const { isOpen, hideItem } = this.state;
    const currentDate = new Date();
    const currentYear = new Date().getFullYear();
    const dayMonth = this.state.birthdays.filter((item: BirthdayClass) => {
      const birthDate = new Date(`${currentYear}-${item.Birth}`);
      const day = birthDate.getDate();
      const month = birthDate.getMonth() + 1;
      const birthdayToday = `${month}/${day}/${currentYear}`;
      const formattedBirthday = new Date(birthdayToday);
      return (
        formattedBirthday.getDate() === currentDate.getDate() &&
        formattedBirthday.getMonth() === currentDate.getMonth()
      );
    });
    //Company apps
    const { collectionData } = this.props;
    const openInNewTab = (url: string) => {
      window.open(url, "_blank");
    };
    // Clockit
    // const { clockIt } = this.state;
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weekdays = daysOfWeek.slice(0, 5);
    const groupedItems: { [key: string]: ISchedule[] } = {};
    weekdays.forEach((day) => {
      groupedItems[day] = this.state.clockIt.filter(
        (item: ISchedule) =>
          new Date(item.Date).toLocaleDateString("en-US", {
            weekday: "long",
          }) === day
      );
    });
    return (
      <div className="flex flex-col p-5 justify-center ">
        <p className="font-bold text-4xl m-6 ml-[260px]">For You </p>

        <div className="flex flex-row gap-7 mx-auto">
          <div className="rounded-3xl shadow-md h-[447px] w-[439px]">
            <div className="flex flex-row m-6">
              {dayMonth.length > 0 ? (
                <Slider {...settings} className="react-slider">
                  {dayMonth.map((item) => {
                    return (
                      <div
                        className=" flex justify-center items-center p-4 relative h-[400px] w-[490px] bg-white"
                        key={item.ID}>
                        {isOpen && (
                          <Modal isOpen={isOpen} onDismiss={this.closeModal}>
                            <Toaster />
                            <div className="flex flex-col h-full w-full p-4 bg-gray-100 rounded-lg">
                              <textarea
                                id="birthday-wish"
                                className="border border-gray-300 rounded-lg p-2 mb-4 h-48 focus:outline-none"
                                placeholder="Enter text here..."
                              />
                              <div className="flex items-center justify-end mb-4">
                                <button
                                  className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 "
                                  onClick={() =>
                                    this.triggerFlow(item.Title, item.Email)
                                  }>
                                  Wish
                                </button>
                                <button
                                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg ml-2"
                                  onClick={this.closeModal}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </Modal>
                        )}

                        <div>
                          <img
                            src={require("../assets/Frame.svg")}
                            alt="no image found"
                            className="main-container absolute inset-0 h-[400px] w-[400px] object-cover rounded-[2.5rem] p-4"
                          />
                        </div>

                        <div className="flex flex-col items-center justify-center absolute inset-0 z-10">
                          <div className="flex flex-col items-center justify-center bg-transparent">
                            <p className="italiana-regular mb-3">
                              Happy Birthday
                            </p>
                            <img
                              id="profile"
                              src={require("../assets/Caleb.jpg")}
                              alt="User"
                              className="rounded-full BdayImage mb-2"
                            />
                            <p className="dancing-script mb-2 transform font-medium text-[40px] -rotate-[5deg]">
                              {item.Title}
                            </p>
                            <button className="UserRoleBtn inria-sans-bold rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white py-2 px-4">
                              {item.Role}
                            </button>
                            <div
                              className="flex flex-row items-center"
                              style={{ position: "relative" }}>
                              <button
                                onClick={this.openModal}
                                title="Send a wish..."
                                className="rounded-lg cursor-pointer bg-gradient-to-br from-blue-500 to-green-500 py-2 px-4 mt-3 hvr-bounce-in"
                                style={{ height: "35px" }}>
                                <img
                                  src={require("../assets/send.svg")}
                                  alt="send icon"
                                  className="h-6 w-6"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <div className="flex h-[447px] w-[439px] justify-center items-center text-center rounded-md shadow-sm">
                  <img
                    src={require("../assets/nobday.jpg")}
                    title="no birthday today"
                    className="absolute w-[386px] h-[380px]"
                  />
                  <p className="relative">No Birthdays Today</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-[447px] w-[345px] bg-white rounded-3xl shadow-md p-3">
            <p className="font-semibold text-2xl">Company Apps</p>
            {collectionData ? (
              <div className="grid grid-cols-2 place-items-stretch gap-[0.15rem] p-[0.25rem]">
                {collectionData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-item icon-container hvr-bounce-in rounded-md hover:z-10">
                    <div
                      className={`flex h-28 ${
                        item.cardColor ? item.cardColor : "bg-sky-600"
                      }  justify-center items-center relative group `}
                      style={{
                        backgroundColor: `${
                          item.cardColor ? item.cardColor : "rgb(2 132 199)"
                        }`,
                      }}>
                      <Icon
                        iconName={item.Icon}
                        className="text-5xl text-white cursor-pointer"
                        onClick={() => openInNewTab(item.Link)}
                      />
                      <span
                        className="icon-overlay cursor-pointer"
                        onClick={() => openInNewTab(item.Link)}>
                        {item.Name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <p className=" flex text-center justify-center items-center text-white text-4xl">
                  No app is found, add an app from the configuration.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col h-[447px] w-[439px] rounded-3xl shadow-md p-2">
            <div className="flex bg-gray-200 h-[81px] items-center text-2xl font-bold mb-3 mt-5 pl-5 rounded-t-[20px] text-left">
              {" "}
              Employee Updates
            </div>
            <div className="flex flex-row justify-between">
              <div className="border border-gray-200 rounded border-solid ml-2 px-4 py-2 w-[334px]">
                ClockIn
              </div>
              <div className="border border-gray-300 px-4 py-2 rounded  hvr-bounce-in">
                {hideItem ? (
                  <Icon
                    iconName="ChevronRight"
                    className="cursor-pointer font-bold text-xl"
                    onClick={this.hideClockIt}
                  />
                ) : (
                  <Icon
                    iconName="ChevronDown"
                    className="cursor-pointer font-bold text-xl"
                    onClick={this.showClockIt}
                  />
                )}
              </div>
            </div>
            {hideItem ? (
              ""
            ) : (
              <div className="flex flex-col divide-y divide-gray-300 overflow-y-auto cal-scroll pt-2 ">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex flex-col p-[1.25rem]">
                    {groupedItems[day].length > 0 ? (
                      <div className="flex flex-row justify-between py-2">
                        <div className="flex flex-row gap-4">
                          <div className="relative flex items-center justify-center">
                            <div className="relative mb-[35px]">
                              {groupedItems[day]
                                .slice(0, 3)
                                .map((item, index) => {
                                  const initial = item.Title.charAt(0);
                                  const colors = [
                                    {
                                      bg: "bg-pink-100",
                                      text: "text-pink-500",
                                    },
                                    {
                                      bg: "bg-customLB",
                                      text: "text-customL",
                                    },
                                    {
                                      bg: "bg-customPeach",
                                      text: "text-customDeepPeach",
                                    },
                                  ];
                                  const color = colors[index];
                                  const positions = [
                                    { top: "top-0", left: "left-0" },
                                    { top: "top-0", left: "left-8" },
                                    { top: "top-4", left: "left-4" },
                                  ];
                                  const position = positions[index];
                                  return (
                                    <div
                                      key={item.ID}
                                      className={`h-8 w-8 ${color.bg} rounded-full flex items-center justify-center absolute ${position.top} ${position.left}`}>
                                      <p className={`${color.text} font-bold`}>
                                        {initial}
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="flex flex-col pl-16">
                            <p className="font-bold text-base mulish">
                              {groupedItems[day][0].Title}
                              {` & ${groupedItems[day].length - 1} more`}
                            </p>
                            <p className="text-sm font-normal mulish">{day}</p>
                          </div>
                        </div>{" "}
                        <Icon
                          iconName="ChevronRight"
                          className="pt-2 cursor-pointer font-bold text-xl
                "
                          onClick={() =>
                            this.openClockitRecords(day, groupedItems[day])
                          }
                        />
                      </div>
                    ) : (
                      <div className="text-sm font-normal text-gray-500">
                        No records for {day}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <ClockItRecords
          clockItItems={this.state.clockItItems}
          onDismiss={this.closeClockitRecords}
          selectedDay={this.state.selectedDay}
          selectedEmployees={this.state.selectedEmployees}
        />
      </div>
    );
  }
}
