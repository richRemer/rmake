rmake Overview
==============
The ``rmake`` command is used to build projects using a set of simple rules.
It is both inspired by and a criticism of **GNU make**.

Basics
------
To use ``rmake``, you create a file in your project root called ``Ruleset`` and
write a set of rules describing how to transform your source code into desired
build targets.

The Ruleset File
----------------
The ``Ruleset`` file in your project contains rules describing how to transform
various source and intermediate files into specified targets, as well as global
declarations which can be used to configure the build as a whole.

### Global Declarations
A global declaration can appear anywhere in the ``Ruleset``, and the order in
which the declarations appear has no effect.  There must be no whitespace
preceding the declaration on the line.
