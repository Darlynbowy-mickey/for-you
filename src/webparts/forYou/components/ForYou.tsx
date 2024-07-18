import * as React from "react";
import { IForYouProps } from "./IForYouProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import "./styles.css";
import { BirthdayClass } from "../../../models/interface";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { forYouState } from "../../../models/stateItems";
import { Icon } from "@fluentui/react";
import "hover.css/css/hover.css";

// import toast, { Toaster } from "react-hot-toast";

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 2,
//   slidesToScroll: 1,
//   fade: true,
// };
export default class ForYou extends React.Component<IForYouProps, forYouState> {
  constructor(props: IForYouProps, state: forYouState) {
    super(props);
    this.state = {
      birthdays: [],
      holidays: [],
      isOpen: false,
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
  // triggerFlow = async (name: string, email: string): Promise<void> => {
  //   // const userId =
  //   //   this.props.context.pageContext.legacyPageContext.userId.toString();
  //   const flowUrl =
  //     "https://prod-00.westeurope.logic.azure.com:443/workflows/b8813d8eb3b847e4922c1d5930e83f2d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4eH8UJAp_yLZ-yjDxTb85HdS8EXTPYGS9puK1mJmtZc";

  //   try {
  //     const userResponse = await fetch("/_api/web/currentUser", {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json;odata=verbose",
  //         "Content-Type": "application/json;odata=verbose",
  //       },
  //     });

  //     if (userResponse.ok) {
  //       const userData = await userResponse.json();
  //       const fullName = userData.d.Title;
  //       const message = (
  //         document.getElementById("birthday-wish") as HTMLInputElement
  //       ).value;
  //       const payload = {
  //         fullName: fullName,
  //         cardName: name,
  //         celebrantEmail: email,
  //         message: message,
  //       };

  //       const response = await fetch(flowUrl, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       });

  //       if (response.ok) {
  //         toast.success(`You've successfully wished ${name} a happy birthday`);
  //       } else {
  //         console.error("Error triggering Power Automate Flow");
  //       }
  //     } else {
  //       toast.error("Error fetching user information from SharePoint");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred");
  //   }
  // };
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
  componentDidMount = async (): Promise<void> => {
    await this.getHolidays();
    await this.fetchBirthdays();
  };
  componentDidUpdate = async (preProps: IForYouProps) => {
    if (preProps.collectionData !== this.props.collectionData) {
    }
  };
  public render(): React.ReactElement<IForYouProps> {
    // const { isOpen } = this.state;
    // const currentDate = new Date();
    // const currentYear = new Date().getFullYear();
    // const dayMonth = this.state.birthdays.filter((item: BirthdayClass) => {
    //   const birthDate = new Date(`${currentYear}-${item.Birth}`);
    //   const day = birthDate.getDate();
    //   const month = birthDate.getMonth() + 1;
    //   const birthdayToday = `${month}/${day}/${currentYear}`;
    //   const formattedBirthday = new Date(birthdayToday);
    //   return (
    //     formattedBirthday.getDate() === currentDate.getDate() &&
    //     formattedBirthday.getMonth() === currentDate.getMonth()
    //   );
    // });
    const { collectionData } = this.props;
    const openInNewTab = (url: string) => {
      window.open(url, "_blank");
    };

    return (
      <div className="flex flex-row p-5 justify-center">
        <div className="rounded-lg h-[488px] w-[500px] bg-sky-950">
          <div className="grid grid-cols-3 place-items-stretch gap-1 p-2">
            {collectionData.map((item, index) => (
              <div key={index} className="flex-item icon-container">
                <div
                  className={`flex h-28 ${
                    item.cardColor ? item.cardColor : "bg-sky-600"
                  }  justify-center items-center hvr-pulse hvr-grow relative group `}
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
                  <span className="icon-overlay">{item.Name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* <div className="">
          <p className="font-bold text-4xl ml-5">For You </p>
          <div className=" flex flex-row m-6">
            <Slider {...settings} className="react-slider">
              {dayMonth.map((item) => {
                <div className="birthday-h flex justify-center items-center">
                  <div
                    className="container rounded-3xl shadow-md p-4 relative h-[446px] w-[490px] bg-white"
                    key={item.ID}>
                    {isOpen && (
                      <Modal isOpen={isOpen} onDismiss={this.closeModal}>
                        <Toaster />

                        <div
                          className="flex flex-col h-full w-full p-4 bg-gray-100 rounded-lg"
                          style={{ width: "600px", height: "600px" }}>
                          <textarea
                            id="birthday-wish"
                            className="border border-gray-300  rounded-lg p-2 mb-4 h-48 r focus:outline-none"
                            placeholder="Enter text here..."
                          />
                          <div className="flex items-center justify-end mb-4">
                            <button
                              className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
                              onClick={() =>
                                this.triggerFlow(item.Title, item.Email)
                              }>
                              Wish
                            </button>
                            <button
                              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg ml-2"
                              onClick={() => this.closeModal()}>
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
                        className=" main-container absolute inset-0 h-[28rem] w-[490px] object-cover rounded-[2.5rem] p-4"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center absolute inset-0 z-10">
                      <div className="flex flex-col items-center justify-center bg-transparent">
                        <p className="roboto-bold mb-3">Happy Birthdays</p>
                        <img
                          id="profile"
                          src={require("../assets/Caleb.jpg")}
                          alt="User"
                          className="rounded-full BdayImage mb-2"
                        />

                        <p className="dancing-script-displayname mb-2 transform -rotate-6">
                          {" "}
                          {item.Title}
                        </p>
                        <button className="UserRoleBtn inria-sans-bold rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white py-2 px-4">
                          {item.Role}
                        </button>

                        <div
                          className="flex flex-row items-center"
                          style={{
                            position: "relative",
                          }}>
                          <button
                            // onClick={this.openModal}
                            title="Birthday Wish..."
                            className="rounded-lg cursor-pointer bg-gradient-to-br from-blue-500 to-green-500 py-2 px-4 mt-3"
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
                </div>;
              })}
            </Slider>
            <div className="bg-white rounded-lg shadow-md p-4 h-[430px] ml-[40px]">
              <div className="h-[446px] w-[450px] overflow-y-auto cal-scroll">
                {this.state.holidays.map((item: IHolidayInterface) => (
                  <div className="space-y-4 m-[30px]">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img src={require("../assets/holiday-icon.png")} />
                      </div>
                      <div className="ml-12 flex flex-grow flex-col">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-normal text-gray-500">
                            {new Date(item.HolidayDate).toLocaleString(
                              "en-us",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <button className="w-20 bg-gray-100 rounded-full text-xs font-normal px-2 py-1 ml-[80px]">
                            {item.HolidayType}
                          </button>
                        </div>
                        <p className="text-lg font-semibold mt-1">
                          {item.Title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}
