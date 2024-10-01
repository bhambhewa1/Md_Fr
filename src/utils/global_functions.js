import Axios from "api/Axios";
import { API } from "api/API";
const moment = require('moment');

export const removeSpacesAndNonASCII = (str) => {
  // Remove non-ASCII characters
  str = str.replace(/[^\x00-\x7F]/g, "");

  // Remove unwanted characters (™ and ®)
  str = str.replace(/[™®]/g, "");

  // Remove spaces from both ends
  str = str.trim();

  // Replace multiple spaces with a single space
  str = str.replace(/\s+/g, " ");

  return str;
};

export const EventsAPIs = async (batchId, eventName) => {
  try {
    const data = {
      batchId,
      email: JSON.parse(localStorage.getItem("Profile_Details"))?.email,
      eventName,
    };

    const res = await Axios.post(API.Events_History, data);
    if(res.data){
      // console.log("api passed",res.data)
    }
  } catch (error) {
    console.log(error);
  }
}

export const dateRange = () => {
  try {
    // const currentDate = '2024-06-14';
    const currentDate = new Date();
    const currentMoment = moment(currentDate);
    const currentDayOfWeek = currentMoment.day();

    let startOfCurrentWeek, endOfCurrentWeek, startOfLastWeek, endOfLastWeek;

    if (currentDayOfWeek < 4) { // If current day is before Thursday
        startOfCurrentWeek = currentMoment.clone().subtract(currentDayOfWeek + 3, 'days'); // Last Thursday
    } else { // If current day is Thursday or after
        startOfCurrentWeek = currentMoment.clone().subtract(currentDayOfWeek - 4, 'days'); // This Thursday
    }

    // endOfCurrentWeek = startOfCurrentWeek.clone().add(6, 'days'); // Upcoming Wednesday
    endOfCurrentWeek = currentMoment.clone();
    startOfLastWeek = startOfCurrentWeek.clone().subtract(7, 'days'); // Last Thursday
    endOfLastWeek = startOfCurrentWeek.clone().subtract(1, 'days'); // Last Wednesday

    return {
        currentWeek: {
            startOfWeek: startOfCurrentWeek.format('YYYY-MM-DD'),
            endOfWeek: endOfCurrentWeek.format('YYYY-MM-DD')
        },
        lastWeek: {
            startOfWeek: startOfLastWeek.format('YYYY-MM-DD'),
            endOfWeek: endOfLastWeek.format('YYYY-MM-DD')
        }
    };
  } catch (error) {
    console.log(error);
  }
}