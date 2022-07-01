const { faker } = require("@faker-js/faker");
const properCase = require("proper-case");

// List of all types of Fakers. We specify this explicitly since there is
// no easy way to filter out these from the other objects on the faker module.
const fakerTypes = [
  "address",
  "animal",
  "color",
  "commerce",
  "company",
  "database",
  "datatype",
  "date",
  "finance",
  "git",
  "hacker",
  "helpers",
  "image",
  "internet",
  "lorem",
  "mersenne",
  "music",
  "name",
  "phone",
  "random",
  "science",
  "system",
  "unique",
  "vehicle",
  "word",
];

// Creates the scaffolds for Enum options that Insomnia's Template Tags expect
populateFakerOptions = function (someArray) {
  return someArray.sort().map(function (key) {
    return {
      displayName: properCase(key),
      value: key,
    };
  });
};
// Creates Faker Sub Types and hides them so that they only show when the
// parent Type is selected
populateFakerSubOptions = function () {
  return fakerTypes.map(function (fakerType) {
    let objPropertyNames = Object.getOwnPropertyNames(faker[fakerType]).filter(
      function (item) {
        const funArray = ["length", "name"];
        const objPropertyArray = Object.getOwnPropertyNames(
          faker[fakerType][item]
        );
        return (
          item != "faker" &&
          objPropertyArray.length == funArray.length &&
          objPropertyArray.every((v) => funArray.indexOf(v) >= 0)
        );
      }
    );
    const fakerTypeOptions = populateFakerOptions(objPropertyNames);
    return {
      displayName: properCase(fakerType),
      type: "enum",
      defaultValue: "",
      options: fakerTypeOptions,
      hide: (args) => fakerType != args[0].value,
    };
  });
};

populateFakerLocalizationOptions = function () {
  return Object.keys(faker.locales)
    .sort()
    .map(function (locale) {
      return {
        displayName: locale,
        value: locale,
      };
    });
};

// Actual Template Tags export that Insomnia expects
module.exports.templateTags = [
  {
    name: "faker",
    displayName: "Faker",
    description: "Generate Faker data in Insomnia",
    args: [
      {
        displayName: "Type",
        type: "enum",
        options: populateFakerOptions(fakerTypes),
      },
    ]
      .concat(populateFakerSubOptions())
      .concat([
        {
          displayName: "(Optional) Modifier",
          type: "string",
          encoding: "base64",
          description:
            "Allows you to pass in a string that some types allow for more fine grained control over the output of the value. See https://github.com/faker-js/faker for more info.",
        },
        {
          displayName: "Localization",
          type: "enum",
          options: populateFakerLocalizationOptions(),
          defaultValue: "en",
        },
      ]),
    async run(context, type, ...args) {
      // Since we dynamically generate the Faker Type Sub Options, we
      // don't know which argument its stored at, so lets look it up
      var fakerTypeIndex = fakerTypes.indexOf(type);
      // Check to see if we have selected a Sub Type Value
      var subTypeValue = args[fakerTypeIndex];
      // If not, be sure to select the first value from the correct Faker Type
      if (subTypeValue == "") {
        subTypeValue = this.args[fakerTypeIndex + 1].options[0].value;
      }
      // Setup faker locale for i18n support
      var fakerLocale = args.slice(-1)[0];
      faker.locale = fakerLocale;
      // Optional Format String
      var formatString = args.slice(-2)[0];
      if (formatString != "") {
        try {
          // Attempt to parse arguments as JSON object or list
          console.log(
            `Attempting to parse as JSON object`,
            JSON.parse(formatString)
          );
          const formattedString = JSON.parse(formatString);
          try {
            const formattedStringArray =
              formattedString.constructor === Array
                ? formattedString
                : Array(formattedString);
            return faker[type][subTypeValue].apply(null, formattedStringArray);
          } catch (_err) {
            return faker[type][subTypeValue](formattedString);
          }
        } catch (_err) {
          try {
            // Attempt to parse as list of arguments
            console.log(
              `Attempting to parse as list / array`,
              formatString.split(",")
            );
            return faker[type][subTypeValue].apply(
              null,
              formatString.split(",")
            );
          } catch (_err) {
            // Just send as a string
            return faker[type][subTypeValue](formatString);
          }
        }
      } else {
        // Otherwise call out to Faker module without arguments
        return faker[type][subTypeValue]();
      }
    },
  },
];
