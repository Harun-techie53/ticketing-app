class Utils {
  stringTruncate = (str: string, n: number): string => {
    return str.length > n ? str.substring(0, n - 1) + " ...." : str;
  };
  isDefined = (object: { [key: string]: any }, property: any = null) => {
    if (property === null) {
      return typeof object !== "undefined";
    }

    return (
      typeof object !== "undefined" &&
      object &&
      typeof object[property] !== "undefined"
    );
  };

  findInArray = (array: any[] = [], itemToFind: any, key = ""): number => {
    return array.findIndex((item) =>
      key.trim() ? item[key] === itemToFind : item === itemToFind
    );
  };

  isTwoArrayEqual = (array1: any[], array2: any[]): boolean => {
    if (array1.length !== array2.length) return false;

    return array1.every((a: any) => this.findInArray(array2, a) > -1);
  };

  isTwoObjectEqual(obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  // isEmpty = (value: any): boolean => {
  //   return _.isEmpty(value);
  // };

  timeSince = (dateToCompare: Date, dateToCompareWith?: Date): string => {
    const dteToCompareWith: Date = !!dateToCompareWith
      ? dateToCompareWith
      : new Date();
    const dateDiff: number =
      dteToCompareWith.getTime() - dateToCompare.getTime();
    let seconds = Math.floor(dateDiff / 1000);

    const days = seconds / 86400;
    const hours = seconds / 3600;
    const minutes = seconds / 60;

    let dateString: string = "";
    if (days >= 1) {
      dateString = `${Math.floor(days)} days`;
    } else if (hours >= 1 && hours < 24) {
      dateString = Math.floor(hours) + " hr";
    } else if (minutes >= 1 && minutes <= 59) {
      dateString = Math.floor(minutes) + " min";
    } else if (minutes < 1) {
      dateString = Math.floor(seconds) + " sec";
    }
    return dateString;
  };

  isGraterThanOneHour = (
    dateToCompare: Date,
    dateToCompareWith?: Date
  ): boolean => {
    const dteToCompareWith: Date = !!dateToCompareWith
      ? dateToCompareWith
      : new Date();
    const dateDiff: number =
      dteToCompareWith.getTime() - dateToCompare.getTime();
    let seconds = Math.floor(dateDiff / 1000);
    const minutes = seconds / 60;
    return minutes > 59;
  };

  getRelativeTime(dateISOString: string): string {
    const now = new Date();
    const then = new Date(dateISOString);
    const diffMs = now.getTime() - then.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30); // Approximate month

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    if (hours <= 22) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    if (days <= 28) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  stringToDate = (date = "") => {
    if (!date.trim()) return new Date();
    return new Date(date);
  };

  //   getDateTime = (dateString = '', timeString = '') => {
  //     const date = moment();
  //     const dateArray = dateString.split('-');
  //     const month = dateArray[0];
  //     const day = dateArray[1];
  //     const year = dateArray[2];
  //     const timeArray = timeString.split(':');
  //     const hour = timeArray[0];
  //     const minute = timeArray[1];
  //     date
  //       .year(+year)
  //       .month(+month - 1)
  //       .date(+day)
  //       .hour(+hour)
  //       .minute(+minute);
  //     return date;
  //   };

  isHTML = (text: string) => {
    return /<[a-z][\s\S]*>/i.test(text);
  };

  compareTwoDates = (date1: Date, date2: Date): number => {
    let firstDate = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );

    let secondDate = new Date(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    if (firstDate.getTime() < secondDate.getTime()) {
      return -1;
    } else if (firstDate.getTime() > secondDate.getTime()) {
      return 1;
    } else {
      return 0;
    }
  };

  //   formatDate = (value: any, format: string) => {
  //     const date = this.stringToDate(value);
  //     if (date.getFullYear() <= DEFAULT_YEAR) {
  //       return 'N/A';
  //     }
  //     return moment(date).format(format);
  //   };

  //   deepClone = (arg: any): any => {
  //     return _.cloneDeep(arg);
  //   };

  getUserShortName = (name: string) => {
    const arr = name.split(" ");
    const secondLater = arr?.[1]?.[0] ? ` ${arr[1][0]}` : "";
    return arr[0] + secondLater;
  };

  getCookie = (name: string) => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    if (cookieValue) {
      return cookieValue.split("=")[1];
    }
    return undefined;
  };

  formatDateWithOrdinal = (input: string | Date): string => {
    const date = typeof input === "string" ? new Date(input) : input;

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const getOrdinal = (n: number) => {
      const suffixes = ["th", "st", "nd", "rd"];
      const v = n % 100;
      const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
      return `${n < 10 ? "0" + n : n}${suffix}`;
    };

    return `${getOrdinal(day)} ${month}, ${year}`;
  };
}
export const utils = new Utils();
