rmake
=====
The rmake tool is intended for building software projects.  It uses a set of
user-defined rules to transform source files into target files or intermediate
files.

Ruleset
-------
When rmake is used to build your project, it uses a ruleset file to determine
how project files are handled.  When invoking `rmake` without any arguments, it
will look for a `Ruleset` file in the current directory.  You can also pass the
path to a ruleset file, or to a directory which contains a `Ruleset` file.

**the following invocations all work the same**
```
rmake
rmake .
rmake Ruleset
```

For more information, check the [rmake Reference][reference.md].

Project Root
------------
An rmake build will not operate on files outside of the project root.  The
project root is typically the directory in which the ruleset file is found.  The
`--project-root` option can be used to override this.

**project root and Ruleset**
```
# execute rules from my-project/Ruleset from project root my-project
rmake my-project

# execute rules from my-rules/Ruleset.web from project root my-project
rmake --project-root my-project my-rulese/Ruleset.web
```

Examples
--------
Simple examples for different types of projects.

 * [GNU Make](example/Ruleset-make)
 * [GCC C](example/Ruleset-gcc)
 * [Web](example/Ruleset-web)
