/**
 * Generates PLACEHOLDER recordings with the macOS Arabic voice "Majed":
 * - public/audio/letters/  one per letter (its name), named as in `letterAudioUrl`
 * - public/audio/drills/   one per Birikma drill (read as written), named as in `drillAudioUrl`
 *
 * Run (macOS only):  npm run audio:generate
 *
 * These exist so every device plays a sound, even browsers without an Arabic speech voice.
 * Replace them with a qari's recordings by overwriting the files with the same names;
 * existing files are skipped unless you pass --force.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mockLetters } from '../src/api/mock/lettersData.ts'

const VOICE = 'Majed'
/** Words per minute; a bit slower than the default (~175) so children hear each letter clearly. */
const RATE = '140'
const force = process.argv.includes('--force')

const publicDir = new URL('../public', import.meta.url).pathname
const tmp = mkdtempSync(join(tmpdir(), '63yil-audio-'))
let created = 0
let skipped = 0

/** What to record: each letter's name, and each Birikma drill read as written (harakat included). */
const recordings = mockLetters.flatMap((letter) => [
  { url: letter.activities.listen.audioUrl, text: letter.arabicName, label: letter.name },
  ...(letter.activities.join?.drills ?? []).map((drill) => ({ url: drill.audioUrl, text: drill.text, label: `${letter.name} drill` })),
])

try {
  for (const [i, { url, text, label }] of recordings.entries()) {
    if (!url) continue
    const target = join(publicDir, url)
    if (existsSync(target) && !force) {
      skipped++
      continue
    }
    mkdirSync(join(target, '..'), { recursive: true })

    // 1. Speak the Arabic text (e.g. "باء" or "أَتَبَ") into an uncompressed file.
    const raw = join(tmp, `${i}.aiff`)
    execFileSync('say', ['-v', VOICE, '-r', RATE, '-o', raw, text])

    // 2. Compress to AAC (.m4a): small and playable in every modern browser.
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', raw, target])
    created++
    console.log(`  ${url}  ←  ${text} (${label})`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`Done: ${created} created, ${skipped} already existed${skipped && !force ? ' (use --force to regenerate)' : ''}.`)
