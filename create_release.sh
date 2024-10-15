set -eux

current_version=$(git tag -n | awk '{ print $1 }' | sort | head -n 1)

read -p "Current version is ${current_version}. Enter new version: " new_version

git tag ${new_version}
git push
git push --tags