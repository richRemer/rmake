rmake Ruleset Reference
=======================
A *ruleset* is a UTF-8 encoded file containing a *global block* followed by
zero or more *rule blocks*.  Each block contains lines, each of which can be a
*directive*, a *comment*, or an empty line.  Any *comments* or empty lines are
ignored.  Each *rule block* begins with a `rule` directive, and the *global
block* ends at the first *rule block*.  Within a block, the order of directives
is not significant.

R-vars
------
Directive data may include sequences referencing rmake variables or *r-vars*.
These *r-vars* are context-sensitive.  Not all *r-vars* are available to all
directives, and some *r-vars* may mean different things in different directives.

### % : path r-var
**directives:** `rule` `target`

Inside a `rule` directive, the `%` *r-var* acts as a wildcard matching any path.
Unlike the `**` wildcard, the `%` *r-var* matches files inside sub-directories,
and unlike the `*` wildcard, the `%` *r-var* matches inside sub-directories.  It
functions similar to if you were to match against `**/*` and `*`, and then
combine the results.

Inside a `target` directive, the `%` *r-var* expands to the value matched by the
corresponding `%` *r-var* in the `rule` pattern.

### %* : inputs r-var
**directives:** `cmd`

The `%*` *r-var* evaluates to the rule inputs.  Use the `%*` *r-var* inside a
`cmd` that accepts multiple inputs and generates a single output.

### %< : input r-var
**directives:** `cmd` `target`

The `%<` *r-var* evaluates to a rule input.  If a rule has multiple inputs, the
presence of the `%<` *r-var* inside a `target` or `cmd` directive causes the
directive to undergo expansion, creating multiple targets or executing multiple
commands.

### %> : output r-var
**directives:** `cmd`

The `%>` *r-var* evaluates to a rule output.  If a rule has multiple outputs,
the presence of the `%>` *r-var* inside a `cmd` directive causes the directive
to undergo expansion, executing multiple commands.

### %1..%9 : list expansion r-var
**directives:** `cmd` `target`

The `rule` and `target` directives can contain user-defined lists to generate
multiple inputs or outputs.  The `%1` *r-var* and related *r-vars* evaluate to
the corresponding list expansions from the `rule` or `target` directives, with
`rule` expansions preceding `target` expansions.

Inside a `target` directive, the `%1` *r-var* and related *r-vars* can only
reference list expansions from the `rule` directive.

```
rule {one,a}
    target {two,b}
    cmd echo -n %1 %2,
    # output: one two,one b,a two,a b
```

### %% : literal r-var
**directives:** *all*

Use `%%` to insert a literal "%" character into the directive.

Comments
--------
<code><strong>#</strong><var>comments</var></code>

Comments are ignored by rmake and are not part of any block.

Directives
----------
<code><var>directive</var> [<var>data</var>]</code>

The general form of a directive has a name and optional data.  The available
directives depends on what type of block the directive is found in.  A *global
block* may contain [global directives](#global-directives), while a *rule block*
may contain [rule directives](#rule-directives).

### Global Directives

#### rule: global directive
<code><strong>rule</strong> <var>pattern</var> [<var>pattern</var> ...]</code>

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

#### set: global directive
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

#### cd: rule directive
<code><strong>cd</strong></code>

Change the current working directory to that of the input file before executing
the command for this rule.  Many other build tools -- most notably `make` --
expect or require this.

```
rule Makefile
    cd
    cmd make
```

#### cmd: rule directive
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

#### mkdir: rule directive
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

#### target: rule directive
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
