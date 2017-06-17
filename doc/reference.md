rmake Ruleset Reference
=======================
A **ruleset** is a UTF-8 encoded file containing a **global block** followed by
zero or more **rule blocks**.  Each block contains lines, each of which can be
a **directive**, a **comment**, or an empty line.  Comments and empty lines are
ignored.  Each rule block begins with a `rule` directive, and the global block
ends at the first rule block.  Within a block, the order of directives is not
important.

Comments
--------
Comments begin with a hash `#`.  They are ignored.

```
# useful text can go here
```

Directives
----------
Directives have a name and optional data.  The available directives are found
below.  The general format of all directives is the same.

```
# 'name' directive, with no data
name

# 'name' directive with data 'apple banana'
name    apple banana
```

### Global Directives

#### rule
<code><string>rule</strong> <var>pattern</var> [<var>pattern</var> ...]</code>

Begin a new rule.  Source files and intermediate files matching any of the
patterns become rule inputs.  Paths matching a rule target pattern become rule
outputs.  Rules matching intermediate files become dependent upon the rules
which target the intermediate files.

Rule patterns are matched against paths in the project root.  Patterns starting
with a slash `/` match paths relative to the project root, while other patterns
match paths anywhere in the project.  The `*` and `**` sequences can be used as
normal globs.  The `%` sequence essentially matches anything that would be by
either `*` or `**`.

```
rule /**/*.scss
    target /dist/**/*.css
    cmd sass --cache-location /tmp %< > %>
```

#### set
<code><strong>set</strong> $<var>id</var> <var>value</var></code>

Set value for an identifier which can be referenced inside data for other
directives.  More complicated rulesets can often benefit from defining paths
and other re-usable bits of text in identifiers.

```
set $style  $res/style
set $res    /res

rule $style/%.scss
```

### Rule Directives

#### cd
<code><strong>cd</strong></code>

Change the current working directory to that of the input file before executing
the command for this rule.  Many other build tools -- most notably `make` --
expect or require this.

```
rule Makefile
    cd
    cmd make
```

#### cmd
<code><strong>cmd</strong> <var>command</var></code>

Execute *command* when this rule matches.  If the command executed contains
sequences such as `%<` or `%1`, the command may be executed multiple times, once
per rule expansion.  Otherwise, the command will get executed once, regardless
of how many files are matched by the rule.  Commands are only executed if the
input is newer than the output.

```
# run once for EACH scss file
rule res/%.scss
    target dist/%.css
    cmd sass --cache-location /tmp %< > %>

# run once for ALL js files
rule res/%.js
    target dist/bundle.js
    cmd cat %@ > %>
```

#### mkdir
<code><strong>mkdir</strong></code>

Create target directory before executing the command for this rule.  Many build
tools will fail if the target directory does not exist.

```
# copy files from 'assets' directory to 'public' directory
rule assets/%
    target public/%
    mkdir
    cmd cp %< %>
```

#### target
<code><string>target</strong> <var>pattern</var></code>

Map rule inputs to outputs.  If the target pattern contains `*`, `**`, or `%`
sequences, they are expanded to the corresponding pattern matches in the rule
patterns.  A target pattern sequence without a corresponding rule input sequence
results in an error.

```
# map input files like /icon/user.svg to output /image/user-icon.png
rule /icon/%.svg
    target /image/%-icon.png
```

Escape Sequences
----------------
 * `%` (rule): path match; matches both `**/*` and `*`
 * `%` (target): evaluates to the path matched in the rule
 * `%<`: input; evaluates to rule input file
 * `%>`: output; evaluates to target output file
 * `%@`: inputs; evaluates to all rule input files
 * `%1`..`%9`: numbered rule/target expansions
 * `%%`: literal "%" character
