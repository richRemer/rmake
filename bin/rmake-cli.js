const fs = require("fs");
const join = require("path").join;
const CLI = require("qwcli");
const assign = Object.assign;

var cli = CLI(),
    opts = {verbosity: 0, root: process.cwd()};

cli.bind(CLI.head, (node, script) => assign(opts, {node: node, script: script}));
cli.bind(["-v", "--verbose"], () => opts.verbosity++);
cli.bind(["--root"], root => assign(opts, {root: root}));
cli.bind(CLI.rest, rest => assign(opts, {cmd: rest.shift(), cmdopts: rest}));

cli.parser()(process.argv);

try {
    process.chdir(opts.root);
    rulefile = join(opts.root, "Ruleset");
    ruleset = fs.readFileSync(rulefile, "utf8");
    console.log(ruleset);
} catch (err) {
    if (err.code === "ENOENT") {
        console.error(`missing ruleset: ${rulefile}`);
        process.exit(2);
    } else {
        process.exit(1);
    }
}
