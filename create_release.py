#!/usr/bin/env python3

# Required GitPython - `pip install gitpython`

from git import Repo
from packaging import version

class DirtyRepoError(Exception):
    pass
class TagsNotFoundError(Exception):
    pass

def get_latest_version(version_list):
    """
    >>> version_list = ["3.3.0", "0.3.1", "latest", "other", "5.3.2"]
    >>> get_latest_version(version_list)
    <Version('5.3.2')>

    >>> version_list = []
    """
    versions = []

    for tag in version_list:
        if isinstance(tag, version.Version):
            tag = tag.name
        elif not isinstance(tag, str):
            raise TypeError("tags must be a Version or str")

        try:
            versions.append(version.Version(tag))
        except:
            pass

    if len(versions) < 1:
        print("no tags found in repo")
        if input("create a new release? (y/n): ") == "y":
            return version.Version("0.0.1")
        
        raise TagsNotFoundError("no tags found in repo")
    versions.sort()
    return versions.pop().name


repo = Repo(".")
if repo.is_dirty():
    raise DirtyRepoError("repo is dirty, commit or stash changes before creating release")

current_version = get_latest_version(repo.tags)

new_version = input(f"Current version is {current_version}. Enter new version: ")
repo.git.tag(new_version)
print(f"tag created for new version {new_version}")
repo.git.push()
repo.git.push("--tags")
print(f"release pushed")
