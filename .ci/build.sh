#!/bin/bash

set -e
set -o pipefail
set -x

ESY_VERSION=latest

npmInstallEsy () {
  npm install -g "esy@${ESY_VERSION}"
}

esyInstall () {
  esy install
}

esyBuild () {
  esy build
}

restoreBuildCache () {
  # If organization name is reasonml then REST_BASE will be:
  #   https://dev.azure.com/reasonml/
  REST_BASE="${SYSTEM_TEAMFOUNDATIONCOLLECTIONURI}"
  PROJ="$SYSTEM_TEAMPROJECT"
  ART_NAME="cache-${AGENT_OS}-install"

  fetchLatestBuild() {
    MASTER='branchName=refs%2Fheads%2Fmaster'
    FILTER='deletedFilter=excludeDeleted&statusFilter=completed&resultFilter=succeeded'
    LATEST='queryOrder=finishTimeDescending&$top=1'
    REST_BUILDS="$REST_BASE/$PROJ/_apis/build/builds?${FILTER}&${MASTER}&${LATEST}&api-version=4.1"
    echo "Rest call for builds: $REST_BUILDS"
    REST_BUILDS_RESP=$(curl "$REST_BUILDS")
    if [[ $REST_BUILDS_RESP =~ (\"web\":\{\"href\":\")([^\"]*) ]]; then
      LATEST_BUILD_PAGE="${BASH_REMATCH[2]}";
    else
      LATEST_BUILD_PAGE="";
    fi
    if [[ $REST_BUILDS_RESP =~ (\"badge\":\{\"href\":\")([^\"]*) ]]; then
      LATEST_BUILD_BADGE="${BASH_REMATCH[2]}";
    else
      LATEST_BUILD_BADGE="";
    fi
    if [[ $REST_BUILDS_RESP =~ (\"id\":)([^,]*) ]]; then
      LATEST_BUILD_ID="${BASH_REMATCH[2]}";
    else
      LATEST_BUILD_ID="";
    fi
  }

  fetchLatestBuild
  fetchArtifactURL() {
    REST_ART="$REST_BASE/$PROJ/_apis/build/builds/$LATEST_BUILD_ID/artifacts?artifactName=$ART_NAME&api-version=4.1"
    echo "Rest call for artifacts: $REST_ART"
    if [[ $(curl $REST_ART) =~ (downloadUrl\":\")([^\"]*) ]]; then LATEST_ART_URL="${BASH_REMATCH[2]}"; else LATEST_ART_URL=""; fi
  }
  downloadArtifact() {
    curl "$LATEST_ART_URL" > "${STAGING_DIRECTORY_UNIX}/$ART_NAME.zip"
    cd $STAGING_DIRECTORY_UNIX
    unzip "$ART_NAME.zip"
  }
  fetchArtifactURL
  echo "Using Dependency cache for buildID: $LATEST_BUILD_ID"
  echo "Build log for build that produced the cache: $LATEST_BUILD_PAGE"
  echo "Build badge for build that produced the cache: $LATEST_BUILD_BADGE"
  echo "Build artifact from build that produced the cache: $LATEST_ART_URL"
  downloadArtifact
}
