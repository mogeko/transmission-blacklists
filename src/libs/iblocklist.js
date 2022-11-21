const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const R = require("ramda");

exports.fetchURLs = R.curry(async (url, { "User-Agent": ua }) => {
  const html = await fetch(url, {
    headers: new Headers({ "User-Agent": ua }),
    method: "GET",
  }).then((res) => res.text());

  const dom = new jsdom.JSDOM(html);

  return R.pipe(
    R.map(R.prop("value")),
    R.filter(R.test(/gz$/))
  )(dom.window.document.querySelectorAll("td input"));
});

exports.fetchBlocklists = R.curry(async (url, { "User-Agent": ua }) => {
  const params = new URL(url).searchParams;
  const outPath = path.join(__dirname, `../../temp/${params.get("list")}`);

  if (R.not(await fs.promises.stat(outPath).catch(() => false))) {
    await fetch(url, {
      headers: new Headers({ "User-Agent": ua }),
    }).then((res) => {
      const outStream = fs.createWriteStream(outPath);
      const gunzip = zlib.createGunzip();
      res.body.pipe(gunzip).pipe(outStream);
    });
  }

  return fs.createReadStream(outPath);
});
