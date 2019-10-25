const STREET_VIEW_URL = 'https://maps.googleapis.com/maps/api/streetview';
const VISION_URL = 'https://vision.googleapis.com/v1/images:annotate';

//set the following variables
const KEY = '';
//These must be the same as defined in terraform
const BUCKET_NAME = '';
const DATASET_NAME = '';
const TABLE_NAME = '';

//Will save the resulting image to a file and return the image as a base64 encoded string
function getStreetViewImage(address) {
  return new Promise(function(resolve, reject) {
    const request = require('request-promise');
    const fs = require('fs');
  
    const SIZE = '600x400';

    let options = {
      uri: STREET_VIEW_URL,
      qs: {
        'location': address,
        'key': KEY,
        'size': SIZE,
        'source': 'outdoor'
      },
      'Accept-Charset': 'utf-8',
      resolveWithFullResponse: true
    }

    let fileName = `${address.replace(/[^a-zA-Z0-9-_ ]+/, '')}.jpeg`;
    request(options)
      .pipe(fs.createWriteStream(fileName, { flags: 'w' }))
      .on('close', () => {
        let result = {
          fileName: fileName,
          imageBase64: fs.readFileSync(fileName, 'base64')
        }
        resolve(result);
      });
  });
}

function getImageText(base64Image) {
  return new Promise(function(resolve, reject) {
    const request = require('request-promise');

    let options = {
      method: 'POST',
      uri: VISION_URL,
      qs: {'key': KEY},
      body: {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION'
              }
            ]
          }
        ]
      },
      json: true // Automatically stringifies the body to JSON
    };

    request(options)
      .then(function (parsedBody) {
          resolve(parsedBody.responses[0].fullTextAnnotation.text);
      })
      .catch(function (err) {
          reject(err);
      });
  });
};

async function saveImage(fileName) {
  const {Storage} = require('@google-cloud/storage');
  const fs = require('fs');
  const storage = new Storage();

  //bucket name here has to be the same as the bucket created through terraform!
  await storage.bucket(BUCKET_NAME).upload(fileName);

  //remove the local file after uploading to Google Cloud
  fs.unlink(fileName, () => null);
}

function writeToBigQuery(row) {
  const {BigQuery} = require('@google-cloud/bigquery');
  const bq = new BigQuery();

  bq
    .dataset(DATASET_NAME)
    .table(TABLE_NAME)
    .insert(row);
}

function processFile(fileName) {
  const fs = require('fs');

  let lineReader = require('readline').createInterface({
    input: fs.createReadStream(fileName)
  });

  lineReader.on('line', function (line) {
    let row = {
      address: line,
      imageBase64: '',
      imageText: '',
      fileName: ''
    };

    getStreetViewImage(line).then(sv => {
      row.imageBase64 = sv.imageBase64;
      row.fileName = sv.fileName;

      saveImage(sv.fileName);
      getImageText(sv.imageBase64).then(text => {
        row.imageText = text;

        writeToBigQuery(row);
      })
    }, console.error);
  })
}

processFile(process.argv[2]);