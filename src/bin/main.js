#!/usr/bin/env node

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

const { AeternityClient, Crypto } = require('@aeternity/aepp-sdk')
const { HttpProvider } = AeternityClient.providers
const program = require('commander')
const readline = require('readline')
const url = require('url')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const wallet = {
  priv: process.env['WALLET_PRIV'],
  pub: process.env['WALLET_PUB']
}

function connect (host) {
  const node = url.parse(host)
  const secured = node.protocol === 'https:'
  const port = node.port || (secured ? 443 : 80)

  console.log(`Attempting to connect to ${host}...`)
  const client = new AeternityClient(new HttpProvider(node.hostname, port, { secured }))

  return new Promise((resolve, reject) =>{
    client.base.getHeight().then(height => {
      console.log(`Connected. Current height reported as ${height}`)
      resolve(client)
    }).catch(reject)
  })
}

program
  .version('0.1.0')
  .option('--url [url]', 'Node to connect to', 'http://localhost:3013')
  .parse(process.argv)

const tx = 'th$hQqUV7BY7i64ZFxhxNzQ5Cf2BUUvh9r1r3MpwAUaqfKMWFoeH'

const sig = Crypto.sign(tx, Buffer.from(wallet.priv, 'hex'))

function toBase64 (data) {
  return Buffer.from(data).toString('base64')
}

function fromBase64 (data) {
  return Buffer.from(data, 'base64')
}

function decodeBase58 (data) {
  return Crypto.decodeBase58Check(data.split('$')[1])
}

// const input = [tx, toBase64(sig)]
// console.log(input)
// const json = JSON.stringify(input)
// console.log(json)
// const output = JSON.parse(json)
// console.log(output)

//const bla = 'tx$nor5kyrt1poqJDqbYUasz1sF3jfo98HZPEFQ2q5CdWVm6amDmoBr16ECGyXAZFQjnYprzHGVdCQFTPtx13qFX9RF572HAPjynAnou1fymN4NVXzewiNSSfL9smvkFuZB2JRNyPH5a7d7Lq3Gqsptxj5fVkVM2WCA4KJYfK2NVDzZabvh8b5ZEyihJvkq7kUwD44erh8nUV1VvsJ4RoGpkXGLi5VzG8E2yFKwU3oeDrGBvDNERa3y8mLsqgn2Sy8iuu1UDMYvdhSotYZz5jdyMCa1AVoF1gAPV2BR2EXhJ4bMmNGQztk92pJJr1Uc1LP8Q8p9St1z5uibLHi6KVCQXY4jHbV4S76x6SQY8f57g7oMAsuigyeCscMohTvTxPL8c2jgrAouHXssXEX3p6fjVqtftGMgY5wbjXruW9opw9pHJrpdBg8Piqr5q7D3Sd8XhEiuayiQiVLsGMZ2uGaprReYDnWYKZxhrvx7tYq9KfH2yCE4fqBw2S5BJM5XWoZBhcoB7iomytdWqACr86zSFWMZWtPkDCekUBM5BKXUrN8obK6cFcZbp8k3VsUfBkVUEJqrqi4B3CajnwbjKsr1rQ7UjR72EiHLJPH2UwPCmz4Gu18SLxyM4SWsR5vmv8Ftzjh3vojRkzwHYW8CYPQiKnS5t'

//const bla = 'tx$Pp2r5e8M5wC6Wu4u2CPD7KiXJKSnNNuieB7ozVTU68JsYpaACB491zAPKZEhmKz4F4N4HZYxg9NnxTqMQ236ke7gkUsCA7jzyYsdc3FEPd8jGVUGo9JSGDV8NuYdChshSmmQek5NyZrCLNjFEMddV3JLgGCM56RpMpBbuWBoUaCeG4xykWauEkKFmCs1gfvstJqpAjvHgSXo32oLeoP766eiDDZAm6V8TaM6prB1dDTMMboD13FrVwTFJKM2GPSSe9mFqPoc8BXjCERJVrjGmLKts3TA18PwcNmCdqcARMndtqoXs54AXKndZ53e29VejsfYaV949jffZUm3aYRDF2FskmXxQvQVDsCNpnYEn3pnpnP4zQ4E1DBeyY3tm54jAMsReY7d9RJbGLmWfmKTULo6QH6NhP1bV2MDMBTV3tBYdTPbZaLytgMLk5hYBm37WBCpPkSYx46ueTL9oaLGCiKbkdgzcTWjAoXpkvTmFmxvc3LXZ1e5rkYT1EdYFuTqAzAhVwnAbB4FhuButQ3bCCRpyLEHZZ9dvnBGk2DWgKk98dgBkSaUtrtMs3DXG6pghC61tx1u2o9rT52adrg5EcG6N14pLJ8Peoz4Y59bTt6d5yjPpE9jCrT87LF9eu4Eckg6TCv812wZojTRk4pryVXAQr4YbYeU'

//const bla = 'tx$3MNteekSyPZyPSGpvRPsS5EtNyz1bumDVPVyG5AoHYPUoj7RLhN1Rf7A76Hu1XbNxnBNLWst2GDwVkeFfZHoMshsLLagsA5xeTYmdAK3mq5NQQCyKBLWjRsGsycVsXrnkggGy4kLVuC8JLMxv38Q52LfZd4aVEXPG1a2uxwJ6nUACnXJQSbXEtkPETRpXWYGCq4fVfVsr76JDHrSD4gPNNQReoPXCc1UU5zoxSyfAuc9ukz7ZbnP3u2txd2ArNxJyQijsC51z2ctm2BCN7ugJQHMa2wYWFkYEsv6pZ1N9B3dCU5uB7GZfK99wXg7FxqtjzYGEZ91Ziw65DbHfM8oq5tupjHTcGWgLpnAE3Ac3iUpiUo7Pvk4kVWPcMiB4SCqGsxeZ3mxKvYXWUQGYyGaBYVFqKBfhXq7LbLFk3KpcDXr8XtkrcUEDUwHXnT6V3kJoY7PHGTQJStm1TyKAPEk97AufW6y2KRVumaFyiWguqbHWnScrQpq3vHNPdjkcLMmNyy8Njyig2c7qHonh4CGwcbqf7Xm96h77kJEtCWr52YhgrHJC7pHW6mifg7a19tRfCaXpm5YVyecmr3tCTkDYrAsDZoESJmsPN4ZwZEDjN26N7SEZhpAC6Y6bqhav9FyVrSP2ae399wUziZKZkJufSg'

//const bla = 'tx$8ZK8qUXJzRM4VPaetd6fu6rAS1PUU9JKZYm6uLAKGfpmGqhrx4DNtPboTX2xKfVYJ5MCtQxwhPpoBwACmpCsvAKH6NLApPFsBLRJBtVyKp6Gy7hrS3qWC6ePxcGTtHbX1qao9V5EURGeTV5EqL71kw3CDt5XXKNkU6dMuBuL6NUVrhwp3ZgbDGCsk8wreXavFFQUvLULSpBgb284n5PeSUC3rWN'

//const bla = 'tx$3wu1WL1sXpu1uBHKrN6s6YDbipdWKnkPsBzGzWG1yUocakpwD6P7yKfyK8dBKQ2SJ96kWZVDSXarakTS8Z9pBEXwx66jLPXUexG7YGvSdBhnakTQ8gegVZMYVTGfuydHsZ1M6Axvo1xST8hDPvPiuZDfScm3odiYp2zAUuNRc6qqwZugtBh8JSt8yryZ5DWvyNC35MxynRSGjHjMRVeo2RMHExJE4RsWZuyr5FmwhoaRn3hMwu67FnDueTA7Lf5SzuNJzUc9K6gM8jPv2GuUaEtku2iqNJgSb4ekBQDrkCGaknkCEx8h'

const bla = 'tx$4Q9VRbrE2twg4x1ZvfWRFt2zktUmytRHZET7vYXBu9hExs52BdU7b4CAQFLUKfHQqZhUA2uM9xxUdh9Sj617KaRms1zQ3h4XzpecgFiCPdA8WL7N5AZYF9WhA5BPoccurMMzuX4Jjr7SGLKD2dog27nn3SmkZhZmx9aQC5PVnzfrzczuj93rdbQsKM6v1RCUPqxasgcfLWWAUFTLipwf8K6HDezybapjNBcnWv2ynF98qNKkGHGufs3Qp3V2neKwQg4CuR1wqy1x56gt67hyogzjEvZDLzfDqS1vJrJiVDV8gr5hKi9gXRfajW6qM1ggGM5arVCmTkFCpMy1k856p29sJXUShLr6XxK67zbksYxX9AjPGLhu6dgmUDjogAhr3uyFXSKD48UJ1ok7CfdndfKkn1CBfdDCt3wcYFXnc2Ek3DNuCQdRv761hAum9ETpE7KpNvkxLxVKoVzhiyAzQ16Kdmq5i1Qyoc1CBWSitwUNfjuq5CP3GmyQET5atWSTZhzjoL3pEuLo532EscXW3VbCfTPP'

function decode (encodedTx) {
  //const [tag, version, {tx}, [{block_height}, {block_hash}, {hash}]] = Crypto.decodeTx(encodedTx)
  
  return decodeBase58(tx.toString()).toString()

  //return [tag.toString(), version, fromBase64(tx).toString(), block_height, block_hash.toString(), hash.toString()]
  //return [tag.toString(), version, tx.toString(), block_height, block_hash.toString(), hash.toString()]
}

console.log(decode(bla))

// pub = decodeBase58(lookedUpTransaction.sender)

//const data = [output[0], fromBase64(output[1]), decodeBase58(wallet.pub)]

//console.log(data)
//console.log(Crypto.verify.apply(null, data))

// connect(program.url).then(client => {
//   rl.on('line', line => {
//     console.log(`Received: ${line}`);
//   })
// }).catch(e => {
//   console.log(e.code)
//   process.exit(1)
// })
