/**
 * Uzbek (Latin script) interface text: every word the child sees.
 * Components use the keys through `t('key')`, see `../useI18n.ts`.
 *
 * Uzbek apostrophes: use ʻ (U+02BB) in oʻ / gʻ, and ʼ (U+02BC) for the tutuq belgisi.
 */
export const uz = {
  // App shell
  'app.title': '63yil — Arab harflari',
  'app.brand': '63yil Harflar',
  'header.progress': 'Natijalaringiz',
  'header.xp': 'XP',
  'header.lettersDone': '{count} ta harf oʻrganildi',

  // Generic states
  'status.loading': 'Yuklanmoqda…',
  'status.errorTitle': 'Nimadir xato ketdi',
  'status.retry': 'Qayta urinish',
  'error.network': 'Serverga ulanib boʻlmadi. Internet aloqasini tekshiring.',
  'error.notFound': 'Topilmadi.',
  'error.server': 'Serverda xatolik yuz berdi.',
  'error.generic': 'Kutilmagan xatolik yuz berdi.',
  'error.crashed': 'Sahifaning bu qismi ishlamay qoldi.',
  'notFound.title': 'Sahifa topilmadi',
  'notFound.message': 'Bu sahifani topa olmadik.',
  'notFound.home': 'Barcha harflarga oʻtish',

  // Home page
  'letters.title': 'Arab harflari',
  'letters.intro': 'Harfni tanlang. Har bir harfni chizasiz, yozasiz, tinglaysiz va aytasiz.',
  'letters.loading': 'Harflar yuklanmoqda…',
  'letters.tileLabel': '{order}. {name}, {total} ta mashqdan {done} tasi bajarildi',

  // Lesson page
  'lesson.loading': 'Harf yuklanmoqda…',
  'lesson.nav': 'Dars navigatsiyasi',
  'lesson.allLetters': '← Barcha harflar',
  'lesson.position': '{total} tadan {order}-harf',
  'lesson.previous': 'Oldingi harf: {name}',
  'lesson.next': 'Keyingi harf: {name}',
  'info.title': 'Harf haqida',
  'info.sound': 'Talaffuzi',
  'info.makhraj': 'Maxraji (tovush chiqadigan joy)',
  'info.forms': 'Soʻzdagi shakllari',
  'info.form.isolated': 'Alohida',
  'info.form.initial': 'Boshida',
  'info.form.medial': 'Oʻrtada',
  'info.form.final': 'Oxirida',
  'info.example': '{word} — “{meaning}” degani',

  // Activities
  'activities.nav': 'Mashqlar',
  'activities.done': 'bajarildi',
  'activity.trace.label': 'Chizish',
  'activity.trace.description': 'Nuqtalar boʻylab',
  'activity.write.label': 'Yozish',
  'activity.write.description': 'Oʻzingiz yozing',
  'activity.listen.label': 'Tinglash',
  'activity.listen.description': 'Tovushni toping',
  'activity.repeat.label': 'Takrorlash',
  'activity.repeat.description': 'Ovoz chiqarib ayting',
  'panel.kicker': 'Mashq',
  'panel.title': '{letter}: {activity}',
  'panel.step': '{total} tadan {step}-qadam',
  'panel.nextActivity': 'Keyingisi: {activity} →',
  'panel.letterDone': '🎉 {name} harfining barcha toʻrt mashqini bajardingiz!',
  'panel.nextLetter': 'Keyingi harf: {name}',

  // Sound
  'sound.listen': 'Tinglash',
  'sound.slow': 'Sekin',
  'sound.playing': 'Eshittirilmoqda…',
  'sound.error': 'Tovushni ijro etib boʻlmadi.',

  // Trace & Write
  'drawing.traceCanvas': '{name} harfini ustidan chizish maydoni',
  'drawing.writeCanvas': '{name} harfini yozish uchun boʻsh maydon',
  'drawing.model': 'Namuna',
  'drawing.undo': '↶ Ortga',
  'drawing.clear': 'Tozalash',
  'drawing.check': 'Tekshirish ✓',
  'drawing.again': 'Yana mashq qilish',
  'drawing.stars': '3 tadan {stars} yulduz',
  'drawing.trace.great': 'Ajoyib chizdingiz!',
  'drawing.trace.empty': 'Avval nuqtali harf ustidan chizing.',
  'drawing.trace.cover-more': 'Davom eting: harfni nuqtalari bilan birga toʻliq chizing.',
  'drawing.trace.stay-on-lines': 'Yaxshi urinish! Nuqtali chiziqdan chiqmang.',
  'drawing.write.great': 'Chiroyli yozdingiz!',
  'drawing.write.empty': 'Avval harfni yozing.',
  'drawing.write.cover-more': 'Oz qoldi! Harfning barcha qismlari va nuqtalari borligini tekshiring.',
  'drawing.write.stay-on-lines': 'Yaxshi urinish! Namunaga qarab, yana bir bor yozib koʻring.',

  // Listen
  'listen.question': 'Qaysi harfni eshitdingiz?',
  'listen.choice': '{name} harfi',
  'listen.correct': 'Toʻgʻri! Bu — {name}.',
  'listen.wrong': 'Unchalik emas. Yana tinglab, boshqasini tanlang.',

  // Repeat
  'repeat.step.listen': 'Tinglang',
  'repeat.step.record': 'Ayting va yozib oling',
  'repeat.step.compare': 'Solishtiring',
  'repeat.record': '🎤 Yozib olish',
  'repeat.recordAgain': '🎤 Qayta yozish',
  'repeat.stop': 'Toʻxtatish',
  'repeat.micDenied':
    'Mikrofonga ruxsat berilmagan. Uni brauzer manzil satridan yoqing yoki harfni shunchaki ovoz chiqarib ayting.',
  'repeat.micUnsupported': 'Bu brauzer ovoz yozib ololmaydi. Harfni ovoz chiqarib ayting.',
  'repeat.yourVoice': 'Sizning ovozingiz',
  'repeat.placeholder': 'Yozuvingiz shu yerda chiqadi.',
  'repeat.selfCheck': 'Namunadagidek eshitildimi?',
  'repeat.confirm': '✓ Toʻgʻri aytdim',
  'repeat.done': 'Barakalla! Siz {name} harfini aytdingiz.',
} as const

export type MessageKey = keyof typeof uz
