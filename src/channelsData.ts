import { Channel, MatchHighlight } from "./types";

export const CHANNELS_DATA: Channel[] = [
  {
    "name": "Al-Jazeera HD",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhaBdbL7lCwCj-0NYvOvZtvJGm-yXMAhAYq4u99CmYcBJRJjhVU9SkS8IzwaWy1F1f7EUJqL_fXMWgxA4P9n09QVQrzV1jM5JtPVeNcGeMMA5_HVD4bBYQ97OZN7ijNWa700_po0PVIZEXaCgDDVnjSa6Mv9V33gHPPxLSDH1GNPrQ0AsnIufh3NBbM/s600/Nur_20251026_223118_0000.png",
    "group": "News",
    "url": "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8"
  },
  {
    "name": "Makkah Live 24/7",
    "logo": "https://i.imgur.com/colOISC.jpeg",
    "group": "Islamic",
    "url": "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/makkah.stream/tracks-v1a1/mono.m3u8"
  },
  {
    "name": "Ananda TV",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2RNLiL4qhYEVawGUat1HjjDb693C2K8hUpM7xLiuYciPmjwIQ5j7TIevtcnsHdjGBLIZZJbFTAc4nRoys3vyN-IeEiParo1SNH19m-1IbWG9RPRcW_VoPdSDNfNlFD4NWrKoONwxhgYJuLUzaTQ-LpDoQuqyOMx6meiH7QStygj_kx_Yrs17Dz62ccw/s600/Nur_20251216_221801_0000.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/anandatv/index.m3u8?e=1779283759&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=504b9350b4703116ca4ab20e4013288e"
  },
  {
    "name": "Bangla TV",
    "logo": "https://s3.aynaott.com/storage/e42ecfa90e3d6b15bdb7fea5ef673864",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/banglatv/index.m3u8?e=1779283758&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=f3e9e2737e35147900c0f4add619ead6"
  },
  {
    "name": "Channel 9",
    "logo": "https://s3.aynaott.com/storage/a959f06b4fc9e1421f867b6c1601fe43",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/channel9/index.m3u8?e=1779283756&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=6d1662351f39dd5277df069a01f46fee"
  },
  {
    "name": "Duronto TV",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ10o12m5_heYW_O1b71UxtR_ZtpK9dmjzwh1XaPs3lfC8Ev4CweSEOam1lCJ5Tf0V59Yyba60h-UPffxAIMj78BM-qvY5ZMeEAVJYfJ1lOzP0gQn3zX5_iduoCgPb7y-d2NB6NgJ0Ck7vTkwg9VxjNTtmSs4yHN3SHIyxGoZe00djFk5vh95PuCrF/s600/Nur_20251103_211727_0000.png",
    "group": "Kids",
    "url": "https://tvsen6.aynaott.com/durontotv-live/index.m3u8?e=1779283757&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=3da514e08a15c80daed60a18b3f423fa"
  },
  {
    "name": "Boishakhi TV",
    "logo": "https://s3.aynaott.com/storage/58658d4594ca1ff3c5031c9d8e3d9fc0",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/boishakhitv/index.m3u8?e=1779283755&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=f3f4ec98ffbd9567c21e8b2ee98e32d5"
  },
  {
    "name": "Desh TV",
    "logo": "https://i.postimg.cc/wvBbd56q/Desh-TV.jpg",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/deshtv/index.m3u8?e=1779283755&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9cf4584fd86e1427935f23b30fd28799"
  },
  {
    "name": "RTV",
    "logo": "https://i.postimg.cc/8kmxMkrr/20250529_101852.png",
    "group": "Bangladesh",
    "url": "https://tvsen5.aynaott.com/RtvHD/index.m3u8?e=1779283751&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=678f1f8ec03b1af7b76d013d33f45198"
  },
  {
    "name": "Channel 1",
    "logo": "https://s3.aynaott.com/storage/00da8a07fb26b2fb79359ee535e4c7bc",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/btvctg/index.m3u8?e=1779283747&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9bca925fbdfe526b29d41ab7802348ec"
  },
  {
    "name": "ABC News",
    "logo": "https://s3.aynaott.com/storage/065af1ce1aa68d9d96c27050a8125413",
    "group": "News",
    "url": "https://tvsen6.aynaott.com/AbcNews/index.m3u8?e=1779283763&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=6768af084e787f0340bb860898c7323b"
  },
  {
    "name": "ATN Bangla",
    "logo": "https://s3.aynaott.com/storage/eff41809fca04f7c1da5481e135d7913",
    "group": "Bangladesh",
    "url": "https://tvsen5.aynaott.com/atnbangla/index.m3u8?e=1779283752&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=e20058ae495a80a83ec09cb9d82b9253"
  },
  {
    "name": "Bangla Vision",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735561344354.png",
    "group": "Bangladesh",
    "url": "https://tvsen5.aynaott.com/banglavision/index.m3u8?e=1779283750&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=c6bb7760d6eb9b999205a81ca4f4f51c"
  },
  {
    "name": "Gazi TV",
    "logo": "https://s3.aynaott.com/storage/417a833f6d83021c99bfc3d4176610f4",
    "group": "Bangladesh",
    "url": "https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8?e=1779283754&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=0cdc69aae0d57f2ce93a41a608a3d821"
  },
  {
    "name": "Channel I",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1740567626692.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/channeli/index.m3u8?e=1779283749&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=1d2782c406bc6c9f853716c3dc41a439"
  },
  {
    "name": "Asian TV",
    "logo": "https://www.jagobd.com/wp-content/uploads/2015/12/asiantv.jpg",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/asiantv/index.m3u8?e=1779283756&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=46e2c2d74460202bdd6638ed54273e2a"
  },
  {
    "name": "NTV",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735560841094.png",
    "group": "Bangladesh",
    "url": "https://tvsen5.aynaott.com/ntvbd/index.m3u8?e=1779283750&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=dac30ebda5dba60e895e85ddee645992"
  },
  {
    "name": "ATN News",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1739962961772.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/atnnews/index.m3u8?e=1779283767&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9e9b363bb761a6f0d5547b465dfbbede"
  },
  {
    "name": "Global TV",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXMpIa-Ckqus5ll5uOh9vNZc7_ekC8gzp47_m9tSLqe3KbPGpr2kWhELxLHj-d25HSOh_ys__QnM1ccCK7x_1jeO8KWWj6sg6cZP3u0hJD9QS9nEdWrCCF9qU21nekj758dLm9yaBF9Qw8jxVtY5uuANki_WjX9kEui7iBGf9bpdzCLW1kuodOUTJ5lA/s600/Nur_20251227_140413_0000.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/globaltvhd/index.m3u8?e=1779283760&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9877fe1456ffd7b4e155ff0dc042c176"
  },
  {
    "name": "Mohona TV",
    "logo": "https://i.imgur.com/ENyPcL0.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/mohonatv/index.m3u8?e=1779283762&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=017ac949515fd9b0181090287f362d2b"
  },
  {
    "name": "Maasranga TV",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1773680325498.png",
    "group": "Bangladesh",
    "url": "https://tvsen5.aynaott.com/maasrangatv/index.m3u8?e=1779283753&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=d29aadd6d2d6f7a0a28fabc7830ae6e3"
  },
  {
    "name": "NEXUS TV",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitq58axdbCfGNK8qnGYe7NLyrBUvXyrKC6Ecv8Tz1lAm92MameWti_mim2e6PRquP9dhudYb7k0CqmMmVqrFGVXYV5xzbaNoi07uK3C-Xqz78BNSstr0Q0tRBsrj1V2GXRnNg_jL_iGObQ3FsRUDOBL7AQBsU-85f5gTslDC7oJPHF6z_Rkv9WgIl4Nw/s600/Nur_20251226_221102_0000.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/nexustv/index.m3u8?e=1779283761&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=bbcba35ac711c3545a56b3580503ee00"
  },
  {
    "name": "SA TV",
    "logo": "https://s3.aynaott.com/storage/f710d2ff532cb7e7b75566232c5b72d3",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/satv/index.m3u8?e=1779283757&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=336f19de5e4aacae753d7524d86d1a89"
  },
  {
    "name": "ETV",
    "logo": "https://s3.aynaott.com/storage/8a1af81802b0728c064c2adabcdc72c8",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/etv/index.m3u8?e=1779283752&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=2c4b5c7a7044076e38b667d37971baec"
  },
  {
    "name": "Bijoy TV",
    "logo": "https://s3.aynaott.com/storage/f23d6f82c1a16458fe0e4c6f11b8fd87",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/bijoytv/index.m3u8?e=1779283761&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=5c8b85f4f92c654640f3abdc1ac061c6"
  },
  {
    "name": "My TV",
    "logo": "https://i.postimg.cc/HxGF4V2b/20250529_103226.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/mytv/index.m3u8?e=1779283760&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=0a2ae0189a44e789d3fecffe5a474ec3"
  },
  {
    "name": "Somoy News TV",
    "logo": "https://dl.dropbox.com/s/leielj83em5kg7h/somoy_news.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/somoytv/index.m3u8?e=1779283766&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=269246b8a31fb3a656624d71e10e447d"
  },
  {
    "name": "DBC News",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7DCTzh4b82m6FX8whYDnAqQ_vyjKvEYJrY3W8mBEgxrMxO68aM3kCpYWPX02XIL24fTVB69E5Pz6cAh75mF4ezJxEWlA9Mz0gwW3MqaEje2xroxNd-0dq1hzVKhvE-Ou7HrllVUuEL9ICpkqWdLz05__s0AiKjm18GgoGKsraY_tNvEa0i6uPzzDvZA/s600/Nur_20251226_221330_0000.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/dbcnews/index.m3u8?e=1779283768&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9e5c2851814ffe8483f21f50dfbcb4b9"
  },
  {
    "name": "Ekhon TV",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2rwzM3TeXBFILm0KCzTHqk7WkaIVniq3gkqXny_2h_OJyCxzBVt3RGzHT0M0uHf9dOLNjsSlvNNzk_Ij3Qsqei0S3_Qh7eboeNq8O06tuDaBiW60St_EP_T17ulx5AvyA-Piaj9sLcT6jMJKs9uhTa8-sdf6dfDJgQDdd1yTO3L9Dvmv6Dwl1Ewq_1A/s600/Nur_20251226_221258_0000.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/ekhontv/index.m3u8?e=1779283769&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=d3dc5ee2773ce51cc8c2805a647bf2de"
  },
  {
    "name": "News 24 BD",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ4i3S16Che45JPuFqE6a_-CJo4BDp6RT960bpfO4vhliae9Yrs1KuCovDsJPhGeM-m6iDcn91VXnCYfCZWv-BG2O-kPO36X_nqXG4jUm5WvMm0CVhSvTV3mTQmqStPemFldry_Hi_yYtpH73SYzqim7qqNYxvSsBHhc6134AK8kg_R8BDRj4TNkcMRA/s1080/1000015280.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/news24/index.m3u8?e=1779283769&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=a773d74ac7f54526f02c2840c88335fa"
  },
  {
    "name": "Jamuna TV",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735560213832.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/jamunatv/index.m3u8?e=1779283771&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=2592d440f00d65738bd7f6c5158ce486"
  },
  {
    "name": "Ekattor TV",
    "logo": "https://tstatic.akash-go.com/cms-ui/images/custom-content/1739963327549.png",
    "group": "Bangladesh",
    "url": "https://tvsen6.aynaott.com/ekattorbdtv/index.m3u8?e=1779283770&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=dc7810d37e97e9d5ef235e0781255c24"
  },
  {
    "name": "T Sports HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/500px-T_Sports_logo.svg.png",
    "group": "Sports",
    "url": "https://tvsen7.aynaott.com/tsports-hd/index.m3u8?e=1779283784&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=3b4c5a2cfa872fa7f91ffbfb4aa0f658"
  },
  {
    "name": "Wion",
    "logo": "https://s3.aynaott.com/storage/671cfb22f8d0362ae01403b6e748f2e2",
    "group": "News",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8"
  },
  {
    "name": "Cricket Gold",
    "logo": "https://s3.aynaott.com/storage/7d20b575edc4e4b5276faa8c246e72a4",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/CricketGold/index.m3u8?e=1779283786&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=7c79e4f07ef8bf05e35ecffd9e056652"
  },
  {
    "name": "A sports",
    "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWw7Tog0Vmto_gO32WGjKy2-tX8G-CIdmuZN8QCIla3g&s=10",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/asports/index.m3u8?e=1779283785&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=356b906bf972b824782bb58c1ce0bb22"
  },
  {
    "name": "PTV Sports",
    "logo": "https://i.postimg.cc/sXpJqtm3/Ptv.png",
    "group": "Sports",
    "url": "https://tvsen5.aynaott.com/PtvSports/index.m3u8?e=1779283784&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=db1789e36c278bf538489fac263e0ffb"
  },
  {
    "name": "India Today",
    "logo": "https://s3.aynaott.com/storage/49b496bca6d7c67d53431e9238f83397",
    "group": "News",
    "url": "https://feeds.intoday.in/hltapps/api/master.m3u8"
  },
  {
    "name": "Golf Channel",
    "logo": "https://s3.aynaott.com/storage/edb73991516696dfd53efbd32d80ca58",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/golfchannel/index.m3u8?e=1779283789&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=56943a1262fd47843d1dbaaaf88363bc"
  },
  {
    "name": "Fox Sports 2",
    "logo": "https://s3.aynaott.com/storage/da4282cd107cc3d40efadae488b187e5",
    "group": "Sports",
    "url": "https://tvsen7.aynaott.com/foxsports2/index.m3u8?e=1779283790&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=cbb7f40b4af7be51a91e0629a5ac7238"
  },
  {
    "name": "TV9 Bangla",
    "logo": "https://upload.wikimedia.org/wikipedia/bn/8/80/%E0%A6%9F%E0%A6%BF%E0%A6%AD%E0%A6%BF%E0%A7%AF_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.jpg",
    "group": "India",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9banaen8yq/liveabr/playlist.m3u8"
  },
  {
    "name": "TSN 2",
    "logo": "https://s3.aynaott.com/storage/17642cb60c2af7fc36ca1e08cc54fdae",
    "group": "Sports",
    "url": "https://tvsen7.aynaott.com/tsn2/index.m3u8?e=1779283793&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=636d9b8b83d4316193c2d1c9aad8951c"
  },
  {
    "name": "Talk Sport",
    "logo": "https://s3.aynaott.com/storage/5128cd32518d5a9ba7a37e21947fd8fd",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/talkSPORT/index.m3u8?e=1779283794&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=24b590ae2b7927c00a9acc3a97bc5d86"
  },
  {
    "name": "Espn",
    "logo": "https://s3.aynaott.com/storage/b46df1959322aa48d270a6b163234c76",
    "group": "Sports",
    "url": "https://tvsen5.aynaott.com/espn/index.m3u8?e=1779283793&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=cf2b4cb8b6c96ab86daee4299c792295"
  },
  {
    "name": "Marquee Sports Network",
    "logo": "https://s3.aynaott.com/storage/66bdaa21aba96de6d32a3515715f7502",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/MarqueeSportsNetwork/index.m3u8?e=1779283796&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=a91e537a0eb1a24ed472a508e90fefcc"
  },
  {
    "name": "Sports Grid",
    "logo": "https://s3.aynaott.com/storage/1aa37e387ed56a1260b285558eec7c46",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/SportsGrid/index.m3u8?e=1779283798&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=652ed8ae174a9efdb335fb31355f0fb5"
  },
  {
    "name": "TSN 3",
    "logo": "https://s3.aynaott.com/storage/1cb10107a47db353e35ad78d3160eda7",
    "group": "Sports",
    "url": "https://tvsen7.aynaott.com/tsn3/index.m3u8?e=1779283805&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=fd3b5d71227f183da51caba4325cee10"
  },
  {
    "name": "TSN 1",
    "logo": "https://s3.aynaott.com/storage/59fe7ff434fed04ecec29b4d737ebc95",
    "group": "Sports",
    "url": "https://tvsen7.aynaott.com/tsn1/index.m3u8?e=1779283805&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=e5ce886378c54bd381b9833b5d57649a"
  },
  {
    "name": "Bloomberg TV",
    "logo": "https://s3.aynaott.com/storage/253dcc8b5951160d6aa26bc5ac65ddb8",
    "group": "News",
    "url": "https://tvsen6.aynaott.com/bloombergtv/index.m3u8?e=1779283799&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=ecba4c0cf6ffc82d2d0dfc78f69c1061"
  },
  {
    "name": "News Nation",
    "logo": "https://s3.aynaott.com/storage/1001f1d96d63da3ced733a843613b6e0",
    "group": "News",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/6cd2f649739a45ca9de1daf81cc7d0f2/index.m3u8"
  },
  {
    "name": "NFL Network",
    "logo": "https://s3.aynaott.com/storage/79f1ee920d6931a767ae0030e1c7c12b",
    "group": "Sports",
    "url": "https://tvsen6.aynaott.com/nfl/index.m3u8?e=1779283803&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=1b632116fe249e5c6c5307adc395a1ec"
  },
  {
    "name": "Willow HD TV",
    "logo": "https://s3.aynaott.com/storage/94a778ec3219f7eb54bdf1ee07a95788",
    "group": "Sports",
    "url": "https://tvsen5.aynaott.com/willowhd/index.m3u8?e=1779283803&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=2fe7bf4f892cf09f80087b8146545bad"
  },
  {
    "name": "kolkata TV",
    "logo": "https://s3.aynaott.com/storage/c355110e9cbebd89649a95f0f0fd77da",
    "group": "India",
    "url": "https://tvsen6.aynaott.com/kolkatatv/index.m3u8?e=1779283837&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=8cc8bac4fecb91a1f2e5443bbc180545"
  },
  {
    "name": "Republic Bangla",
    "logo": "https://s3.aynaott.com/storage/18cb20e8e53eb27249c62d3aedf51241",
    "group": "India",
    "url": "https://tvsen5.aynaott.com/R_Bangla/index.m3u8?e=1779283835&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=fd3c370d04fa673a7faa815a98ef3ed9"
  },
  {
    "name": "AMC TV",
    "logo": "https://s3.aynaott.com/storage/5522b7ef736d7f4e7f80ac6325dce821",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/amc/index.m3u8?e=1779283842&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=021858f1b00e00e96d1c4781ed44da4c"
  },
  {
    "name": "pix 11",
    "logo": "https://s3.aynaott.com/storage/294b72dc2ca7b74ab3312059728cab22",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/pix11/index.m3u8?e=1779283842&u=78be6644"
  },
  {
    "name": "Zee 24 Ghanta",
    "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYy4jJoltvhvpRSuk8i6Wm03s40xqEpsla9Q&s",
    "group": "India",
    "url": "https://tvsen6.aynaott.com/zee24/index.m3u8?e=1779283836&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=40021614a85616c858c5a6839f22dcc6"
  },
  {
    "name": "DW News",
    "logo": "https://brandlogos.net/wp-content/uploads/2021/12/deutsche_welle-brandlogo.net_-512x512.png",
    "group": "News",
    "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8"
  },
  {
    "name": "Goal TV",
    "logo": "https://s3.aynaott.com/storage/495e1816602db61aa4c2a348a257bd0a",
    "group": "Sports",
    "url": "https://streams2.sofast.tv/sofastplayout/WiseM3U8_1/master.m3u8"
  },
  {
    "name": "4k Travel TV",
    "logo": "https://s3.aynaott.com/storage/6ccc7357c3d8d35770732126dd819596",
    "group": "Entertainment",
    "url": "https://streams2.sofast.tv/sofastplayout/33c31ac4-51fa-46ae-afd0-0d1fe5e60a80_0_HLS/master.m3u8"
  },
  {
    "name": "DD Sports",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvJ1HtheTbTZjOoXTO9KRK1fIhh1uXhyvSckbf05J7yIcdT4ZucX1fvfjnyiv9QK-m0pBK6MoY6KhcVPQpsRSXdgBFU612nmbKpY864gsoMvMaCyu_fOdNVbx6ADMbz2dftZ7-0Arzx81kC8nqbeduSEsquwrPpzNGm2wZw6rXHe79vlF7DokCavubWA/s600/Nur_20251107_160202_0000.png",
    "group": "Sports",
    "url": "https://cdn-6.pishow.tv/live/13/master.m3u8"
  },
  {
    "name": "TRT World",
    "logo": "https://m.media-amazon.com/images/I/415L9C3sABL.png",
    "group": "News",
    "url": "https://tv-trtworld.medya.trt.com.tr/master.m3u8"
  },
  {
    "name": "RDS Social TV",
    "logo": "https://s3.aynaott.com/storage/f1fbcbc6cd325f5324eabb3bc733584e",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/RDSSocialTV/index.m3u8?e=1779283862&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=fbef4d16f6abea87ad32acccd9c2a28c"
  },
  {
    "name": "Sangeet Bangla",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgrLOUFHDDyqsVLJrykfcAe5h-yLsBYxvRFRtNC0pfFTMvqEwGlRq0gU5jnSOW_L5aWermQ-XYwI8x3an2mI01Fxe5diC1LMXykyw6f_DtJ_GilLz0Mxb_cumqpUmdOy-RAXSFXgX4xRxBMrW6k5VsOcLIYpdczThtec0-Yemkf_jlIgNN_kyCpnBOkA/s600/Nur_20251219_135056_0000.png",
    "group": "Music",
    "url": "https://cdn-4.pishow.tv/live/1143/master.m3u8"
  },
  {
    "name": "HBO",
    "logo": "https://s3.aynaott.com/storage/4a1291716680b5c095d33e106337bb04",
    "group": "Entertainment",
    "url": "https://tvsen5.aynaott.com/hbo/index.m3u8?e=1779283863&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=e4e97ebbe24cbdf38c9cd086323b3039"
  },
  {
    "name": "OAN",
    "logo": "https://s3.aynaott.com/storage/73820738ff3902737f987eb34612b26d",
    "group": "News",
    "url": "https://a-cdn.klowdtv.com/live1/oan_720p/playlist.m3u8"
  },
  {
    "name": "R Plus",
    "logo": "https://s3.aynaott.com/storage/9531f970bb7abf30ac2a48f40838c3a1",
    "group": "India",
    "url": "https://thelegitpro.in/pntv/rplusnews24x7/index.m3u8"
  },
  {
    "name": "KTV Sport Plus",
    "logo": "https://s3.aynaott.com/storage/b54495ee3cdd53ddaa19d1f98120f488",
    "group": "Sports",
    "url": "https://kwtsplta.cdn.mangomolo.com/spl/smil:spl.stream.smil/chunklist.m3u8"
  },
  {
    "name": "Fox 5",
    "logo": "https://s3.aynaott.com/storage/4f6486854be670f7458ab60d0402ee42",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/fox5/index.m3u8?e=1779283866&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=3aab593a32cb4b2754467570e1c42136"
  },
  {
    "name": "Fox business",
    "logo": "https://s3.aynaott.com/storage/20e4602dd584784607e5eff3963cdde6",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/foxbusiness/index.m3u8?e=1779283865&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=c24958e7d2f98a772a97c77e942dc078"
  },
  {
    "name": "Discovery Family",
    "logo": "https://s3.aynaott.com/storage/3f7983c0bc7cacd206dd195a2eff6b10",
    "group": "Entertainment",
    "url": "https://tvsen5.aynaott.com/discoveryfamily/index.m3u8?e=1779283866&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=f8ded49bb7e99514409772c85d44b971"
  },
  {
    "name": "BRAVO",
    "logo": "https://s3.aynaott.com/storage/7604a2c87620363fce86b73731b8035d",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/bravo/index.m3u8?e=1779283867&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=a60fb7d13dd4ea9bfa8669b1fc29a53c"
  },
  {
    "name": "Cowboy Movie Channel",
    "logo": "https://s3.aynaott.com/storage/cb1ab052f5b733bbf600a7a8e3a1164b",
    "group": "Entertainment",
    "url": "https://streams2.sofast.tv/sofastplayout/32eb332e-f644-46e5-ad91-e55ad80d14f7_0_HLS/master.m3u8"
  },
  {
    "name": "COMEDY CENTRAL",
    "logo": "https://s3.aynaott.com/storage/211d55de947bdf03f5c18b7e30e0d98b",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/comedycentral/index.m3u8?e=1779283868&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=dee438a9c2f015c824a618447e11d623"
  },
  {
    "name": "FX TV",
    "logo": "https://s3.aynaott.com/storage/f403cc315ca6269c5fcbf1875c95d329",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/fx/index.m3u8?e=1779283870&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=6a5cabf0ab9a0d4bc794ec00af1f0371"
  },
  {
    "name": "EPIX TV",
    "logo": "https://s3.aynaott.com/storage/c0b0c986890a8c88c3566d93e18cada6",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/epix/index.m3u8?e=1779283869&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=63c6b35b74665280499da54c568ff282"
  },
  {
    "name": "HBO 2",
    "logo": "https://s3.aynaott.com/storage/b64c028d8c0895ed81f3201d5979f7ba",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/hbo2/index.m3u8?e=1779283871&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=c965d65d5d57410abd166c88e5c70c8b"
  },
  {
    "name": "Food Network",
    "logo": "https://s3.aynaott.com/storage/582675c375dfa47c2d66e6639fcd2eac",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/foodnetwork/index.m3u8?e=1779283870&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=dda0004b8e85ccc033f3473846741003"
  },
  {
    "name": "Oman Sports TV",
    "logo": "https://s3.aynaott.com/storage/33f87783637fc95fdb8837ba9344c9e9",
    "group": "Sports",
    "url": "https://partneta.cdn.mgmlcdn.com/omsport/smil:omsport.stream.smil/chunklist.m3u8"
  },
  {
    "name": "HGTV",
    "logo": "https://s3.aynaott.com/storage/be15ed692e22ad4b7dcb9d7251ce32a6",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/hgtv/index.m3u8?e=1779283871&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=b765b233682cebe7bcfb9cc380cd3353"
  },
  {
    "name": "LAFF TV",
    "logo": "https://s3.aynaott.com/storage/ac4e2fb2e4eccd7417e5cc5b5a733369",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/laff/index.m3u8?e=1779283872&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=d3bc12ec0ed6e181f5e328053530e9c7"
  },
  {
    "name": "LIFE TIME",
    "logo": "https://s3.aynaott.com/storage/90258e6758834a12979d27097bee04a7",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/lifetime/index.m3u8?e=1779283872&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=68ae0dcb6c7f8191fdf0362cf9a7ec37"
  },
  {
    "name": "Nat Geo TV",
    "logo": "https://s3.aynaott.com/storage/2dce8297266bbc9c235c27119f914e1b",
    "group": "Documentary",
    "url": "https://tvsen6.aynaott.com/natgeo/index.m3u8?e=1779283873&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=b98710c5aef12640970c358e3a0472e5"
  },
  {
    "name": "TLC HD",
    "logo": "https://s3.aynaott.com/storage/ba3c9fa1144bc65322f8ae3a1bb69cc9",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/tlc_hd/index.m3u8?e=1779283875&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=e1b76eb7edd1d45d50cf85f4bf7a26ef"
  },
  {
    "name": "Travel Channel",
    "logo": "https://s3.aynaott.com/storage/a7f87f1e71905ee14429ed26abd29b2a",
    "group": "Documentary",
    "url": "https://tvsen6.aynaott.com/travelxp/index.m3u8?e=1779283876&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=61edf9ea37355b98aa9524cacb226e3b"
  },
  {
    "name": "SYFY TV",
    "logo": "https://s3.aynaott.com/storage/addd5f3c52326489e02df9aa14bb4ea5",
    "group": "Entertainment",
    "url": "https://tvsen7.aynaott.com/syfy/index.m3u8?e=1779283874&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=e8228a5c9face446d6cc4fd3aa7e6287"
  },
  {
    "name": "WEATHER CHANNEL",
    "logo": "https://s3.aynaott.com/storage/67e08c23033802b4443baf81d1b048bf",
    "group": "News",
    "url": "https://tvsen6.aynaott.com/TheWeatherChannel/index.m3u8?e=1779283877&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=bff83cb7a2fcd3dbef83a9a3c7b969c4"
  },
  {
    "name": "CNBC TV",
    "logo": "https://s3.aynaott.com/storage/16a213d06e7362d97cb6085e70c9b5a2",
    "group": "News",
    "url": "https://tvsen6.aynaott.com/cnbc/index.m3u8?e=1779283878&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=c2df62f70129f9cc7e25ecbdc050b59b"
  },
  {
    "name": "CBS TV",
    "logo": "https://s3.aynaott.com/storage/41536a676b99c1996efbccd8f65df42b",
    "group": "News",
    "url": "https://tvsen7.aynaott.com/cbs/index.m3u8?e=1779283878&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=38581bcdfcfefaccc60cd13023d0c783"
  },
  {
    "name": "MTV",
    "logo": "https://s3.aynaott.com/storage/c0bfcdb40393eb5824907adaaa63a653",
    "group": "Music",
    "url": "https://tvsen6.aynaott.com/mtv/index.m3u8?e=1779283879&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=eabe7b33941d288d3e5759384db43d1c"
  },
  {
    "name": "USA TV",
    "logo": "https://s3.aynaott.com/storage/376b8483457b06dbc5b7b7b327a21ac6",
    "group": "Entertainment",
    "url": "https://tvsen6.aynaott.com/usa/index.m3u8?e=1779283880&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=618f7c1e32e8a9d455697be12191f933"
  },
  {
    "name": "Goldmines Bollywood",
    "logo": "https://s3.aynaott.com/storage/e92e9e2fb70909f3dd30a8d89e644119",
    "group": "India",
    "url": "https://tvsen6.aynaott.com/GoldminesBollywood/index.m3u8"
  },
  {
    "name": "Dangal",
    "logo": "https://s3.aynaott.com/storage/cb1c3e153b951760fb0396cd27b8a715",
    "group": "India",
    "url": "https://tvsen6.aynaott.com/Dangal/index.m3u8?e=1779283890&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=0538e40970744c2993c693c596911e2a"
  },
  {
    "name": "9x Jalwa",
    "logo": "https://s3.aynaott.com/storage/d2d8f00a60dc64dad6c0181cd86f7869",
    "group": "India",
    "url": "https://tvsen6.aynaott.com/9xjalwa/index.m3u8?e=1779283896&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=c537db14645c6338e56ccd72bb375808"
  },
  {
    "name": "Cartoon Network",
    "logo": "https://s3.aynaott.com/storage/a89142109d049ae325fd1681b50bfffb",
    "group": "Kids",
    "url": "https://tvsen5.aynaott.com/cartoonnetwork/index.m3u8?e=1779283917&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=6f8487c9adac23cedcbca869d7d7a595"
  },
  {
    "name": "Disney JR",
    "logo": "https://s3.aynaott.com/storage/31a070024b6516e3738baec70168f0b6",
    "group": "Kids",
    "url": "https://tvsen7.aynaott.com/disneyjr/index.m3u8?e=1779283918&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=5269dc1176c26984cb3eff6a2c891c14"
  },
  {
    "name": "Music India",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFFLa5D9PY1QwJccJVBotkle4QNuD4XX4MH49p3ueGZ9y_76Uf1X98DONGky0xa1gwLHfQkubZNgFJyNpIVZlqKJykCAK1YPjJ73S5DLKj9TD-UN6WepH1tWINUYNlds6wSl-SgLn9SsqnDvnwJv-C5GHL3_JcVVZhk8t5acAKXhRKt03OABgRU1E_Hw/s600/Nur_20251227_140529_0000.png",
    "group": "Music",
    "url": "https://cdn-2.pishow.tv/live/226/master.m3u8"
  },
  {
    "name": "DD Bangla",
    "logo": "https://s3.aynaott.com/storage/e5117c508d18adf0a3f2475eb1fd5a9d",
    "group": "India",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/7ff57cc9046b4c188b51a0d506f36e7f/index_3.m3u8"
  },
  {
    "name": "Enter 10 Bangla",
    "logo": "https://s3.aynaott.com/storage/2b00567c538d392c8050124f0064c4a1",
    "group": "India",
    "url": "https://live-bangla.akamaized.net/liveabr/playlist.m3u8"
  },
  {
    "name": "Moonbug Kids",
    "logo": "https://s3.aynaott.com/storage/d9b8deaf735ee0954260c7b3b61f508d",
    "group": "Kids",
    "url": "https://tvsen6.aynaott.com/MoonbugKids/index.m3u8?e=1779283923&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=52145358ed3be27c1e34ba90b246262a"
  },
  {
    "name": "Disney Channel",
    "logo": "https://s3.aynaott.com/storage/a0c74b576321da5aa33a69806401caf1",
    "group": "Kids",
    "url": "https://tvsen7.aynaott.com/disney/index.m3u8?e=1779283925&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=edae9ca94bed2313e48e56a9085b496d"
  },
  {
    "name": "Khushboo Bangla",
    "logo": "https://upload.wikimedia.org/wikipedia/bn/c/c1/%E0%A6%96%E0%A7%81%E0%A6%B6%E0%A6%AC%E0%A7%81_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE_%E0%A6%9F%E0%A7%87%E0%A6%B2%E0%A6%BF%E0%A6%AD%E0%A6%BF%E0%A6%B6%E0%A6%A8_%E0%A6%9A%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8%E0%A7%87%E0%A6%B2%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.jpeg",
    "group": "India",
    "url": "https://cdn-4.pishow.tv/live/1473/master.m3u8"
  },
  {
    "name": "Bleav Football",
    "logo": "https://s3.aynaott.com/storage/030ec528e912afb9a2ec3b4c5167a928",
    "group": "Sports",
    "url": "https://linear-493.frequency.stream/dist/glewedtv/493/hls/master/playlist.m3u8"
  },
  {
    "name": "Nickelodeon",
    "logo": "https://s3.aynaott.com/storage/bb2375af2d1ff8666f2c24fbcec3c541",
    "group": "Kids",
    "url": "https://tvsen7.aynaott.com/nicklodean/index.m3u8?e=1779283926&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=6cbf077eae56bf7598b035f3c466d2b1"
  },
  {
    "name": "Eman Channel",
    "logo": "https://s3.aynaott.com/storage/09d759c7bb93fa3fb76014c8936201ce",
    "group": "Islamic",
    "url": "https://tvsen6.aynaott.com/eman/index.m3u8?e=1779283935&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=08f8a7c54838dd4274f8b058bbed710e"
  },
  {
    "name": "Deen TV",
    "logo": "https://s3.aynaott.com/storage/66ac3ae1e56001353b69bb5f63ebcc6e",
    "group": "Islamic",
    "url": "https://tvsen7.aynaott.com/deen/index.m3u8?e=1779283935&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=d49bc388cc0adea4907ecc83f4c83c4c"
  },
  {
    "name": "MADANI TV",
    "logo": "https://s3.aynaott.com/storage/813fca9bc7df9a4810efe2eb87c57039",
    "group": "Islamic",
    "url": "https://tvsen7.aynaott.com/MadaniTV/index.m3u8?e=1779283937&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=8e3699711dd88227b533acc570b06a7b"
  },
  {
    "name": "Action Hollywood Movies",
    "logo": "https://s3.aynaott.com/storage/baef6dd41c3ee6fabbb59bb8403cc1eb",
    "group": "Entertainment",
    "url": "https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg01076-lightningintern-actionhollywood-samsungnz/playlist.m3u8"
  },
  {
    "name": "NBC Sports",
    "logo": "https://s3.aynaott.com/storage/0a241a80bf51d2c3b3722531706ce086",
    "group": "Sports",
    "url": "https://xumo-xumoent-vc-122-sjv70.fast.nbcuni.com/live/master.m3u8"
  },
  {
    "name": "Channel Win",
    "logo": "https://s3.aynaott.com/storage/3458d0d9097a8283a94a13374bcbf5c7",
    "group": "Islamic",
    "url": "https://cdn-4.pishow.tv/live/229/master.m3u8"
  },
  {
    "name": "STAR SPORTS2",
    "logo": "https://ctgiptv.com/assets/images/channels/starsports2hd.jpg",
    "group": "Sports",
    "url": "http://198.195.239.50:8095/StarSports2/index.m3u8"
  },
  {
    "name": "STAR SPORTS SELECT1 HD",
    "logo": "https://ctgiptv.com/assets/images/channels/starselect1hd.jpg",
    "group": "Sports",
    "url": "http://198.195.239.50:8095/StarSportsSelect1/index.m3u8"
  },
  {
    "name": "STAR SPORTS SELECT2 HD",
    "logo": "https://ctgiptv.com/assets/images/channels/starselect2hd.jpg",
    "group": "Sports",
    "url": "http://198.195.239.50:8095/StarSportsSelect2/index.m3u8"
  },
  {
    "name": "SONY SPORTS 2 HD",
    "logo": "https://ctgiptv.com/assets/images/channels/sonysports2hd.jpg",
    "group": "Sports",
    "url": "http://198.195.239.50:8095/SonyTenSports2/index.m3u8"
  },
  {
    "name": "SONY SPORTS 5 HD",
    "logo": "https://ctgiptv.com/assets/images/channels/sonysports5hd.jpg",
    "group": "Sports",
    "url": "http://198.195.239.50:8095/SonyTenSports5/index.m3u8"
  },
  {
    "name": "EURO SPORTS HD",
    "logo": "https://ctgiptv.com/assets/images/channels/eurosport.jpg",
    "group": "Sports",
    "url": "http://198.195.239.50:8095/Eurosport/index.m3u8"
  },
  {
    "name": "NAGORIK",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisb8V027N_tNRE9cIcoofgqQJ14K3K9e3N6aY5e8_lZ6cK9c3f_ksKPyl5u_KmZsMJeEZJbFTAc4nRoys3vyN-IeEiParo1SNH19m-1IbWG9RPRcW_VoPdSDNfNlFD4NWrKoONwxhgYJuLUzaTQ-LpDoQuqyOMx6meiH7QStygj_kx_Yrs17Dz62ccw/s600/nagoriktv.jpg",
    "group": "Bangladesh",
    "url": "http://198.195.239.50:8095/nagorik/index.m3u8"
  },
  {
    "name": "Jalsha Movies HD",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPZdDXbsGeDOGhPC-Og7bXRrJxsbaFnZ1IEVB7-bPsJtpvNE9IhcMv0Q5OnUq5GCK9UqE7mzMCZinQaN1NSjk2wqKQFs_dreX5yGnDiXNju5yYT_9BDLC3dThhXRIfKk5XQGNc4oi6qWO3fvw5-9dqydLf6pvyHsq5cske3F1FKKih75cCUk20OKVymg/s600/Nur_20251216_222101_0000.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/JalshaMovies/index.m3u8"
  },
  {
    "name": "COLOR BANGLA",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Colors_Bangla_Logo.svg/512px-Colors_Bangla_Logo.svg.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/ColorsBanglaChinema/index.m3u8"
  },
  {
    "name": "ZEE BANGLA CINEMA HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/5/52/Zee_Bangla_Cinema_Logo.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/ZeeBanglaCinema/index.m3u8"
  },
  {
    "name": "SONY AATH",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sony_Aath_logo.svg/640px-Sony_Aath_logo.svg.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/SonyAath/index.m3u8"
  },
  {
    "name": "STAR PLUS HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/1/18/Star_Plus_logo_2023.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/StarPlus/index.m3u8"
  },
  {
    "name": "SONY TV HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/2/23/Sony_Entertainment_Television_logo_2016.svg",
    "group": "India",
    "url": "http://198.195.239.50:8095/SonyTv/index.m3u8"
  },
  {
    "name": "MORE THAN SPORTS TV",
    "logo": "https://s3.aynaott.com/storage/39174e32d4f8d29a95c881637fe1ecdb",
    "group": "Sports",
    "url": "https://mts1.iptv-playoutcenter.de/mts/mts-web/playlist.m3u8"
  },
  {
    "name": "SONY MAX HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Sony_Max_logo_2023.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/SonyMAX/index.m3u8"
  },
  {
    "name": "STAR GOLD HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/8/87/Star_Gold_logo_2024.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/StarGold/index.m3u8"
  },
  {
    "name": "STAR MOVIES HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Star_Movies_logo_2018.png",
    "group": "India",
    "url": "http://198.195.239.50:8095/StarMovies/index.m3u8"
  },
  {
    "name": "ZEE TV HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/9/90/Zee_TV_logo_2023.svg",
    "group": "India",
    "url": "http://198.195.239.50:8095/ZeeTV/index.m3u8"
  },
  {
    "name": "DISCOVERY HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Discovery_Channel_logo.svg/640px-Discovery_Channel_logo.svg.png",
    "group": "Documentary",
    "url": "http://198.195.239.50:8095/Discovery/index.m3u8"
  },
  {
    "name": "NATIONAL GEOGRAPHIC HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/National_Geographic_logo.svg/640px-National_Geographic_logo.svg.png",
    "group": "Documentary",
    "url": "http://198.195.239.50:8095/NationalGeographic/index.m3u8"
  },
  {
    "name": "CARTOON NETWORK HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Cartoon_Network_logo.svg",
    "group": "Kids",
    "url": "http://198.195.239.50:8095/CartoonNetwork/index.m3u8"
  },
  {
    "name": "DISCOVERY KIDS HD",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Discovery_Kids_Logo.png",
    "group": "Kids",
    "url": "http://198.195.239.50:8095/DiscoveryKids/index.m3u8"
  },
  {
    "name": "SPORTS FIRST TV",
    "logo": "https://s3.aynaott.com/storage/748d28752dcf95740561f1ac39e15fc3",
    "group": "Sports",
    "url": "https://d4ddgdmj1cvnm.cloudfront.net/scheduler/scheduleMaster/409.m3u8"
  },
  {
    "name": "Geo Entertainment",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEit0qcnH_W9u_tYYLFtiSInZHF15Y6j2B3sAbROlKejZ2mhXoNRHGyRYgk2ZgBrbFGR46MxPVJE8rX97PiSjv8CwouIdSZsdddDYB9zN-ZxMpFnCJJEu5IhcT-TS9rtIY4lQnJ5ueAO_FJYaiOwWc6hNG6uupodBMGECYtA5nfP6vHlKP165NqjFSU8Fw/s600/Nur_20251222_155957_0000.png",
    "group": "Others",
    "url": "https://jk3lz82elw79-hls-live.5centscdn.com/harPalGeo/955ad3298db330b5ee880c2c9e6f23a0.sdp/playlist.m3u8"
  },
  {
    "name": "Bein Sport 3",
    "logo": "https://static.epg.best/qa/beINSports1.qa.png",
    "group": "Sports",
    "url": "http://145.239.5.177:80/559/index.m3u8"
  },
  {
    "name": "TNT SPORTS PREMIUM",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/TNT_Sports_logo_2023.svg/640px-TNT_Sports_logo_2023.svg.png",
    "group": "Sports",
    "url": "http://200.115.120.1:8000/play/ca040/index.m3u8"
  },
  {
    "name": "Bein Tv Fast",
    "logo": "https://static.epg.best/qa/beINSports1.qa.png",
    "group": "Sports",
    "url": "https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8"
  },
  {
    "name": "Real Madrid Club TV",
    "logo": "https://pbs.twimg.com/profile_images/896773300667461633/F75hrQfN_400x400.jpg",
    "group": "Sports",
    "url": "https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/bitrate_3.m3u8"
  },
  {
    "name": "Al Jazeera News Arabic",
    "logo": "https://upload.wikimedia.org/wikipedia/en/9/90/Al_Jazeera_Mubasher_logo.png",
    "group": "News",
    "url": "https://live-hls-web-aja.getaj.net/AJA/index.m3u8"
  },
  {
    "name": "Deepto TV",
    "logo": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgEcUKZKXpZYe-67ozuLp6SuDBYF6JuQrzvT3IHSFvrBlIOgNvHCm9CHE5qqMWz9yoA4LOLL2knp13N8_SqVeOfGaUuQwJH02JjlYuLx4JBOzuLBGX2ezdoW2I3RSEFkJVyb-3OOlWe7WZ0I25-UtBfiKqVHZnsrZ1NC1J0ZEr1qODT2F7eWw74APyYRg/s600/Nur_20251216_221956_0000.png",
    "group": "Bangladesh",
    "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8"
  },
  {
    "name": "Tom & Jerry (24/7 Animation)",
    "logo": "https://i.imgur.com/GXzqIYy.png",
    "group": "Kids",
    "url": "https://live20.bozztv.com/giatvplayout7/giatv-208314/playlist.m3u8"
  },
  {
    "name": "Madina Live 24/7",
    "logo": "https://images-na.ssl-images-amazon.com/images/I/71CywdrFaZL.png",
    "group": "Islamic",
    "url": "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8"
  },
  {
    "name": "Peace Tv Bangla",
    "logo": "https://www.jagobd.com/wp-content/uploads/2024/08/logo_50.png",
    "group": "Islamic",
    "url": "https://dzkyvlfyge.erbvr.com/PeaceTvBangla/tracks-v3a1/mono.m3u8"
  },
  {
    "name": "STAR JALSHA",
    "logo": "https://upload.wikimedia.org/wikipedia/en/2/26/Star_Jalsha_logo.png",
    "group": "India",
    "url": "http://murgi.live:8083/StarJalshaHD/tracks-v1a1/mono.m3u8?token=74fe67de88ba2cc74404244ac2650a8d4edf96e0-58380a97f18f8e90182d2b2638658416-1780959956-1780949156"
  }
];

export const FIFA_WORLD_CUP_HIGHLIGHTS: MatchHighlight[] = [
  {
    id: "match-1",
    title: "Argentina vs France (4-2 Pen) - FIFA World Cup Qatar 2022 Final",
    coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    url: "https://videos.ctfassets.net/gpdg6g8o2782/25T2G38uM82UWyOeyuq8gE/6ca94c9657c96ba181c9ecdfab68cd15/final_2022.mp4", // fallback or nice placeholder video
    duration: "12:45",
    year: "2022"
  },
  {
    id: "match-2",
    title: "France vs Croatia (4-2) - FIFA World Cup Russia 2018 Final",
    coverImage: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800",
    url: "https://shls-mbc5-prod-dub.shahid.net/out/v1/2720564b6a4641658fdfb6884b160da2/index.m3u8", // Using the working M3U8 from MBC 5
    duration: "10:14",
    year: "2018"
  },
  {
    id: "match-3",
    title: "Germany vs Argentina (1-0 AET) - FIFA World Cup Brazil 2014 Final",
    coverImage: "https://images.unsplash.com/photo-1489945052260-4f21d52268b9?auto=format&fit=crop&q=80&w=800",
    url: "https://tvsen6.aynaott.com/globaltvhd/index.m3u8?e=1779283760&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=9877fe1456ffd7b4e155ff0dc042c176", // Using Global TV stream
    duration: "11:02",
    year: "2014"
  },
  {
    id: "match-4",
    title: "Spain vs Netherlands (1-0 AET) - FIFA World Cup South Africa 2010 Final",
    coverImage: "https://images.unsplash.com/photo-1431324155629-1a6edd1ec131?auto=format&fit=crop&q=80&w=800",
    url: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8?e=1779283784&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=3b4c5a2cfa872fa7f91ffbfb4aa0f658", // Using T Sports HD stream
    duration: "09:55",
    year: "2010"
  },
  {
    id: "match-5",
    title: "Italy vs France (5-3 Pen) - FIFA World Cup Germany 2006 Final",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    url: "https://tvsen5.aynaott.com/espn/index.m3u8?e=1779283793&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=cf2b4cb8b6c96ab86daee4299c792295", // Using ESPN stream
    duration: "08:31",
    year: "2006"
  }
];
