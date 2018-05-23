# insomnia-plugin-faker
Generate Faker data right within the Insomnia REST Client!

This plugin uses the Faker NPM module to generate "fake" data.

----

Need a random IP address other than "127.0.0.1"?

Looking for a better name than John Doe?

Are you hoping to get creative with adding variety to your data?

Look no further!

## Add Faker Type
Use Template Tags (i.e., CTRL + SPACE, then find "Faker") to add Faker data types.
![Screenshot](https://raw.githubusercontent.com/bbbco/insomnia-plugin-faker/master/readme-ss-add.png)

## Specific Tag
Self-explanatory, basic Faker data type and sub-type selection.
![Screenshot](https://raw.githubusercontent.com/bbbco/insomnia-plugin-faker/master/readme-ss-specific.png)

----

For a complete list of fake data types, refer to the list here: https://www.npmjs.com/package/faker#api-methods

----

## TODO:

* Better handling of the modifier argument (this should only show when an argument is able to passed to the Faker constructor).
* Coercing of the modifier argument into the object type the Faker constructor is expecting.
(Both of these items requires some way to know that what arguments and types the Faker constructor is expecting; if you know of a good way to figure this out, please let me know!)
