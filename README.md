# insomnia-plugin-faker

Generate Faker data right within the Insomnia REST Client!

This plugin uses the community-driven [Faker NPM module](https://www.npmjs.com/package/@faker-js/faker) to generate "fake" data.

---

Need a random IP address other than "127.0.0.1"?

Looking for a better name than John Doe?

Are you hoping to get creative with adding variety to your data?

Look no further!

# Installation

This plugin may be installed as discussed in [Insomnia "Managing plugins" documentation](https://support.insomnia.rest/article/26-plugins#managing-plugins).

1. Open Insomnia
2. Go to Application > Preferences
3. Go to "Plugins" tab
4. Type "insomnia-plugin-faker" in the "Install Plugin" field
5. Click "Install Plugin"

# Usage

## Add general Faker Type

Use Template Tags (i.e., CTRL + SPACE, then find "Faker") to add Faker data types.

![Screenshot](https://raw.githubusercontent.com/bbbco/insomnia-plugin-faker/master/readme-ss-add.png)

## Example: randomly generated Zip code

If you want to use a random Zip code in the json body when executing a request:

1. Place cursor on the field where the Zip code should be,
2. Add quotation marks
3. Press CTRL + SPACE, locate "Address" in the list
4. Double-click "Faker ⇒ Address"
5. Select "ZipCode" in "Address" field

![Screenshot](https://raw.githubusercontent.com/bbbco/insomnia-plugin-faker/master/readme-ss-specific.png)

---

For a complete list of fake data types, refer to the list here: https://fakerjs.dev/guide/#overview

---

## Limitations:

Be sure to reference the Faker API docs to determine what type of arguments should be passed to the Optional Modifier argument.

The Optional Modifier argument can take a string, or list of items, or a JSON encoded object as arguments. If you have to pass several arguments in at a time, try wrapping them in square brackets (`[]`).

The Optional Modifier cannot take a callback argument (as in the Helpers > Maybe option), and may not work correctly for every Faker function. YMMV.

## TODO:

- Figure out how to pull the Faker categories out programmatically. Currently, we just define them in a hard-coded array.
- Better handling of the modifier argument (this should only show when an argument is able to passed to the Faker constructor).
- Coercing of the modifier argument into the object type the Faker constructor is expecting.
  (Both of these items requires some way to know that what arguments and types the Faker constructor is expecting; if you know of a good way to figure this out, please let me know!)
