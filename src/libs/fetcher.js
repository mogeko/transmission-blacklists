const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const io = require("@actions/io");
const R = require("ramda");

exports.fetchBlocklists = R.curry(async (url, opts) => {
  const { "User-Agent": ua, filename } = opts;
  const outPath = path.join(__dirname, `../../temp/${filename}`);

  if (R.not(await fs.promises.stat(outPath).catch(() => false))) {
    await io.mkdirP(path.dirname(outPath));
    await fs.promises.writeFile(outPath, "");
    await fetch(url, {
      headers: new Headers({ "User-Agent": ua }),
      method: "GET",
    }).then((res) => {
      const outStream = fs.createWriteStream(outPath);
      const gunzip = zlib.createGunzip();

      if (R.endsWith("gz", url)) {
        res.body.pipe(gunzip).pipe(outStream);
      } else {
        res.body.pipe(outStream);
      }
    });
  }

  return fs.createReadStream(outPath);
});
