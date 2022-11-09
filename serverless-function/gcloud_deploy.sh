# Note that `asia-southeast1` is the Singapore region as of 6 Nov 2022
# 
# NOTE: Run this script in the folder `serverless-function`
# NOTE: Beforehand, run one of the following first:
#       - `gcloud init`, if this is the first time setting up gcloud.
#       - `gcloud auth login`, if you have been logged out
#
# Deploy function
gcloud functions deploy nodejs-http-function --gen2 --runtime=nodejs16 --region="asia-southeast1" --source=. --entry-point=serverlessFunction --trigger-http --allow-unauthenticated
# Get function URI
gcloud functions describe nodejs-http-function --gen2 --region asia-southeast1 --format="value(serviceConfig.uri)"