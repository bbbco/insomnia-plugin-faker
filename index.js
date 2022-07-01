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
          displayName:
            "(Optional) Modifier [see Faker docs for args usage; construct as JSON or list surrounded by square brackets]",
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
    async run(_context, type, ...args) {
      let returnValue;

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
      var optionalModifier = args.slice(-2)[0];
      if (optionalModifier != "") {
        try {
          // Attempt to parse arguments as JSON object or list
          // console.log(
          //   `Attempting to parse as JSON object`,
          //   JSON.parse(optionalModifier)
          // );
          const optionalModifierObj = JSON.parse(optionalModifier);

          try {
            // Try calling via .apply()
            // .apply() takes second arg of array type, so format it as an Array if not already
            const optionalModifierArray =
              optionalModifierObj.constructor === Array
                ? optionalModifierObj
                : Array(optionalModifierObj);
            returnValue = faker[type][subTypeValue].apply(
              null,
              optionalModifierArray
            );
          } catch (_err) {
            // Otherwise, try calling directly with JSON parsed objects as arguments
            returnValue = faker[type][subTypeValue](optionalModifierObj);
          }
        } catch (_err) {
          try {
            // Attempt to parse as list of arguments
            // console.log(
            //   `Attempting to parse as list / array`,
            //   optionalModifier.split(",")
            // );
            returnValue = faker[type][subTypeValue].apply(
              null,
              optionalModifier.split(",")
            );
          } catch (_err) {
            // If none of that works, just send optional modifier argument as a string
            returnValue = faker[type][subTypeValue](optionalModifier);
          }
        }
      } else {
        // Otherwise call out to Faker module without arguments
        returnValue = faker[type][subTypeValue]();
      }

      if (typeof returnValue !== "string") {
        returnValue = JSON.stringify(returnValue);
      }

      return returnValue;
    },
  },
];
