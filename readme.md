# Identify Businesses using Street View images

Given a file containing a list of newline separated addresses, this app will take each address and look up the business storefront using Google's street view API.
The resulting image is then passed to the Vision OCR API where all the text is extracted and stored in BigQuery.
The image is also saved to bucket using the address as the filename.

### Prerequisites

* [Terraform](https://www.terraform.io/) - Infrastructure as code software tool
* [Service Account Key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) - To use a service account outside of GCP, such as on other platforms or on-premises, you must first establish the identity of the service account
* [Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) - Encrypted string that can be used when calling certain APIs that don't need to access private user data
* [Node.js](https://nodejs.org/en/) - An asynchronous event-driven JavaScript runtime

### Installing

Navigate to the 'terraform' folder and run the following command to create the required Google Cloud objects.
```
terraform apply -auto-approve
```
You will be prompted to enter some paramters. It is important to note, the same dataset, table, and bucket names will need to be set in the ../code/index.js file. 

Next, navigate to the 'code' folder and set the values mentioned above in the index.js file. You will also need to set the Google API key.
To call the app run:
```
node index.js [FILENAME]
```
Where [FILENAME] is the path to a local file containing any number of newline separated addresses.

Once the app has run the BigQuery table will now have a row for each of the supplied addresses. Each row will also contain the image in base64, any text extracted from the image, and the name of the corresponding image that is now stored in the Google Cloud bucket.

## Built using

* [Streetview API](https://developers.google.com/maps/documentation/streetview/intro) - Street View Static API lets you embed a static (non-interactive) Street View panorama or thumbnail into your web page
* [Cloud Vision API](https://cloud.google.com/vision/docs/ocr) - The Vision API can detect and extract text from images.

## Authors

* **Brian**

