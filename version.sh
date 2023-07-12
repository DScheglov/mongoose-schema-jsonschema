PACKAGE_NAME=$(npm pkg get name | tr -d '"')
PACKAGE_VERSION=$(npm pkg get version | tr -d '"')
PACKAGE=$PACKAGE_NAME@$PACKAGE_VERSION

PUBLISHED_VERSION=$(npm view $PACKAGE version || echo "")
if [[ -n $PUBLISHED_VERSION ]]; then echo "The version is already published"; exit 1; fi
