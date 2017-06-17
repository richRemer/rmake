rmake Overview
==============
The `rmake` command is used to build projects using a set of simple rules.

 > the rmake project is currently in early development; documentation is
 > indicative of where the project is heading, but nothing really works yet

Overview
--------
To use rmake, you create a file in your project root called `Ruleset` and
write a set of rules describing how to transform your source code into desired
build targets.  Once you have your rules in place, you run `rmake` from the
project root to build the project.

More information can be found in the [rmake documentation](doc/rmake.md).

Usage
-----
```
rmake [-v] [--project-root=<root>] [<ruleset>]

Examples:
    # default build, executed from project root
    rmake

    # default build, executed from outside the project root
    rmake my-project
    rmake my-project/Ruleset

    # reuse a Ruleset for multiple projects
    rmake --project-root first-project rules/my-Ruleset
    rmake --project-root other-project rules/my-Ruleset
```
