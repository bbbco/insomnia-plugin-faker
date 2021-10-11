var faker = require('faker');
var isEmpty = require('lodash/isEmpty');
var startCase = require('lodash/startCase');

// List of all types of Fakers. We specify this explicitly since there is
// no easy way to filter out these from the other objects on the faker module.
var fakerTypes = [
  'address',
  'commerce',
  'company',
  'database',
  'datatype',
  'date',
  'finance',
  'git',
  'hacker',
  'helpers',
  'image',
  'internet',
  'lorem',
  'mersenne',
  'music',
  'name',
  'phone',
  'system',
  'time',
  'vehicle',
];

// Creates the scaffolds for Enum options that Insomnia's Template Tags expect
function populateFakerOptions(someArray) {
  return someArray.sort().map(function(key) {
    return {
      displayName: startCase(key),
      value: key,
    };
  });
}
// Creates Faker Sub Types and hides them so that they only show when the
// parent Type is selected
function populateFakerSubOptions() {
  return fakerTypes.map(function(fakerType) {
    var fakerTypeOptions = populateFakerOptions(Object.keys(faker[fakerType]));

    return {
      displayName: startCase(fakerType),
      type: 'enum',
      defaultValue: '',
      options: fakerTypeOptions,
      hide: function(args) { return fakerType !== args[0].value; },
    };
  });
}

function populateFakerLocalizationOptions() {
  return Object.keys(faker.locales).sort().map(function(locale) {
    return {
      displayName: locale,
      value: locale,
    };
  });
}

// Actual Template Tags export that Insomnia expects
module.exports.templateTags = [{
  name: 'faker',
  displayName: 'Faker',
  description: 'Generate Faker data in Insomnia',
  args: [{
    displayName: 'Type',
    type: 'enum',
    options: populateFakerOptions(fakerTypes),
  }].concat(populateFakerSubOptions())
  .concat([{
    displayName: '(Optional) Modifier',
    type: 'string',
    encoding: 'base64',
    description: 'Allows you to pass in a string that some types allow for more fine grained control over the output of the value. See http://marak.github.io/faker.js/faker.html for more info.',
  }, {
    displayName: 'Localization',
    type: 'enum',
    options: populateFakerLocalizationOptions(),
    defaultValue: 'en',
  }]),
  async run(context, type, ...args) {
    // Since we dynamically generate the Faker Type Sub Options, we
    // don't know which argument its stored at, so lets look it up
    var fakerTypeIndex = fakerTypes.indexOf(type);
    // Check to see if we have selected a Sub Type Value
    var subTypeValue = args[fakerTypeIndex];
    // If not, be sure to select the first value from the correct Faker Type
    if (isEmpty(subTypeValue)) {
      subTypeValue = this.args[fakerTypeIndex + 1].options[0].value;
    }
    // Setup faker locale for i18n support
    var fakerLocale = args.slice(-1)[0];
    faker.locale = fakerLocale;
    // Optional Format String
    var formatString = args.slice(-2)[0];

    if (!isEmpty(formatString)) {
      try {
        // Attempt to parse arguments as JSON object or list
        return faker[type][subTypeValue](JSON.parse(formatString));
      } catch (err) {
        try {
          // Attempt to parse as list of arguments
          return faker[type][subTypeValue].apply(undefined, formatString.split(','));
        } catch (err) {
          // Just send as a string
          return faker[type][subTypeValue](formatString);
        }
      }
    } else {
      // Otherwise call out to Faker module without arguments
      return faker[type][subTypeValue]();
    }
  },
}];

