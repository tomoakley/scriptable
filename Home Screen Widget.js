// variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

// To use, add a parameter to the widget with a format of: image.png|padding-top|text-color
// The image should be placed in the iCloud Scriptable folder (case-sensitive).
// The padding-top spacing parameter moves the text down by a set amount.
// The text color parameter should be a hex value.

// For example, to use the image bkg_fall.PNG with a padding of 40 and a text color of red,
// the parameter should be typed as: bkg_fall.png|40|#ff0000

// All parameters are required and separated with "|"

// Parameters allow different settings for multiple widget instances.

const widgetHello = new ListWidget();
const today = new Date();

const widgetInputRAW = args.widgetParameter;

const widgetInput = widgetInputRAW
  ? widgetInputRAW.toString()
  : "widget-large-top.png|80|#FFFFFF"; // to debug

const [bgImage, spacingAmount, widgetColour] = widgetInput.split("|");

// Import and setup Cache
const Cache = importModule("Cache");
const cache = new Cache("HomeScreenWidget");

// iCloud file path
const fm = FileManager.iCloud();
const scriptableFilePath =
  "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
const backgroundImageFileName = bgImage.split(" ").join(""); // Remove spaces from file name
const backgroundImageURL = scriptableFilePath + backgroundImageFileName;

const spacing = parseInt(spacingAmount);

//API_KEY
const API_WEATHER = "1fb7f2a17bbc1123ff44ae0b45022517"; //Load Your api here
const CITY_WEATHER = "2634451"; //add your city ID

// Fetch Image from Url
async function fetchimageurl(url) {
  const request = new Request(url);
  const res = await request.loadImage();
  return res;
}

// Get formatted Date
function getformatteddate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[today.getMonth()] + " " + today.getDate();
}

// Long-form days and months
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Load image from local drive
async function fetchimagelocal(path) {
  const directoryPath = scriptableFilePath + path.split("/")[0];
  const finalPath = scriptableFilePath + path + ".png";
  if (fm.fileExists(finalPath) == true) {
    return finalPath;
  } else {
    //throw new Error("Error file not found: " + path);
    if (fm.fileExists(directoryPath) == false) {
      fm.createDirectory(directoryPath);
    }
    await downloadimg(path);
    if (fm.fileExists(finalPath) == true) {
      return finalPath;
    } else {
      throw new Error("Error file not found: " + path);
    }
  }
}

async function downloadimg(path) {
  const { icon: iconData } = await fetchDataFromUrl(
    "http://a.animedlweb.ga/weather/weathers25_2.json"
  );
  const name = path.replace("_ico", "").split("/")[1];
  const image = await fetchimageurl(iconData[name]);
  fm.writeImage(scriptableFilePath + path + ".png", image);
}

//get Json weather
async function fetchDataFromUrl(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}

// Get Location
/*Location.setAccuracyToBest();
const curLocation = await Location.current();
console.log(curLocation.latitude);
console.log(curLocation.longitude);*/
const wetherurl =
  "http://api.openweathermap.org/data/2.5/weather?id=" +
  CITY_WEATHER +
  "&APPID=" +
  API_WEATHER +
  "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=metric";
//"http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=metric"

const weatherJSON = await fetchDataFromUrl(wetherurl);
const cityName = weatherJSON.name;
const weatherarry = weatherJSON.weather;
const iconData = weatherarry[0].icon;
const weathername = weatherarry[0].main;
const curTempObj = weatherJSON.main;
const curTemp = curTempObj.temp;
const highTemp = curTempObj.temp_max;
const lowTemp = curTempObj.temp_min;
const feel_like = curTempObj.feels_like;

const bibleUrl =
  "https://beta.ourmanna.com/api/v1/get/?format=json&order=random";

async function fetchBibleVerse() {
  const dateKey = new Date().toISOString().split("T")[0].replace(/\-/g, "_");
  const cachedBibleVerse = await cache.read(dateKey);
  const verse = !cachedBibleVerse
    ? (await fetchDataFromUrl(bibleUrl)).verse.details
    : cachedBibleVerse;
  if (!cachedBibleVerse) {
    cache.write(dateKey, verse);
  }
  return verse;
}

// Greetings arrays per time period.
const greetingsMorning = ["Good morning, Tom."];
const greetingsAfternoon = ["Good afternoon, Tom."];
const greetingsEvening = ["Good evening, Tom."];
const greetingsNight = ["Good night, Tom."];
const greetingsLateNight = ["Good night, Tom."];

// Holiday customization
const holidaysByKey = {
  // month,week,day: datetext
};

const holidaysByDate = {
  // month,date: greeting
  "1,1": "Happy " + today.getFullYear().toString() + "!",
  "12,25": "Merry Christmas!",
};

const holidayKey =
  (today.getMonth() + 1).toString() +
  "," +
  Math.ceil(today.getDate() / 7).toString() +
  "," +
  today.getDay().toString();

const holidayKeyDate =
  (today.getMonth() + 1).toString() + "," + today.getDate().toString();

// Date Calculations
const weekday = days[today.getDay()];
const month = months[today.getMonth()];
const date = today.getDate();
const hour = today.getHours();

// Append ordinal suffix to date
function ordinalSuffix(input) {
  if (input % 10 == 1 && date != 11) {
    return input.toString() + "st";
  } else if (input % 10 == 2 && date != 12) {
    return input.toString() + "nd";
  } else if (input % 10 == 3 && date != 13) {
    return input.toString() + "rd";
  } else {
    return input.toString() + "th";
  }
}

// Generate date string
const datefull = weekday + ", " + month + " " + ordinalSuffix(date);

// Support for multiple greetings per time period
function randomGreeting(greetingArray) {
  return Math.floor(Math.random() * greetingArray.length);
}

const greeting = (() => {
  switch (true) {
    case hour < 5 && hour >= 1:
      // 1am - 5am
      return greetingsLateNight[randomGreeting(greetingsLateNight)];
    case hour >= 23 || hour < 1:
      // 11pm - 1am
      return greetingsNight[randomGreeting(greetingsNight)];
    case hour < 12:
      // Before noon (5am - 12pm)
      return greetingsMorning[randomGreeting(greetingsMorning)];
    case hour >= 12 && hour <= 17:
      // 12pm - 5pm
      return greetingsAfternoon[randomGreeting(greetingsAfternoon)];
    case hour > 17 && hour < 23:
      // 5pm - 11pm
      return greetingsEvening[randomGreeting(greetingsEvening)];
    default:
      return new String("Howdy.");
  }
})();

// Overwrite greeting if calculated holiday
if (holidaysByKey[holidayKey]) {
  greeting = holidaysByKey[holidayKey];
}

// Overwrite all greetings if specific holiday
if (holidaysByDate[holidayKeyDate]) {
  greeting = holidaysByDate[holidayKeyDate];
}

// Try/catch for color input parameter
try {
  widgetColour.toString();
} catch (e) {
  throw new Error("Please long press the widget and add a parameter.");
}

const themeColor = new Color(widgetColour.toString());

/* --------------- */
/* Assemble Widget */
/* --------------- */

const hStack = widgetHello.addStack();
hStack.layoutHorizontally();

// Date label in stack
const dateText = hStack.addText(datefull + "\xa0\xa0\xa0\xa0");
dateText.font = Font.lightSystemFont(18);
dateText.textColor = themeColor;

// add weather icon
const weatherIconPath = await fetchimagelocal(`weather/_${iconData}_ico`);
if (weatherIconPath != null) {
  const weatherIcon = hStack.addImage(Image.fromFile(weatherIconPath));
  weatherIcon.imageSize = new Size(20, 20);
  weatherIcon.centerAlignImage();
}

//tempeture label in stack
const tempLabel = hStack.addText(
  "\xa0\xa0" + Math.round(curTemp).toString() + "\u2103"
);
tempLabel.font = Font.lightSystemFont(18);
tempLabel.textColor = themeColor;
tempLabel.centerAlignText();

widgetHello.addSpacer(15);

// Greeting label
const greetingLabel = widgetHello.addText(greeting);
greetingLabel.font = Font.regularSystemFont(30);
greetingLabel.textColor = themeColor;

widgetHello.addSpacer(50);

const bibleVerseOfDay = await fetchBibleVerse();
const bibleVerseText = widgetHello.addText(bibleVerseOfDay.text)
bibleVerseText.font = Font.lightSystemFont(16);
bibleVerseText.textColor = themeColor;
const bibleVerseRef = widgetHello.addText(bibleVerseOfDay.reference)
bibleVerseRef.font = Font.lightSystemFont(14);
bibleVerseRef.textColor = themeColor;

// Bottom Spacer
// widgetHello.addSpacer();
widgetHello.setPadding(0, 0, 0, 0);

// Background image
widgetHello.backgroundImage = Image.fromFile(backgroundImageURL);

// Set widget
Script.setWidget(widgetHello);
