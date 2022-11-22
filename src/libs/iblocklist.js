const fetcher = require("./fetcher");

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
  const filename = params.get("list");

  return fetcher.fetchBlocklists(url, { "User-Agent": ua, filename });
});
