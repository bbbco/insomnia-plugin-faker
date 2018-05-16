const faker = require('faker');
const properCase = require('proper-case');

// List of all types of Fakers. We specify this explicitly since there is
// no easy way to filter out these from the other objects on the faker module.
var fakerTypes = [
    "address",
    "commerce",
    "company",
    "database",
    "date",
    "finance",
    "hacker",
    "internet",
    "lorem",
    "name",
    "phone",
    "system"
]

// Creates the scaffolds for Enum options that Insomnia's Template Tags expect
populateFakerOptions = function(someArray) {
  return someArray.sort().map(function(key) {
      return {
          displayName: properCase(key),
          value: key
      }
  });
}
// Creates Faker Sub Types and hides them so that they only show when the
// parent Type is selected
populateFakerSubOptions = function() {
    return fakerTypes.map( function(fakerType) {
        var fakerTypeOptions = populateFakerOptions(Object.keys(faker[fakerType]))
        return {
            displayName: properCase(fakerType),
            type: 'enum',
            defaultValue: "",
            options: fakerTypeOptions,
            hide: args => fakerType != args[0].value
        };
    });
}

// Actual Template Tags export that Insomnia expects
module.exports.templateTags = [{
    name: 'faker',
    displayName: 'Faker',
    description: 'Generate Faker data in Insomnia',
    args: [
        {
            displayName: 'Type',
            type: 'enum',
            options: populateFakerOptions(fakerTypes)
        }
    ].concat(populateFakerSubOptions()),
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
        // Actual call out to Faker module
        return faker[type][subTypeValue]();
    }
}];

