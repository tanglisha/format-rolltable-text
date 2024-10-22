#!/usr/bin/env python3

# Required GitPython - `pip install gitpython`

from git import Repo, Tag
from packaging.version import Version, InvalidVersion

class DirtyRepoError(Exception):
    pass
class TagsNotFoundError(Exception):
    pass

def get_latest_version(version_list):
    """
    >>> from packaging.version import Version
    >>> # Happy path, checks to ensure .1>.23
    >>> version_list = [Version("3.3.0"), Version("5.3.23"), Version("5.3.1"), "latest", "other", Version("1.3.0")]
    >>> get_latest_version(version_list)
    <Version('5.3.23')>

    """
    versions = []

    for tag in version_list:
        if isinstance(tag, Tag):
            tag = tag.name
        if isinstance(tag, Version):
            versions.append(tag)
            continue
        elif not isinstance(tag, str):
            raise TypeError(f"tags must be a Tag or str, got a {type(tag)}")

        try:
            versions.append(Version(tag))
        except (InvalidVersion, ValueError):
            pass

    if len(versions) < 1:
        print("no tags found in repo")
        if input("create a new release? (y/n): ") == "y":
            return Version("0.0.1")
        
        raise TagsNotFoundError("no tags found in repo")
    versions.sort()
    return versions.pop()

def get_repo():
    repo = Repo(".")
    if repo.is_dirty():
        raise DirtyRepoError("repo is dirty, commit or stash changes before creating release")

    return repo

def set_up_tag(repo, tag, msg_file):
    tag_obj = repo.git.tag.create(tag, F=msg_file)
    print(f"tag created for new version {tag}")
    print(tag_obj)
    repo.git.push()
    repo.git.push("--tags")
    print(f"release pushed")

def run():
    repo = get_repo()
    current_version = get_latest_version(repo.tags)

    new_version = input(f"Current version is {current_version}. Enter new version: ")

    print("What changes are in the new version? (opens editor)")
    msg_file = "tmp_msg.txt"
    with open(tmp_msg, "w") as handle:
        handle.writeline("")
        handle.writeline("")
    os.system(f"vim {tmp_msg}")

    set_up_tag(repo, new_version, tmp_msg)

if "__main__" == __name__:
    run()
