const glob = require("glob");
const path = require("path");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({
  strict: false,
});
// ensure uri-reference is available
addFormats(ajv);

// use draft-06 jsonschema standard
const draft6MetaSchema = require("ajv/dist/refs/json-schema-draft-06.json");
ajv.addMetaSchema(draft6MetaSchema);

const jsonapiJsonSchema = require("./spec/jsonapi-schema.json");

const validate = ajv.compile(jsonapiJsonSchema);

const validFiles = [];
const errorsByFilename = {};

const jsonapiResponseFiles = glob
  .sync("./spec/test-data/jsonapi/**/*.json")
  .forEach((file) => {
    const data = require(path.resolve(file));
    const validData = validate(data);

    if (!validData) {
      errorsByFilename[file] = validate.errors;
    } else {
      validFiles.push(file);
    }
  });

const invalidFilenames = Object.keys(errorsByFilename);

console.log(
  `The test-data contains ${validFiles.length} valid JSON:API example file(s)`
);
if (invalidFilenames.length > 0) {
  console.error(
    `The test-data contains ${invalidFilenames.length} invalid JSON:API example file(s)`
  );
  invalidFilenames.forEach((invalidFile) => {
    console.error(`\n\n=== ${invalidFile} ===`);
    console.error(errorsByFilename[invalidFile]);
  });
  process.exit(1);
}
