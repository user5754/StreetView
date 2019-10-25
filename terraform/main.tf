provider "google" {
  credentials = file(var.credentials_file)
  project = var.project
  region = ""
  version = "~> 2.14"
}

# Create a bucket that will hold the images from street view
resource "google_storage_bucket" "image_bucket" {
  name = var.image_bucket_name
  location = var.location

  project = var.project
}

# This builds the dataset that will hold all below tables
resource "google_bigquery_dataset" "dataset" {
  dataset_id = var.dataset_id
  description = var.dataset_description
  location = var.location

  project = var.project
}

# Create the table to hold the data
resource "google_bigquery_table" "table" {
  dataset_id = google_bigquery_dataset.dataset.dataset_id
  table_id = var.table_id
  schema = file(var.schema_file)
  project = var.project

  depends_on = [google_bigquery_dataset.dataset]
}