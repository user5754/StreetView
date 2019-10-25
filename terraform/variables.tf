//project variables
variable project {
  description = "Name of the GCP project that will contain your resources"
}

variable credentials_file {
  description = "Path to your credentials file including filename"
}

//function and bucket variables
variable image_bucket_name {
  description = "Name of the bucket that will store the street view images. Must match bucket name specified in node app"
}

variable location {
  description = "The regional location for the bucket and dataset"
  default = "australia-southeast1"
}

//bigQuery variables
variable dataset_id {
  description = "ID of the dataset. Must match dataset name specified in node app"
}

variable dataset_description {
  description = "Dataset description"
  default = "Holds the tables for OCR related data"
}

variable table_id {
  description = "Id of the table that will hold the data. Must match table name specified in node app"
}

variable schema_file {
  description = "Path to the schema file including filename"
  default = "./schema.json"
}