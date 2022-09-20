command.on(
  ['a'],
  ["command"],
  (mess) => {
    return client.sendButton(
      mess,
      {
        text: "Selamat datang di Jasa Websiteku. Jasa pembuatan website dengan support terbaik.",
        buttonText: "Daftar Layanan",
      },
      [
        {
          listTitle: "Website Desa",
          value: "!~website_desa",
        },
        {
          listTitle: "Website Berita",
          value: "!~website_berita",
        },
        {
          listTitle: "Website Pendidikan",
          value: "!~website_pendidikan",
        },
      ]
    );
  },
  {
    prefix: true,
  }
);

command.on(["website_desa"], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "Website desa adalah situs online yang berupa sistem informasi untuk administrasi dan pengelolaan pemerintahan desa. Tipe website ini juga menjadi sarana penghubung antara pemerintahan desa dengan para warganya. Website ini merupakan representasi kehidupan desa dalam dunia digital" },
    [
      {
        reply: "Joyce enjoyed eating pancakes with ketchup.",
        value:
          "!~No matter how beautiful the sunset, it saddened her knowing she was one day older.",
      },
      {
        reply:
          "To the surprise of everyone, the Rapture happened yesterday but it didn't quite go as expected.",
        value: "!~He had accidentally hacked into his company's server.",
      },
      {
        reply: "On each full moon",
        value:
          "!~You realize you're not alone as you sit in your bedroom massaging your calves after a long day of playing tug-of-war with Grandpa Joe in the hospital.",
      },
    ]
  );
});
command.on(["website_berita"], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "Website berita adalah jenis website yang dibuat dengan tujuan untuk menyebarluaskan berita atau informasi secara luas di internet. Website berita ini mampu menyedot perhatian banyak orang terutama bagi mereka yang menjadikan website berita sebagai media dan sumber informasi." },
    [
      {
        reply: "They say that dogs are man's best friend, but this cat was setting out to sabotage that theory.",
        value:
          "!~Honestly, I didn't care much for the first season, so I didn't bother with the second.",
      },
      {
        reply:
          "This is a Japanese doll.",
        value: "!~Peanut butter and jelly caused the elderly lady to think about her past.",
      },
      {
        reply: "Nothing seemed out of place except the washing machine in the bar.",
        value:
          "!~They got there early, and they got really good seats.",
      },
    ]
  );
});
command.on(["website_pendidikan"], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "Website pendidikan adalah website yang dibuat khusus untuk instansi pendidikan seperti sekolah, yayasan, kampus. Website ini bisa digunakan sebagai media para pelajar dalam mencari informasi seputar pendidikan yang sedang dijalani, maupun sebagai salah satu sarana pendukung kegiatan belajar mengajar. Website Pendidikan dilengkapi dengan fitur-fitur yang canggih untuk mendukung proses sarana belajar mengajar yang lebih baik." },
    [
      {
        reply: "It doesn't sound like that will ever be on my travel list.",
        value:
          "!~Jason didn’t understand why his parents wouldn’t let him sell his little sister at the garage sale.",
      },
      {
        reply:
          "They looked up at the sky and saw a million stars.",
        value: "!~Red is greener than purple, for sure.",
      },
      {
        reply: "He dreamed of leaving his law firm to open a portable dog wash.",
        value:
          "!~Tomatoes make great weapons when water balloons aren’t available.",
      },
    ]
  );
});


command.on(["No matter how beautiful the sunset, it saddened her knowing she was one day older."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "He strives to keep the best lawn in the neighborhood." }
  );
});
command.on(["He had accidentally hacked into his company's server."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "I'm worried by the fact that my daughter looks to the local carpet seller as a role model." }
  );
});
command.on(["You realize you're not alone as you sit in your bedroom massaging your calves after a long day of playing tug-of-war with Grandpa Joe in the hospital."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "He strives to keep the best lawn in the neighborhood." }
  );
});

command.on(["Honestly, I didn't care much for the first season, so I didn't bother with the second."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "While on the first date he accidentally hit his head on the beam." }
  );
});
command.on(["Peanut butter and jelly caused the elderly lady to think about her past."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "I just wanted to tell you I could see the love you have for your child by the way you look at her." }
  );
});
command.on(["They got there early, and they got really good seats."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "The hand sanitizer was actually clear glue." }
  );
});

command.on(["Jason didn’t understand why his parents wouldn’t let him sell his little sister at the garage sale."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "She cried diamonds." }
  );
});
command.on(["Red is greener than purple, for sure."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "Joyce enjoyed eating pancakes with ketchup." }
  );
});
command.on(["Tomatoes make great weapons when water balloons aren’t available."], ["command"], (mess) => {
  return client.reply(
    mess,
    { text: "Cats are good pets, for they are clean and are not noisy." }
  );
});