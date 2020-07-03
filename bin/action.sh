#!/usr/bin/env bash

# Alternative entrypoint for GitHub Action
# We embed this in our image to avoid rebuilding it at action runtime

usage() {
  echo "Usage: $0 [-c <sha>] [-x <bool>] [-m <string>]" 1>&2
  exit 1
}

while getopts ":c:m:x:" opt; do
  case "${opt}" in
    c)
      commit="$OPTARG"
      ;;
    m)
      message="$OPTARG"
      ;;
    x)
      relaxed="$OPTARG"
      ;;
    *)
      usage
      ;;
  esac
done

if [ -n "$message" ]; then
  echo "$message" | exec /usr/local/bin/commitlint
elif [ -n "$commit" ]; then
  if [ "$relaxed" == "true" ]; then
    # Relaxed validation. Only check if this is a single commit.
    if [ "$(git rev-parse "$commit")" == "$(git rev-parse HEAD)" ]; then
      echo "commitlint HEAD"
      exec /usr/local/bin/commitlint --from "$commit"
    else
      echo "commitlint relaxed, not linting $commit...HEAD"
    fi
  else
    echo "commitlint $commit...HEAD"
    exec /usr/local/bin/commitlint --from "$commit"
  fi
fi
