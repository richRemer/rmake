rmake Overview
==============
The `rmake` command is used to build projects using a set of simple rules.
It is both inspired by and a criticism of **GNU make**.

Basics
------
To use `rmake`, you create a file in your project root called `Ruleset` and
write a set of rules describing how to transform your source code into desired
build targets.  Once you have your rules in place, you simply run `rmake` from
the project root.

The Ruleset File
----------------
The `Ruleset` file in your project contains rules describing how to transform
various source and intermediate files into specified targets, as well as global
declarations which can be used to configure the build as a whole.

### Global Declarations
A global declaration can appear anywhere in the `Ruleset`, and the order in
which the declarations appear has no effect.  There must be no whitespace
preceding the declaration on the line.

#### Global Declaration - set
The `set` declaration can be used to define a constant which can be used
anywhere else in the `Ruleset`.

 > <code><strong>set</strong> $<var>var</var> <var>value</var></code>

**Example**
```
set $pi 3.14159
command print-pi

rule print-pi
    echo $pi
```

### Rules
Each rule in the `Ruleset` starts with a rule pattern, followed by any number
indented rule instructions.  The rule pattern begins with the keyword `rule`
and must not have any preceding whitespace.  Following the `rule` keyword is
one or more rule patterns, which are matched against a user-specified command
or against project files.

**Example - GNU Make Project**
```
rule Makefile
    cd
    cmd make
```

**Example - GCC C Project**
```
rule src/%.c
    target build/%.o
    mkdir
    cmd gcc -c %< -o %>

rule build/%.o
    target /dist/bin/foo
    mkdir
    cmd gcc %<* -Wall -o %>
```

**Example - Web Project**
```
rule /res/%.scss
    target /dist/%.css
    mkdir
    cmd sass --cache-location /tmp %< > %>

rule /res/image/logo.svg
    target /dist/favicon-{16,32,64,128,256}.png
    cmd rsvg-convert -w %1 -h %1 %< > %>

rule /res/image/logo.svg
    target /dist/image/logo.svg
    cmd cp %< %>
```
