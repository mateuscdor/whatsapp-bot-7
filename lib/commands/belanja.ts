import { ButtonConfig } from "../types";

type Barang = {
  nama: string,
  harga: number
}

const daftarBarang = [
  {
    nama: "aaa",
    harga: 15000
  },
  {
    nama: "bbb",
    harga: 12000
  },
  {
    nama: "ccc",
    harga: 5000
  },
]

let keranjang: Array<Barang> = []

function getBarang()  {
  const button: ButtonConfig[] = [];
    for (let i = 0; i < daftarBarang.length; i++) {
      let { nama } = daftarBarang[i]
      button.push({listTitle: nama, value: `!~${nama}`})
    }
    return button
}

command.on([/\w*/], [''], (mess) => {
  return client.sendButton(mess, {text: "test", buttonText: "list"}, getBarang())
}, {prefix: false})

daftarBarang.forEach(({nama, harga}) => {
  command.on([`${nama}`], [''], (mess) => {
    keranjang.push({nama, harga})
    return client.sendButton(mess, {text: `Terimakasih anda sudah membeli ${nama} dengan harga ${harga}`}, [{reply: 'Lihat Keranjang', value: '!~lihatkeranjang'}])
  })
})

command.on(['lihatkeranjang'], [''], (mess) => {
  let pesan = 'Anda membeli\n-----\n';
  let total = 0;
  keranjang.forEach(({nama, harga}) => {
    pesan += `Nama Barang: ${nama}\nHarga: ${harga}\n`
    total += harga
  })
  pesan += `\nTotal: ${total}`
  return client.sendMessage(mess, {text: pesan})
})

command.on(['hapuskeranjang'], [''], () => {
  keranjang = [];
})