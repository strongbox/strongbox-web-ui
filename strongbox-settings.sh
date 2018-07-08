#!/bin/bash


curl -i -sS -u admin:password -H accept:application/json -H content-type:application/json -X PUT -d '[ "*" ]' http://localhost:48080/api/configuration/cors && echo "" && echo ""
curl -sS -u admin:password -X GET -H "Accept:application/xml" http://localhost:48080/api/configuration/strongbox | sed 's/session-configuration timeout-seconds="30"/session-configuration timeout-seconds="3600"/' > /tmp/strongbox.xml  && echo "" && echo ""
curl -i -s -u admin:password -X PUT -H accept:application/json -H content-type:application/xml -d @/tmp/strongbox.xml http://localhost:48080/api/configuration/strongbox && echo ""  && echo ""
curl -s -u admin:password -X GET -H "Accept:application/xml" http://localhost:48080/api/configuration/strongbox