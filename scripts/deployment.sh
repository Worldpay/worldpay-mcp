#!/bin/bash

invalidArgumentsMessage="Invalid arguments
Usage:
publish -d|--destination=[staging|prod]

staging will publish to https://hydra-014399089400.d.codeartifact.eu-west-1.amazonaws.com/npm/access-checkout-react-native/
prod will publish to https://registry.npmjs.org
"

# Extracting arguments
for i in "$@"
do
case $i in
    -d=*|--destination=*)
    destination="${i#*=}"
    shift
    ;;
    *)
    echo "Unknonwn option $i \n"
    echo $invalidArgumentsMessage
    exit 1
    # unknown option
    ;;
esac
done

if [[ "${destination}" == "staging" ]]; then
  registryAddress="https://hydra-014399089400.d.codeartifact.eu-west-1.amazonaws.com/npm/worldpay-mcp/"
#elif [ "${destination}" == "prod" ]; then
#  registryAddress="https://registry.npmjs.org"
else
  echo "${invalidArgumentsMessage}"
fi

if [[ -z "${registryAddress}" ]]; then
  echo "Registry address is empty, it looks like destination has not been correctly specified \n"
  echo "${invalidArgumentsMessage}"
  exit 1
fi

#echo "Installing dependencies"
#npm install
#
#echo "Building artifacts"
#npm run build

if [ "${destination}" == "staging" ]; then
  echo "Logging in to Codeartifact registry at ${registryAddress} "

  aws codeartifact login --tool npm --repository access-checkout-react-native --domain hydra --domain-owner 014399089400

  if [ $? -ne 0 ]; then
    echo "Stopping publish process and exiting now"
    exit 1
  fi
fi
