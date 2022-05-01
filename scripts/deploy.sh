node -r @babel/register -r esm -r ./scripts/shim scripts/deploy.js &&\
cd dist &&\
aws s3 sync . s3://$1/hubs/ --delete --acl public-read
