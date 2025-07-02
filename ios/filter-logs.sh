#!/bin/bash

# Script to filter out ColorSync warnings from iOS build logs
# This script captures the output and filters out the ColorSync warnings

# Function to filter ColorSync warnings
filter_logs() {
    while IFS= read -r line; do
        if [[ ! "$line" =~ \[ColorSync\].*Invalid.*profile.*uRGB.*tags.*(rXYZ|gXYZ).*and.*desc.*overlap ]]; then
            echo "$line"
        fi
    done
}

# If this script is called with arguments, execute them and filter the output
if [ $# -gt 0 ]; then
    "$@" 2>&1 | filter_logs
else
    # Otherwise, just filter stdin
    filter_logs
fi 