#!/usr/bin/env bash

buckets="s.tarkus.me"

for bucket in $buckets
do
  curl "https://storage.googleapis.com/$bucket/?cors" \
    --request PUT \
    --header "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
    --header "Content-Type: application/xml" \
    --data @- << EOF
<?xml version='1.0' encoding='UTF-8'?>
<CorsConfig>
  <Cors>
    <Origins>
      <Origin>https://tarkus.me</Origin>
      <Origin>https://storage.tarkus.me</Origin>
      <Origin>http://localhost:3000</Origin>
    </Origins>
    <Methods>
      <Method>GET</Method>
      <Method>HEAD</Method>
      <Method>PUT</Method>
      <Method>OPTIONS</Method>
    </Methods>
    <ResponseHeaders>
      <ResponseHeader>Content-Type</ResponseHeader>
      <ResponseHeader>Access-Control-Allow-Origin</ResponseHeader>
    </ResponseHeaders>
    <MaxAgeSec>3600</MaxAgeSec>
  </Cors>
</CorsConfig>
EOF
done


