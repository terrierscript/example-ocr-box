const axios = require("axios")
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
  const r = await axios.get(req.query.url, {
    responseType: "arraybuffer",
  })
  Object.entries(r.headers).map(([k, v]) => {
    console.log(k, v)
    res.setHeader(k, v)
  })
  res.end(r.data)
}
