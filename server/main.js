/*
 * ISC License (ISC)
 * Copyright © 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

const {AeternityClient, Crypto} = require('@aeternity/aepp-sdk')
const {HttpProvider} = AeternityClient.providers
const program = require('commander')
const url = require('url')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const {Client: PgClient} = require('pg')

const wallet = {
  priv: process.env['WALLET_PRIV'],
  pub: process.env['WALLET_PUB']
}

program
  .version('0.1.0')
  .option('-p, --port [port]', 'Port to listen on for requests', '3000')

program.parse(process.argv)

const port = parseInt(program.port)

http.listen(port, () => {
  console.log(`listening on *:${port}`)
})

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

io.on('connection', socket => {
  console.log('a user connected')
})

async function run () {
  const pg = new PgClient()
  await pg.connect()

  const node = url.parse(process.env['EPOCH_NODE'])
  const ae = new AeternityClient(new HttpProvider(node.hostname, node.port, {secured: node.protocol === 'https:'}))

  const {height} = (await pg.query('SELECT height FROM blocks ORDER BY height DESC LIMIT 1')).rows[0]

  
}

run().catch(e => {
  console.log(`Abnormal exit: ${e}`)
  process.exit(1)
})
