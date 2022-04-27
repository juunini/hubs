npm run deploy &&\
cd dist &&\
aws s3 sync . s3://$1/hubs/ --delete --acl public-read
