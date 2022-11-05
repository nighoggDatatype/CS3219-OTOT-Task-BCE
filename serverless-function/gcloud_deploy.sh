# Note that `asia-southeast1` is the Singapore region as of 6 Nov 2022
# 
# NOTE: Run this script in the folder `serverless-function`
# NOTE: Run gcloud init first
#
# Deploy function
gcloud functions deploy nodejs-http-function --gen2 --runtime=nodejs16 --region="asia-southeast1" --source=. --entry-point=serverlessFunction --trigger-http --allow-unauthenticated
# Get function URI
gcloud functions describe nodejs-http-function --gen2 --region asia-southeast1 --format="value(serviceConfig.uri)"